import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdService } from './AdService';
import adsConfig from '@/config/ads';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => false },
}));

describe('AdService maybePreloadInterstitial', () => {
  it('skips preload when placement is disabled', async () => {
    const service = AdService.getInstance();
    const preloadSpy = vi.spyOn(service, 'preloadInterstitial').mockResolvedValue();

    const preloaded = await service.maybePreloadInterstitial('interstitial.toHome');

    expect(preloaded).toBe(false);
    expect(preloadSpy).not.toHaveBeenCalled();
    preloadSpy.mockRestore();
  });
});
