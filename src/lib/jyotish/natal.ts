import {
  computeRashiChart,
  getInstantPanchang,
} from 'panchang-ts';
import type { AppLanguage, BirthProfile, NatalSnapshot } from '../types';
import {
  birthInstantFromProfile,
  geoFromLocation,
  toLibraryLanguage,
} from './utils';

export function getJanmaIndices(profile: BirthProfile): {
  janmaRashi: number;
  janmaNakshatra: number;
} {
  const snapshot = computeNatalSnapshot(profile, 'en');
  return {
    janmaRashi: snapshot.moonRashiIndex,
    janmaNakshatra: snapshot.moonNakshatraIndex,
  };
}

export function computeNatalSnapshot(
  profile: BirthProfile,
  language: AppLanguage,
): NatalSnapshot {
  const birth = birthInstantFromProfile(profile);
  const location = geoFromLocation(profile.birthLocation);
  const libraryLanguage = toLibraryLanguage(language);

  const instant = getInstantPanchang(birth, location, {
    language: libraryLanguage,
  });

  if (!instant) {
    throw new Error('Could not compute birth moon position');
  }

  const base: NatalSnapshot = {
    moonRashi: instant.chandraRashi.name,
    moonNakshatra: instant.nakshatra.name,
    moonNakshatraIndex: instant.nakshatra.index,
    moonRashiIndex: instant.chandraRashi.index,
  };

  if (profile.timeUnknown) {
    return base;
  }

  const chart = computeRashiChart(birth, location, {
    houseSystem: 'whole-sign',
    language: libraryLanguage,
  });

  return {
    ...base,
    lagna: chart.lagna.rashi.name,
    lagnaNakshatra: chart.lagna.nakshatra.name,
    planets: chart.planets.map((planet) => ({
      planet: planet.planet,
      house: planet.house,
      rashi: planet.rashi.name,
      retrograde: planet.isRetrograde,
    })),
  };
}
