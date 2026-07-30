'use client';

import { t } from '@/lib/i18n/labels';
import type { AppLanguage, MasaSystemPreference } from '@/lib/types';
import { cn } from '@/lib/utils';

type MasaSystemPickerProps = {
  value: MasaSystemPreference;
  language: AppLanguage;
  onChange: (value: MasaSystemPreference) => void;
};

export function MasaSystemPicker({
  value,
  language,
  onChange,
}: MasaSystemPickerProps) {
  const options: { value: MasaSystemPreference; label: string }[] = [
    { value: 'auto', label: t('masaSystemAuto', language) },
    { value: 'purnimanta', label: t('purnimanta', language) },
    { value: 'amanta', label: t('amanta', language) },
  ];

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-xl border px-3 py-2.5 text-left text-sm transition',
            value === option.value
              ? 'border-amber-400/60 bg-amber-500/15 text-amber-100'
              : 'border-slate-700 bg-slate-900/40 text-slate-400 hover:border-slate-600',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
