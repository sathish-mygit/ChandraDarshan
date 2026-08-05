'use client';

import { useMemo } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { computeChartDepth } from '@/lib/jyotish/chart-depth';
import type { ChartDepthViewModel } from '@/lib/types';

export function useChartDepth(): {
  data: ChartDepthViewModel | null;
  isLoading: boolean;
} {
  const { birthProfile, preferences, isLoading } = useAppPreferences();

  const data = useMemo(() => {
    if (!birthProfile) {
      return null;
    }

    try {
      return computeChartDepth(birthProfile, preferences.language);
    } catch {
      return null;
    }
  }, [birthProfile, preferences.language]);

  return { data, isLoading };
}
