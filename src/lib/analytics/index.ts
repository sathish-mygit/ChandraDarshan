import { analyticsService } from '@/lib/analytics/analytics.service';

export { analyticsService } from '@/lib/analytics/analytics.service';
export { crashlyticsService } from '@/lib/analytics/crashlytics.service';
export {
  ANALYTICS_EVENTS,
  birthProfileSavedParams,
  glossaryOpenedParams,
  preferenceChangedParams,
} from '@/lib/analytics/analytics-events';
export {
  trackBirthEditOpened,
  trackGpsLocationUsed,
  trackInsightExpanded,
  trackLearnArticleViewed,
  trackLearnSearchUsed,
  trackMatchViewed,
  trackNavTapped,
  trackPanchangRefreshed,
} from '@/lib/analytics/app-analytics';
export {
  getRouteMetadata,
  getRouteSegment,
  getScreenTitle,
  normalizeScreenPath,
  resolveTopLevelScreen,
} from '@/lib/analytics/route-metadata';

export function logEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
): void {
  void analyticsService.logEvent(name, params);
}
