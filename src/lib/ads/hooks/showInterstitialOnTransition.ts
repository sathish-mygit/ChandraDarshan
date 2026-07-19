import type { AdService } from '../core/AdService';

/**
 * Fire an interstitial and navigate in parallel (e.g. after save, backup).
 * Ad failures never block navigation.
 * Checks block reason before showing to avoid pointless waits.
 */
export function showInterstitialOnTransition(
  adService: AdService,
  placement: string,
  navigate: () => void
): void {
  void (async () => {
    try {
      await adService.showInterstitial(placement).catch(() => false);
    } catch (err) {
      console.warn(`[AdService] showInterstitialOnTransition error: ${placement}`, err);
    } finally {
      navigate();
    }
  })();
}
