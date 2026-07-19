import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NewUserManager } from '@/lib/ads/lifecycle/NewUserManager';
import { GraceType } from '@/lib/ads/core/types';

describe('NewUserManager', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
    });
  });

  it('treats first session as new user when grace enabled', async () => {
    const manager = new NewUserManager({
      enabled: true,
      type: GraceType.SESSIONS,
      maxSessions: 5,
    });
    const state = await manager.getGraceState();
    expect(state.sessionCount).toBe(1);
    expect(manager.isNewUser(state)).toBe(true);
  });

  it('allows rewarded ads for new users when policy says so', async () => {
    const manager = new NewUserManager({
      enabled: true,
      type: GraceType.SESSIONS,
      maxSessions: 5,
    });
    const state = await manager.getGraceState();
    const allowed = manager.shouldShowAdForPlacement(state, { showForNewUsers: true });
    expect(allowed).toBe(true);
  });

  it('blocks interstitial for new users until startAfterSession', async () => {
    const manager = new NewUserManager({
      enabled: true,
      type: GraceType.SESSIONS,
      maxSessions: 10,
    });
    const state = await manager.getGraceState();
    const blocked = manager.shouldShowAdForPlacement(state, {
      showForNewUsers: false,
      startAfterSession: 5,
    });
    expect(blocked).toBe(false);
  });
});
