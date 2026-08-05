import { CITIES } from '../cities';
import { findNearestCityWithinKm } from '../geo';
import type {
  MasaSystem,
  MasaSystemPreference,
  StoredLocation,
} from '../types';

const NEARBY_CITY_KM = 50;

export function inferMasaSystemFromCoords(
  latitude: number,
  longitude: number,
): MasaSystem {
  if (latitude < 18) {
    return 'amanta';
  }

  if (latitude < 22.5 && longitude < 78) {
    return 'amanta';
  }

  if (latitude < 24 && longitude < 74) {
    return 'amanta';
  }

  return 'purnimanta';
}

function findPresetCity(location: StoredLocation) {
  return CITIES.find(
    (city) =>
      (location.source === 'city' || location.source === 'approx') &&
      city.latitude === location.latitude &&
      city.longitude === location.longitude,
  );
}

export function resolveMasaSystem(
  preference: MasaSystemPreference,
  location: StoredLocation,
): MasaSystem {
  if (preference !== 'auto') {
    return preference;
  }

  const presetCity = findPresetCity(location);
  if (presetCity) {
    return presetCity.masaSystem;
  }

  const nearbyCity = findNearestCityWithinKm(
    location.latitude,
    location.longitude,
    NEARBY_CITY_KM,
  );
  if (nearbyCity) {
    return nearbyCity.masaSystem;
  }

  return inferMasaSystemFromCoords(location.latitude, location.longitude);
}
