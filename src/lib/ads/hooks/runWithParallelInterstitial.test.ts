import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runWithParallelInterstitial } from './runWithParallelInterstitial';
import type { AdService } from '../core/AdService';

describe('runWithParallelInterstitial', () => {
  const maybePreloadInterstitial = vi.fn().mockResolvedValue(undefined);
  const showInterstitial = vi.fn();

  const adService = {
    maybePreloadInterstitial,
    showInterstitial,
  } as unknown as AdService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs operation and ad in parallel and returns success', async () => {
    showInterstitial.mockResolvedValue(true);
    const operation = vi.fn().mockResolvedValue(undefined);

    const result = await runWithParallelInterstitial('interstitial.postBackup', operation, {
      adService,
    });

    expect(result).toEqual({ operationOk: true, adShown: true });
    expect(maybePreloadInterstitial).toHaveBeenCalledWith('interstitial.postBackup', {
    });
    expect(showInterstitial).toHaveBeenCalledWith('interstitial.postBackup', {
    });
    expect(operation).toHaveBeenCalled();
  });

  it('throws when operation fails but still attempts ad', async () => {
    showInterstitial.mockResolvedValue(false);
    const operation = vi.fn().mockRejectedValue(new Error('backup failed'));

    await expect(
      runWithParallelInterstitial('interstitial.postBackup', operation, { adService })
    ).rejects.toThrow('backup failed');
  });

  it('succeeds when ad fails', async () => {
    showInterstitial.mockRejectedValue(new Error('no fill'));
    const operation = vi.fn().mockResolvedValue(undefined);

    const result = await runWithParallelInterstitial('interstitial.postBackup', operation, {
      adService,
    });

    expect(result).toEqual({ operationOk: true, adShown: false });
  });
});
