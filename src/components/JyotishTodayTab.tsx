'use client';

import { ExplainedInsightCard } from '@/components/ExplainedInsightCard';
import { ForYouTodayCard } from '@/components/ForYouTodayCard';
import { LearnTooltip } from '@/components/LearnTooltip';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, PersonalTodayViewModel } from '@/lib/types';
import { cn } from '@/lib/utils';

type JyotishTodayTabProps = {
  data: PersonalTodayViewModel;
  language: AppLanguage;
};

function TimeWindowRow({
  label,
  window,
  termId,
  language,
}: {
  label: string;
  window: { start: string; end: string; explanation: string; label?: string };
  termId?: 'choghadiya' | 'rahuKalam';
  language: AppLanguage;
}) {
  return (
    <div className="rounded-lg bg-slate-900/40 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-sm text-slate-300">
        <span>{label}</span>
        {termId ? <LearnTooltip termId={termId} language={language} /> : null}
      </div>
      <p className="mt-0.5 text-sm font-medium text-amber-50">
        {window.label ? `${window.label} · ` : ''}
        {window.start} – {window.end}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {window.explanation}
      </p>
    </div>
  );
}

export function JyotishTodayTab({ data, language }: JyotishTodayTabProps) {
  const useDevanagari = language === 'hi' || language === 'sa';

  return (
    <div className="space-y-6">
      <ForYouTodayCard data={data} language={language} />

      {data.weeklyTone ? (
        <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
          <h3 className="mb-2 text-sm font-medium text-amber-200/90">
            {t('weeklyTone', language)}
          </h3>
          <p
            className={cn(
              'text-xs leading-relaxed text-slate-400',
              useDevanagari && 'font-devanagari',
            )}
          >
            {data.weeklyTone}
          </p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <h3 className="mb-1 text-base font-semibold text-amber-100">
          {t('explainedInsights', language)}
        </h3>
        <div className="mt-3 space-y-3">
          {data.explainedInsights.map((insight) => (
            <ExplainedInsightCard
              key={insight.title}
              insight={insight}
              language={language}
            />
          ))}
        </div>
      </section>

      {data.transitInsights.length > 0 ? (
        <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
          <h3 className="mb-1 text-base font-semibold text-amber-100">
            {t('transitInsights', language)}
          </h3>
          <div className="mt-3 space-y-3">
            {data.transitInsights.map((insight) => (
              <ExplainedInsightCard
                key={`${insight.title}-${insight.summary}`}
                insight={insight}
                language={language}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <h3 className="mb-3 text-base font-semibold text-amber-100">
          {t('skyWindows', language)}
        </h3>
        <div className="space-y-2">
          {data.currentChoghadiya ? (
            <TimeWindowRow
              label={t('currentChoghadiya', language)}
              window={data.currentChoghadiya}
              termId="choghadiya"
              language={language}
            />
          ) : null}
          {data.nextChoghadiya ? (
            <TimeWindowRow
              label={t('nextChoghadiya', language)}
              window={data.nextChoghadiya}
              termId="choghadiya"
              language={language}
            />
          ) : null}
          {data.rahuKalam ? (
            <TimeWindowRow
              label={t('rahuKalam', language)}
              window={data.rahuKalam}
              termId="rahuKalam"
              language={language}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
