import { Preferences } from '@capacitor/preferences';
import { cityToLocation, DEFAULT_CITY } from './cities';
import type { AppPreferences, MasaSystemPreference } from './types';

const PREFERENCES_KEY = 'app.preferences.v2';
const LEGACY_PREFERENCES_KEY = 'app.preferences.v1';

export const DEFAULT_PREFERENCES: AppPreferences = {
  language: 'en',
  masaSystem: 'auto',
  location: cityToLocation(DEFAULT_CITY),
};

function parseMasaSystem(value: unknown): MasaSystemPreference {
  if (value === 'auto' || value === 'amanta' || value === 'purnimanta') {
    return value;
  }
  return DEFAULT_PREFERENCES.masaSystem;
}

function parsePreferences(value: string): AppPreferences {
  const parsed = JSON.parse(value) as Partial<AppPreferences>;
  return {
    language: parsed.language ?? DEFAULT_PREFERENCES.language,
    masaSystem: parseMasaSystem(parsed.masaSystem),
    location: parsed.location ?? DEFAULT_PREFERENCES.location,
    locationAutoDetected: parsed.locationAutoDetected ?? false,
    birthProfile: parsed.birthProfile,
    partnerBirthProfile: parsed.partnerBirthProfile,
    dailyReminder: parsed.dailyReminder,
  };
}

export async function loadPreferences(): Promise<AppPreferences> {
  const { value } = await Preferences.get({ key: PREFERENCES_KEY });
  if (value) {
    try {
      return parsePreferences(value);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  const legacy = await Preferences.get({ key: LEGACY_PREFERENCES_KEY });
  if (legacy.value) {
    try {
      const migrated = parsePreferences(legacy.value);
      await savePreferences(migrated);
      return migrated;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  return DEFAULT_PREFERENCES;
}

export async function savePreferences(preferences: AppPreferences): Promise<void> {
  await Preferences.set({
    key: PREFERENCES_KEY,
    value: JSON.stringify(preferences),
  });
}
