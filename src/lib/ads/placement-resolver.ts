import { Placement } from '@/config/placements';
import { adService } from '@/lib/ads';
import {
  hasVisitedJyotishThisSession,
  markJyotishVisited,
} from '@/lib/ads/jyotish-visit-tracker';

function normalizeRoute(route: string): string {
  if (!route || route === '/') return '/';
  return route.endsWith('/') ? route : `${route}/`;
}

export function resolveNavInterstitialPlacement(toRoute: string): string | null {
  const route = normalizeRoute(toRoute);

  if (route === '/jyotish/' || route.startsWith('/jyotish/')) {
    markJyotishVisited();
    return adService.isPlacementEnabled(Placement.INTERSTITIAL_TO_JYOTISH)
      ? Placement.INTERSTITIAL_TO_JYOTISH
      : null;
  }

  const fallbackAds = adService.getRuntimeConfig().fallbackAds ?? {};
  const {
    enableWhenJyotishNotVisited = false,
    enableHomePlacement = false,
    enableSettingsPlacement = false,
  } = fallbackAds;

  if (!enableWhenJyotishNotVisited || hasVisitedJyotishThisSession()) {
    return null;
  }

  if (route === '/' && enableHomePlacement) {
    return adService.isPlacementEnabled(Placement.INTERSTITIAL_TO_HOME)
      ? Placement.INTERSTITIAL_TO_HOME
      : null;
  }

  if (route.startsWith('/settings') && enableSettingsPlacement) {
    return adService.isPlacementEnabled(Placement.INTERSTITIAL_TO_SETTINGS)
      ? Placement.INTERSTITIAL_TO_SETTINGS
      : null;
  }

  return null;
}

export function shouldTriggerNavInterstitial(fromRoute: string, toRoute: string): boolean {
  if (fromRoute === toRoute) return false;
  return resolveNavInterstitialPlacement(toRoute) !== null;
}
