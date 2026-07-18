'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsService } from '@/lib/analytics/analytics.service';
import { ANALYTICS_EVENTS } from '@/lib/analytics/analytics-events';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const pageStartTimeRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (pageStartTimeRef.current === 0) {
      pageStartTimeRef.current = Date.now();
    }

    const currentTime = Date.now();

    if (!isInitializedRef.current) {
      void analyticsService.logPageView(pathname);
      previousPathnameRef.current = pathname;
      pageStartTimeRef.current = currentTime;
      isInitializedRef.current = true;
      return;
    }

    if (pathname !== previousPathnameRef.current) {
      const timeOnPreviousPage = currentTime - pageStartTimeRef.current;
      const previousPath = previousPathnameRef.current;

      if (previousPath && timeOnPreviousPage > 500) {
        void analyticsService.logEvent(ANALYTICS_EVENTS.PAGE_DURATION, {
          page_name: previousPath,
          duration_ms: timeOnPreviousPage,
          duration_seconds: Math.round(timeOnPreviousPage / 1000),
        });
      }

      void analyticsService.logPageView(pathname);
      previousPathnameRef.current = pathname;
      pageStartTimeRef.current = currentTime;
    }
  }, [pathname]);

  return null;
}
