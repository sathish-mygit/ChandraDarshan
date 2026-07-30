import { CITIES } from '../cities';
import type {
  MasaSystem,
  MasaSystemPreference,
  StoredLocation,
} from '../types';

const NEARBY_CITY_KM = 50;

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
      location.source === 'city' &&
      city.latitude === location.latitude &&
      city.longitude === location.longitude,
  );
}

function findNearestPresetCity(latitude: number, longitude: number) {
  let nearest: (typeof CITIES)[number] | undefined;
  let nearestDistanceKm = Number.POSITIVE_INFINITY;

  for (const city of CITIES) {
    const distanceKm = haversineKm(
      latitude,
      longitude,
      city.latitude,
      city.longitude,
    );
    if (distanceKm < nearestDistanceKm) {
      nearest = city;
      nearestDistanceKm = distanceKm;
    }
  }

  if (!nearest || nearestDistanceKm > NEARBY_CITY_KM) {
    return null;
  }

  return nearest;
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

  const nearbyCity = findNearestPresetCity(
    location.latitude,
    location.longitude,
  );
  if (nearbyCity) {
    return nearbyCity.masaSystem;
  }

  return inferMasaSystemFromCoords(location.latitude, location.longitude);
}
