/** Diagnostics types — reusable across apps */

export type PolicyMode = 'production' | 'admob_only';

export type SessionAttemptKind =
  | 'evaluate'
  | 'skip'
  | 'preload_skip'
  | 'show'
  | 'preload'
  | 'provider';

export type SessionAttemptSource = 'policy' | 'provider' | 'debug';

export interface SessionAttemptEntry {
  timestamp: number;
  kind: SessionAttemptKind;
  placement: string;
  phase?: 'show' | 'preload';
  allowed?: boolean;
  ruleId?: string;
  message: string;
  source: SessionAttemptSource;
}

export interface PlacementDiagnostic {
  placement: string;
  toggle: boolean;
  showBlock?: {
    ruleId: string;
    message: string;
    hint?: string;
  };
  preloadBlock?: {
    ruleId: string;
    message: string;
    hint?: string;
  };
}

export interface DiagnosticsSnapshot {
  timestamp: number;
  policyMode: PolicyMode;
  initReady: boolean;
  consentGiven: boolean;
  ivtPaused: boolean;
  simulationActive: boolean;
  adUnitMode: {
    effective: boolean;
    source: 'google_sample' | 'production';
    runtimeOverride: boolean | null;
    testingDeviceCount: number;
    testingDeviceMasks: string[];
  };
  placements: PlacementDiagnostic[];
  limits: {
    wardrobe: {
      current: number | null;
      globalMin: number;
      perPlacement: Record<string, number>;
      gatesDisabled: boolean;
    };
    interstitial: {
      shownThisSession: number;
      maxPerSession: number;
      minIntervalMs: number;
      msSinceLast: number | null;
      cooldownSec: number;
    };
    ivt: {
      enabled: boolean;
      paused: boolean;
      sessionClicks: number;
      dayClicks: number;
      maxClicksPerSession: number;
      maxClicksPerDay: number;
    };
  };
  freqCaps?: Record<
    string,
    { perHour: number; perDay: number; hourUsed: number; dayUsed: number }
  >;
}

export interface SimulationOverrides {
  engagementCount?: number;
  engagementMin?: number;
  engagementGatesDisabled?: boolean;
  interstitial?: {
    maxPerSession?: number;
    minIntervalMs?: number;
  };
  ivt?: {
    maxClicksPerSession?: number;
    maxClicksPerDay?: number;
  };
  consentGranted?: boolean;
  ivtPaused?: boolean;
  interstitialShownCount?: number;
  lastInterstitialAt?: number;
  placementToggles?: Record<string, boolean>;
  freqCap?: Record<
    string,
    {
      perHour?: number;
      perDay?: number;
      hourUsed?: number;
      dayUsed?: number;
    }
  >;
}

export interface DiagnosticsExportReport {
  timestamp: number;
  snapshot: DiagnosticsSnapshot;
  recentAttempts: SessionAttemptEntry[];
  formattedText: string;
}
