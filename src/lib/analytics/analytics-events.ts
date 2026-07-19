export const ANALYTICS_EVENTS = {
  PREFERENCE_CHANGED: 'preference_changed',
  BIRTH_PROFILE_SAVED: 'birth_profile_saved',
  BIRTH_PROFILE_CLEARED: 'birth_profile_cleared',
  GLOSSARY_OPENED: 'glossary_opened',
  PAGE_DURATION: 'page_duration',
  HOME_PAGE_VISITED: 'home_page_visited',
  ASTRO_PAGE_VISITED: 'astro_page_visited',
  SETTINGS_PAGE_VISITED: 'settings_page_visited',
} as const;

export type PreferenceSetting =
  | 'language'
  | 'masa_system'
  | 'location'
  | 'daily_reminder';

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
