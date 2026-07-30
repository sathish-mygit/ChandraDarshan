'use client';

import { t } from '@/lib/i18n/labels';
import { getScriptFontClass } from '@/lib/i18n/locale';
import { formatPanchangTime, formatPanchangTimeRange } from '@/lib/panchang/cache';
import type { AppLanguage, PanchangViewModel } from '@/lib/types';
import { cn } from '@/lib/utils';

type PanchangSummaryProps = {
  data: PanchangViewModel;
  language: AppLanguage;
  className?: string;
};

function SummaryRow({
  label,
  value,
  subValue,
  badge,
}: {
  label: string;
  value: string;
  subValue?: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 py-3 last:border-b-0">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="text-right">
        <span className="font-medium text-amber-50">{value}</span>
        {subValue ? (
          <p className="mt-0.5 text-xs text-slate-500">{subValue}</p>
        ) : null}
        {badge ? (
          <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function TimingRow({
  label,
  time,
  language,
}: {
  label: string;
  time: Date | null;
  language: AppLanguage;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-300">
        {time ? formatPanchangTime(time) : t('notToday', language)}
      </span>
    </div>
  );
}

function TithiTimelineRow({
  name,
  start,
  end,
  isCurrent,
  language,
}: {
  name: string;
  start: Date | null;
  end: Date | null;
  isCurrent: boolean;
  language: AppLanguage;
}) {
  const range = formatPanchangTimeRange(start, end);

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 py-1.5 text-xs',
        isCurrent && 'rounded-md bg-amber-500/10 px-2 -mx-2',
      )}
    >
      <span className={cn('text-slate-500', isCurrent && 'text-amber-400/90')}>
        {name}
      </span>
      <span className={cn('text-slate-300', isCurrent && 'text-amber-100')}>
        {range ?? t('notToday', language)}
      </span>
    </div>
  );
}

export function PanchangSummary({
  data,
  language,
  className,
}: PanchangSummaryProps) {
  const scriptFont = getScriptFontClass(language);

  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-800 bg-card/60 p-5 text-sm backdrop-blur-sm text-left',
        className,
      )}
    >
      <div className="mb-4 space-y-1 border-b border-slate-800 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80">
          {data.locationLabel}
        </p>
        <p
          className={cn(
            'text-base text-amber-100',
            scriptFont,
          )}
        >
          {data.gregorianDate}
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-slate-900/40 px-3 py-2">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-500/70">
          {t('timings', language)}
        </p>
        <TimingRow
          label={t('sunrise', language)}
          time={data.sunrise}
          language={language}
        />
        <TimingRow
          label={t('sunset', language)}
          time={data.sunset}
          language={language}
        />
        <TimingRow
          label={t('moonrise', language)}
          time={data.moonrise}
          language={language}
        />
        <TimingRow
          label={t('moonset', language)}
          time={data.moonset}
          language={language}
        />
      </div>

      {data.tithiTimeline.length > 0 ? (
        <div className="mb-4 rounded-xl bg-slate-900/40 px-3 py-2">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-amber-500/70">
            {t('tithiTimings', language)}
          </p>
          {data.previousTithi && data.previousTithiEnd ? (
            <div className="mb-2 border-b border-slate-800/80 pb-2 text-xs text-slate-500">
              {t('previousTithiEnded', language)}: {data.previousTithi}{' '}
              {formatPanchangTime(data.previousTithiEnd)}
            </div>
          ) : null}
          {data.tithiTimeline.map((entry) => (
            <TithiTimelineRow
              key={`${entry.name}-${entry.start?.toISOString() ?? 'start'}`}
              name={entry.name}
              start={entry.start}
              end={entry.end}
              isCurrent={entry.isCurrent}
              language={language}
            />
          ))}
        </div>
      ) : null}

      <SummaryRow
        label={t('vara', language)}
        value={data.vara}
      />
      <SummaryRow
        label={t('tithi', language)}
        value={data.tithi}
        subValue={
          formatPanchangTimeRange(data.tithiStart, data.tithiUntil) ??
          (data.tithiUntil
            ? `${t('tithiUntil', language)} ${formatPanchangTime(data.tithiUntil)}`
            : undefined)
        }
      />
      <SummaryRow label={t('nakshatra', language)} value={data.nakshatra} />
      <SummaryRow label={t('paksha', language)} value={data.pakshaLabel} />
      <SummaryRow
        label={t('maasa', language)}
        value={data.maasa}
        badge={data.isAdhika ? t('adhika', language) : undefined}
      />
      <SummaryRow
        label={t('samvatsara', language)}
        value={`${data.samvatsara} (VS ${data.vikramSamvat})`}
      />
      <SummaryRow
        label={t('shakaSamvat', language)}
        value={String(data.shakaSamvat)}
      />

      {data.festivals.length > 0 ? (
        <div className="mt-3 border-t border-slate-800/80 pt-3">
          <p className="mb-2 text-xs font-medium text-amber-500/70">
            {t('festivals', language)}
          </p>
          <ul className="space-y-1 text-xs text-slate-300">
            {data.festivals.map((festival) => (
              <li
                key={festival}
                className={cn(scriptFont)}
              >
                {festival}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
