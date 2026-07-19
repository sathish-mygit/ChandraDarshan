'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { isAnalyticsEnabled } from '@/config/analytics';
import { buildInfo } from '@/config/buildinfo-generated';
import { analyticsService } from '@/lib/analytics/analytics.service';
import { crashlyticsService } from '@/lib/analytics/crashlytics.service';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';

export function AppTelemetry() {
  const { preferences, isLoading } = useAppPreferences();

  useEffect(() => {
    if (!isAnalyticsEnabled()) {
      return;
    }

    if (buildInfo.buildNumber > 0) {
      void crashlyticsService.setCustomKey('buildNumber', buildInfo.buildNumber);
      void crashlyticsService.setCustomKey('buildBranch', buildInfo.branchName);
      void crashlyticsService.setCustomKey('buildDate', buildInfo.buildDate);
    }

    const handleError = (event: ErrorEvent) => {
      void crashlyticsService.recordError({
        error: event.error instanceof Error ? event.error : new Error(event.message),
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      void crashlyticsService.recordError({
        error:
          reason instanceof Error
            ? reason
            : new Error(typeof reason === 'string' ? reason : 'Unhandled promise rejection'),
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  useEffect(() => {
    if (!isAnalyticsEnabled() || isLoading) {
      return;
    }

    void analyticsService.setUserProperties({
      app_language: preferences.language,
      masa_system: preferences.masaSystem,
      has_birth_profile: preferences.birthProfile ? 'true' : 'false',
      location_source: preferences.location.source,
      platform: Capacitor.isNativePlatform() ? 'native' : 'web',
    });
  }, [isLoading, preferences]);

  return null;
}
