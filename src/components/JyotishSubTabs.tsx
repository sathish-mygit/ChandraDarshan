'use client';

import { t } from '@/lib/i18n/labels';
import type { AppLanguage } from '@/lib/types';
import { cn } from '@/lib/utils';

export type JyotishTabId = 'today' | 'chart' | 'timeline' | 'learn';

const TABS: JyotishTabId[] = ['today', 'chart', 'timeline', 'learn'];

const TAB_LABEL_KEYS: Record<
  JyotishTabId,
  'jyotishTabToday' | 'jyotishTabChart' | 'jyotishTabTimeline' | 'jyotishTabLearn'
> = {
  today: 'jyotishTabToday',
  chart: 'jyotishTabChart',
  timeline: 'jyotishTabTimeline',
  learn: 'jyotishTabLearn',
};

type JyotishSubTabsProps = {
  active: JyotishTabId;
  onChange: (tab: JyotishTabId) => void;
  language: AppLanguage;
};

export function JyotishSubTabs({
  active,
  onChange,
  language,
}: JyotishSubTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl border border-slate-800 bg-slate-900/50 p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            'flex-1 rounded-lg px-2 py-2 text-xs font-medium transition',
            active === tab
              ? 'bg-amber-500/20 text-amber-100'
              : 'text-slate-500 hover:text-slate-300',
          )}
        >
          {t(TAB_LABEL_KEYS[tab], language)}
        </button>
      ))}
    </div>
  );
}
