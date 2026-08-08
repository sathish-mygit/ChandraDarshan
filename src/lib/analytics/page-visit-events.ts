import { ANALYTICS_EVENTS } from '@/lib/analytics/analytics-events';
import { normalizeScreenPath } from '@/lib/analytics/route-metadata';

export { normalizeScreenPath };

export function resolvePageVisitedEvent(pathname: string): string | null {
  const path = normalizeScreenPath(pathname);
  if (path === '/') {
    return ANALYTICS_EVENTS.HOME_PAGE_VISITED;
  }
  if (path === '/jyotish') {
    return ANALYTICS_EVENTS.ASTRO_PAGE_VISITED;
  }
  if (path === '/match') {
    return ANALYTICS_EVENTS.MATCH_PAGE_VISITED;
  }
  if (path === '/settings') {
    return ANALYTICS_EVENTS.SETTINGS_PAGE_VISITED;
  }
  return null;
}

export function pageVisitedEventParams(pathname: string): Record<string, string> {
  return { route_path: normalizeScreenPath(pathname) };
}
