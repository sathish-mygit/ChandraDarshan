'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CityPicker } from '@/components/CityPicker';
import { GpsLocationButton } from '@/components/GpsLocationButton';
import { LanguagePicker } from '@/components/LanguagePicker';
import { MasaSystemPicker } from '@/components/MasaSystemPicker';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { t } from '@/lib/i18n/labels';

export function SettingsClient() {
  const { preferences, isLoading, updatePreferences } = useAppPreferences();
  const language = preferences.language;

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <p className="text-sm text-slate-400">{t('loading', language)}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 pb-24">
      <div className="mx-auto w-full max-w-md space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400/90 hover:text-amber-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToToday', language)}
        </Link>

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
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
