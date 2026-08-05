'use client';

import { useMemo } from 'react';
import { useAppPreferences } from '@/contexts/AppPreferencesContext';
import { computeKundaliMatch } from '@/lib/jyotish/kundali-match';
import type { KundaliMatchViewModel } from '@/lib/types';

export function useKundaliMatch(): {
  data: KundaliMatchViewModel | null;
  isLoading: boolean;
} {
  const { birthProfile, partnerBirthProfile, preferences, isLoading } =
    useAppPreferences();

  const data = useMemo(() => {
    if (!birthProfile || !partnerBirthProfile) {
      return null;
    }

    try {
      return computeKundaliMatch(
        birthProfile,
        partnerBirthProfile,
        preferences.language,
      );
    } catch {
      return null;
    }
  }, [birthProfile, partnerBirthProfile, preferences.language]);

  return { data, isLoading };
}
