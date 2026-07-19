import type {
  GraceType,
  NewUserGraceConfig,
  NewUserPlacementPolicy,
  UserGraceState,
} from '../core/types';

const STORAGE_KEY = 'ad_user_state_v1';
const SESSION_GAP_MS = 60 * 60 * 1000;

export class NewUserManager {
  private graceConfig: NewUserGraceConfig;

  constructor(graceConfig: NewUserGraceConfig) {
    this.graceConfig = graceConfig;
  }

  updateGraceConfig(partial: Partial<NewUserGraceConfig>): void {
    this.graceConfig = { ...this.graceConfig, ...partial };
  }

  getGraceConfig(): NewUserGraceConfig {
    return { ...this.graceConfig };
  }

  async getGraceState(): Promise<UserGraceState> {
    const now = Date.now();
    let state = this.readState();

    if (!state) {
      state = {
        firstLaunchTime: now,
        sessionCount: 1,
        totalSessions: 1,
        daysActive: 0,
        isNewUser: true,
        lastAppOpenTime: now,
      };
    } else {
      const isNewSession = now - state.lastAppOpenTime > SESSION_GAP_MS;
      if (isNewSession) {
        state.sessionCount += 1;
        state.totalSessions += 1;
      }
      state.lastAppOpenTime = now;
      state.daysActive = Math.floor((now - state.firstLaunchTime) / (1000 * 60 * 60 * 24));
      state.isNewUser = this.computeIsNewUser(state);
    }

    this.writeState(state);
    return state;
  }

  isNewUser(state: UserGraceState): boolean {
    return this.computeIsNewUser(state);
  }

  shouldShowAdForPlacement(
    state: UserGraceState,
    policy?: NewUserPlacementPolicy
  ): boolean {
    if (!this.graceConfig.enabled) return true;
    if (!policy) return !this.computeIsNewUser(state);

    if (policy.showForNewUsers) return true;

    if (!this.computeIsNewUser(state)) return true;

    if (policy.startAfterSession != null && state.sessionCount >= policy.startAfterSession) {
      return true;
    }

    if (policy.startAfterDays != null && state.daysActive >= policy.startAfterDays) {
      return true;
    }

    if (policy.startAfterReturns != null && state.totalSessions >= policy.startAfterReturns) {
      return true;
    }

    return false;
  }

  private computeIsNewUser(state: UserGraceState): boolean {
    if (!this.graceConfig.enabled) return false;

    switch (this.graceConfig.type as GraceType) {
      case 'sessions':
        return state.sessionCount <= (this.graceConfig.maxSessions ?? 1);
      case 'days':
        return state.daysActive <= (this.graceConfig.maxDays ?? 0);
      case 'hours': {
        const hours = (Date.now() - state.firstLaunchTime) / (1000 * 60 * 60);
        return hours <= (this.graceConfig.maxHours ?? 0);
      }
      case 'returns':
        return state.totalSessions <= (this.graceConfig.requiredReturns ?? 1);
      default:
        return false;
    }
  }

  private readState(): UserGraceState | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserGraceState) : null;
    } catch {
      return null;
    }
  }

  private writeState(state: UserGraceState): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }
}
