export const ANALYTICS_EVENTS = {
  PREFERENCE_CHANGED: 'preference_changed',
  BIRTH_PROFILE_SAVED: 'birth_profile_saved',
  BIRTH_PROFILE_CLEARED: 'birth_profile_cleared',
  GLOSSARY_OPENED: 'glossary_opened',
  PAGE_DURATION: 'page_duration',
} as const;

export type PreferenceSetting = 'language' | 'masa_system' | 'location';

export function preferenceChangedParams(
  setting: PreferenceSetting,
  value: string,
): Record<string, string> {
  return { setting, value };
}

export function birthProfileSavedParams(hasBirthTime: boolean): Record<string, string> {
  return { has_birth_time: hasBirthTime ? 'true' : 'false' };
}

export function glossaryOpenedParams(termId: string): Record<string, string> {
  return { term_id: termId };
}
