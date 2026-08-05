'use client';

import { ExplainedInsightCard } from '@/components/ExplainedInsightCard';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, KundaliMatchViewModel } from '@/lib/types';

type KundaliMatchContentProps = {
  data: KundaliMatchViewModel;
  language: AppLanguage;
};

export function KundaliMatchContent({
  data,
  language,
}: KundaliMatchContentProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <p className="text-xs text-slate-500">{t('matchConventionNote', language)}</p>
      </section>

      <section className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5">
        <h3 className="text-base font-semibold text-amber-100">
          {t('matchScoreTitle', language)}
        </h3>
        <p className="mt-2 text-3xl font-semibold text-amber-50">
          {data.totalScore}
          <span className="text-lg text-amber-200/70"> / {data.maxTotal}</span>
        </p>
        <ExplainedInsightCard
          insight={data.summaryInsight}
          language={language}
          defaultExpanded
        />
        {(data.nadiDosha || data.bhakootDosha) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.nadiDosha ? (
              <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
                {t('matchNadiDosha', language)}
              </span>
            ) : null}
            {data.bhakootDosha ? (
              <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
                {t('matchBhakootDosha', language)}
              </span>
            ) : null}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <h3 className="mb-3 text-base font-semibold text-amber-100">
          {t('matchGunaBreakdown', language)}
        </h3>
        <div className="space-y-3">
          {data.gunas.map((guna) => (
            <ExplainedInsightCard
              key={guna.id}
              insight={guna.insight}
              language={language}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <h3 className="mb-3 text-base font-semibold text-amber-100">
          {t('matchMangalPairing', language)}
        </h3>
        <ExplainedInsightCard
          insight={data.mangalPairing.insight}
          language={language}
          defaultExpanded
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <h3 className="mb-3 text-base font-semibold text-amber-100">
          {t('matchSynastry', language)}
        </h3>
        {data.synastry.unlocked ? (
          <div className="space-y-3">
            {data.synastry.insights.map((insight, index) => (
              <ExplainedInsightCard
                key={`${insight.title}-${index}`}
                insight={insight}
                language={language}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            {data.synastry.timeRequiredMessage ??
              t('matchSynastryLocked', language)}
          </p>
        )}
      </section>
    </div>
  );
}
