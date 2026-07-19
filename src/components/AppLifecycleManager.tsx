'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { fetchAndActivate, getAll } from 'firebase/remote-config';
import { isAdsEnabled } from '@/config/ads';
import { getAppSessionCount, incrementAppSessionCount } from '@/config/ads-engagement';
import { Placement } from '@/config/placements';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { adService, resolveEnabledNetworks, useAdSessionAnalytics } from '@/lib/ads';
import { getFirebaseApp, getRemoteConfig } from '@/lib/firebase/client';
import {
  DAILY_READING_ROUTE,
  syncDailyReadingReminder,
} from '@/lib/notifications/daily-reminder';
import {
  buildRemoteAdsSettingsFromFirebase,
  mergeConfigWithDefaults,
} from '@/lib/remote-config-ads';

export function AppLifecycleManager() {
  useAdSessionAnalytics(adService);
  const router = useRouter();
  const { preferences, isLoading } = useAppPreferences();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    void syncDailyReadingReminder(preferences);
  }, [isLoading, preferences]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let notificationListener: { remove: () => void } | null = null;

    const setupNotificationListener = async () => {
      notificationListener = await LocalNotifications.addListener(
        'localNotificationActionPerformed',
        (event) => {
          const route =
            (event.notification.extra?.route as string | undefined) ??
            DAILY_READING_ROUTE;
          router.push(route);
        },
      );
    };

    void setupNotificationListener().catch((error) => {
      console.warn('[AppLifecycleManager] Notification listener setup failed:', error);
    });

    return () => {
      notificationListener?.remove();
    };
  }, [router]);

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
