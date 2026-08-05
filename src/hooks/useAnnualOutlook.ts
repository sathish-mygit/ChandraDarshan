'use client';

import { useMemo } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { computeAnnualOutlook } from '@/lib/jyotish/annual-outlook';
import type { AnnualOutlookViewModel } from '@/lib/types';

export function useAnnualOutlook(): {
  data: AnnualOutlookViewModel | null;
  isLoading: boolean;
} {
  const { birthProfile, preferences, isLoading } = useAppPreferences();

  const data = useMemo(() => {
    if (!birthProfile) {
      return null;
    }

    try {
      return computeAnnualOutlook(birthProfile, preferences.language);
    } catch {
      return null;
    }
  }, [birthProfile, preferences.language]);

  return { data, isLoading };
}
