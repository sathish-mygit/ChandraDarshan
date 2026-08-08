/** Route metadata for analytics screen_view events. */

const JYOTISH_TAB_TITLES: Record<string, string> = {
  today: 'Today',
  chart: 'Chart',
  timeline: 'Timeline',
  learn: 'Learn',
  onboarding: 'Setup',
};

export function normalizeScreenPath(pathname: string): string {
  const clean = pathname.split('?')[0].split('#')[0];
  if (!clean || clean === '/') {
    return '/';
  }
  return clean.replace(/\/+$/, '');
}

export function getRouteSegment(pathname: string): string {
  const path = normalizeScreenPath(pathname);
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);
  const first = segments[0] || '';
  if (first === 'jyotish') {
    return 'astro';
  }
  if (first === 'match') {
    return 'match';
  }
  if (!first) {
    return 'home';
  }
  return first;
}

export function getScreenTitle(pathname: string): string {
  const path = normalizeScreenPath(pathname);
  if (path === '/') {
    return 'Today';
  }
  if (path === '/match') {
    return 'Match';
  }
  if (path === '/settings') {
    return 'Settings';
  }
  if (path === '/jyotish') {
    return 'Astro';
  }
  if (path.startsWith('/jyotish/')) {
    const tab = path.replace('/jyotish/', '');
    const tabTitle = JYOTISH_TAB_TITLES[tab] ?? tab;
    return `Astro: ${tabTitle}`;
  }
  return path;
}

/** Returns null when screen tracking is delegated (e.g. Jyotish sub-tabs). */
export function resolveTopLevelScreen(pathname: string): string | null {
  const path = normalizeScreenPath(pathname);
  if (path === '/jyotish' || path.startsWith('/jyotish/')) {
    return null;
  }
  return path;
}

export function getRouteMetadata(pathname: string) {
  const screenPath = normalizeScreenPath(pathname);
  return {
    screen_path: screenPath,
    screen_title: getScreenTitle(screenPath),
    route_segment: getRouteSegment(screenPath),
  };
}
