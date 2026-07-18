import { Preferences } from '@capacitor/preferences';
import type {
  AppLanguage,
  BirthProfile,
  PersonalTodayViewModel,
  StoredLocation,
} from '../types';

const CACHE_KEY = 'jyotish.personal.v5';

type PersonalCacheEntry = {
  cacheKey: string;
  data: PersonalTodayViewModel;
  nextSunrise: string;
};

function buildCacheKey(
  profile: BirthProfile,
  location: StoredLocation,
  language: AppLanguage,
): string {
  return [
    profile.birthDate,
    profile.birthTime ?? 'unknown',
    profile.timeUnknown ? '1' : '0',
    profile.birthLocation.latitude.toFixed(4),
    profile.birthLocation.longitude.toFixed(4),
    location.latitude.toFixed(4),
    location.longitude.toFixed(4),
    String(location.timezone),
    language,
  ].join('|');
}

export async function getCachedPersonalToday(
  profile: BirthProfile,
  location: StoredLocation,
  language: AppLanguage,
  now: Date,
): Promise<PersonalTodayViewModel | null> {
  const { value } = await Preferences.get({ key: CACHE_KEY });
  if (!value) {
    return null;
  }

  try {
    const entry = JSON.parse(value) as PersonalCacheEntry;
    const expectedKey = buildCacheKey(profile, location, language);

    if (entry.cacheKey !== expectedKey) {
      return null;
    }

    if (now.getTime() >= new Date(entry.nextSunrise).getTime()) {
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export async function setCachedPersonalToday(
  profile: BirthProfile,
  location: StoredLocation,
  language: AppLanguage,
  data: PersonalTodayViewModel,
  _sunrise: Date,
  nextSunrise: Date,
): Promise<void> {
  const entry: PersonalCacheEntry = {
    cacheKey: buildCacheKey(profile, location, language),
    data,
    nextSunrise: nextSunrise.toISOString(),
  };

  await Preferences.set({
    key: CACHE_KEY,
    value: JSON.stringify(entry),
  });
}
