'use client';

import { useState } from 'react';
import { BirthProfileForm } from '@/components/BirthProfileForm';
import { JyotishChartTab } from '@/components/JyotishChartTab';
import { JyotishEmptyState } from '@/components/JyotishEmptyState';
import { JyotishLearnTab } from '@/components/JyotishLearnTab';
import {
  JyotishSubTabs,
  type JyotishTabId,
} from '@/components/JyotishSubTabs';
import { JyotishTimelineTab } from '@/components/JyotishTimelineTab';
import { JyotishTodayTab } from '@/components/JyotishTodayTab';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { useScreenTracking } from '@/hooks/useScreenTracking';
import { useAnnualOutlook } from '@/hooks/useAnnualOutlook';
import { useChartDepth } from '@/hooks/useChartDepth';
import { useLifeDirection } from '@/hooks/useLifeDirection';
import { useNatalChart } from '@/hooks/useNatalChart';
import { usePersonalToday } from '@/hooks/usePersonalToday';
import { trackBirthEditOpened } from '@/lib/analytics';
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
  const { data: chartDepth } = useChartDepth();
  const { data: annualOutlook } = useAnnualOutlook();
  const { data: personalToday, isLoading: personalLoading, error, refresh } =
    usePersonalToday();
  const [activeTab, setActiveTab] = useState<JyotishTabId>('today');
  const [showEdit, setShowEdit] = useState(!birthProfile);
  const screenId = birthProfile ? `/jyotish/${activeTab}` : '/jyotish';

  useScreenTracking(screenId);

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
          {birthProfile?.name ? (
            <>
              <p className="text-sm text-slate-500">
                {t('jyotishTitle', language)}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {t('greetingPrefix', language)}
              </p>
              <h1 className="mt-0.5 text-3xl font-semibold text-amber-50">
                {birthProfile.name}
              </h1>
            </>
          ) : (
            <h2 className="text-xl font-medium text-slate-400">
              {t('jyotishTitle', language)}
            </h2>
          )}
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
            <JyotishSubTabs
              active={activeTab}
              onChange={setActiveTab}
              language={language}
            />

            {personalLoading && activeTab === 'today' ? (
              <p className="text-sm text-slate-400">
                {t('loadingJyotish', language)}
              </p>
            ) : null}

            {error ? (
              <p className="text-sm text-red-300">{error}</p>
            ) : null}

            {activeTab === 'today' && personalToday ? (
              <JyotishTodayTab data={personalToday} language={language} />
            ) : null}

            {activeTab === 'chart' ? (
              <JyotishChartTab
                snapshot={snapshot}
                chartDepth={chartDepth}
                timeUnknown={birthProfile.timeUnknown}
                language={language}
              />
            ) : null}

            {activeTab === 'timeline' ? (
              <JyotishTimelineTab
                lifeDirection={lifeDirection}
                annualOutlook={annualOutlook}
                language={language}
              />
            ) : null}

            {activeTab === 'learn' ? (
              <JyotishLearnTab
                language={language}
                timeUnknown={birthProfile.timeUnknown}
              />
            ) : null}

            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <button
                type="button"
                onClick={() =>
                  setShowEdit((value) => {
                    if (!value) {
                      trackBirthEditOpened('self');
                    }
                    return !value;
                  })
                }
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
