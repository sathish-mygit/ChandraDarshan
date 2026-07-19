'use client';

import { useEffect, useRef } from 'react';
import type { AdService } from '../core/AdService';

export type NavigationInterstitialOptions = {
  adService: AdService;
  pathname: string;
  /** App-provided resolver: destination route → placement key (or null to skip) */
  resolvePlacement?: (toRoute: string) => string | null;
  /** sessionStorage key for one-time preload per placement */
  preloadSessionKey?: (placement: string) => string;
  delayMs?: number;
  shouldTrigger?: (fromRoute: string, toRoute: string) => boolean;
};

const defaultPreloadSessionKey = (placement: string) => `ads:preload:${placement}`;

export function useNavigationInterstitial({
  adService,
  pathname,
  resolvePlacement,
  preloadSessionKey = defaultPreloadSessionKey,
  delayMs,
  shouldTrigger,
}: NavigationInterstitialOptions): void {
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    adService.setCurrentRoute(pathname);

    const prev = prevPathRef.current;
    if (!prev) {
      prevPathRef.current = pathname;
      return;
    }

    if (prev === pathname) return;

    const fromRoute = prev;
    const toRoute = pathname;
    prevPathRef.current = pathname;

    if (shouldTrigger && !shouldTrigger(fromRoute, toRoute)) {
      return;
    }

    if (!resolvePlacement) return;

    const placement = resolvePlacement(toRoute);
    adService.recordNavigationEval(fromRoute, toRoute, placement);
    if (!placement) return;

    try {
      const preloadKey = preloadSessionKey(placement);
      if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(preloadKey)) {
        sessionStorage.setItem(preloadKey, '1');
        void adService.maybePreloadInterstitial(placement);
      }
    } catch {
      // ignore
    }

    const waitMs = delayMs ?? adService.getIvtConfig().navigationDelayMs;

    const timer = setTimeout(() => {
      void (async () => {
        try {
          await adService.getInitReady();
          adService.recordNavigationDelay(placement, waitMs, fromRoute, toRoute);
          await adService.showInterstitial(placement);
        } catch (err) {
          console.warn(`[AdService] nav interstitial error: ${placement}`, err);
        }
      })();
    }, waitMs);

    return () => clearTimeout(timer);
  }, [adService, pathname, resolvePlacement, preloadSessionKey, delayMs, shouldTrigger]);
}
