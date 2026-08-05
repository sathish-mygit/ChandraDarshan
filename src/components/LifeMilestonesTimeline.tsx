'use client';

import { LearnTooltip } from '@/components/LearnTooltip';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, LifeMilestone } from '@/lib/types';
import { cn } from '@/lib/utils';

type LifeMilestonesTimelineProps = {
  milestones: LifeMilestone[];
  language: AppLanguage;
};

export function LifeMilestonesTimeline({
  milestones,
  language,
}: LifeMilestonesTimelineProps) {
  const useDevanagari = language === 'hi' || language === 'sa';

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-slate-500">
        {t('lifeMilestonesIntro', language)}
      </p>

      <div className="relative space-y-3 pl-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-slate-700/80">
        {milestones.map((milestone) => (
          <div key={`${milestone.kind}-${milestone.date}`} className="relative">
            <span
              className={cn(
                'absolute -left-4 top-1.5 h-2.5 w-2.5 rounded-full border-2',
                milestone.isCurrent
                  ? 'border-amber-400 bg-amber-400'
                  : milestone.isPast
                    ? 'border-slate-600 bg-slate-700'
                    : 'border-slate-500 bg-slate-800',
              )}
            />

            <div
              className={cn(
                'rounded-xl border px-3 py-2.5',
                milestone.isCurrent
                  ? 'border-amber-500/30 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-900/40',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        milestone.isCurrent
                          ? 'text-amber-100'
                          : milestone.isPast
                            ? 'text-slate-500'
                            : 'text-slate-300',
                      )}
                    >
                      {milestone.title}
                    </span>
                    {milestone.kind === 'sadeSati' ? (
                      <LearnTooltip termId="sadeSati" language={language} />
                    ) : milestone.kind === 'jupiterTransit' ||
                      milestone.kind === 'saturnTransit' ? (
                      <LearnTooltip termId="transit" language={language} />
                    ) : (
                      <LearnTooltip termId="mahaDasha" language={language} />
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {milestone.ageLabel}
                    {milestone.isCurrent
                      ? ` · ${t('lifeMilestoneCurrent', language)}`
                      : null}
                  </p>
                </div>
                <div className="shrink-0 text-right text-[11px] text-slate-500">
                  <p>{milestone.date}</p>
                  {milestone.endDate ? (
                    <p>
                      {t('until', language)} {milestone.endDate}
                    </p>
                  ) : null}
                </div>
              </div>

              <p
                className={cn(
                  'mt-2 text-xs leading-relaxed text-slate-400',
                  useDevanagari && 'font-devanagari',
                )}
              >
                {milestone.description}
              </p>
              {milestone.how ? (
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  {milestone.how}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
