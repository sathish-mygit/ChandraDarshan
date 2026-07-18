'use client';

import { LearnTooltip } from '@/components/LearnTooltip';
import { t } from '@/lib/i18n/labels';
import { getScriptFontClass } from '@/lib/i18n/locale';
import type { GlossaryTermId } from '@/lib/i18n/glossary';
import type { AppLanguage, NatalSnapshot } from '@/lib/types';
import { cn } from '@/lib/utils';

type NatalChartSummaryProps = {
  snapshot: NatalSnapshot;
  timeUnknown: boolean;
  language: AppLanguage;
};

function houseTermId(house: number): GlossaryTermId {
  return `house${house}` as GlossaryTermId;
}

export function NatalChartSummary({
  snapshot,
  timeUnknown,
  language,
}: NatalChartSummaryProps) {
  const scriptFont = getScriptFontClass(language);

  return (
    <section className="rounded-2xl border border-slate-800 bg-card/60 p-5 backdrop-blur-sm">
      <h2 className="mb-4 text-base font-semibold text-amber-100">
        {t('birthChart', language)}
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Moon rashi</span>
            <LearnTooltip termId="moonRashi" language={language} />
          </div>
          <span
            className={cn(
              'font-medium text-amber-50',
              scriptFont,
            )}
          >
            {snapshot.moonRashi}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Nakshatra</span>
            <LearnTooltip termId="nakshatra" language={language} />
          </div>
          <span
            className={cn(
              'font-medium text-amber-50',
              scriptFont,
            )}
          >
            {snapshot.moonNakshatra}
          </span>
        </div>

        {snapshot.lagna ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Lagna</span>
              <LearnTooltip termId="lagna" language={language} />
            </div>
            <span
              className={cn(
                'font-medium text-amber-50',
                scriptFont,
              )}
            >
              {snapshot.lagna}
            </span>
          </div>
        ) : null}
      </div>

      {timeUnknown ? (
        <p className="mt-4 text-xs text-amber-400/80">
          {t('addTimeForChart', language)}
        </p>
      ) : null}

      {snapshot.planets && snapshot.planets.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2 pr-3">Planet</th>
                <th className="pb-2 pr-3">House</th>
                <th className="pb-2">Rashi</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.planets.map((planet) => (
                <tr
                  key={planet.planet}
                  className="border-t border-slate-800/60 text-slate-300"
                >
                  <td className="py-2 pr-3 text-amber-100">
                    {planet.planet}
                    {planet.retrograde ? ' (R)' : ''}
                  </td>
                  <td className="py-2 pr-3">
                    <span className="inline-flex items-center gap-1">
                      {planet.house}
                      <LearnTooltip
                        termId={houseTermId(planet.house)}
                        language={language}
                      />
                    </span>
                  </td>
                  <td
                    className={cn(
                      'py-2',
                      scriptFont,
                    )}
                  >
                    {planet.rashi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
