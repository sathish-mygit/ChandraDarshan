'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
} from '@/lib/preferences';
import type { AppPreferences, BirthProfile } from '@/lib/types';

type AppPreferencesContextValue = {
  preferences: AppPreferences;
  birthProfile?: BirthProfile;
  isLoading: boolean;
  updatePreferences: (patch: Partial<AppPreferences>) => Promise<void>;
  updateBirthProfile: (profile: BirthProfile | undefined) => Promise<void>;
  clearBirthProfile: () => Promise<void>;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(
  null,
);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const stored = await loadPreferences();
      if (!cancelled) {
        setPreferences(stored);
        setIsLoading(false);
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  const updatePreferences = useCallback(
    async (patch: Partial<AppPreferences>) => {
      let next: AppPreferences = DEFAULT_PREFERENCES;
      setPreferences((current) => {
        next = { ...current, ...patch };
        return next;
      });
      await savePreferences(next);
    },
    [],
  );

  const updateBirthProfile = useCallback(
    async (profile: BirthProfile | undefined) => {
      let next: AppPreferences = DEFAULT_PREFERENCES;
      setPreferences((current) => {
        next = { ...current, birthProfile: profile };
        return next;
      });
      await savePreferences(next);
    },
    [],
  );

  const clearBirthProfile = useCallback(async () => {
    await updateBirthProfile(undefined);
  }, [updateBirthProfile]);

  const value = useMemo(
    () => ({
      preferences,
      birthProfile: preferences.birthProfile,
      isLoading,
      updatePreferences,
      updateBirthProfile,
      clearBirthProfile,
    }),
    [
      preferences,
      isLoading,
      updatePreferences,
      updateBirthProfile,
      clearBirthProfile,
    ],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences(): AppPreferencesContextValue {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }
  return context;
}
