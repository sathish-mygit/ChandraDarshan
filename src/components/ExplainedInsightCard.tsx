'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LearnTooltip } from '@/components/LearnTooltip';
import { getExplainedLabel } from '@/lib/i18n/jyotish-explanations';
import type { GlossaryTermId } from '@/lib/i18n/glossary';
import type { AppLanguage, ExplainedInsight } from '@/lib/types';
import { cn } from '@/lib/utils';

type ExplainedInsightCardProps = {
  insight: ExplainedInsight;
  language: AppLanguage;
  defaultExpanded?: boolean;
};

function Section({
  label,
  text,
  language,
}: {
  label: string;
  text: string;
  language: AppLanguage;
}) {
  const useDevanagari = language === 'hi' || language === 'sa';
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-amber-500/70">
        {label}
      </p>
      <p
        className={cn(
          'mt-0.5 text-xs leading-relaxed text-slate-400',
          useDevanagari && 'font-devanagari',
        )}
      >
        {text}
      </p>
    </div>
  );
}

export function ExplainedInsightCard({
  insight,
  language,
  defaultExpanded = false,
}: ExplainedInsightCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const useDevanagari = language === 'hi' || language === 'sa';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-medium text-amber-100">
              {insight.title}
            </h4>
            {insight.termIds?.map((termId) => (
              <LearnTooltip
                key={termId}
                termId={termId as GlossaryTermId}
                language={language}
              />
            ))}
          </div>
          <p
            className={cn(
              'mt-1 text-xs leading-relaxed text-slate-300',
              useDevanagari && 'font-devanagari',
            )}
          >
            {insight.summary}
          </p>
          {insight.effect ? (
            <p
              className={cn(
                'mt-2 text-xs leading-relaxed text-slate-400',
                useDevanagari && 'font-devanagari',
              )}
            >
              {insight.effect}
            </p>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {expanded ? (
        <div className="mt-3 space-y-3 border-t border-slate-800/80 pt-3">
          <Section
            label={getExplainedLabel('what', language)}
            text={insight.what}
            language={language}
          />
          <Section
            label={getExplainedLabel('how', language)}
            text={insight.how}
            language={language}
          />
          <Section
            label={getExplainedLabel('why', language)}
            text={insight.why}
            language={language}
          />
          <Section
            label={getExplainedLabel('practical', language)}
            text={insight.practical}
            language={language}
          />
        </div>
      ) : null}
    </div>
  );
}
