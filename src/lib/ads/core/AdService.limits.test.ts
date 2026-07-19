import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdService } from './AdService';
import adsConfig from '@/config/ads';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => false },
}));

describe('AdService engagement gate', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    });
    vi.stubGlobal('sessionStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    });
    const service = AdService.getInstance() as AdService & {
      inited: boolean;
      cachedEngagementCount: number | null;
      engagementCountFetchedAt: number;
    };
    service.inited = false;
    service.cachedEngagementCount = null;
    service.engagementCountFetchedAt = 0;
  });

  it('blocks ads when wardrobe count is below placement minimum', async () => {
    const service = AdService.getInstance();
    await service.initialize({
      config: {
        ...adsConfig,
        engagement: { minWardrobeItems: 0 },
        settings: { ...adsConfig.settings, 'interstitial.toPlanner': true },
      },
      getEngagementItemCount: async () => 2,
    });

    const reason = await service.getInterstitialBlockReason('interstitial.toPlanner');
    expect(reason).toContain('Engagement gate');
    expect(reason).toContain('8');
  });

  it('blocks ads when wardrobe count is below global minimum', async () => {
    const service = AdService.getInstance();
    await service.initialize({
      config: {
        ...adsConfig,
        engagement: { minWardrobeItems: 5 },
      },
      getEngagementItemCount: async () => 2,
    });

    const reason = await service.getInterstitialBlockReason('interstitial.postItemSave');
    expect(reason).toContain('Engagement gate');
    expect(reason).toContain('5');
  });

  it('allows ads when wardrobe count meets placement minimum', async () => {
    const service = AdService.getInstance();
    await service.initialize({
      config: {
        ...adsConfig,
        engagement: { minWardrobeItems: 3 },
      },
      getEngagementItemCount: async () => 10,
    });

    const reason = await service.getInterstitialBlockReason('interstitial.postItemSave');
    expect(reason).toBeNull();
  });
});

describe('AdService debug limit overrides', () => {
  beforeEach(() => {
    const sessionStore: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    });
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => sessionStore[k] ?? null,
      setItem: (k: string, v: string) => {
        sessionStore[k] = v;
      },
      removeItem: (k: string) => {
        delete sessionStore[k];
      },
    });
    const service = AdService.getInstance() as AdService & {
      inited: boolean;
      cachedEngagementCount: number | null;
      engagementCountFetchedAt: number;
    };
    service.inited = false;
    service.cachedEngagementCount = null;
    service.engagementCountFetchedAt = 0;
  });

  it('applies session override for interstitial max per session', async () => {
    const service = AdService.getInstance();
    await service.initialize({
      config: adsConfig,
      getEngagementItemCount: async () => 100,
    });

    service.setDebugLimitOverrides({ interstitial: { maxPerSession: 99 } });
    const snapshot = await service.getAdsLimitsSnapshot();
    expect(snapshot.interstitial.maxPerSession).toBe(99);
    expect(snapshot.debugOverridesActive).toBe(true);
  });

  it('respects setEnabled toggle for nav placement block reason', async () => {
    const service = AdService.getInstance();
    await service.initialize({
      config: {
        ...adsConfig,
        settings: { ...adsConfig.settings, 'interstitial.toPlanner': false },
      },
      getEngagementItemCount: async () => 100,
    });

    expect(await service.getInterstitialBlockReason('interstitial.toPlanner')).toContain('disabled');

    service.setEnabled('interstitial.toPlanner', true);
    expect(await service.getInterstitialBlockReason('interstitial.toPlanner')).toBeNull();
  });

  it('coerces boolean maxPerSession from bad RC parse to default limit', async () => {
    const service = AdService.getInstance() as AdService & {
      inited: boolean;
      interstitialCount: number;
    };
    service.inited = false;
    service.interstitialCount = 0;

    await service.initialize({
      config: {
        ...adsConfig,
        settings: { ...adsConfig.settings, 'interstitial.toPlanner': true },
        interstitial: { minIntervalMs: 300000, maxPerSession: false as unknown as number },
      },
      getEngagementItemCount: async () => 100,
    });

    service.interstitialCount = 0;
    expect(await service.getInterstitialBlockReason('interstitial.toPlanner')).toBeNull();
  });
});
