import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ClickLimiter } from './click-limiter';
import type { IvtConfig } from '../core/types';
import { stubLocalStorage } from '../test-helpers';

const baseConfig: IvtConfig = {
  enabled: true,
  maxClicksPerSession: 1,
  maxClicksPerDay: 3,
  pauseDurationMs: 60_000,
  navigationDelayMs: 800,
};

describe('ClickLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-24T12:00:00Z'));
    stubLocalStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('pauses after exceeding session click limit', () => {
    const limiter = new ClickLimiter(baseConfig);

    const first = limiter.recordClick();
    expect(first.shouldPause).toBe(false);

    const second = limiter.recordClick();
    expect(second.shouldPause).toBe(true);
    expect(second.trigger).toBe('session_limit');
    expect(limiter.isPaused()).toBe(true);
  });

  it('does not pause when IVT is disabled', () => {
    const limiter = new ClickLimiter({ ...baseConfig, enabled: false });

    for (let i = 0; i < 10; i++) {
      const result = limiter.recordClick();
      expect(result.shouldPause).toBe(false);
    }
    expect(limiter.isPaused()).toBe(false);
  });

  it('clears pause after pause duration elapses', () => {
    const limiter = new ClickLimiter({ ...baseConfig, maxClicksPerSession: 1 });

    limiter.recordClick();
    limiter.recordClick();
    expect(limiter.isPaused()).toBe(true);

    vi.advanceTimersByTime(60_001);
    expect(limiter.isPaused()).toBe(false);
  });
});
