'use client';

import { t } from '@/lib/i18n/labels';
import type { AppLanguage } from '@/lib/types';

type JyotishEmptyStateProps = {
  language: AppLanguage;
};

export function JyotishEmptyState({ language }: JyotishEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-6 text-center">
      <p className="text-sm text-slate-400">{t('jyotishEmpty', language)}</p>
      <p className="mt-2 text-xs text-amber-500/80">
        {t('addBirthProfile', language)}
      </p>
    </div>
  );
}
