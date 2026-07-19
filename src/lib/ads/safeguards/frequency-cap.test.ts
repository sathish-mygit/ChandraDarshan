import { describe, it, expect, beforeEach } from 'vitest';
import { FrequencyCapTracker } from './frequency-cap';
import { stubLocalStorage } from '../test-helpers';

describe('FrequencyCapTracker', () => {
  beforeEach(() => {
    stubLocalStorage();
  });

  it('blocks impressions when hourly cap is reached', () => {
    const tracker = new FrequencyCapTracker({
      'interstitial.transitions': { perHour: 2, perDay: 10 },
    });

    tracker.recordImpression('interstitial.transitions');
    tracker.recordImpression('interstitial.transitions');

    const check = tracker.canShow('interstitial.transitions');
    expect(check.allowed).toBe(false);
    expect(check.capType).toBe('hour');
    expect(check.capValue).toBe(2);
  });

  it('allows impressions under cap', () => {
    const tracker = new FrequencyCapTracker({
      'native.feed': { perHour: 5, perDay: 20 },
    });

    tracker.recordImpression('native.feed');
    expect(tracker.canShow('native.feed').allowed).toBe(true);
  });
});
