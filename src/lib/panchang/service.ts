import {
  getDailyPanchang,
  getInstantPanchang,
  type DailyNakshatraInfo,
  type DailyTithiInfo,
} from 'panchang-ts';
import type {
  AppPreferences,
  Paksha,
  PanchangViewModel,
  TithiTimingEntry,
} from '../types';
import {
  localizeFestival,
  localizeMaasa,
  localizeNakshatra,
  localizePaksha,
  localizeTithi,
  localizeVara,
} from '../i18n/terms';
import { toLibraryLanguage } from '../i18n/locale';
import {
  formatGregorianDate,
  getCachedPanchang,
  getLocalDateKey,
  setCachedPanchang,
} from './cache';
import { resolveMasaSystem } from './masa-system';
import { getSamvatsaraName } from './samvatsara';
import {
  isInPanchangWindow,
  toPanchangComparableMs,
} from './time';

function parsePaksha(tithi: { paksha: string }): Paksha {
  const paksha = tithi.paksha.toLowerCase();
  if (paksha.includes('shukla') || paksha.includes('शुक्ल')) {
    return 'shukla';
  }
  return 'krishna';
}

function computeMoonFill(
  paksha: Paksha,
  tithiNumber: number,
  completionPercentage: number,
): { moonFill: number; isWaxing: boolean } {
  const progress = (tithiNumber - 1 + completionPercentage / 100) / 15;
  const clamped = Math.min(1, Math.max(0, progress));

  if (paksha === 'shukla') {
    return { moonFill: clamped, isWaxing: true };
  }

  return { moonFill: 1 - clamped, isWaxing: false };
}

function findActiveTithiIndex(
  tithis: DailyTithiInfo[],
  now: Date,
  timezone: number | string,
): number {
  for (let index = 0; index < tithis.length; index++) {
    const tithi = tithis[index];
    if (!tithi.startTime || !tithi.endTime) {
      continue;
    }
    if (isInPanchangWindow(now, tithi.startTime, tithi.endTime, timezone)) {
      return index;
    }
  }

  const sunriseIndex = tithis.findIndex((tithi) => tithi.isActiveAtSunrise);
  return sunriseIndex >= 0 ? sunriseIndex : 0;
}

function buildTithiTimeline(
  tithis: DailyTithiInfo[],
  activeIndex: number,
  language: AppPreferences['language'],
): TithiTimingEntry[] {
  return tithis.map((tithi, index) => ({
    name: localizeTithi(tithi.name, language),
    start: tithi.startTime,
    end: tithi.endTime,
    isCurrent: index === activeIndex,
    paksha: parsePaksha(tithi),
  }));
}

function findActiveTimelineIndex(
  timeline: TithiTimingEntry[],
  now: Date,
  sunrise: Date,
  timezone: number | string,
): number {
  for (let index = 0; index < timeline.length; index++) {
    const entry = timeline[index];
    if (!entry.start || !entry.end) {
      continue;
    }
    if (isInPanchangWindow(now, entry.start, entry.end, timezone)) {
      return index;
    }
  }

  for (let index = 0; index < timeline.length; index++) {
    const entry = timeline[index];
    if (!entry.start || !entry.end) {
      continue;
    }
    if (isInPanchangWindow(sunrise, entry.start, entry.end, timezone)) {
      return index;
    }
  }

  return 0;
}

/** Re-resolve tithi, nakshatra, and moon phase for the current moment from cached daily data. */
export function resolveLivePanchang(
  data: PanchangViewModel,
  prefs: AppPreferences,
  now: Date = new Date(),
): PanchangViewModel {
  const { location, language } = prefs;
  const timezone = location.timezone;
  const geo = {
    latitude: location.latitude,
    longitude: location.longitude,
  };
  const libraryLanguage = toLibraryLanguage(language);

  const instant = getInstantPanchang(now, geo, {
    language: libraryLanguage,
  });

  const activeIndex =
    data.tithiTimeline.length > 0
      ? findActiveTimelineIndex(
          data.tithiTimeline,
          now,
          data.sunrise,
          timezone,
        )
      : -1;
  const activeEntry =
    activeIndex >= 0 ? data.tithiTimeline[activeIndex] : undefined;
  const previousEntry =
    activeIndex > 0 ? data.tithiTimeline[activeIndex - 1] : undefined;

  const instantTithi = instant?.tithi;
  const paksha = instantTithi
    ? parsePaksha(instantTithi)
    : (activeEntry?.paksha ?? data.paksha);

  const { moonFill, isWaxing } = computeMoonFill(
    paksha,
    instantTithi?.number ?? 1,
    instantTithi?.completionPercentage ?? 0,
  );

  const nakshatra = instant?.nakshatra
    ? localizeNakshatra(instant.nakshatra.name, language)
    : data.nakshatra;

  const tithiTimeline =
    activeIndex >= 0
      ? data.tithiTimeline.map((entry, index) => ({
          ...entry,
          isCurrent: index === activeIndex,
        }))
      : data.tithiTimeline;

  const tithiLabel = instantTithi
    ? localizeTithi(instantTithi.name, language)
    : (activeEntry?.name ?? data.tithi);

  return {
    ...data,
    tithi: tithiLabel,
    paksha,
    pakshaLabel: localizePaksha(paksha, language),
    nakshatra,
    tithiUntil: activeEntry?.end ?? data.tithiUntil,
    tithiStart: activeEntry?.start ?? data.tithiStart,
    previousTithi: previousEntry?.name ?? null,
    previousTithiEnd: previousEntry ? (activeEntry?.start ?? null) : null,
    tithiTimeline,
    moonFill,
    isWaxing,
    gregorianDate: formatGregorianDate(now, language),
  };
}

