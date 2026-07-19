'use client';

import { AppPreferencesProvider } from '@/contexts/AppPreferencesContext';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { AppHeader } from '@/components/AppHeader';
import { AppTelemetry } from '@/components/AppTelemetry';
import { BottomNav } from '@/components/BottomNav';
import { AppLifecycleManager } from '@/components/AppLifecycleManager';
import { AdNavigationBridge } from '@/components/AdNavigationBridge';

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPreferencesProvider>
      <AnalyticsTracker />
      <AppTelemetry />
      <AppLifecycleManager />
      <AdNavigationBridge />
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
