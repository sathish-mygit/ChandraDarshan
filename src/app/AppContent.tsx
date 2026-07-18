'use client';

import { AppPreferencesProvider } from '@/contexts/AppPreferencesContext';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPreferencesProvider>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <AppHeader />
        <div className="flex-1 pb-20">{children}</div>
        <BottomNav />
      </div>
    </AppPreferencesProvider>
  );
}
