'use client';

import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import {
  logEvent as logFirebaseEvent,
  setCurrentScreen,
  setUserProperties,
} from 'firebase/analytics';
import { isAnalyticsEnabled } from '@/config/analytics';
import { getFirebaseAnalytics } from '@/lib/firebase/client';
import { getRouteMetadata } from '@/lib/analytics/route-metadata';

class AnalyticsService {
  private sessionStartTime = Date.now();

  constructor() {
    void this.initialize();
  }

  private isDisabled(operation: string): boolean {
    if (isAnalyticsEnabled()) {
      return false;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        `[AnalyticsService] suppressed ${operation} (NEXT_PUBLIC_ANALYTICS_ENABLED is not "true")`,
      );
    }

    return true;
  }

  private async initialize(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const enabled = isAnalyticsEnabled();
        await FirebaseAnalytics.setEnabled({ enabled });
        console.log(
          `[AnalyticsService] Native Firebase Analytics ${enabled ? 'enabled' : 'disabled'}.`,
        );
      } catch (error) {
        console.error('[AnalyticsService] Error initializing native analytics', error);
      }
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[AnalyticsService] Web analytics ${isAnalyticsEnabled() ? 'enabled' : 'disabled'} (on first use).`,
      );
    }
  }

  async logPageView(screenName: string): Promise<void> {
    if (this.isDisabled(`screen_view:${screenName}`)) {
      return;
    }

    try {
      const { page_title, route_segment } = getRouteMetadata(screenName);

      if (Capacitor.isNativePlatform()) {
        await FirebaseAnalytics.logEvent({
          name: 'screen_view',
          params: {
            screen_name: screenName,
            screen_class: 'ChandraDarshanApp',
            page_title,
            route_segment,
          },
        });
        return;
      }

      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        setCurrentScreen(analytics, screenName);
        logFirebaseEvent(analytics, 'screen_view', {
          firebase_screen: screenName,
          firebase_screen_class: 'WebApp',
          page_title,
          route_segment,
        });
      }
    } catch (error) {
      console.error(`[AnalyticsService] Error logging page view for ${screenName}:`, error);
    }
  }

  async setUserProperty(key: string, value: string | null): Promise<void> {
    if (this.isDisabled(`setUserProperty:${key}`)) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await FirebaseAnalytics.setUserProperty({ key, value });
        return;
      }

      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        setUserProperties(analytics, { [key]: value ?? undefined });
      }
    } catch (error) {
      console.error(`[AnalyticsService] Error setting user property '${key}':`, error);
    }
  }

  async setUserProperties(props: Record<string, string | number | null>): Promise<void> {
    if (this.isDisabled('setUserProperties')) {
      return;
    }

    try {
      const stringProps: Record<string, string> = {};
      for (const [key, value] of Object.entries(props)) {
        if (value === null || value === undefined) {
          continue;
        }
        stringProps[key] = String(value);
      }

      if (Object.keys(stringProps).length === 0) {
        return;
      }

      if (Capacitor.isNativePlatform()) {
        await Promise.all(
          Object.entries(stringProps).map(([key, value]) =>
            FirebaseAnalytics.setUserProperty({ key, value }),
          ),
        );
        return;
      }

      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        setUserProperties(analytics, stringProps);
      }
    } catch (error) {
      console.error('[AnalyticsService] Error setting user properties:', error);
    }
  }

  async logEvent(
    name: string,
    params: Record<string, string | number | boolean> = {},
  ): Promise<void> {
    if (this.isDisabled(`event:${name}`)) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await FirebaseAnalytics.logEvent({ name, params });
      } else {
        const analytics = await getFirebaseAnalytics();
        if (analytics) {
          logFirebaseEvent(analytics, name, params);
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[AnalyticsService] Logged event: '${name}'`, params);
      }
    } catch (error) {
      console.error(`[AnalyticsService] Error logging event '${name}':`, error);
    }
  }

  getSessionStartTime(): number {
    return this.sessionStartTime;
  }

  resetSessionTime(): void {
    this.sessionStartTime = Date.now();
  }
}

export const analyticsService = new AnalyticsService();
