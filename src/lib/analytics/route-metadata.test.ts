import { describe, expect, it } from 'vitest';
import {
  getRouteMetadata,
  getRouteSegment,
  getScreenTitle,
  normalizeScreenPath,
  resolveTopLevelScreen,
} from './route-metadata';

describe('normalizeScreenPath', () => {
  it('normalizes root and trailing slashes', () => {
    expect(normalizeScreenPath('/')).toBe('/');
    expect(normalizeScreenPath('/jyotish/')).toBe('/jyotish');
    expect(normalizeScreenPath('/jyotish/today/')).toBe('/jyotish/today');
  });

  it('strips query and hash', () => {
    expect(normalizeScreenPath('/match?tab=1#score')).toBe('/match');
  });
});

describe('getRouteSegment', () => {
  it('maps known routes to segments', () => {
    expect(getRouteSegment('/')).toBe('home');
    expect(getRouteSegment('/jyotish/today')).toBe('astro');
    expect(getRouteSegment('/match')).toBe('match');
    expect(getRouteSegment('/settings')).toBe('settings');
  });
});

describe('getScreenTitle', () => {
  it('returns readable titles', () => {
    expect(getScreenTitle('/')).toBe('Today');
    expect(getScreenTitle('/match')).toBe('Match');
    expect(getScreenTitle('/jyotish/today')).toBe('Astro: Today');
    expect(getScreenTitle('/jyotish/chart')).toBe('Astro: Chart');
  });
});

describe('resolveTopLevelScreen', () => {
  it('delegates jyotish routes to JyotishClient', () => {
    expect(resolveTopLevelScreen('/jyotish/')).toBeNull();
    expect(resolveTopLevelScreen('/jyotish/today')).toBeNull();
  });

  it('tracks other top-level routes', () => {
    expect(resolveTopLevelScreen('/')).toBe('/');
    expect(resolveTopLevelScreen('/match/')).toBe('/match');
    expect(resolveTopLevelScreen('/settings')).toBe('/settings');
  });
});

describe('getRouteMetadata', () => {
  it('returns normalized metadata', () => {
    expect(getRouteMetadata('/jyotish/')).toEqual({
      screen_path: '/jyotish',
      screen_title: 'Astro',
      route_segment: 'astro',
    });
  });
});
