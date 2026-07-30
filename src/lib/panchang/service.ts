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

function parsePaksha(tithi: DailyTithiInfo): Paksha {
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
): number {
  for (let index = 0; index < tithis.length; index++) {
    const tithi = tithis[index];
    if (!tithi.startTime || !tithi.endTime) {
      continue;
    }
    const start = tithi.startTime.getTime();
    const end = tithi.endTime.getTime();
    if (now.getTime() >= start && now.getTime() < end) {
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
  }));
}

function findActiveNakshatra(
  nakshatras: DailyNakshatraInfo[],
  now: Date,
): DailyNakshatraInfo {
  for (const nakshatra of nakshatras) {
    if (!nakshatra.startTime || !nakshatra.endTime) {
      continue;
    }
    const start = nakshatra.startTime.getTime();
    const end = nakshatra.endTime.getTime();
    if (now.getTime() >= start && now.getTime() < end) {
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
    return cached;
  }

  const { location, language, masaSystem: masaPreference } = prefs;
  const masaSystem = resolveMasaSystem(masaPreference, location);
  const geo = {
    latitude: location.latitude,
    longitude: location.longitude,
  };
  const libraryLanguage = toLibraryLanguage(language);

  const daily = getDailyPanchang(now, geo, {
    timezone: location.timezone,
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

  const activeTithiIndex = findActiveTithiIndex(daily.tithis, now);
  const activeTithi = daily.tithis[activeTithiIndex];
  const previousTithiInfo = daily.tithis[activeTithiIndex - 1];
  const activeNakshatra = findActiveNakshatra(daily.nakshatras, now);
  const instantTithi = instant?.tithi ?? activeTithi;
  const paksha = parsePaksha(activeTithi);
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
    tithi: localizeTithi(activeTithi.name, language),
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

  return viewModel;
}
