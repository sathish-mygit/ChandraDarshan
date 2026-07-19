import { describe, it, expect } from 'vitest';
import { mapBlockReasonToSkipReason } from './skip-reason';

describe('mapBlockReasonToSkipReason', () => {
  it('maps engagement gate to engagement_gate', () => {
    expect(mapBlockReasonToSkipReason('Engagement gate: need 8 items (have 2)')).toBe(
      'engagement_gate'
    );
  });

  it('maps placement disabled to disabled', () => {
    expect(
      mapBlockReasonToSkipReason('Placement disabled: interstitial.toPlanner (toggle off)')
    ).toBe('disabled');
  });

  it('maps rate limit to rate_limit', () => {
    expect(mapBlockReasonToSkipReason('Rate limit: wait 120s before next interstitial')).toBe(
      'rate_limit'
    );
  });
});
