/**
 * Remote Config → ads config merge for Hand Cricket Pro (native Android).
 * Uses Firebase Web SDK values from AppLifecycleManager fetch.
 */

import {
  CORE_IVT_RC_KEY_MAP,
  mergeIvtRemoteConfig,
  parseIvtRemoteValue,
  routeIvtRemoteValue,
} from '@/lib/ads/config/ivt-remote-config';
import {
  applyDeprecatedPlacementAliases,
  DEPRECATED_FIREBASE_RC_ALIASES,
} from '@/config/placements';
import {
  FIREBASE_RC_KEY_MAP,
  PLACEMENT_FREQ_CAP_ROUTING,
} from '@/config/ads-remote-config';
import adsConfig from '@/config/ads';

const INTERSTITIAL_LIMIT_KEYS = new Set(['interstitial.minIntervalMs', 'interstitial.maxPerSession']);

type RemoteConfigValueLike = {
  asString(): string;
  asBoolean(): boolean;
  asNumber(): number;
};

export function parseRemoteConfigValue(
  value: string | number | boolean,
  key: string
): string | number | boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value;

  if (INTERSTITIAL_LIMIT_KEYS.has(key)) {
    const n = parseInt(String(value), 10);
    return Number.isFinite(n) ? n : 0;
  }

  if (
    key.includes('Interval') ||
    key.includes('Max') ||
    key.includes('maxSessions') ||
    key.includes('WardrobeItems') ||
    key.includes('GamesPlayed') ||
    key.includes('Count') ||
    key.startsWith('ivt.') ||
    key.startsWith('freqCap.')
  ) {
    if (key === 'ivt.enabled') {
      return value === 'true' || value === '1' || value === 'yes';
    }
    if (key.startsWith('ivt.') || key.startsWith('freqCap.')) {
      return parseIvtRemoteValue(value, key) as number;
    }
    return parseInt(String(value), 10) || 0;
  }

  if (
    key.includes('master') ||
    key.startsWith('ads.') ||
    key.startsWith('banner.') ||
    key.startsWith('interstitial.') ||
    key.startsWith('rewarded.') ||
    key.startsWith('fallbackAds.') ||
    key === 'showAdsNative' ||
    key === 'engagement.gatesDisabled' ||
    (key.startsWith('newUserGrace.') && key !== 'newUserGrace.type')
  ) {
    return value === 'true' || value === '1' || value === 'yes';
  }

  return String(value);
}

function routeRemoteValue(
  remoteSettings: Record<string, unknown>,
  internalKey: string,
  parsedValue: string | number | boolean
): void {
  const settings = remoteSettings.settings as Record<string, unknown>;
  const adUnitIds = remoteSettings.adUnitIds as Record<string, unknown>;
  const interstitial = remoteSettings.interstitial as Record<string, unknown>;
  const newUserGrace = remoteSettings.newUserGrace as Record<string, unknown>;
  const engagement = remoteSettings.engagement as Record<string, unknown>;
  const fallbackAds = remoteSettings.fallbackAds as Record<string, unknown>;

  if (internalKey.startsWith('fallbackAds.')) {
    const field = internalKey.replace('fallbackAds.', '');
    fallbackAds[field] = parsedValue;
    return;
  }

  if (internalKey.startsWith('engagement.')) {
    const field = internalKey.replace('engagement.', '');
    engagement[field] = parsedValue;
    return;
  }

  if (internalKey.startsWith('adUnitId.')) {
    const unitType = internalKey.replace('adUnitId.', '');
    adUnitIds[unitType] = parsedValue;
    return;
  }

  if (INTERSTITIAL_LIMIT_KEYS.has(internalKey)) {
    const settingName = internalKey.replace('interstitial.', '');
    interstitial[settingName] = parsedValue;
    return;
  }

  if (
    internalKey.startsWith('ads.') ||
    internalKey.startsWith('banner.') ||
    internalKey.startsWith('interstitial.') ||
    internalKey.startsWith('rewarded.') ||
    internalKey === 'showAdsNative'
  ) {
    settings[internalKey] = parsedValue;
    return;
  }

  if (internalKey === 'mediationProvider') {
    remoteSettings.mediationProvider = parsedValue;
    return;
  }

  if (internalKey.startsWith('newUserGrace.')) {
    const field = internalKey.replace('newUserGrace.', '');
    newUserGrace[field] = parsedValue;
    return;
  }

  if (internalKey.startsWith('ivt.') || internalKey.startsWith('freqCap.')) {
    routeIvtRemoteValue(remoteSettings, internalKey, parsedValue, PLACEMENT_FREQ_CAP_ROUTING);
  }
}

