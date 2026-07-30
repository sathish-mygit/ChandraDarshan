'use client';



import Link from 'next/link';

import { useCallback, useEffect, useState } from 'react';

import { MoonPhaseDisc } from '@/components/MoonPhaseDisc';

import { PanchangSummary } from '@/components/PanchangSummary';

import { useAppPreferences } from '@/contexts/AppPreferencesContext';

import { usePanchangToday } from '@/hooks/usePanchangToday';

import { usePersonalToday } from '@/hooks/usePersonalToday';

import { t } from '@/lib/i18n/labels';

import { getScriptFontClass } from '@/lib/i18n/locale';

import { cn } from '@/lib/utils';



export function HomeClient() {

  const { preferences, birthProfile } = useAppPreferences();

  const { data, isLoading, error, refresh } = usePanchangToday();

  const { data: personalToday } = usePersonalToday();

  const scriptFont = getScriptFontClass(preferences.language);

  const [moonRevealed, setMoonRevealed] = useState(false);



  const dataKey = data

    ? `${data.gregorianDate}-${data.tithi}-${data.moonFill}`

    : null;



  useEffect(() => {

    setMoonRevealed(false);

  }, [dataKey]);



  const handleMoonRevealComplete = useCallback(() => {

    setMoonRevealed(true);

  }, []);



  return (

    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">

      <div className="w-full max-w-md space-y-8 text-center">

        {data ? (

          <div className="space-y-3">

            <MoonPhaseDisc

              moonFill={data.moonFill}

              isWaxing={data.isWaxing}

              ariaLabel={`${data.tithi}, ${data.pakshaLabel}`}

              className="mx-auto"

              onRevealComplete={handleMoonRevealComplete}

            />

            <div

              className={cn(

                'space-y-1 transition-opacity duration-500',

                moonRevealed ? 'opacity-100' : 'opacity-0',

              )}

            >

              <p

                className={cn(

                  'text-lg font-medium text-amber-100',

                  scriptFont,

                )}

              >

                {data.tithi} · {data.pakshaLabel}

              </p>

              <p className="text-sm text-slate-400">

                {data.isWaxing

                  ? t('moonPhaseWaxing', preferences.language)

                  : t('moonPhaseWaning', preferences.language)}

              </p>

            </div>

          </div>

        ) : (

          <div className="mx-auto h-44 w-44 animate-pulse rounded-full border border-amber-500/10 bg-slate-900/60" />

        )}



        <div className="space-y-2">

          <p className="text-sm uppercase tracking-[0.3em] text-amber-500/80">

            {t('appTitle', preferences.language)}

          </p>

          {birthProfile?.name ? (

            <>

              <p className="text-sm text-slate-500">

                {t('dailyMoon', preferences.language)}

              </p>

              <p className="text-sm text-slate-400">

                {t('greetingPrefix', preferences.language)}

              </p>

              <h1 className="text-3xl font-semibold text-amber-50">

                {birthProfile.name}

              </h1>

            </>

          ) : (

            <h1

              className={cn(

                'text-xl font-medium text-slate-400',

                scriptFont,

              )}

            >

              {t('dailyMoon', preferences.language)}

            </h1>

          )}

        </div>



        {isLoading ? (

          <p className="text-sm text-slate-400">{t('loading', preferences.language)}</p>

        ) : null}



        {error ? (

          <div className="space-y-3 rounded-2xl border border-red-900/50 bg-red-950/20 p-5 text-sm">

            <p className="text-red-200">{t('error', preferences.language)}</p>

            <p className="text-red-300/80">{error}</p>

            <button

              type="button"

              onClick={() => void refresh()}

              className="text-amber-400 hover:text-amber-300"

            >

              {t('retry', preferences.language)}

            </button>

          </div>

        ) : null}



        {data ? (

          <div

            className={cn(

              'transition-opacity duration-500',

              moonRevealed ? 'opacity-100' : 'opacity-0',

            )}

          >

            <PanchangSummary data={data} language={preferences.language} />

          </div>

        ) : null}



        {birthProfile ? (

          <Link

            href="/jyotish/"

            className={cn(

              'block rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-left text-sm text-amber-200/90 transition hover:border-amber-400/40 hover:bg-amber-500/10',

              data && !moonRevealed && 'opacity-0',

            )}

          >

            <span className="block font-medium">

              {t('jyotishTeaser', preferences.language)} →

            </span>

            {personalToday ? (

              <span className="mt-1 block text-xs text-amber-200/60">

                {personalToday.teaserSummary}

              </span>

            ) : null}

          </Link>

        ) : null}

      </div>

    </main>

  );

}


