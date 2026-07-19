import type { AdService, ShowAdOptions } from '../core/AdService';

export type ParallelInterstitialResult = {
  operationOk: boolean;
  adShown: boolean;
};

export type ParallelInterstitialOptions = ShowAdOptions & {
  adService: AdService;
};

/**
 * Runs an async operation in parallel with an interstitial (e.g. backup/restore wait time).
 * Ad failures never block the operation result.
 */
export async function runWithParallelInterstitial(
  placement: string,
  operation: () => Promise<void>,
  { adService, ...showOptions }: ParallelInterstitialOptions
): Promise<ParallelInterstitialResult> {
  await adService.maybePreloadInterstitial(placement, showOptions);

  const opPromise = operation();
  const adPromise = adService
    .showInterstitial(placement, showOptions)
    .catch(() => false);

  const results = await Promise.allSettled([opPromise, adPromise]);

  if (results[0].status === 'rejected') {
    throw results[0].reason;
  }

  return {
    operationOk: true,
    adShown: results[1].status === 'fulfilled' && results[1].value === true,
  };
}
