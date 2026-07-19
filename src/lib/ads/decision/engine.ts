import type {
  AdDecisionContext,
  AdsPolicySnapshot,
  DecisionResult,
  EngagementGateProvider,
  FreqCapChecker,
} from './types';
import { DecisionLog } from './log';

/**
 * Portable ad decision engine—rules ordered by priority.
 * Evaluates placement show/preload eligibility without app-specific routing logic.
 */
export class PlacementDecisionEngine {
  private policy: AdsPolicySnapshot;
  private engagementProvider?: EngagementGateProvider;
  private log = new DecisionLog();
  private ivtPaused = false;
  private sessionInterstitialCount = 0;
  private lastInterstitialTime = 0;
  private lastPreloadTime = 0;
  private consentGiven = true;
  private freqCapChecker?: FreqCapChecker;
  private simulatedEngagementCount?: number;

  constructor(policy: AdsPolicySnapshot, engagementProvider?: EngagementGateProvider) {
    this.policy = policy;
    this.engagementProvider = engagementProvider;
  }

  setFreqCapChecker(checker: FreqCapChecker): void {
    this.freqCapChecker = checker;
  }

  updatePolicy(policy: AdsPolicySnapshot): void {
    this.policy = policy;
  }

  setIvtPaused(paused: boolean): void {
    this.ivtPaused = paused;
  }

  setConsentGiven(consent: boolean): void {
    this.consentGiven = consent;
  }

  recordInterstitialShow(): void {
    this.lastInterstitialTime = Date.now();
    this.sessionInterstitialCount += 1;
  }

  recordPreload(): void {
    this.lastPreloadTime = Date.now();
  }

  setInterstitialState(state: {
    count?: number;
    lastShownAt?: number;
    lastPreloadAt?: number;
  }): void {
    if (state.count != null) {
      this.sessionInterstitialCount = state.count;
    }
    if (state.lastShownAt != null) {
      this.lastInterstitialTime = state.lastShownAt;
    }
    if (state.lastPreloadAt != null) {
      this.lastPreloadTime = state.lastPreloadAt;
    }
  }

  applySimulationOverrides(overrides: {
    ivtPaused?: boolean;
    consentGranted?: boolean;
    interstitialShownCount?: number;
    lastInterstitialAt?: number;
    engagementCount?: number;
    engagementMin?: number;
    engagementGatesDisabled?: boolean;
    interstitial?: { maxPerSession?: number; minIntervalMs?: number };
  }): void {
    if (overrides.ivtPaused != null) {
      this.ivtPaused = overrides.ivtPaused;
    }
    if (overrides.consentGranted != null) {
      this.consentGiven = overrides.consentGranted;
    }
    if (overrides.interstitialShownCount != null) {
      this.sessionInterstitialCount = overrides.interstitialShownCount;
    }
    if (overrides.lastInterstitialAt != null) {
      this.lastInterstitialTime = overrides.lastInterstitialAt;
    }
    if (overrides.engagementCount != null) {
      this.simulatedEngagementCount = overrides.engagementCount;
    } else {
      this.simulatedEngagementCount = undefined;
    }
    if (overrides.engagementMin != null) {
      this.policy = {
        ...this.policy,
        engagement: {
          ...this.policy.engagement,
          globalMinEngagementCount: overrides.engagementMin,
        },
      };
    }
    if (overrides.engagementGatesDisabled != null) {
      this.policy = {
        ...this.policy,
        engagement: {
          ...this.policy.engagement,
          gatesDisabled: overrides.engagementGatesDisabled,
        },
      };
    }
    if (overrides.interstitial) {
      this.policy = {
        ...this.policy,
        interstitialLimits: {
          minIntervalMs:
            overrides.interstitial.minIntervalMs ?? this.policy.interstitialLimits.minIntervalMs,
          maxPerSession:
            overrides.interstitial.maxPerSession ?? this.policy.interstitialLimits.maxPerSession,
        },
      };
    }
  }

  resetSessionCount(): void {
    this.sessionInterstitialCount = 0;
  }

  getLog() {
    return this.log;
  }

