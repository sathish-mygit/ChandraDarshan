'use client';

import { useState } from 'react';
import { BirthProfileForm } from '@/components/BirthProfileForm';
import { ForYouTodayCard } from '@/components/ForYouTodayCard';
import { JyotishEmptyState } from '@/components/JyotishEmptyState';
import { LifeDirectionCard } from '@/components/LifeDirectionCard';
import { NatalChartSummary } from '@/components/NatalChartSummary';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { useLifeDirection } from '@/hooks/useLifeDirection';
import { useNatalChart } from '@/hooks/useNatalChart';
import { usePersonalToday } from '@/hooks/usePersonalToday';
import { t } from '@/lib/i18n/labels';
import type { BirthProfile } from '@/lib/types';

export function JyotishClient() {
  const {
    preferences,
    birthProfile,
    isLoading,
    updateBirthProfile,
    clearBirthProfile,
  } = useAppPreferences();
  const language = preferences.language;
  const { snapshot } = useNatalChart();
  const { data: lifeDirection } = useLifeDirection();
  const { data: personalToday, isLoading: personalLoading, error, refresh } =
    usePersonalToday();
  const [showEdit, setShowEdit] = useState(!birthProfile);

  async function handleSave(profile: BirthProfile) {
    await updateBirthProfile(profile);
    setShowEdit(false);
    refresh();
  }

  async function handleClear() {
    await clearBirthProfile();
    setShowEdit(true);
  }

  if (isLoading) {
    return (
      <main className="px-4 py-6">
        <p className="text-sm text-slate-400">{t('loading', language)}</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-6">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-amber-50">
            {t('jyotishTitle', language)}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {t('disclaimer', language)}
          </p>
        </div>

        {!birthProfile ? (
          <>
            <JyotishEmptyState language={language} />
            <BirthProfileForm language={language} onSave={handleSave} />
          </>
        ) : (
          <>
            {personalLoading ? (
              <p className="text-sm text-slate-400">
                {t('loadingJyotish', language)}
              </p>
            ) : null}

            {error ? (
              <p className="text-sm text-red-300">{error}</p>
            ) : null}

            {personalToday ? (
              <ForYouTodayCard data={personalToday} language={language} />
            ) : null}

            {lifeDirection ? (
              <LifeDirectionCard data={lifeDirection} language={language} />
            ) : null}

            {snapshot ? (
              <NatalChartSummary
                snapshot={snapshot}
                timeUnknown={birthProfile.timeUnknown}
                language={language}
              />
            ) : null}

            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <button
                type="button"
                onClick={() => setShowEdit((value) => !value)}
                className="text-sm font-medium text-amber-300 hover:text-amber-200"
              >
                {t('editBirthDetails', language)}
              </button>

              {showEdit ? (
                <div className="mt-4">
                  <BirthProfileForm
                    language={language}
                    initial={birthProfile}
                    onSave={handleSave}
                    onClear={handleClear}
                  />
                </div>
              ) : null}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
