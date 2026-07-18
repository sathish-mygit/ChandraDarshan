import { Geolocation } from '@capacitor/geolocation';
import type { StoredLocation } from './types';

export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationError';
  }
}

function getDeviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export async function resolveGpsLocation(): Promise<StoredLocation> {
  const permission = await Geolocation.requestPermissions();
  if (permission.location === 'denied') {
    throw new LocationError('Location permission denied');
  }

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  });

  const { latitude, longitude } = position.coords;
  const timezone = getDeviceTimezone();

  return {
    source: 'gps',
    label: 'Current location',
    latitude,
    longitude,
    timezone,
  };
}
