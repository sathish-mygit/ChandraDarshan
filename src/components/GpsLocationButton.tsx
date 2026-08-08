'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { trackGpsLocationUsed } from '@/lib/analytics';
import { t } from '@/lib/i18n/labels';
import { LocationError, resolveGpsLocation } from '@/lib/location';
import type { AppLanguage, StoredLocation } from '@/lib/types';
import { cn } from '@/lib/utils';

type GpsLocationButtonProps = {
  language: AppLanguage;
  onSuccess: (location: StoredLocation) => void;
  onError?: (message: string) => void;
};

export function GpsLocationButton({
  language,
  onSuccess,
  onError,
}: GpsLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      const location = await resolveGpsLocation();
      trackGpsLocationUsed('success');
      onSuccess(location);
    } catch (error) {
      if (error instanceof LocationError && error.message === 'Location permission denied') {
        trackGpsLocationUsed('denied');
      } else {
        trackGpsLocationUsed('error');
      }
      const message =
        error instanceof LocationError
          ? error.message
          : 'Could not get current location';
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isLoading}
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2.5 text-sm text-amber-100 transition hover:border-amber-400/40 disabled:opacity-60',
      )}
    >
      <MapPin className="h-4 w-4" />
      {isLoading ? t('gpsLoading', language) : t('useGps', language)}
    </button>
  );
}
