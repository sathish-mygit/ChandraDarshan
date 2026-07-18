'use client';

import type { AppLanguage } from '@/lib/types';
import { cn } from '@/lib/utils';

const OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'sa', label: 'संस्कृत' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'ta', label: 'தமிழ்' },
];

type LanguagePickerProps = {
  value: AppLanguage;
  onChange: (value: AppLanguage) => void;
};

export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'min-w-[4.5rem] flex-1 rounded-xl border px-3 py-2 text-sm transition',
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
