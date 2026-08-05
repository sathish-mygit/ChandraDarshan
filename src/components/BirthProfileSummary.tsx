'use client';

import { t } from '@/lib/i18n/labels';
import type { AppLanguage, BirthProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

type BirthProfileSummaryProps = {
  profile: BirthProfile;
  language: AppLanguage;
  heading: string;
  moonRashi?: string;
  moonNakshatra?: string;
};

export function BirthProfileSummary({
  profile,
  language,
  heading,
  moonRashi,
  moonNakshatra,
}: BirthProfileSummaryProps) {
  const useDevanagari = language === 'hi' || language === 'sa';
  const timeLabel = profile.timeUnknown
    ? t('timeUnknown', language)
    : (profile.birthTime ?? t('timeUnknown', language));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">
        {heading}
      </p>
      {profile.name ? (
        <p className="mt-1 text-sm font-medium text-amber-50">{profile.name}</p>
      ) : null}
      <dl className="mt-2 space-y-1 text-sm text-slate-300">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">{t('birthDate', language)}</dt>
          <dd>{profile.birthDate}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">{t('birthTime', language)}</dt>
          <dd>{timeLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="shrink-0 text-slate-500">{t('birthPlace', language)}</dt>
          <dd className="text-right">{profile.birthLocation.label}</dd>
        </div>
      </dl>
      {moonRashi && moonNakshatra ? (
        <p
          className={cn(
            'mt-2 border-t border-slate-800 pt-2 text-sm text-amber-100',
            useDevanagari && 'font-devanagari',
          )}
        >
          {moonRashi} · {moonNakshatra}
        </p>
      ) : null}
    </div>
  );
}
