'use client';

import { ExplainedInsightCard } from '@/components/ExplainedInsightCard';
import { LifeDirectionCard } from '@/components/LifeDirectionCard';
import { t } from '@/lib/i18n/labels';
import type {
  AnnualOutlookViewModel,
  AppLanguage,
  LifeDirectionViewModel,
} from '@/lib/types';
import { cn } from '@/lib/utils';

type JyotishTimelineTabProps = {
  lifeDirection: LifeDirectionViewModel | null;
  annualOutlook: AnnualOutlookViewModel | null;
  language: AppLanguage;
};

export function JyotishTimelineTab({
  lifeDirection,
  annualOutlook,
  language,
}: JyotishTimelineTabProps) {
  const useDevanagari = language === 'hi' || language === 'sa';

  return (
    <div className="space-y-6">
      {annualOutlook?.visible ? (
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="text-base font-semibold text-amber-100">
            {t('annualOutlook', language)}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {t('annualOutlookSubtitle', language)} · Age {annualOutlook.age} ·{' '}
            {annualOutlook.praveshDate}
          </p>
          <p
            className={cn(
              'mt-2 text-sm text-amber-50',
              useDevanagari && 'font-devanagari',
            )}
          >
            Varsha lagna: {annualOutlook.varshaLagna}
          </p>
          <div className="mt-3 space-y-3">
            {annualOutlook.insights.map((insight) => (
              <ExplainedInsightCard
                key={insight.title}
                insight={insight}
                language={language}
              />
            ))}
          </div>
        </section>
      ) : null}

      {lifeDirection ? (
        <LifeDirectionCard data={lifeDirection} language={language} />
      ) : null}
    </div>
  );
}
