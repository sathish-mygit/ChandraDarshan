import { analyticsService } from '@/lib/analytics/analytics.service';
import {
  ANALYTICS_EVENTS,
  birthEditOpenedParams,
  gpsLocationUsedParams,
  insightExpandedParams,
  learnArticleViewedParams,
  learnSearchUsedParams,
  matchViewedParams,
  navTappedParams,
  type BirthEditVariant,
  type GpsLocationResult,
  type NavDestination,
} from '@/lib/analytics/analytics-events';

function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
): void {
  void analyticsService.logEvent(name, params);
}

export function trackNavTapped(destination: NavDestination): void {
  trackEvent(ANALYTICS_EVENTS.NAV_TAPPED, navTappedParams(destination));
}

export function trackPanchangRefreshed(): void {
  trackEvent(ANALYTICS_EVENTS.PANCHANG_REFRESHED, {});
}

export function trackInsightExpanded(insightKey: string, expanded: boolean): void {
  trackEvent(ANALYTICS_EVENTS.INSIGHT_EXPANDED, insightExpandedParams(insightKey, expanded));
}

export function trackMatchViewed(params: {
  qualityBand: string;
  hasNadiDosha: boolean;
  hasBhakootDosha: boolean;
  synastryUnlocked: boolean;
}): void {
  trackEvent(ANALYTICS_EVENTS.MATCH_VIEWED, matchViewedParams(params));
}

export function trackBirthEditOpened(variant: BirthEditVariant): void {
  trackEvent(ANALYTICS_EVENTS.BIRTH_EDIT_OPENED, birthEditOpenedParams(variant));
}

export function trackLearnSearchUsed(queryLength: number): void {
  if (queryLength <= 0) {
    return;
  }
  trackEvent(ANALYTICS_EVENTS.LEARN_SEARCH_USED, learnSearchUsedParams(queryLength));
}

export function trackLearnArticleViewed(articleId: string): void {
  trackEvent(ANALYTICS_EVENTS.LEARN_ARTICLE_VIEWED, learnArticleViewedParams(articleId));
}

export function trackGpsLocationUsed(result: GpsLocationResult): void {
  trackEvent(ANALYTICS_EVENTS.GPS_LOCATION_USED, gpsLocationUsedParams(result));
}
