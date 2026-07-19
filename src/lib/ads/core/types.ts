export enum NetworkType {
  ADMOB = 'admob',
  APPLOVIN_MAX = 'applovin_max',
  META = 'meta',
  UNITY = 'unity',
  PANGLE = 'pangle',
  MINTEGRAL = 'mintegral',
  MOCK = 'mock',
}

export enum PlacementStrategy {
  MEDIATION = 'mediation',
  DIRECT = 'direct',
  HYBRID_WATERFALL = 'hybrid_waterfall',
}

/** Arbitrary placement key string — app defines concrete keys in src/config/placements.ts */
export type PlacementKey = string;

export enum NativeAdSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum GraceType {
  SESSIONS = 'sessions',
  DAYS = 'days',
  HOURS = 'hours',
  RETURNS = 'returns',
}

export type AdFormat = 'native' | 'interstitial' | 'rewarded' | 'banner' | 'app-open';

export interface NativeAd {
  id: string;
  headline?: string;
  body?: string;
  cta?: string;
  images?: string[];
  rating?: number;
  network: NetworkType;
  impressionTimestamp: number;
}

/** @deprecated Use NativeAd — kept for existing NativeAd component */
export interface AdData {
  headline?: string;
  body?: string;
  callToAction?: string;
  imageUrl?: string;
  iconUrl?: string;
  advertiser?: string;
}

export interface AdRequestParams {
  placement: PlacementKey;
  size?: NativeAdSize;
  timeout?: number;
}

export interface AdRewardedResult {
  earned: boolean;
  rewardType?: string;
  rewardAmount?: number;
}

export interface PlacementNetworkConfig {
  strategy: PlacementStrategy;
  mediationProvider?: NetworkType;
  directNetwork?: NetworkType;
  waterfall?: NetworkType[];
}

export interface NewUserPlacementPolicy {
  showForNewUsers: boolean;
  /** Minimum wardrobe items before this placement may show (unified readiness gate). */
  minWardrobeItems?: number;
  /** @deprecated Use minWardrobeItems — still read as fallback when minWardrobeItems is unset. */
  startAfterSession?: number;
  startAfterDays?: number;
  startAfterReturns?: number;
}

export interface PlacementDefinition {
  format: AdFormat;
  sizes?: NativeAdSize[];
  position: string;
  refreshIntervalSec: number;
  frequencyCap: { perHour: number; perDay: number };
  priority: number;
  networkConfig: PlacementNetworkConfig;
  newUserPolicy?: NewUserPlacementPolicy;
}

export interface NewUserGraceConfig {
  enabled: boolean;
  type: GraceType;
  maxSessions?: number;
  maxDays?: number;
  maxHours?: number;
  requiredReturns?: number;
}

export interface UserGraceState {
  firstLaunchTime: number;
  sessionCount: number;
  totalSessions: number;
  daysActive: number;
  isNewUser: boolean;
  lastAppOpenTime: number;
}

export interface ProviderInitOptions {
  testMode?: boolean;
  useProductionAdUnits?: boolean;
  /** sessionStorage override from diagnostics panel */
  adUnitModeRuntimeOverride?: boolean | null;
  testDeviceIds?: string[];
  appIds?: { android?: string; ios?: string };
  adUnitIds?: Record<string, string>;
  pangleAppId?: string;
  metaAppId?: string;
  onAdClick?: (placement: string, format: string) => void;
  onAdImpression?: (placement: string, format: string) => void;
}

export interface AdMetrics {
  provider: string;
  placement: string;
  format: AdFormat;
  loadLatency: number;
  fillRate: number;
  impressions: number;
  clicks: number;
  errors: number;
  ctr?: number;
  ecpm?: number;
}

export type AdSkipReason =
  | 'new_user_grace'
  | 'engagement_gate'
  | 'disabled'
  | 'no_fill'
  | 'consent'
  | 'rate_limit'
  | 'click_limit'
  | 'frequency_cap'
  | 'ivt_pause'
;

export interface IvtConfig {
  enabled: boolean;
  maxClicksPerSession: number;
  maxClicksPerDay: number;
  pauseDurationMs: number;
  navigationDelayMs: number;
}

export interface FrequencyCapValue {
  perHour: number;
  perDay: number;
}

export type FrequencyCapMap = Record<string, FrequencyCapValue>;


export interface IvtStatus {
  enabled: boolean;
  paused: boolean;
  pausedUntil: number;
  sessionClicks: number;
  dayClicks: number;
  maxClicksPerSession: number;
  maxClicksPerDay: number;
}

export interface SessionAdStats {
  impressions: number;
  clicks: number;
  skipsByReason: Record<string, number>;
}

export interface EngagementConfig {
  minWardrobeItems: number;
  /** When true, skip min-games-played gates (Remote Config or debug). */
  gatesDisabled?: boolean;
}

export type DebugLimitOverrides = {
  engagement?: Partial<EngagementConfig>;
  interstitial?: { minIntervalMs?: number; maxPerSession?: number };
  ivt?: Partial<IvtConfig>;
  freqCap?: FrequencyCapMap;
};

export type FreqCapUsageSnapshot = {
  perHour: number;
  perDay: number;
  hourUsed: number;
  dayUsed: number;
};

export type AdsLimitsSnapshot = {
  wardrobeReadiness: {
    globalMinWardrobeItems: number;
    currentItemCount: number | null;
    placementMins: Record<string, number>;
    sessionCount: number;
    gatesDisabled: boolean;
  };
  interstitial: {
    minIntervalMs: number;
    maxPerSession: number;
    shownThisSession: number;
    msSinceLast: number | null;
  };
  ivt: IvtStatus | null;
  freqCaps: Record<string, FreqCapUsageSnapshot>;
  debugOverridesActive: boolean;
};

export interface AdsRuntimeConfig {
  testMode?: boolean;
  useProductionAdUnits?: boolean;
  appIds?: { android?: string; ios?: string };
  testingDevices?: string[];
  adUnitIds?: Record<string, string>;
  settings?: Record<string, boolean>;
  interstitial?: { minIntervalMs?: number; maxPerSession?: number };
  banner?: { enabled?: boolean };
  rewarded?: { enabled?: boolean };
  mediationProvider?: string;
  newUserGrace?: NewUserGraceConfig;
  placementNewUserPolicy?: Partial<Record<PlacementKey, NewUserPlacementPolicy>>;
  ivt?: Partial<IvtConfig>;
  freqCap?: FrequencyCapMap;
  placementDefinitions?: Record<string, PlacementDefinition>;
  engagement?: EngagementConfig;
  fallbackAds?: {
    enableWhenJyotishNotVisited?: boolean;
    enableHomePlacement?: boolean;
    enableSettingsPlacement?: boolean;
  };
}
