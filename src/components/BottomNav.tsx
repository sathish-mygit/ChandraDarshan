'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Settings, Sparkles } from 'lucide-react';
import { t } from '@/lib/i18n/labels';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { cn } from '@/lib/utils';

const TABS = [
  {
    href: '/',
    labelKey: 'tabToday' as const,
    icon: CalendarDays,
    isActive: (pathname: string) => pathname === '/' || pathname === '',
  },
  {
    href: '/jyotish/',
    labelKey: 'tabJyotish' as const,
    icon: Sparkles,
    isActive: (pathname: string) => pathname.startsWith('/jyotish'),
  },
  {
    href: '/settings/',
    labelKey: 'tabSettings' as const,
    icon: Settings,
    isActive: (pathname: string) => pathname.startsWith('/settings'),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { preferences } = useAppPreferences();
  const language = preferences.language;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-card/95 backdrop-blur-md"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mx-auto flex max-w-md">
        {TABS.map((tab) => {
          const active = tab.isActive(pathname);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition',
                active
                  ? 'text-amber-300'
                  : 'text-slate-500 hover:text-slate-300',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.5} />
              <span>{t(tab.labelKey, language)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
