import type { FrequencyCapMap, IvtConfig } from '../core/types';
import { ClickLimiter } from './click-limiter';
import { FrequencyCapTracker } from './frequency-cap';
import type { IvtStatus, SessionAdStats } from '../core/types';

export class IvtGuard {
  private clickLimiter: ClickLimiter;
  private frequencyCap: FrequencyCapTracker;
  private currentRoute = '/';
  private sessionStats: SessionAdStats = { impressions: 0, clicks: 0, skipsByReason: {} };
  private wasPaused = false;
  private pauseStartedAt = 0;

  constructor(
    ivtConfig: IvtConfig,
    freqCap: FrequencyCapMap = {}
  ) {
    this.clickLimiter = new ClickLimiter(ivtConfig);
    this.frequencyCap = new FrequencyCapTracker(freqCap);
    this.wasPaused = this.clickLimiter.isPaused();
    if (this.wasPaused) {
      this.pauseStartedAt = this.clickLimiter.getPausedUntil() - ivtConfig.pauseDurationMs;
    }
  }

  updateConfig(ivtConfig: IvtConfig, freqCap?: FrequencyCapMap): void {
    this.clickLimiter.updateConfig(ivtConfig);
    if (freqCap) this.frequencyCap.updateConfig(freqCap);
  }

  setCurrentRoute(route: string): void {
    this.currentRoute = route;
  }

  getIvtConfig(): IvtConfig {
    return this.clickLimiter.getConfig();
  }

  getStatus(): IvtStatus {
    const config = this.clickLimiter.getConfig();
    return {
      enabled: config.enabled,
      paused: this.clickLimiter.isPaused(),
      pausedUntil: this.clickLimiter.getPausedUntil(),
      sessionClicks: this.clickLimiter.getSessionClicks(),
      dayClicks: this.clickLimiter.getDayClicks(),
      maxClicksPerSession: config.maxClicksPerSession,
      maxClicksPerDay: config.maxClicksPerDay,
    };
  }

  getSessionStats(): SessionAdStats {
    return {
      impressions: this.sessionStats.impressions,
      clicks: this.sessionStats.clicks,
      skipsByReason: { ...this.sessionStats.skipsByReason },
    };
  }

  recordSkip(reason: string): void {
    this.sessionStats.skipsByReason[reason] = (this.sessionStats.skipsByReason[reason] ?? 0) + 1;
  }

  checkIvtPause(): boolean {
    const paused = this.clickLimiter.isPaused();
    if (!paused && this.wasPaused && this.pauseStartedAt > 0) {
      this.wasPaused = false;
      this.pauseStartedAt = 0;
    }
    return paused;
  }

  consumeResumeEvent(): number | null {
    const paused = this.clickLimiter.isPaused();
    if (this.wasPaused && !paused) {
      const duration = Date.now() - (this.pauseStartedAt || Date.now());
      this.wasPaused = false;
      this.pauseStartedAt = 0;
      return Math.max(0, duration);
    }
    this.wasPaused = paused;
    return null;
  }


  checkFrequencyCap(placement: string): {
    allowed: boolean;
    capType?: 'hour' | 'day';
    capValue?: number;
    currentCount?: number;
  } {
    return this.frequencyCap.canShow(placement);
  }

  recordImpression(placement: string): void {
    this.frequencyCap.recordImpression(placement);
    this.sessionStats.impressions += 1;
  }

  getFreqCapUsage(placement: string): {
    perHour: number;
    perDay: number;
    hourUsed: number;
    dayUsed: number;
  } {
    const cap = this.frequencyCap.getCap(placement);
    const usage = this.frequencyCap.getUsage(placement);
    return {
      perHour: cap.perHour,
      perDay: cap.perDay,
      hourUsed: usage.hourUsed,
      dayUsed: usage.dayUsed,
    };
  }

  getFreqCapUsageForPlacements(placements: string[]): Record<
    string,
    { perHour: number; perDay: number; hourUsed: number; dayUsed: number }
  > {
    const result: Record<string, { perHour: number; perDay: number; hourUsed: number; dayUsed: number }> = {};
    for (const p of placements) {
      result[p] = this.getFreqCapUsage(p);
    }
    return result;
  }

  applyFreqCapSimulation(
    freqCapOverrides: Record<
      string,
      { perHour?: number; perDay?: number; hourUsed?: number; dayUsed?: number }
    >
  ): void {
    for (const [placement, override] of Object.entries(freqCapOverrides)) {
      if (override.perHour != null || override.perDay != null) {
        this.frequencyCap.setCapOverride(placement, override.perHour, override.perDay);
      }
      if (override.hourUsed != null || override.dayUsed != null) {
        this.frequencyCap.setSimulatedUsage(placement, {
          hourUsed: override.hourUsed,
          dayUsed: override.dayUsed,
        });
      }
    }
  }

  clearFreqCapSimulation(): void {
    this.frequencyCap.clearSimulatedUsage();
  }

  recordClick(): {
    sessionClicks: number;
    dayClicks: number;
    shouldPause: boolean;
    trigger?: 'session_limit' | 'day_limit';
  } {
    const result = this.clickLimiter.recordClick();
    this.sessionStats.clicks += 1;
    if (result.shouldPause) {
      this.wasPaused = true;
      this.pauseStartedAt = Date.now();
    }
    return result;
  }

  getNavigationDelayMs(): number {
    return this.clickLimiter.getConfig().navigationDelayMs;
  }

  isEnabled(): boolean {
    return this.clickLimiter.getConfig().enabled;
  }
}
