'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { fetchTodayPanchang } from '@/lib/panchang/service';
import type { PanchangViewModel } from '@/lib/types';

type UsePanchangTodayResult = {
  data: PanchangViewModel | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

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

  return {
    data,
    isLoading: prefsLoading || isLoading,
    error,
    refresh,
  };
}
