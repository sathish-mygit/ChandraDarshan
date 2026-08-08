'use client';

import { usePathname } from 'next/navigation';
import { resolveTopLevelScreen } from '@/lib/analytics/route-metadata';
import { useScreenTracking } from '@/hooks/useScreenTracking';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const screenId = resolveTopLevelScreen(pathname);

  useScreenTracking(screenId);

  return null;
}
