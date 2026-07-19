'use client';

import { usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { isAdsEnabled } from '@/config/ads';
import { adService, useNavigationInterstitial } from '@/lib/ads';
import {
  resolveNavInterstitialPlacement,
  shouldTriggerNavInterstitial,
} from '@/lib/ads/placement-resolver';

export function AdNavigationBridge() {
  const pathname = usePathname();

  useNavigationInterstitial({
    adService,
    pathname,
    resolvePlacement: resolveNavInterstitialPlacement,
    shouldTrigger: (from, to) =>
      Capacitor.isNativePlatform() &&
      isAdsEnabled() &&
      shouldTriggerNavInterstitial(from, to),
  });

  return null;
}
