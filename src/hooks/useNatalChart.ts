'use client';

import { useMemo } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { computeNatalSnapshot } from '@/lib/jyotish/natal';
import type { NatalSnapshot } from '@/lib/types';

export function useNatalChart(): {
  snapshot: NatalSnapshot | null;
  isLoading: boolean;
} {
  const { birthProfile, preferences, isLoading } = useAppPreferences();

  const snapshot = useMemo(() => {
    if (!birthProfile) {
      return null;
    }

    try {
      return computeNatalSnapshot(birthProfile, preferences.language);
    } catch {
      return null;
    }
  }, [birthProfile, preferences.language]);

  return {
    snapshot,
    isLoading,
  };
}
