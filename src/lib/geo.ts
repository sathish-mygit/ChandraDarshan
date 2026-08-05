import { CITIES } from './cities';
import type { CityEntry } from './types';

const INDIA_LAT_MIN = 6.5;
const INDIA_LAT_MAX = 37;
const INDIA_LON_MIN = 68;
const INDIA_LON_MAX = 97;

export function haversineKm(
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

export function isInIndia(latitude: number, longitude: number): boolean {
  return (
    latitude >= INDIA_LAT_MIN &&
    latitude <= INDIA_LAT_MAX &&
    longitude >= INDIA_LON_MIN &&
    longitude <= INDIA_LON_MAX
  );
}

export function findNearestCity(
  latitude: number,
  longitude: number,
): { city: CityEntry; distanceKm: number } {
  let nearest = CITIES[0];
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

  return { city: nearest, distanceKm: nearestDistanceKm };
}

export function findNearestCityWithinKm(
  latitude: number,
  longitude: number,
  maxDistanceKm: number,
): CityEntry | null {
  const { city, distanceKm } = findNearestCity(latitude, longitude);
  if (distanceKm > maxDistanceKm) {
    return null;
  }
  return city;
}
