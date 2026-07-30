import { Preferences } from '@capacitor/preferences';
import type { AppPreferences, PanchangViewModel, TithiTimingEntry } from '../types';
import { resolveMasaSystem } from './masa-system';
import { getDateLocale } from '../i18n/locale';

const CACHE_KEY = 'panchang.cache.v4';

export type PanchangCacheEntry = {
  cacheKey: string;
  data: PanchangViewModel;
  sunrise: string;
  nextSunrise: string;
  cachedAt: string;
};

function buildCacheKey(prefs: AppPreferences, dateKey: string): string {
  const { location, language, masaSystem: masaPreference } = prefs;
  const masaSystem = resolveMasaSystem(masaPreference, location);
  return [
    dateKey,
    location.latitude.toFixed(4),
    location.longitude.toFixed(4),
    String(location.timezone),
    language,
    masaPreference,
    masaSystem,
  ].join('|');
}

function serializeViewModel(data: PanchangViewModel): PanchangViewModel {
  return {
    ...data,
    sunrise: data.sunrise,
    sunset: data.sunset,
  };
}

function deserializeTithiTimeline(
  raw: TithiTimingEntry[] | undefined,
): TithiTimingEntry[] {
  return (raw ?? []).map((entry) => ({
    name: entry.name,
    start: entry.start ? new Date(entry.start) : null,
    end: entry.end ? new Date(entry.end) : null,
    isCurrent: entry.isCurrent ?? false,
  }));
}

function deserializeViewModel(raw: PanchangViewModel): PanchangViewModel {
  return {
    ...raw,
    sunrise: new Date(raw.sunrise),
    sunset: new Date(raw.sunset),
    tithiUntil: raw.tithiUntil ? new Date(raw.tithiUntil) : null,
    tithiStart: raw.tithiStart ? new Date(raw.tithiStart) : null,
    previousTithi: raw.previousTithi ?? null,
    previousTithiEnd: raw.previousTithiEnd ? new Date(raw.previousTithiEnd) : null,
    tithiTimeline: deserializeTithiTimeline(raw.tithiTimeline),
    moonrise: raw.moonrise ? new Date(raw.moonrise) : null,
    moonset: raw.moonset ? new Date(raw.moonset) : null,
    festivals: raw.festivals ?? [],
  };
}

export async function getCachedPanchang(
  prefs: AppPreferences,
  dateKey: string,
): Promise<PanchangViewModel | null> {
  const { value } = await Preferences.get({ key: CACHE_KEY });
  if (!value) {
    return null;
  }

  try {
    const entry = JSON.parse(value) as PanchangCacheEntry;
    const expectedKey = buildCacheKey(prefs, dateKey);

    if (entry.cacheKey !== expectedKey) {
      return null;
    }

    const now = Date.now();
    const nextSunrise = new Date(entry.nextSunrise).getTime();
    if (now >= nextSunrise) {
      return null;
    }

    return deserializeViewModel(entry.data);
  } catch {
    return null;
  }
}

export async function setCachedPanchang(
  prefs: AppPreferences,
  dateKey: string,
  data: PanchangViewModel,
  sunrise: Date,
  nextSunrise: Date,
): Promise<void> {
  const entry: PanchangCacheEntry = {
    cacheKey: buildCacheKey(prefs, dateKey),
    data: serializeViewModel(data),
    sunrise: sunrise.toISOString(),
    nextSunrise: nextSunrise.toISOString(),
    cachedAt: new Date().toISOString(),
  };

  await Preferences.set({
    key: CACHE_KEY,
    value: JSON.stringify(entry),
  });
}

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatPanchangTime(date: Date): string {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

export function formatPanchangTimeRange(
  start: Date | null,
  end: Date | null,
): string | null {
  if (start && end) {
    return `${formatPanchangTime(start)} – ${formatPanchangTime(end)}`;
  }
  if (start) {
    return formatPanchangTime(start);
  }
  if (end) {
    return formatPanchangTime(end);
  }
  return null;
}

export function formatGregorianDate(date: Date, language: AppPreferences['language']): string {
  return date.toLocaleDateString(getDateLocale(language), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
