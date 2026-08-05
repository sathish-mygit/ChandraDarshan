'use client';

import { ExplainedInsightCard } from '@/components/ExplainedInsightCard';
import { NatalChartSummary } from '@/components/NatalChartSummary';
import { t } from '@/lib/i18n/labels';
import type {
  AppLanguage,
  ChartDepthViewModel,
  NatalSnapshot,
} from '@/lib/types';
import { cn } from '@/lib/utils';

type JyotishChartTabProps = {
  snapshot: NatalSnapshot | null;
  chartDepth: ChartDepthViewModel | null;
  timeUnknown: boolean;
  language: AppLanguage;
};

export function JyotishChartTab({
  snapshot,
  chartDepth,
  timeUnknown,
  language,
}: JyotishChartTabProps) {
  const useDevanagari = language === 'hi' || language === 'sa';

  if (!snapshot) {
    return null;
  }

  return (
    <div className="space-y-6">
      <NatalChartSummary
        snapshot={snapshot}
        timeUnknown={timeUnknown}
        language={language}
        dignities={chartDepth?.dignities}
      />

      {!chartDepth?.unlocked ? (
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="text-sm font-medium text-amber-200">
            {t('chartDepthLocked', language)}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {t('chartDepthLockedHint', language)}
          </p>
        </section>
      ) : (
        <>
          {chartDepth.navamsa ? (
            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <h3 className="mb-3 text-base font-semibold text-amber-100">
                {t('navamsaSummary', language)}
              </h3>
              <ExplainedInsightCard
                insight={chartDepth.navamsa.insight}
                language={language}
                defaultExpanded
              />
              {chartDepth.navamsa.vargottamaPlanets.length > 0 ? (
                <p className="mt-3 text-xs text-amber-200/80">
                  Vargottama:{' '}
                  {chartDepth.navamsa.vargottamaPlanets.join(', ')}
                </p>
              ) : null}
            </section>
          ) : null}

          {chartDepth.dignities.length > 0 ? (
            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <h3 className="mb-3 text-base font-semibold text-amber-100">
                {t('planetDignities', language)}
              </h3>
              <div className="space-y-3">
                {chartDepth.dignities.map((d) => (
                  <ExplainedInsightCard
                    key={d.planet}
                    insight={d.insight}
                    language={language}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {chartDepth.yogas.length > 0 ? (
            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <h3 className="mb-3 text-base font-semibold text-amber-100">
                {t('chartYogas', language)}
              </h3>
              <div className="space-y-2">
                {chartDepth.yogas.map((yoga) => (
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
            </section>
          ) : null}

          {chartDepth.doshas.some((d) => d.active) ? (
            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <h3 className="mb-3 text-base font-semibold text-amber-100">
                {t('chartDoshas', language)}
              </h3>
              <div className="space-y-3">
                {chartDepth.doshas
                  .filter((d) => d.active)
                  .map((dosha) => (
                    <ExplainedInsightCard
                      key={dosha.name}
                      insight={dosha.insight}
                      language={language}
                    />
                  ))}
              </div>
            </section>
          ) : null}

          {chartDepth.planetInsights.length > 0 ? (
            <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
              <h3 className="mb-2 text-sm font-medium text-amber-200/90">
                {t('planetThemes', language)}
              </h3>
              <div className="space-y-2">
                {chartDepth.planetInsights.map((planet) => (
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
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