export function getNextPanchangTransitionMs(
  data: PanchangViewModel,
  timezone: number | string,
  now: Date = new Date(),
): number | null {
  const nowMs = toPanchangComparableMs(now, timezone);
  const candidates: number[] = [];

  for (const entry of data.tithiTimeline) {
    if (entry.end && entry.end.getTime() > nowMs) {
      candidates.push(entry.end.getTime());
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  return Math.min(...candidates) - nowMs;
}

function findActiveNakshatra(
  nakshatras: DailyNakshatraInfo[],
  now: Date,
  timezone: number | string,
): DailyNakshatraInfo {
  for (const nakshatra of nakshatras) {
    if (!nakshatra.startTime || !nakshatra.endTime) {
      continue;
    }
    if (
      isInPanchangWindow(
        now,
        nakshatra.startTime,
        nakshatra.endTime,
        timezone,
      )
    ) {
      return nakshatra;
    }
  }

  return (
    nakshatras.find((nakshatra) => nakshatra.isActiveAtSunrise) ?? nakshatras[0]
  );
}

export async function fetchTodayPanchang(
  prefs: AppPreferences,
): Promise<PanchangViewModel> {
  const now = new Date();
  const dateKey = getLocalDateKey(now);

  const cached = await getCachedPanchang(prefs, dateKey);
  if (cached) {
    return resolveLivePanchang(cached, prefs, now);
  }

  const { location, language, masaSystem: masaPreference } = prefs;
  const timezone = location.timezone;
  const masaSystem = resolveMasaSystem(masaPreference, location);
  const geo = {
    latitude: location.latitude,
    longitude: location.longitude,
  };
  const libraryLanguage = toLibraryLanguage(language);

  const daily = getDailyPanchang(now, geo, {
    timezone,
    language: libraryLanguage,
    masaSystem,
    computeEndTimes: true,
  });

  if (!daily) {
    throw new Error('Panchang unavailable for this location and date');
  }

  const instant = getInstantPanchang(now, geo, {
    language: libraryLanguage,
  });

  const activeTithiIndex = findActiveTithiIndex(daily.tithis, now, timezone);
  const activeTithi = daily.tithis[activeTithiIndex];
  const previousTithiInfo = daily.tithis[activeTithiIndex - 1];
  const activeNakshatra = findActiveNakshatra(
    daily.nakshatras,
    now,
    timezone,
  );
  const instantTithi = instant?.tithi ?? activeTithi;
  const paksha = parsePaksha(instantTithi);
  const { moonFill, isWaxing } = computeMoonFill(
    paksha,
    instantTithi.number,
    instantTithi.completionPercentage,
  );

  const maasaName =
    masaSystem === 'amanta'
      ? daily.chandramasa.amantaName
      : daily.chandramasa.purnimantaName;

  const viewModel: PanchangViewModel = {
    tithi: localizeTithi(instantTithi.name, language),
    paksha,
    pakshaLabel: localizePaksha(paksha, language),
    maasa: localizeMaasa(maasaName, language),
    isAdhika: daily.chandramasa.isAdhika,
    samvatsara: getSamvatsaraName(daily.samvat.vikramSamvat, language),
    vikramSamvat: daily.samvat.vikramSamvat,
    shakaSamvat: daily.samvat.shakaSamvat,
    vara: localizeVara(daily.vara.name, language),
    nakshatra: localizeNakshatra(activeNakshatra.name, language),
    tithiUntil: activeTithi.endTime,
    tithiStart: activeTithi.startTime,
    previousTithi: previousTithiInfo
      ? localizeTithi(previousTithiInfo.name, language)
      : null,
    previousTithiEnd: previousTithiInfo ? activeTithi.startTime : null,
    tithiTimeline: buildTithiTimeline(
      daily.tithis,
      activeTithiIndex,
      language,
    ),
    moonFill,
    isWaxing,
    sunrise: daily.sunrise,
    sunset: daily.sunset,
    moonrise: daily.moonrise,
    moonset: daily.moonset,
    festivals: daily.festivals
      .slice(0, 3)
      .map((festival) => localizeFestival(festival.name, language)),
    locationLabel: location.label,
    gregorianDate: formatGregorianDate(now, language),
  };

  await setCachedPanchang(
    prefs,
    dateKey,
    viewModel,
    daily.sunrise,
    daily.nextSunrise,
  );

  return resolveLivePanchang(viewModel, prefs, now);
}
