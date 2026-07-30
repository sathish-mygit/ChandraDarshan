'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { CityPicker } from '@/components/CityPicker';
import { GpsLocationButton } from '@/components/GpsLocationButton';
import { LanguagePicker } from '@/components/LanguagePicker';
import { MasaSystemPicker } from '@/components/MasaSystemPicker';
import { AdDiagnosticsPanel } from '@/components/AdDiagnosticsPanel';
import { CrashlyticsTestPanel } from '@/components/CrashlyticsTestPanel';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { t } from '@/lib/i18n/labels';
import { resolveMasaSystem } from '@/lib/panchang/masa-system';
import {
  DEFAULT_DAILY_REMINDER_TIME,
  requestNotificationPermission,
} from '@/lib/notifications/daily-reminder';
import { cn } from '@/lib/utils';

type ReminderFeedback = 'enabled' | 'disabled' | 'permission_denied' | null;

export function SettingsClient() {
  const { preferences, isLoading, updatePreferences } = useAppPreferences();
  const language = preferences.language;
  const isNative = Capacitor.isNativePlatform();
  const hasBirthProfile = Boolean(preferences.birthProfile);
  const reminderEnabled = Boolean(preferences.dailyReminder?.enabled);
  const reminderTime =
    preferences.dailyReminder?.time ?? DEFAULT_DAILY_REMINDER_TIME;
  const [feedback, setFeedback] = useState<ReminderFeedback>(null);
  const resolvedMasaSystem = resolveMasaSystem(
    preferences.masaSystem,
    preferences.location,
  );

  async function handleToggleDailyReminder(enabled: boolean) {
    if (!hasBirthProfile) {
      return;
    }

    setFeedback(null);

    if (enabled) {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        setFeedback('permission_denied');
        return;
      }

      await updatePreferences({
        dailyReminder: {
          enabled: true,
          time: reminderTime,
        },
      });
      setFeedback('enabled');
      return;
    }

    await updatePreferences({
      dailyReminder: {
        enabled: false,
        time: reminderTime,
      },
    });
    setFeedback('disabled');
  }

  async function handleReminderTimeChange(time: string) {
    if (!reminderEnabled) {
      return;
    }

    await updatePreferences({
      dailyReminder: {
        enabled: true,
        time,
      },
    });
  }

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <p className="text-sm text-slate-400">{t('loading', language)}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-6">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-amber-50">
            {t('settings', language)}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {t('settingsSubtitle', language)}
          </p>
        </div>

        <section className="space-y-4 rounded-2xl border border-slate-800 bg-card/60 p-5">
          <div>
            <h2 className="text-sm font-medium text-amber-100">
              {t('birthProfile', language)}
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              {preferences.birthProfile
                ? `${preferences.birthProfile.birthDate} · ${preferences.birthProfile.birthLocation.label}`
                : t('jyotishEmpty', language)}
            </p>
            <Link
              href="/jyotish/"
              className="mt-3 inline-block text-sm text-amber-400 hover:text-amber-300"
            >
              {preferences.birthProfile
                ? t('editBirthDetails', language)
                : t('addBirthProfile', language)}{' '}
              →
            </Link>
          </div>
        </section>

        {isNative ? (
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-card/60 p-5">
            <div>
              <h2 className="text-sm font-medium text-amber-100">
                {t('dailyReminder', language)}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t('dailyReminderDescription', language)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-300">
                {t('dailyReminder', language)}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={reminderEnabled}
                disabled={!hasBirthProfile}
                onClick={() => void handleToggleDailyReminder(!reminderEnabled)}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition',
                  reminderEnabled ? 'bg-amber-500' : 'bg-slate-700',
                  !hasBirthProfile && 'cursor-not-allowed opacity-50',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition',
                    reminderEnabled && 'translate-x-5',
                  )}
                />
              </button>
            </div>

            {!hasBirthProfile ? (
              <p className="text-xs text-slate-500">
                {t('dailyReminderNeedsProfile', language)}{' '}
                <Link href="/jyotish/" className="text-amber-400 hover:text-amber-300">
                  {t('addBirthProfile', language)} →
                </Link>
              </p>
            ) : null}

            {reminderEnabled ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label
                  htmlFor="daily-reminder-time"
                  className="text-sm font-medium text-slate-300"
                >
                  {t('dailyReminderTime', language)}
                </label>
                <input
                  id="daily-reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(event) =>
                    void handleReminderTimeChange(event.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-amber-50"
                />
              </div>
            ) : null}

            {feedback === 'enabled' ? (
              <p className="text-xs text-emerald-400/90">
                {t('dailyReminderEnabled', language)}
              </p>
            ) : null}
            {feedback === 'disabled' ? (
              <p className="text-xs text-slate-400">
                {t('dailyReminderDisabled', language)}
              </p>
            ) : null}
            {feedback === 'permission_denied' ? (
              <p className="text-xs text-rose-400/90">
                {t('dailyReminderPermissionDenied', language)}
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="space-y-4 rounded-2xl border border-slate-800 bg-card/60 p-5">
          <div>
            <h2 className="text-sm font-medium text-amber-100">
              {t('language', language)}
            </h2>
            <div className="mt-3">
              <LanguagePicker
                value={preferences.language}
                onChange={(nextLanguage) =>
                  void updatePreferences({ language: nextLanguage })
                }
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-amber-100">
              {t('location', language)}
            </h2>
            <div className="mt-3 space-y-3">
              <CityPicker
                value={preferences.location}
                onChange={(location) => void updatePreferences({ location })}
              />
              <GpsLocationButton
                language={language}
                onSuccess={(location) => void updatePreferences({ location })}
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-amber-100">
              {t('masaSystem', language)}
            </h2>
            <div className="mt-3">
              <MasaSystemPicker
                value={preferences.masaSystem}
                language={language}
                onChange={(masaSystem) =>
                  void updatePreferences({ masaSystem })
                }
              />
              {preferences.masaSystem === 'auto' ? (
                <p className="mt-2 text-xs text-slate-400">
                  {t('masaSystemAutoUsing', language)}{' '}
                  {t(
                    resolvedMasaSystem === 'amanta' ? 'amanta' : 'purnimanta',
                    language,
                  )}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <CrashlyticsTestPanel />
        <AdDiagnosticsPanel />
      </div>
    </main>
  );
}
