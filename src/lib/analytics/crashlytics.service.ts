'use client';

import { Capacitor } from '@capacitor/core';
import {
  FirebaseCrashlytics,
  type RecordExceptionOptions,
} from '@capacitor-firebase/crashlytics';
import { logEvent as logFirebaseEvent } from 'firebase/analytics';
import { isAnalyticsEnabled } from '@/config/analytics';
import { getFirebaseAnalytics } from '@/lib/firebase/client';

type ErrorInput =
  | RecordExceptionOptions
  | { error: Error; isFatal?: boolean };

class CrashlyticsService {
  private isInitialized = false;

  constructor() {
    void this.initialize();
  }

  private isDisabled(): boolean {
    return !isAnalyticsEnabled();
  }

  private async initialize(): Promise<void> {
    if (this.isDisabled()) {
      return;
    }

    if (Capacitor.isNativePlatform()) {
      try {
        await FirebaseCrashlytics.setEnabled({ enabled: true });
        this.isInitialized = true;
        console.log('[CrashlyticsService] Native Firebase Crashlytics enabled.');
      } catch (error) {
        console.error('[CrashlyticsService] Error initializing native crashlytics', error);
      }
      return;
    }

    this.isInitialized = true;
    console.log('[CrashlyticsService] Web error logging ready via Firebase Analytics.');
  }

  async recordError(options: ErrorInput): Promise<void> {
    if (this.isDisabled() || !this.isInitialized) {
      return;
    }

    const error =
      'error' in options ? options.error : new Error(options.message ?? 'Unknown error');

    try {
      if (Capacitor.isNativePlatform()) {
        await FirebaseCrashlytics.recordException({
          message: error.message,
        });
        return;
      }

      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        logFirebaseEvent(analytics, 'exception', {
          description: error.message,
          fatal: 'isFatal' in options ? Boolean(options.isFatal) : false,
        });
      }
    } catch (reportError) {
      console.error('[CrashlyticsService] Failed to record error:', reportError);
    }
  }

  /** Forces a fatal native crash to verify Crashlytics in Firebase Console. */
  testCrash(): void {
    if (this.isDisabled()) {
      console.warn('[CrashlyticsService] Cannot test crash: analytics disabled.');
      return;
    }

    if (!this.isInitialized) {
      console.warn('[CrashlyticsService] Cannot test crash: not initialized yet.');
      return;
    }

    if (Capacitor.isNativePlatform()) {
      console.log('[CrashlyticsService] Forcing native test crash.');
      void FirebaseCrashlytics.crash({
        message: 'Chandra Darshan Crashlytics test crash',
      });
      return;
    }

    throw new Error('Chandra Darshan Crashlytics test error (web)');
  }

  /** Records a non-fatal error without killing the app. */
  async testNonFatalError(): Promise<void> {
    await this.recordError({
      error: new Error('Chandra Darshan Crashlytics non-fatal test'),
      isFatal: false,
    });
  }

  async setCustomKey(key: string, value: string | number | boolean): Promise<void> {
    if (this.isDisabled() || !this.isInitialized) {
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        const type =
          typeof value === 'boolean'
            ? 'boolean'
            : typeof value === 'number'
              ? Number.isInteger(value)
                ? 'int'
                : 'double'
              : 'string';
        await FirebaseCrashlytics.setCustomKey({ key, value, type });
        return;
      }

      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        logFirebaseEvent(analytics, 'app_metadata', {
          [key]: String(value),
        });
      }
    } catch (error) {
      console.warn(`[CrashlyticsService] Failed to set custom key '${key}':`, error);
    }
  }
}

export const crashlyticsService = new CrashlyticsService();
