'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { t } from '@/lib/i18n/labels';

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const { preferences } = useAppPreferences();
  const language = preferences.language;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-background/90 px-4 py-3 backdrop-blur-md">
      <h1 className="text-sm font-medium tracking-wide text-amber-100">
        {title ?? t('appTitle', language)}
      </h1>
      <Link
        href="/settings/"
        className="flex h-9 w-9 items-center justify-center rounded-full text-amber-300/90 transition hover:bg-amber-500/10 hover:text-amber-200"
        aria-label={t('settings', language)}
      >
        <Settings className="h-5 w-5" />
      </Link>
    </header>
  );
}
