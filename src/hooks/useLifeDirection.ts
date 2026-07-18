'use client';

import { useMemo } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { computeLifeDirection } from '@/lib/jyotish/life-direction';
import type { LifeDirectionViewModel } from '@/lib/types';

export function useLifeDirection(): {
  data: LifeDirectionViewModel | null;
  isLoading: boolean;
} {
  const { birthProfile, preferences, isLoading } = useAppPreferences();

  const data = useMemo(() => {
    if (!birthProfile) {
      return null;
    }

    try {
      return computeLifeDirection(birthProfile, preferences.language);
    } catch {
      return null;
    }
  }, [birthProfile, preferences.language]);

  return {
    data,
    isLoading,
  };
}
