'use client';

import { DashaPeriodBreakdown } from '@/components/DashaPeriodBreakdown';
import { LearnTooltip } from '@/components/LearnTooltip';
import type { GlossaryTermId } from '@/lib/i18n/glossary';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, PersonalTodayViewModel } from '@/lib/types';
import { cn } from '@/lib/utils';

type ForYouTodayCardProps = {
  data: PersonalTodayViewModel;
  language: AppLanguage;
};

function Row({
  label,
  value,
  termId,
  language,
  subtext,
}: {
  label: string;
  value: string;
  termId?: GlossaryTermId;
  language: AppLanguage;
  subtext?: string;
}) {
  return (
    <div className="border-b border-slate-800/80 py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <span>{label}</span>
          {termId ? <LearnTooltip termId={termId} language={language} /> : null}
        </div>
        <span className="text-right text-sm font-medium text-amber-50">{value}</span>
      </div>
      {subtext ? (
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{subtext}</p>
      ) : null}
    </div>
  );
}

export function ForYouTodayCard({ data, language }: ForYouTodayCardProps) {
  const useDevanagari = language === 'hi' || language === 'sa';
  const chandraLabel =
    data.chandraBalam.quality === 'strong' ? 'Shubha' : 'Ashubha';

  return (
    <section className="rounded-2xl border border-slate-800 bg-card/60 p-5 backdrop-blur-sm">
      <h2 className="mb-1 text-base font-semibold text-amber-100">
        {t('forYouToday', language)}
      </h2>
      <p className="mb-4 text-xs text-slate-500">{t('forYouTodaySubtitle', language)}</p>

      <div className="mb-4 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-slate-900/40 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
          {t('dailyReading', language)}
        </p>
        <h3
          className={cn(
            'mt-1 text-base font-semibold text-amber-50',
            useDevanagari && 'font-devanagari',
          )}
        >
          {data.dailyReading.headline}
        </h3>
        <p
          className={cn(
            'mt-2 text-xs leading-relaxed text-slate-300',
            useDevanagari && 'font-devanagari',
          )}
        >
          {data.dailyReading.summary}
        </p>
        <p
          className={cn(
            'mt-3 text-xs leading-relaxed text-slate-400',
            useDevanagari && 'font-devanagari',
          )}
        >
          {data.dailyReading.dashaNote}
        </p>
        <div className="mt-3 space-y-2 border-t border-amber-500/10 pt-3">
          <p className={cn('text-xs text-slate-400', useDevanagari && 'font-devanagari')}>
            <span className="font-medium text-emerald-400/90">
              {t('favorToday', language)}:{' '}
            </span>
            {data.dailyReading.favor}
          </p>
          <p className={cn('text-xs text-slate-400', useDevanagari && 'font-devanagari')}>
            <span className="font-medium text-rose-400/80">
              {t('pauseToday', language)}:{' '}
            </span>
            {data.dailyReading.pause}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-slate-900/40 p-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500">{t('todayMoon', language)}</p>
            <p
              className={cn(
                'mt-0.5 font-medium text-amber-50',
                useDevanagari && 'font-devanagari',
              )}
            >
              {data.todayMoonRashi}
            </p>
            <p
              className={cn(
                'text-slate-400',
                useDevanagari && 'font-devanagari',
              )}
            >
              {data.todayNakshatra}
            </p>
          </div>
          <div>
            <p className="text-slate-500">{t('birthMoon', language)}</p>
            <p
              className={cn(
                'mt-0.5 font-medium text-amber-50',
                useDevanagari && 'font-devanagari',
              )}
            >
              {data.birthMoonRashi}
            </p>
            <p
              className={cn(
                'text-slate-400',
                useDevanagari && 'font-devanagari',
              )}
            >
              {data.birthNakshatra}
            </p>
          </div>
        </div>
      </div>

      <Row
        label="Chandra Balam"
        value={`${data.chandraBalam.name} (${chandraLabel})`}
        termId="chandraBalam"
        language={language}
        subtext={data.chandraBalamContext}
      />
      <Row
        label="Tarabala"
        value={`${data.tarabala.name} (${data.tarabala.englishName})`}
        termId="tarabala"
        language={language}
        subtext={data.taraDescription}
      />

      {data.currentHora ? (
        <Row
          label={t('currentHora', language)}
          value={`${data.currentHora.planet} (${data.currentHora.start} – ${data.currentHora.end})`}
          termId="hora"
          language={language}
          subtext={data.currentHora.explanation}
        />
      ) : null}

      {data.abhijitMuhurta ? (
        <Row
          label={t('abhijitMuhurta', language)}
          value={`${data.abhijitMuhurta.start} – ${data.abhijitMuhurta.end}`}
          termId="abhijitMuhurta"
          language={language}
          subtext={data.abhijitMuhurta.explanation}
        />
      ) : null}

      <div className="border-b border-slate-800/80 py-3">
        <h3 className="mb-3 text-sm font-medium text-amber-200/90">
          {t('yourDashaPeriods', language)}
        </h3>
        <DashaPeriodBreakdown
          periods={data.dashaPeriods}
          language={language}
        />
      </div>

      <Row
        label="Sade Sati"
        value={
          data.sadeSati.active
            ? `Active (phase ${data.sadeSati.phase})`
            : 'Not active'
        }
        termId="sadeSati"
        language={language}
      />

      <p
        className={cn(
          'mt-4 rounded-xl bg-slate-900/50 p-3 text-xs leading-relaxed text-slate-400',
          useDevanagari && 'font-devanagari',
        )}
      >
        {data.guidance}
      </p>
    </section>
  );
}
