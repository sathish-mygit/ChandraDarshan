import type { DiagnosticsSnapshot, PlacementDiagnostic, PolicyMode } from './types';
import { getRuleHint } from './rule-hints';
import { readSimulationOverrides, hasActiveSimulation } from './simulation';
import type { AdsLimitsSnapshot } from '../core/types';

type AdServiceSnapshotSource = {
  getAdsLimitsSnapshot: (placements: string[]) => Promise<AdsLimitsSnapshot>;
  getInitReady: () => Promise<void>;
  evaluateDecision: (ctx: {
    placement: string;
    phase: 'show' | 'preload';
  }) => Promise<{ allowed: boolean; ruleId?: string; message?: string }>;
  isEnabled: (key: string) => boolean;
  getIvtStatus: () => {
    enabled?: boolean;
    paused?: boolean;
    sessionClicks?: number;
    dayClicks?: number;
    maxClicksPerSession?: number;
    maxClicksPerDay?: number;
  } | null;
  getConsentGiven?: () => boolean;
  getAdUnitModeDiagnostics?: () => {
    effective: boolean;
    source: 'google_sample' | 'production';
    runtimeOverride: boolean | null;
    testingDeviceCount: number;
    testingDeviceMasks: string[];
  };
};

/**
 * Build a complete diagnostics snapshot from AdService state.
 */
export async function buildDiagnosticsSnapshot(
  adService: AdServiceSnapshotSource,
  placements: string[],
  policyMode: PolicyMode = 'production'
): Promise<DiagnosticsSnapshot> {
  const now = Date.now();
  const limits = await adService.getAdsLimitsSnapshot(placements);

  let initReady = false;
  try {
    await adService.getInitReady();
    initReady = true;
  } catch {
    initReady = false;
  }

  const placementDiagnostics: PlacementDiagnostic[] = [];

  for (const placement of placements) {
    const showResult = await adService.evaluateDecision({ placement, phase: 'show' });
    const preloadResult = await adService.evaluateDecision({ placement, phase: 'preload' });

    const showBlock =
      !showResult.allowed && showResult.ruleId
        ? {
            ruleId: showResult.ruleId,
            message: showResult.message ?? 'Blocked',
            hint: getRuleHint(showResult.ruleId)?.hint,
          }
        : undefined;

    const preloadBlock =
      !preloadResult.allowed && preloadResult.ruleId
        ? {
            ruleId: preloadResult.ruleId,
            message: preloadResult.message ?? 'Blocked',
            hint: getRuleHint(preloadResult.ruleId)?.hint,
          }
        : undefined;

    placementDiagnostics.push({
      placement,
      toggle: adService.isEnabled(placement),
      showBlock,
      preloadBlock,
    });
  }

  const ivtStatus = adService.getIvtStatus();
  const msSinceLast = limits.interstitial.msSinceLast;
  const minIntervalMs = limits.interstitial.minIntervalMs;
  const cooldownSec =
    msSinceLast != null && minIntervalMs > 0
      ? Math.max(0, Math.ceil((minIntervalMs - msSinceLast) / 1000))
      : 0;

  const simulation = readSimulationOverrides();

  return {
    timestamp: now,
    policyMode,
    initReady,
    consentGiven: adService.getConsentGiven?.() ?? true,
    ivtPaused: ivtStatus?.paused ?? false,
    simulationActive: hasActiveSimulation(simulation),
    adUnitMode: adService.getAdUnitModeDiagnostics?.() ?? {
      effective: false,
      source: 'google_sample',
      runtimeOverride: null,
      testingDeviceCount: 0,
      testingDeviceMasks: [],
    },
    placements: placementDiagnostics,
    limits: {
      wardrobe: {
        current: limits.wardrobeReadiness.currentItemCount,
        globalMin: limits.wardrobeReadiness.globalMinWardrobeItems,
        perPlacement: limits.wardrobeReadiness.placementMins,
        gatesDisabled: limits.wardrobeReadiness.gatesDisabled,
      },
      interstitial: {
        shownThisSession: limits.interstitial.shownThisSession,
        maxPerSession: limits.interstitial.maxPerSession,
        minIntervalMs,
        msSinceLast,
        cooldownSec,
      },
      ivt: {
        enabled: ivtStatus?.enabled ?? false,
        paused: ivtStatus?.paused ?? false,
        sessionClicks: ivtStatus?.sessionClicks ?? 0,
        dayClicks: ivtStatus?.dayClicks ?? 0,
        maxClicksPerSession: ivtStatus?.maxClicksPerSession ?? 0,
        maxClicksPerDay: ivtStatus?.maxClicksPerDay ?? 0,
      },
    },
    freqCaps: limits.freqCaps,
  };
}
