export const ANALYTICS_EVENTS = {
  PREFERENCE_CHANGED: 'preference_changed',
  BIRTH_PROFILE_SAVED: 'birth_profile_saved',
  BIRTH_PROFILE_CLEARED: 'birth_profile_cleared',
  PARTNER_PROFILE_SAVED: 'partner_profile_saved',
  PARTNER_PROFILE_CLEARED: 'partner_profile_cleared',
  GLOSSARY_OPENED: 'glossary_opened',
  PAGE_DURATION: 'page_duration',
  HOME_PAGE_VISITED: 'home_page_visited',
  ASTRO_PAGE_VISITED: 'astro_page_visited',
  MATCH_PAGE_VISITED: 'match_page_visited',
  SETTINGS_PAGE_VISITED: 'settings_page_visited',
  NAV_TAPPED: 'nav_tapped',
  PANCHANG_REFRESHED: 'panchang_refreshed',
  INSIGHT_EXPANDED: 'insight_expanded',
  MATCH_VIEWED: 'match_viewed',
  BIRTH_EDIT_OPENED: 'birth_edit_opened',
  LEARN_SEARCH_USED: 'learn_search_used',
  LEARN_ARTICLE_VIEWED: 'learn_article_viewed',
  GPS_LOCATION_USED: 'gps_location_used',
} as const;

export type PreferenceSetting =
  | 'language'
  | 'masa_system'
  | 'location'
  | 'daily_reminder';

export type NavDestination = 'home' | 'astro' | 'match' | 'settings';
export type BirthEditVariant = 'self' | 'partner';
export type GpsLocationResult = 'success' | 'denied' | 'error';

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

export function navTappedParams(destination: NavDestination): Record<string, string> {
  return { destination };
}

export function insightExpandedParams(
  insightKey: string,
  expanded: boolean,
): Record<string, string> {
  return {
    insight_key: insightKey,
    expanded: expanded ? 'true' : 'false',
  };
}

export function matchViewedParams(params: {
  qualityBand: string;
  hasNadiDosha: boolean;
  hasBhakootDosha: boolean;
  synastryUnlocked: boolean;
}): Record<string, string> {
  return {
    quality_band: params.qualityBand,
    has_nadi_dosha: params.hasNadiDosha ? 'true' : 'false',
    has_bhakoot_dosha: params.hasBhakootDosha ? 'true' : 'false',
    synastry_unlocked: params.synastryUnlocked ? 'true' : 'false',
  };
}

export function birthEditOpenedParams(variant: BirthEditVariant): Record<string, string> {
  return { variant };
}

export function learnSearchUsedParams(queryLength: number): Record<string, number> {
  return { query_length: queryLength };
}

export function learnArticleViewedParams(articleId: string): Record<string, string> {
  return { article_id: articleId };
}

export function gpsLocationUsedParams(result: GpsLocationResult): Record<string, string> {
  return { result };
}
