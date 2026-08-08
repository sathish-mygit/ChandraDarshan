'use client';

import { useEffect, useRef } from 'react';
import { analyticsService } from '@/lib/analytics/analytics.service';
import { ANALYTICS_EVENTS } from '@/lib/analytics/analytics-events';
import {
  normalizeScreenPath,
  pageVisitedEventParams,
  resolvePageVisitedEvent,
} from '@/lib/analytics/page-visit-events';

const MIN_DURATION_MS = 500;

function logPageDuration(screenId: string, durationMs: number): void {
  if (durationMs <= MIN_DURATION_MS) {
    return;
  }

  void analyticsService.logEvent(ANALYTICS_EVENTS.PAGE_DURATION, {
    page_name: screenId,
    duration_ms: durationMs,
    duration_seconds: Math.round(durationMs / 1000),
  });
}

function logPageVisited(screenId: string): void {
  const visitEvent = resolvePageVisitedEvent(screenId);
  if (!visitEvent) {
    return;
  }

  void analyticsService.logEvent(visitEvent, pageVisitedEventParams(screenId));
}

export function useScreenTracking(screenId: string | null): void {
  const previousScreenRef = useRef<string | null>(null);
  const pageStartTimeRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!screenId) {
      return;
    }

    const normalizedScreenId = normalizeScreenPath(screenId);
    const currentTime = Date.now();

    if (!isInitializedRef.current) {
      void analyticsService.logPageView(normalizedScreenId);
      logPageVisited(normalizedScreenId);
      previousScreenRef.current = normalizedScreenId;
      pageStartTimeRef.current = currentTime;
      isInitializedRef.current = true;
      return;
    }

    if (normalizedScreenId !== previousScreenRef.current) {
      const previousScreen = previousScreenRef.current;
      if (previousScreen) {
        logPageDuration(previousScreen, currentTime - pageStartTimeRef.current);
      }

      void analyticsService.logPageView(normalizedScreenId);
      logPageVisited(normalizedScreenId);
      previousScreenRef.current = normalizedScreenId;
      pageStartTimeRef.current = currentTime;
    }
  }, [screenId]);

  useEffect(() => {
    return () => {
      const activeScreen = previousScreenRef.current;
      if (!activeScreen) {
        return;
      }

      logPageDuration(activeScreen, Date.now() - pageStartTimeRef.current);
    };
  }, []);
}
