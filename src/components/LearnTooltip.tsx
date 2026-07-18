'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { GlossaryTermId } from '@/lib/i18n/glossary';
import { getGlossaryTerm } from '@/lib/i18n/glossary';
import type { AppLanguage } from '@/lib/types';
import { cn } from '@/lib/utils';

type LearnTooltipProps = {
  termId: GlossaryTermId;
  language: AppLanguage;
  className?: string;
};

export function LearnTooltip({ termId, language, className }: LearnTooltipProps) {
  const [open, setOpen] = useState(false);
  const text = getGlossaryTerm(termId, language);

  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-amber-500/70 transition hover:text-amber-300"
        aria-label="Learn more"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 top-6 z-50 w-56 rounded-xl border border-slate-700 bg-slate-900 p-3 text-left text-xs leading-relaxed text-slate-300 shadow-lg">
          {text}
        </div>
      ) : null}
    </span>
  );
}
