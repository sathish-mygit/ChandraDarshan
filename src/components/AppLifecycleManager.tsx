'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { fetchAndActivate, getAll } from 'firebase/remote-config';
import { isAdsEnabled } from '@/config/ads';
import { getAppSessionCount, incrementAppSessionCount } from '@/config/ads-engagement';
import { Placement } from '@/config/placements';
import { adService, resolveEnabledNetworks, useAdSessionAnalytics } from '@/lib/ads';
import { getFirebaseApp, getRemoteConfig } from '@/lib/firebase/client';
import {
  buildRemoteAdsSettingsFromFirebase,
  mergeConfigWithDefaults,
} from '@/lib/remote-config-ads';

export function AppLifecycleManager() {
  useAdSessionAnalytics(adService);

  useEffect(() => {
    void incrementAppSessionCount();

    const initializeAds = async () => {
      if (!isAdsEnabled() || !Capacitor.isNativePlatform()) {
        return;
      }

      let remoteAdsSettings: Record<string, unknown> = {};
      const firebaseApp = getFirebaseApp();

      if (firebaseApp) {
        try {
          const remoteConfig = getRemoteConfig();
          if (remoteConfig) {
            await fetchAndActivate(remoteConfig);
            remoteAdsSettings = buildRemoteAdsSettingsFromFirebase(getAll(remoteConfig));
          }
        } catch (error) {
          console.warn('[AppLifecycleManager] Remote Config fetch failed:', error);
        }
      }

      try {
        const finalConfig = mergeConfigWithDefaults(remoteAdsSettings);
        await adService.init({
          config: finalConfig,
          enabledNetworks: resolveEnabledNetworks(finalConfig, true),
          getEngagementItemCount: getAppSessionCount,
        });
        void adService.maybePreloadInterstitial(Placement.INTERSTITIAL_TO_JYOTISH);
      } catch (error) {
        console.error('[AppLifecycleManager] AdService init failed:', error);
      }
    };

    void initializeAds();
  }, []);

  return null;
}
