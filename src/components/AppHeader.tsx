'use client';

import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { t } from '@/lib/i18n/labels';

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const { preferences } = useAppPreferences();
  const language = preferences.language;

  return (
    <header className="sticky top-0 z-30 flex items-center border-b border-slate-800/80 bg-background/90 px-4 py-3 backdrop-blur-md">
      <h1 className="text-sm font-medium tracking-wide text-amber-100">
        {title ?? t('appTitle', language)}
      </h1>
    </header>
  );
}