  /**
   * Evaluate if a placement is allowed for the given context.
   * Returns first blocking rule or { allowed: true }.
   */
  async evaluate(context: AdDecisionContext): Promise<DecisionResult> {
    const { placement, phase, debug } = context;

    // 1. Not initialized check (skip in debug)
    if (!debug && !this.policy) {
      const result: DecisionResult = {
        allowed: false,
        ruleId: 'not_initialized',
        message: 'Ad service not initialized',
      };
      this.log.record({
        placement,
        phase,
        ruleId: 'not_initialized',
        message: result.message,
        allowed: false,
        timestamp: Date.now(),
      });
      return result;
    }

    // 2. Master disabled (skip in debug)
    if (!debug && !this.policy.masterEnabled) {
      const result: DecisionResult = {
        allowed: false,
        ruleId: 'master_disabled',
        message: 'Master ads toggle is off',
      };
      this.log.record({
        placement,
        phase,
        ruleId: 'master_disabled',
        message: result.message,
        allowed: false,
        timestamp: Date.now(),
      });
      return result;
    }

    // 3. Placement disabled (skip in debug; undefined toggle = enabled)
    if (!debug && this.policy.placementToggles[placement] === false) {
      const result: DecisionResult = {
        allowed: false,
        ruleId: 'placement_disabled',
        message: `Placement disabled: ${placement}`,
      };
      this.log.record({
        placement,
        phase,
        ruleId: 'placement_disabled',
        message: result.message,
        allowed: false,
        timestamp: Date.now(),
      });
      return result;
    }

    // 4. Consent blocked (skip in debug)
    if (!debug && !this.consentGiven) {
      const result: DecisionResult = {
        allowed: false,
        ruleId: 'consent_blocked',
        message: 'User has not given ad consent',
      };
      this.log.record({
        placement,
        phase,
        ruleId: 'consent_blocked',
        message: result.message,
        allowed: false,
        timestamp: Date.now(),
      });
      return result;
    }

    // 5. IVT pause (skip in debug)
    if (!debug && this.ivtPaused) {
      const result: DecisionResult = {
        allowed: false,
        ruleId: 'ivt_paused',
        message: 'Click limit exceeded; ads paused',
      };
      this.log.record({
        placement,
        phase,
        ruleId: 'ivt_paused',
        message: result.message,
        allowed: false,
        timestamp: Date.now(),
      });
      return result;
    }

    // 6. Engagement gate (skip in debug or when gates disabled)
    if (!debug && !this.policy.engagement.gatesDisabled && this.engagementProvider) {
      const engagementResult = await this.checkEngagementGate(placement);
      if (!engagementResult.allowed) {
        this.log.record({
          placement,
          phase,
          ruleId: 'engagement_gate',
          message: engagementResult.message,
          allowed: false,
          timestamp: Date.now(),
        });
        return engagementResult;
      }
    }

    // 7. Frequency cap (skip in debug)
    if (!debug) {
      const freqCapResult = this.checkFrequencyCap(placement);
      if (!freqCapResult.allowed) {
        this.log.record({
          placement,
          phase,
          ruleId: 'frequency_cap',
          message: freqCapResult.message,
          allowed: false,
          timestamp: Date.now(),
        });
        return freqCapResult;
      }
    }

    // 8. Show-phase-only rules
    if (phase === 'show') {
      // 8a. Session rate limit + min interval (interstitials only)
      if (placement.includes('interstitial')) {
        const limits = this.policy.interstitialLimits;
        if (this.sessionInterstitialCount >= limits.maxPerSession) {
          const result: DecisionResult = {
            allowed: false,
            ruleId: 'session_rate_limit',
            message: `Rate limit: max ${limits.maxPerSession} per session`,
          };
          this.log.record({
            placement,
            phase,
            ruleId: 'session_rate_limit',
            message: result.message,
            allowed: false,
            timestamp: Date.now(),
          });
          return result;
        }

        const elapsed = Date.now() - this.lastInterstitialTime;
        if (this.lastInterstitialTime > 0 && elapsed < limits.minIntervalMs) {
          const waitSec = Math.ceil((limits.minIntervalMs - elapsed) / 1000);
          const result: DecisionResult = {
            allowed: false,
            ruleId: 'min_interval',
            message: `Rate limit: wait ${waitSec}s before next interstitial`,
          };
          this.log.record({
            placement,
            phase,
            ruleId: 'min_interval',
            message: result.message,
            allowed: false,
            timestamp: Date.now(),
          });
          return result;
        }
      }
    }

    // 9. Preload-phase-only rules
    if (phase === 'preload') {
      // 9a. Preload debounce (5 minutes unless interstitial shown since last preload)
      const PRELOAD_DEBOUNCE_MS = 5 * 60 * 1000;
      const elapsedSincePreload = Date.now() - this.lastPreloadTime;
      if (
        this.lastPreloadTime > 0 &&
        elapsedSincePreload < PRELOAD_DEBOUNCE_MS &&
        this.lastInterstitialTime < this.lastPreloadTime
      ) {
        const result: DecisionResult = {
          allowed: false,
          ruleId: 'preload_debounce',
          message: `Preload debounce: wait before next preload`,
        };
        this.log.record({
          placement,
          phase,
          ruleId: 'preload_debounce',
          message: result.message,
          allowed: false,
          timestamp: Date.now(),
        });
        return result;
      }
    }

    // All checks passed
    this.log.record({
      placement,
      phase,
      ruleId: 'allowed',
      message: `${phase} allowed`,
      allowed: true,
      timestamp: Date.now(),
    });
    return { allowed: true };
  }

  private async checkEngagementGate(
    placement: string
  ): Promise<DecisionResult> {
    if (this.policy.engagement.gatesDisabled) {
      return { allowed: true };
    }

    if (!this.engagementProvider) {
      return { allowed: true };
    }

    try {
      const currentCount =
        this.simulatedEngagementCount ?? (await this.engagementProvider());
      const required =
        this.policy.engagement.placementMins[placement] ??
        this.policy.engagement.globalMinEngagementCount ??
        0;

      if (currentCount < required) {
        return {
          allowed: false,
          ruleId: 'engagement_gate',
          message: `Engagement gate: ${currentCount} < ${required} required`,
        };
      }
    } catch (err) {
      console.warn('[PlacementDecisionEngine] engagementProvider error:', err);
    }

    return { allowed: true };
  }

  private checkFrequencyCap(placement: string): DecisionResult {
    if (!this.freqCapChecker) return { allowed: true };

    const cap = this.freqCapChecker(placement);
    if (!cap.allowed && cap.capType) {
      return {
        allowed: false,
        ruleId: 'frequency_cap',
        message: `Frequency cap: ${placement} ${cap.capType} limit ${cap.capValue} (${cap.currentCount} used)`,
      };
    }
    return { allowed: true };
  }
}
