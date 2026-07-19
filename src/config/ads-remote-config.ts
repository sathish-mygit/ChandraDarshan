import type { FrequencyCapMap } from '@/lib/ads/core/types';
import type { FreqCapRemoteRouting } from '@/lib/ads/config/ivt-remote-config';
import { Placement } from './placements';

export const DEFAULT_PLACEMENT_FREQ_CAP: FrequencyCapMap = {
  [Placement.INTERSTITIAL_TO_JYOTISH]: { perHour: 1, perDay: 3 },
  [Placement.INTERSTITIAL_TO_HOME]: { perHour: 1, perDay: 2 },
  [Placement.INTERSTITIAL_TO_SETTINGS]: { perHour: 1, perDay: 2 },
};

export const APP_FIREBASE_RC_KEY_MAP: Record<string, string> = {
  engagement_minAppSessions: 'engagement.minWardrobeItems',
  ads_disable_engagement_gates: 'engagement.gatesDisabled',
};

export const PLACEMENT_FIREBASE_RC_KEY_MAP: Record<string, string> = {
  ...APP_FIREBASE_RC_KEY_MAP,
  ads_master: 'ads.master',
  interstitial_toJyotish: 'interstitial.toJyotish',
  interstitial_toHome: 'interstitial.toHome',
  interstitial_toSettings: 'interstitial.toSettings',
  ads_fallback_when_no_jyotish: 'fallbackAds.enableWhenJyotishNotVisited',
  ads_fallback_home: 'fallbackAds.enableHomePlacement',
  ads_fallback_settings: 'fallbackAds.enableSettingsPlacement',
};

export const PLACEMENT_IVT_RC_KEY_MAP: Record<string, string> = {
  freqCap_interstitial_toJyotish_perHour: 'freqCap.interstitial.toJyotish.perHour',
  freqCap_interstitial_toJyotish_perDay: 'freqCap.interstitial.toJyotish.perDay',
  freqCap_interstitial_toHome_perDay: 'freqCap.interstitial.toHome.perDay',
  freqCap_interstitial_toSettings_perDay: 'freqCap.interstitial.toSettings.perDay',
  ivt_enabled: 'ivt.enabled',
  ivt_maxClicksPerSession: 'ivt.maxClicksPerSession',
  ivt_maxClicksPerDay: 'ivt.maxClicksPerDay',
  ivt_pauseDurationMs: 'ivt.pauseDurationMs',
  ivt_navigationDelayMs: 'ivt.navigationDelayMs',
};

export const PLACEMENT_FREQ_CAP_ROUTING: FreqCapRemoteRouting = {
  freqCapPlacementKeys: {
    'freqCap.interstitial.toJyotish': Placement.INTERSTITIAL_TO_JYOTISH,
    'freqCap.interstitial.toHome': Placement.INTERSTITIAL_TO_HOME,
    'freqCap.interstitial.toSettings': Placement.INTERSTITIAL_TO_SETTINGS,
  },
  deprecatedFreqCapAliases: {},
};

export const FIREBASE_RC_KEY_MAP: Record<string, string> = {
  ...PLACEMENT_FIREBASE_RC_KEY_MAP,
  interstitial_minIntervalMs: 'interstitial.minIntervalMs',
  interstitial_maxPerSession: 'interstitial.maxPerSession',
  adUnitId_interstitial: 'adUnitId.interstitial',
  mediationProvider: 'mediationProvider',
  newUserGrace_enabled: 'newUserGrace.enabled',
  newUserGrace_type: 'newUserGrace.type',
  newUserGrace_maxSessions: 'newUserGrace.maxSessions',
  ...PLACEMENT_IVT_RC_KEY_MAP,
};

export const FIREBASE_RC_KEYS = Object.keys(FIREBASE_RC_KEY_MAP);
