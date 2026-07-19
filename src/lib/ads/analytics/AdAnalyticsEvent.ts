import { logEvent } from '@/lib/analytics';
import type { AdFormat, AdSkipReason, NetworkType } from '../core/types';

export class AdAnalyticsEvent {
  recordRequest(placement: string, format: AdFormat, network: NetworkType | string): void {
    void logEvent('ad_requested', {
      placement: String(placement),
      format,
      network: String(network),
    });
  }

  recordLoaded(
    placement: string,
    format: AdFormat,
    latencyMs: number,
    network: NetworkType | string
  ): void {
    void logEvent('ad_loaded', {
      placement: String(placement),
      format,
      network: String(network),
      latency_ms: latencyMs,
    });
  }

  recordImpression(
    placement: string,
    network: NetworkType | string,
    format?: AdFormat
  ): void {
    void logEvent('ad_impression', {
      placement: String(placement),
      network: String(network),
      ...(format ? { format } : {}),
    });
  }

  recordClick(
    placement: string,
    network: NetworkType | string,
    opts?: { format?: AdFormat; sessionClicks?: number; dayClicks?: number }
  ): void {
    void logEvent('ad_clicked', {
      placement: String(placement),
      network: String(network),
      ...(opts?.format ? { format: opts.format } : {}),
      ...(opts?.sessionClicks != null ? { session_clicks: opts.sessionClicks } : {}),
      ...(opts?.dayClicks != null ? { day_clicks: opts.dayClicks } : {}),
    });
  }

  recordSkipped(
    placement: string,
    reason: AdSkipReason,
    sessionCount?: number,
    blockDetail?: string,
    ruleId?: string
  ): void {
    void logEvent('ad_skipped', {
      placement: String(placement),
      reason,
      session_count: sessionCount ?? 0,
      ...(blockDetail ? { block_detail: blockDetail.slice(0, 200) } : {}),
      ...(ruleId ? { rule_id: ruleId } : {}),
    });
  }

  recordPreloadSkipped(
    placement: string,
    ruleId: string,
    message: string
  ): void {
    void logEvent('ad_preload_skipped', {
      placement: String(placement),
      rule_id: ruleId,
      message: message.slice(0, 200),
    });
  }

  recordError(
    placement: string,
    errorCode: string,
    network?: NetworkType | string
  ): void {
    void logEvent('ad_failed', {
      placement: String(placement),
      error_code: errorCode,
      network: network ? String(network) : 'unknown',
    });
  }

  recordIvtPause(params: {
    trigger: 'session_limit' | 'day_limit';
    sessionClicks: number;
    dayClicks: number;
    pausedUntilMs: number;
    maxSession: number;
    maxDay: number;
  }): void {
    void logEvent('ad_ivt_pause', {
      trigger: params.trigger,
      session_clicks: params.sessionClicks,
      day_clicks: params.dayClicks,
      paused_until_ms: params.pausedUntilMs,
      max_session: params.maxSession,
      max_day: params.maxDay,
    });
  }

  recordIvtResume(pausedDurationMs: number): void {
    void logEvent('ad_ivt_resume', {
      paused_duration_ms: pausedDurationMs,
    });
  }

  recordFrequencyCapHit(
    placement: string,
    capType: 'hour' | 'day',
    capValue: number,
    currentCount: number
  ): void {
    void logEvent('ad_frequency_cap_hit', {
      placement: String(placement),
      cap_type: capType,
      cap_value: capValue,
      current_count: currentCount,
    });
  }


  recordNavigationDelay(
    placement: string,
    delayMs: number,
    fromRoute: string,
    toRoute: string
  ): void {
    void logEvent('ad_navigation_delay_applied', {
      placement: String(placement),
      delay_ms: delayMs,
      from_route: fromRoute,
      to_route: toRoute,
    });
  }

  recordSessionSummary(params: {
    impressions: number;
    clicks: number;
    ctrPercent: number;
    ivtPaused: boolean;
    topSkipReason: string;
  }): void {
    void logEvent('ad_session_summary', {
      impressions: params.impressions,
      clicks: params.clicks,
      ctr_percent: params.ctrPercent,
      ivt_paused: params.ivtPaused ? 1 : 0,
      top_skip_reason: params.topSkipReason,
    });
  }

  recordTestModeWarning(): void {
    void logEvent('ad_test_mode_warning', {
      build_type: 'debug',
    });
  }
}
