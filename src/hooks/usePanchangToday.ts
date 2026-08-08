'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import {
  fetchTodayPanchang,
  getNextPanchangTransitionMs,
  resolveLivePanchang,
} from '@/lib/panchang/service';
import type { PanchangViewModel } from '@/lib/types';

type UsePanchangTodayResult = {
  data: PanchangViewModel | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const LIVE_REFRESH_INTERVAL_MS = 60_000;

export function usePanchangToday(): UsePanchangTodayResult {
  const { preferences, isLoading: prefsLoading } = useAppPreferences();
  const [data, setData] = useState<PanchangViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchToken, setFetchToken] = useState(0);

  const refresh = useCallback(async () => {
    setFetchToken((token) => token + 1);
  }, []);

  useEffect(() => {
    if (prefsLoading) {
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchTodayPanchang(preferences);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [prefsLoading, preferences, fetchToken]);

  useEffect(() => {
    if (prefsLoading || !data) {
      return;
    }

    const applyLive = () => {
      setData((prev) =>
        prev ? resolveLivePanchang(prev, preferences, new Date()) : null,
      );
    };

    const intervalId = setInterval(applyLive, LIVE_REFRESH_INTERVAL_MS);

    const delayMs = getNextPanchangTransitionMs(
      data,
      preferences.location.timezone,
      new Date(),
    );
    const transitionTimeoutId =
      delayMs !== null
        ? setTimeout(applyLive, delayMs + 50)
        : undefined;

    return () => {
      clearInterval(intervalId);
      if (transitionTimeoutId !== undefined) {
        clearTimeout(transitionTimeoutId);
      }
    };
  }, [data, preferences, prefsLoading]);

  return {
    data,
    isLoading: prefsLoading || isLoading,
    error,
    refresh,
  };
}
