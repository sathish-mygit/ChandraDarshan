import { cityToLocation } from './cities';
import { findNearestCity, isInIndia } from './geo';
import type { StoredLocation } from './types';

const IP_GEO_URL = 'https://ipwho.is/';
const FETCH_TIMEOUT_MS = 5000;

type IpGeoResponse = {
  success?: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  country_code?: string;
};

function getDeviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

async function fetchIpGeo(): Promise<IpGeoResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(IP_GEO_URL, { signal: controller.signal });
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as IpGeoResponse;
    if (
      data.success === false ||
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number'
    ) {
      return null;
    }

    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function resolveApproximateLocation(): Promise<StoredLocation | null> {
  const ip = await fetchIpGeo();
  if (!ip) {
    return null;
  }

  const { latitude, longitude } = ip;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  if (isInIndia(latitude, longitude)) {
    const { city } = findNearestCity(latitude, longitude);
    return {
      ...cityToLocation(city),
      source: 'approx',
    };
  }

  const label =
    typeof ip.city === 'string' && ip.city.trim().length > 0
      ? ip.city.trim()
      : 'Approximate location';

  return {
    source: 'approx',
    label,
    latitude,
    longitude,
    timezone: getDeviceTimezone(),
  };
}
