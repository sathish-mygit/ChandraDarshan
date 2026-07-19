import { ANALYTICS_EVENTS } from '@/lib/analytics/analytics-events';

export function resolvePageVisitedEvent(pathname: string): string | null {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/') {
    return ANALYTICS_EVENTS.HOME_PAGE_VISITED;
  }
  if (path.startsWith('/jyotish')) {
    return ANALYTICS_EVENTS.ASTRO_PAGE_VISITED;
  }
  if (path.startsWith('/settings')) {
    return ANALYTICS_EVENTS.SETTINGS_PAGE_VISITED;
  }
  return null;
}

export function pageVisitedEventParams(pathname: string): Record<string, string> {
  return { route_path: pathname };
}
