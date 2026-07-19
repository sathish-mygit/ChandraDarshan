'use client';

import { useCallback, useEffect, useState } from 'react';
import { adService } from '../core/AdService';
import type { AdRequestParams, NativeAd } from '../core/types';

export function useAdService() {
  return adService;
}

export function useNativeAd(params: AdRequestParams) {
  const [ad, setAd] = useState<NativeAd | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await adService.getInitReady();
      const loaded = await adService.loadNativeAd(params);
      setAd(loaded);
      if (!loaded) setError('no_fill');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'load_failed');
      setAd(null);
    } finally {
      setLoading(false);
    }
  }, [params.placement, params.size, params.timeout]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial native ad load
    void reload();
  }, [reload]);

  return { ad, loading, error, reload };
}
