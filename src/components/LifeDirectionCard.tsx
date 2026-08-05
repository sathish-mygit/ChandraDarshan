'use client';

import { DashaPeriodBreakdown } from '@/components/DashaPeriodBreakdown';
import { LearnTooltip } from '@/components/LearnTooltip';
import { LifeMilestonesTimeline } from '@/components/LifeMilestonesTimeline';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, LifeDirectionViewModel } from '@/lib/types';
import { cn } from '@/lib/utils';

type LifeDirectionCardProps = {
  data: LifeDirectionViewModel;
  language: AppLanguage;
};

export function LifeDirectionCard({ data, language }: LifeDirectionCardProps) {
  const useDevanagari = language === 'hi' || language === 'sa';

  return (
    <section className="rounded-2xl border border-slate-800 bg-card/60 p-5 backdrop-blur-sm">
      <h2 className="mb-1 text-base font-semibold text-amber-100">
        {t('lifeDirection', language)}
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        {t('lifeDirectionSubtitle', language)}
      </p>

      <div className="mb-4">
        <h3 className="mb-3 text-sm font-medium text-amber-200/90">
          {t('yourDashaPeriods', language)}
        </h3>
        <DashaPeriodBreakdown
          periods={data.dashaPeriods}
          language={language}
        />
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium text-amber-200/90">
          {t('lifeMilestones', language)}
        </h3>
        <LifeMilestonesTimeline
          milestones={data.lifeMilestones}
          language={language}
        />
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium text-amber-200/90">
          {t('dashaTimeline', language)}
        </h3>
        <p className="mb-3 text-xs text-slate-500">
          {t('dashaTimelineIntro', language)}
        </p>
        <div className="space-y-2">
          {data.dashaTimeline.map((entry) => (
            <div
              key={`${entry.lord}-${entry.startDate}`}
              className={cn(
                'rounded-lg px-3 py-2.5 text-xs',
                entry.isCurrent
                  ? 'border border-amber-500/30 bg-amber-500/10 text-amber-100'
                  : entry.isPast
                    ? 'text-slate-600'
                    : 'bg-slate-900/40 text-slate-400',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-medium">{entry.lord}</span>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {entry.ageAtStart} – {entry.ageAtEnd}
                  </p>
                </div>
                <span className="text-right">
                  {entry.startDate} – {entry.endDate}
                </span>
              </div>
              <p
                className={cn(
                  'mt-2 leading-relaxed',
                  entry.isCurrent ? 'text-amber-100/80' : 'text-slate-500',
                  useDevanagari && 'font-devanagari',
                )}
              >
                {entry.lifeChapter}
              </p>
            </div>
          ))}
        </div>
      </div>

      {data.sadeSati.active && data.sadeSati.description ? (
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/30 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-sm text-slate-300">
            <span>Sade Sati</span>
            <LearnTooltip termId="sadeSati" language={language} />
          </div>
          <p
            className={cn(
              'text-xs leading-relaxed text-slate-400',
              useDevanagari && 'font-devanagari',
            )}
          >
            {data.sadeSati.description}
          </p>
          {data.sadeSati.arcEnd ? (
            <p className="mt-2 text-xs text-slate-500">
              {t('sadeSatiUntil', language)} {data.sadeSati.arcEnd}
            </p>
          ) : null}
        </div>
      ) : data.sadeSati.nextArcStart ? (
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/30 p-3">
          <p className="text-xs text-slate-400">
            {t('sadeSatiNext', language)} {data.sadeSati.nextArcStart}
          </p>
        </div>
      ) : null}

      {data.yogas.length > 0 ? (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-amber-200/90">
            {t('chartYogas', language)}
          </h3>
          <div className="space-y-2">
            {data.yogas.map((yoga) => (
              <div
                key={yoga.name}
                className="rounded-lg bg-slate-900/40 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-amber-100">
                    {yoga.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">
                    {yoga.type}
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-1 text-xs leading-relaxed text-slate-500',
                    useDevanagari && 'font-devanagari',
                  )}
                >
                  {yoga.description}
                </p>
                {yoga.effect ? (
                  <p
                    className={cn(
                      'mt-2 text-xs leading-relaxed text-slate-300',
                      useDevanagari && 'font-devanagari',
                    )}
                  >
                    <span className="text-amber-500/80">
                      {t('yogaEffect', language)}:{' '}
                    </span>
                    {yoga.effect}
                  </p>
                ) : null}
                {yoga.how ? (
                  <p className="mt-2 text-xs text-slate-500">
                    <span className="text-amber-500/80">
                      {t('yogaTechnical', language)}:{' '}
                    </span>
                    {yoga.how}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {data.planetInsights.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-medium text-amber-200/90">
            {t('planetThemes', language)}
          </h3>
          <div className="space-y-2">
            {data.planetInsights.map((planet) => (
              <div key={planet.planet} className="text-xs leading-relaxed">
                <p className="font-medium text-amber-100">{planet.planet}</p>
                {planet.effect ? (
                  <p
                    className={cn(
                      'mt-1 text-slate-300',
                      useDevanagari && 'font-devanagari',
                    )}
                  >
                    {planet.effect}
                  </p>
                ) : null}
                <p
                  className={cn(
                    'mt-1 text-slate-500',
                    useDevanagari && 'font-devanagari',
                  )}
                >
                  {planet.insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
