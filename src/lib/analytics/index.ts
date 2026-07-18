import { analyticsService } from '@/lib/analytics/analytics.service';

export { analyticsService } from '@/lib/analytics/analytics.service';
export { crashlyticsService } from '@/lib/analytics/crashlytics.service';
export {
  ANALYTICS_EVENTS,
  birthProfileSavedParams,
  glossaryOpenedParams,
  preferenceChangedParams,
} from '@/lib/analytics/analytics-events';

export function logEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
): void {
  void analyticsService.logEvent(name, params);
}
