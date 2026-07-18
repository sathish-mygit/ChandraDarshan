/** Route metadata for analytics screen_view events. */

export function getPageTitle(pathname: string): string {
  return pathname.split('?')[0].split('#')[0];
}

export function getRouteSegment(pathname: string): string {
  const cleanPath = pathname.replace(/^\/|\/$/g, '').split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  return segments[0] || '';
}

export function getRouteMetadata(pathname: string) {
  return {
    page_title: getPageTitle(pathname),
    route_segment: getRouteSegment(pathname),
  };
}
