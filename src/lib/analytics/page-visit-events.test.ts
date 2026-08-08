import { describe, expect, it } from 'vitest';
import { ANALYTICS_EVENTS } from './analytics-events';
import {
  pageVisitedEventParams,
  resolvePageVisitedEvent,
} from './page-visit-events';

describe('resolvePageVisitedEvent', () => {
  it('resolves top-level routes only', () => {
    expect(resolvePageVisitedEvent('/')).toBe(ANALYTICS_EVENTS.HOME_PAGE_VISITED);
    expect(resolvePageVisitedEvent('/jyotish/')).toBe(
      ANALYTICS_EVENTS.ASTRO_PAGE_VISITED,
    );
    expect(resolvePageVisitedEvent('/match')).toBe(
      ANALYTICS_EVENTS.MATCH_PAGE_VISITED,
    );
    expect(resolvePageVisitedEvent('/settings/')).toBe(
      ANALYTICS_EVENTS.SETTINGS_PAGE_VISITED,
    );
  });

  it('skips virtual jyotish sub-screens', () => {
    expect(resolvePageVisitedEvent('/jyotish/today')).toBeNull();
    expect(resolvePageVisitedEvent('/jyotish/chart')).toBeNull();
  });
});

describe('pageVisitedEventParams', () => {
  it('normalizes route_path', () => {
    expect(pageVisitedEventParams('/match/')).toEqual({ route_path: '/match' });
  });
});
