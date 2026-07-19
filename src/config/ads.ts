/**
 * Ads configuration — native Android (AdMob) only.
 *
 * Google sample IDs used when NEXT_PUBLIC_AD_USE_GOOGLE_SAMPLE_UNITS=true.
 * Google test app ID: ca-app-pub-3940256099942544~3347511713
 */
import { GraceType } from '@/lib/ads/core/types';
import { DEFAULT_IVT_CONFIG } from '@/lib/ads/config/ivt-defaults';
import { DEFAULT_PLACEMENT_DEFINITIONS } from '@/config/placement-definitions';
import { DEFAULT_PLACEMENT_FREQ_CAP } from '@/config/ads-remote-config';
import { DEFAULT_ENGAGEMENT } from '@/config/ads-engagement';
import { PLACEMENT_CATALOG, Placement } from '@/config/placements';

const catalogSettings = Object.fromEntries(
  PLACEMENT_CATALOG.map((entry) => [entry.key, entry.defaultEnabled]),
) as Record<string, boolean>;

const TEST_APP_ID_ANDROID = 'ca-app-pub-3940256099942544~3347511713';
const TEST_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';

const PROD_APP_ID_ANDROID =
  process.env.NEXT_PUBLIC_ADMOB_APP_ID_ANDROID || TEST_APP_ID_ANDROID;
const PROD_INTERSTITIAL =
  process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID_ANDROID || TEST_INTERSTITIAL;

function envFlag(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value === 'true';
}

const adsConfig = {
  testMode: process.env.NEXT_PUBLIC_TEST_MODE !== 'false',
  useProductionAdUnits: process.env.NEXT_PUBLIC_AD_USE_GOOGLE_SAMPLE_UNITS !== 'true',
  appIds: {
    android: PROD_APP_ID_ANDROID,
    ios: '',
  },
  testingDevices: [],
  adUnitIds: {
    banner: TEST_INTERSTITIAL,
    interstitial: PROD_INTERSTITIAL,
    rewarded: TEST_INTERSTITIAL,
    rewardedInterstitial: TEST_INTERSTITIAL,
    native: TEST_INTERSTITIAL,
  },
  settings: catalogSettings,
  interstitial: {
    minIntervalMs: 5 * 60 * 1000,
    maxPerSession: 2,
  },
  banner: { enabled: false },
  rewarded: { enabled: false },
  mediationProvider: 'admob' as 'admob' | 'applovin_max',
  newUserGrace: {
    enabled: false,
    type: GraceType.SESSIONS,
    maxSessions: 5,
  },
  placementDefinitions: DEFAULT_PLACEMENT_DEFINITIONS,
  placementNewUserPolicy: {
    [Placement.INTERSTITIAL_TO_JYOTISH]: {
      showForNewUsers: false,
      minWardrobeItems: 2,
    },
    [Placement.INTERSTITIAL_TO_HOME]: {
      showForNewUsers: false,
      minWardrobeItems: 3,
    },
    [Placement.INTERSTITIAL_TO_SETTINGS]: {
      showForNewUsers: false,
      minWardrobeItems: 3,
    },
  },
  ivt: { ...DEFAULT_IVT_CONFIG },
  freqCap: { ...DEFAULT_PLACEMENT_FREQ_CAP },
  engagement: { ...DEFAULT_ENGAGEMENT },
  fallbackAds: {
    enableWhenJyotishNotVisited: envFlag(
      'NEXT_PUBLIC_ADS_FALLBACK_WHEN_NO_JYOTISH',
      false,
    ),
    enableHomePlacement: envFlag('NEXT_PUBLIC_ADS_FALLBACK_HOME', false),
    enableSettingsPlacement: envFlag('NEXT_PUBLIC_ADS_FALLBACK_SETTINGS', false),
  },
};

export default adsConfig;

/** Build-time gate — skip entire ad stack when false. */
export function isAdsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
}

export type FallbackAdsConfig = typeof adsConfig.fallbackAds;