function applyDeprecatedFirebaseAliases(
  settings: Record<string, boolean>,
  firebaseKey: string,
  parsedValue: boolean
): void {
  const targets = DEPRECATED_FIREBASE_RC_ALIASES[firebaseKey];
  if (!targets) return;
  for (const target of targets) {
    if (settings[target] === undefined) {
      settings[target] = parsedValue;
    }
  }
}

/**
 * Build remote ads settings object from Firebase getAll() map.
 */
export function buildRemoteAdsSettingsFromFirebase(
  allConfig: Record<string, RemoteConfigValueLike | undefined>
): Record<string, unknown> {
  const remoteSettings: Record<string, unknown> = {
    settings: {},
    adUnitIds: {},
    interstitial: {},
    banner: {},
    rewarded: {},
    newUserGrace: {},
    engagement: {},
    ivt: {},
    freqCap: {},
    fallbackAds: {},
  };

  for (const [firebaseKey, internalKey] of Object.entries(FIREBASE_RC_KEY_MAP)) {
    const entry = allConfig[firebaseKey];
    if (!entry) continue;

    let raw: string | number | boolean;
    try {
      raw = entry.asString();
    } catch {
      continue;
    }
    if (raw === '' || raw === undefined) continue;

    const parsedValue = parseRemoteConfigValue(raw, internalKey);
    routeRemoteValue(remoteSettings, internalKey, parsedValue);

    if (typeof parsedValue === 'boolean') {
      applyDeprecatedFirebaseAliases(
        remoteSettings.settings as Record<string, boolean>,
        firebaseKey,
        parsedValue
      );
    }
  }

  return remoteSettings;
}

export function mergeConfigWithDefaults(
  remoteConfig: Record<string, unknown>
): typeof adsConfig {
  const rc = remoteConfig as {
    appIds?: typeof adsConfig.appIds;
    adUnitIds?: typeof adsConfig.adUnitIds;
    settings?: typeof adsConfig.settings;
    interstitial?: typeof adsConfig.interstitial;
    banner?: typeof adsConfig.banner;
    rewarded?: typeof adsConfig.rewarded;
    mediationProvider?: typeof adsConfig.mediationProvider;
    newUserGrace?: Partial<typeof adsConfig.newUserGrace>;
    placementNewUserPolicy?: typeof adsConfig.placementNewUserPolicy;
    ivt?: typeof adsConfig.ivt;
    freqCap?: typeof adsConfig.freqCap;
    engagement?: Partial<typeof adsConfig.engagement>;
    fallbackAds?: Partial<typeof adsConfig.fallbackAds>;
  };

  const ivtMerged = mergeIvtRemoteConfig(
    { ivt: rc.ivt, freqCap: rc.freqCap },
    { ivt: adsConfig.ivt, freqCap: adsConfig.freqCap }
  );

  return {
    ...adsConfig,
    testMode: adsConfig.testMode,
    useProductionAdUnits: adsConfig.useProductionAdUnits,
    appIds: {
      ...adsConfig.appIds,
      ...(rc.appIds || {}),
    },
    adUnitIds: {
      ...adsConfig.adUnitIds,
      ...(rc.adUnitIds || {}),
    },
    settings: (() => {
      const remoteSettings = (rc.settings as Record<string, boolean>) || {};
      return applyDeprecatedPlacementAliases(
        { ...adsConfig.settings, ...remoteSettings },
        remoteSettings
      );
    })(),
    interstitial: {
      ...adsConfig.interstitial,
      ...(rc.interstitial || {}),
    },
    banner: {
      ...adsConfig.banner,
      ...(rc.banner || {}),
    },
    rewarded: {
      ...adsConfig.rewarded,
      ...(rc.rewarded || {}),
    },
    mediationProvider: rc.mediationProvider ?? adsConfig.mediationProvider,
    newUserGrace: {
      ...adsConfig.newUserGrace,
      ...(rc.newUserGrace || {}),
    },
    placementNewUserPolicy: {
      ...adsConfig.placementNewUserPolicy,
      ...(rc.placementNewUserPolicy || {}),
    },
    ivt: ivtMerged.ivt,
    freqCap: ivtMerged.freqCap,
    engagement: {
      ...adsConfig.engagement,
      ...(rc.engagement || {}),
    },
    fallbackAds: {
      ...adsConfig.fallbackAds,
      ...(rc.fallbackAds || {}),
    },
  };
}

export function applyRemoteConfigToAds(remoteConfig: Record<string, unknown>) {
  return mergeConfigWithDefaults(remoteConfig);
}

export { CORE_IVT_RC_KEY_MAP };
