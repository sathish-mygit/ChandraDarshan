'use client';

import { useEffect, useState } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { fetchPersonalToday } from '@/lib/jyotish/personal-today';
import type { PersonalTodayViewModel } from '@/lib/types';

export function usePersonalToday(): {
  data: PersonalTodayViewModel | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const { birthProfile, preferences, isLoading: prefsLoading } =
    useAppPreferences();
  const [data, setData] = useState<PersonalTodayViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchToken, setFetchToken] = useState(0);

  useEffect(() => {
    if (prefsLoading || !birthProfile) {
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchPersonalToday(
          birthProfile!,
          preferences.location,
          preferences.language,
        );
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
  }, [
    prefsLoading,
    birthProfile,
    preferences.location,
    preferences.language,
    fetchToken,
  ]);

  return {
    data,
    isLoading: prefsLoading || isLoading,
    error,
    refresh: () => setFetchToken((token) => token + 1),
  };
}
