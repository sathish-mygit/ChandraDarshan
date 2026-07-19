import { describe, it, expect } from 'vitest';
import { SessionAttemptLog } from './session-log';

describe('SessionAttemptLog', () => {
  it('records skip entries with ruleId', () => {
    const log = new SessionAttemptLog();
    log.recordSkip('interstitial.toHome', 'show', 'engagement_gate', 'Need more items');

    const entries = log.getAll();
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe('skip');
    expect(entries[0].ruleId).toBe('engagement_gate');
    expect(entries[0].placement).toBe('interstitial.toHome');
  });

  it('records navigation evaluate with null placement message', () => {
    const log = new SessionAttemptLog();
    log.record({
      timestamp: Date.now(),
      kind: 'evaluate',
      placement: '/settings',
      message: 'Nav /home → /settings: no transition placement',
      source: 'policy',
      allowed: false,
    });

    expect(log.getRecent(1)[0].message).toContain('no transition placement');
  });

  it('keeps at most 50 entries', () => {
    const log = new SessionAttemptLog();
    for (let i = 0; i < 60; i++) {
      log.recordShow(`placement.${i}`, true, 'ok');
    }
    expect(log.getAll().length).toBeLessThanOrEqual(50);
  });
});
