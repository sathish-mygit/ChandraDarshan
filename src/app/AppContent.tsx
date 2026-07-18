'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AppPreferencesProvider } from '@/contexts/AppPreferencesContext';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      document.documentElement.dataset.platform = Capacitor.getPlatform();
    }
  }, []);

  return (
    <AppPreferencesProvider>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <AppHeader />
        <div
          className="flex-1"
          style={{ paddingBottom: 'calc(var(--nav-height) + var(--safe-bottom))' }}
        >
          {children}
        </div>
        <BottomNav />
      </div>
    </AppPreferencesProvider>
  );
}
