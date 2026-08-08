import { describe, expect, it, vi } from 'vitest';
import { Placement } from '@/config/placements';
import { resolveNavInterstitialPlacement } from './placement-resolver';

const enabledPlacements = new Set<string>([
  Placement.INTERSTITIAL_TO_JYOTISH,
  Placement.INTERSTITIAL_TO_MATCH,
  Placement.INTERSTITIAL_TO_HOME,
  Placement.INTERSTITIAL_TO_SETTINGS,
]);

vi.mock('@/lib/ads', () => ({
  adService: {
    isPlacementEnabled: (placement: string) => enabledPlacements.has(placement),
    getRuntimeConfig: () => ({
      fallbackAds: {
        enableWhenJyotishNotVisited: true,
        enableHomePlacement: true,
        enableSettingsPlacement: true,
      },
    }),
  },
}));

vi.mock('@/lib/ads/jyotish-visit-tracker', () => ({
  hasVisitedJyotishThisSession: () => false,
  markJyotishVisited: vi.fn(),
}));

describe('resolveNavInterstitialPlacement', () => {
  it('resolves primary astro and match placements', () => {
    expect(resolveNavInterstitialPlacement('/jyotish/')).toBe(
      Placement.INTERSTITIAL_TO_JYOTISH,
    );
    expect(resolveNavInterstitialPlacement('/match')).toBe(
      Placement.INTERSTITIAL_TO_MATCH,
    );
  });

  it('resolves fallback placements when astro not visited', () => {
    expect(resolveNavInterstitialPlacement('/')).toBe(Placement.INTERSTITIAL_TO_HOME);
    expect(resolveNavInterstitialPlacement('/settings')).toBe(
      Placement.INTERSTITIAL_TO_SETTINGS,
    );
  });
});
