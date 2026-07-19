import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdAnalyticsEvent } from './AdAnalyticsEvent';

const logEvent = vi.fn();

vi.mock('@/lib/analytics', () => ({
  logEvent: (...args: unknown[]) => logEvent(...args),
}));

describe('AdAnalyticsEvent IVT events', () => {
  let analytics: AdAnalyticsEvent;

  beforeEach(() => {
    logEvent.mockClear();
    analytics = new AdAnalyticsEvent();
  });

  it('logs ad_ivt_pause with trigger metadata', () => {
    analytics.recordIvtPause({
      trigger: 'session_limit',
      sessionClicks: 4,
      dayClicks: 4,
      pausedUntilMs: 1_700_000_000_000,
      maxSession: 1,
      maxDay: 3,
    });

    expect(logEvent).toHaveBeenCalledWith('ad_ivt_pause', expect.objectContaining({
      trigger: 'session_limit',
      session_clicks: 4,
      max_session: 3,
    }));
  });

  it('logs ad_frequency_cap_hit', () => {
    analytics.recordFrequencyCapHit('interstitial.transitions', 'hour', 1, 1);
    expect(logEvent).toHaveBeenCalledWith('ad_frequency_cap_hit', {
      placement: 'interstitial.transitions',
      cap_type: 'hour',
      cap_value: 1,
      current_count: 1,
    });
  });

  it('logs ad_session_summary', () => {
    analytics.recordSessionSummary({
      impressions: 5,
      clicks: 1,
      ctrPercent: 20,
      ivtPaused: false,
      topSkipReason: 'rate_limit',
    });

    expect(logEvent).toHaveBeenCalledWith('ad_session_summary', expect.objectContaining({
      impressions: 5,
      ctr_percent: 20,
      top_skip_reason: 'rate_limit',
    }));
  });
});
