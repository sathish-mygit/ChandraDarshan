'use client';

import { useState } from 'react';
import { BirthProfileForm } from '@/components/BirthProfileForm';
import { BirthProfileSummary } from '@/components/BirthProfileSummary';
import { KundaliMatchContent } from '@/components/KundaliMatchContent';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { useKundaliMatch } from '@/hooks/useKundaliMatch';
import { t } from '@/lib/i18n/labels';
import type { BirthProfile } from '@/lib/types';

export function MatchClient() {
  const {
    preferences,
    birthProfile,
    partnerBirthProfile,
    isLoading,
    updateBirthProfile,
    updatePartnerBirthProfile,
    clearPartnerBirthProfile,
  } = useAppPreferences();
  const language = preferences.language;
  const { data: matchData } = useKundaliMatch();
  const [showSelfEdit, setShowSelfEdit] = useState(!birthProfile);
  const [showPartnerEdit, setShowPartnerEdit] = useState(!partnerBirthProfile);

  async function handleSaveSelf(profile: BirthProfile) {
    await updateBirthProfile(profile);
    setShowSelfEdit(false);
  }

  async function handleSavePartner(profile: BirthProfile) {
    await updatePartnerBirthProfile(profile);
    setShowPartnerEdit(false);
  }

  async function handleClearPartner() {
    await clearPartnerBirthProfile();
    setShowPartnerEdit(true);
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
          <h1 className="text-2xl font-semibold text-amber-50">
            {t('matchTitle', language)}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('matchSubtitle', language)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {t('disclaimer', language)}
          </p>
        </div>

        {!birthProfile ? (
          <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
            <p className="text-sm text-slate-400">{t('matchEmptySelf', language)}</p>
            <div className="mt-4">
              <BirthProfileForm
                language={language}
                onSave={handleSaveSelf}
                variant="self"
              />
            </div>
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <BirthProfileSummary
                  profile={birthProfile}
                  language={language}
                  heading={t('birthProfile', language)}
                  moonRashi={matchData?.selfMoonRashi}
                  moonNakshatra={matchData?.selfMoonNakshatra}
                />
                {partnerBirthProfile ? (
                  <BirthProfileSummary
                    profile={partnerBirthProfile}
                    language={language}
                    heading={t('partnerProfile', language)}
                    moonRashi={matchData?.partnerMoonRashi}
                    moonNakshatra={matchData?.partnerMoonNakshatra}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/20 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                      {t('partnerProfile', language)}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {t('matchEmptyPartner', language)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowSelfEdit((v) => !v)}
                  className="text-sm font-medium text-amber-300 hover:text-amber-200"
                >
                  {t('editBirthDetails', language)}
                </button>
                {partnerBirthProfile ? (
                  <button
                    type="button"
                    onClick={() => setShowPartnerEdit((v) => !v)}
                    className="text-sm font-medium text-amber-300 hover:text-amber-200"
                  >
                    {t('editPartnerDetails', language)}
                  </button>
                ) : null}
              </div>

              {showSelfEdit ? (
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <BirthProfileForm
                    language={language}
                    initial={birthProfile}
                    onSave={handleSaveSelf}
                    variant="self"
                  />
                </div>
              ) : null}

              {showPartnerEdit ? (
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <BirthProfileForm
                    language={language}
                    initial={partnerBirthProfile}
                    onSave={handleSavePartner}
                    onClear={partnerBirthProfile ? handleClearPartner : undefined}
                    variant="partner"
                  />
                </div>
              ) : !partnerBirthProfile ? (
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <BirthProfileForm
                    language={language}
                    onSave={handleSavePartner}
                    variant="partner"
                  />
                </div>
              ) : null}
            </section>

            {matchData ? (
              <KundaliMatchContent data={matchData} language={language} />
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
