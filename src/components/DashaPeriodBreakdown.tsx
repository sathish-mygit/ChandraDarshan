'use client';

import { LearnTooltip } from '@/components/LearnTooltip';
import { t } from '@/lib/i18n/labels';
import type { GlossaryTermId } from '@/lib/i18n/glossary';
import type { AppLanguage, DashaPeriodInsight } from '@/lib/types';
import { cn } from '@/lib/utils';

type DashaPeriodBreakdownProps = {
  periods: DashaPeriodInsight[];
  language: AppLanguage;
  showIntro?: boolean;
};

function levelLabel(
  level: DashaPeriodInsight['level'],
  language: AppLanguage,
): string {
  switch (level) {
    case 'maha':
      return t('dashaLevelMaha', language);
    case 'antar':
      return t('dashaLevelAntar', language);
    case 'pratyantar':
      return t('dashaLevelPratyantar', language);
  }
}

function levelTermId(
  level: DashaPeriodInsight['level'],
): GlossaryTermId {
  switch (level) {
    case 'maha':
      return 'mahaDasha';
    case 'antar':
      return 'antarDasha';
    case 'pratyantar':
      return 'pratyantarDasha';
  }
}

export function DashaPeriodBreakdown({
  periods,
  language,
  showIntro = true,
}: DashaPeriodBreakdownProps) {
  const useDevanagari = language === 'hi' || language === 'sa';

  return (
    <div className="space-y-3">
      {showIntro ? (
        <p className="text-xs leading-relaxed text-slate-500">
          {t('dashaLayersIntro', language)}
        </p>
      ) : null}

      {periods.map((period) => (
        <div
          key={period.level}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-3"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-amber-100">
                  {levelLabel(period.level, language)}
                </span>
                <LearnTooltip
                  termId={levelTermId(period.level)}
                  language={language}
                />
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {period.levelMeaning}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-amber-50">
                {period.lord}
              </span>
              {period.endDate ? (
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {t('until', language)} {period.endDate}
                </p>
              ) : null}
            </div>
          </div>

          <p
            className={cn(
              'text-xs leading-relaxed text-slate-400',
              useDevanagari && 'font-devanagari',
            )}
          >
            {period.planetEffect}
          </p>

          {period.chartNote ? (
            <p
              className={cn(
                'mt-2 text-xs leading-relaxed text-amber-200/70',
                useDevanagari && 'font-devanagari',
              )}
            >
              {period.chartNote}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
