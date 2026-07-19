'use client';

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import type { AdService } from '../core/AdService';

export function useAdSessionAnalytics(adService: AdService): void {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = CapacitorApp.addListener('appStateChange', (state: { isActive: boolean }) => {
      if (!state.isActive) {
        adService.flushSessionAnalytics();
      }
    });

    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [adService]);
}
