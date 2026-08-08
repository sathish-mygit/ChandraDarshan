import type { BirthProfile, StoredLocation } from '../types';
import { toLibraryLanguage } from '../i18n/locale';
import { resolveTimezoneOffsetMinutes } from '../panchang/time';

export { toLibraryLanguage };

export function birthInstantFromProfile(profile: BirthProfile): Date {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const offset = resolveTimezoneOffsetMinutes(profile.birthLocation.timezone);

  let hours = 12;
  let minutes = 0;

  if (!profile.timeUnknown && profile.birthTime) {
    const [h, m] = profile.birthTime.split(':').map(Number);
    hours = h;
    minutes = m;
  }

  const utcMs =
    Date.UTC(year, month - 1, day, hours, minutes, 0, 0) - offset * 60 * 1000;
  return new Date(utcMs);
}

export function geoFromLocation(location: StoredLocation) {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
  };
}
