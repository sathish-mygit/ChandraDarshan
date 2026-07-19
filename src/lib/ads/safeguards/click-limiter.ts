import type { IvtConfig } from '../core/types';
import type { ClickLimiterState, ClickRecordResult } from './click-limiter-state';

const STORAGE_KEY = 'ads:ivt:clicks';
const SESSION_GAP_MS = 60 * 60 * 1000;

function dayKey(ts = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function newSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class ClickLimiter {
  private config: IvtConfig;
  private state: ClickLimiterState;

  constructor(config: IvtConfig) {
    this.config = { ...config };
    this.state = this.readState() ?? this.freshState();
    this.syncSession();
    this.writeState();
  }

  updateConfig(config: IvtConfig): void {
    this.config = { ...config };
  }

  getConfig(): IvtConfig {
    return { ...this.config };
  }

  getSessionClicks(): number {
    return this.state.sessionClicks;
  }

  getDayClicks(): number {
    return this.state.dayClicks;
  }

  isPaused(): boolean {
    if (!this.config.enabled) return false;
    if (this.state.pausedUntil <= 0) return false;
    if (Date.now() >= this.state.pausedUntil) {
      this.state.pausedUntil = 0;
      this.writeState();
      return false;
    }
    return true;
  }

  getPausedUntil(): number {
    return this.state.pausedUntil;
  }

  recordClick(): ClickRecordResult {
    if (!this.config.enabled) {
      return {
        sessionClicks: this.state.sessionClicks,
        dayClicks: this.state.dayClicks,
        shouldPause: false,
      };
    }

    this.syncSession();
    this.state.sessionClicks += 1;
    this.state.dayClicks += 1;

    let shouldPause = false;
    let trigger: ClickRecordResult['trigger'];

    if (this.state.sessionClicks > this.config.maxClicksPerSession) {
      shouldPause = true;
      trigger = 'session_limit';
    } else if (this.state.dayClicks > this.config.maxClicksPerDay) {
      shouldPause = true;
      trigger = 'day_limit';
    }

    if (shouldPause) {
      this.state.pausedUntil = Date.now() + this.config.pauseDurationMs;
    }

    this.writeState();

    return {
      sessionClicks: this.state.sessionClicks,
      dayClicks: this.state.dayClicks,
      shouldPause,
      trigger,
    };
  }

  private syncSession(): void {
    const now = Date.now();
    const today = dayKey(now);

    if (this.state.dayKey !== today) {
      this.state.dayKey = today;
      this.state.dayClicks = 0;
    }

    const isNewSession = now - this.state.lastAppOpenTime > SESSION_GAP_MS;
    if (isNewSession) {
      this.state.sessionId = newSessionId();
      this.state.sessionClicks = 0;
    }
    this.state.lastAppOpenTime = now;
  }

  private freshState(): ClickLimiterState {
    const now = Date.now();
    return {
      sessionId: newSessionId(),
      sessionClicks: 0,
      dayKey: dayKey(now),
      dayClicks: 0,
      pausedUntil: 0,
      lastAppOpenTime: now,
    };
  }

  private readState(): ClickLimiterState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ClickLimiterState;
    } catch {
      return null;
    }
  }

  private writeState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }
}
