/** Chandra Darshan ads diagnostics configuration */

import { ALL_PLACEMENT_KEYS, PLACEMENT_CATALOG } from '@/config/placements';
import { DEFAULT_PLACEMENT_FREQ_CAP } from '@/config/ads-remote-config';

export const DEBUG_PLACEMENT_MATRIX = [...ALL_PLACEMENT_KEYS];

export const DEBUG_FREQ_CAP_PLACEMENTS = Object.entries(DEFAULT_PLACEMENT_FREQ_CAP)
  .filter(([, cap]) => cap.perHour > 0 || cap.perDay > 0)
  .map(([key]) => key);

export function formatEngagementLabel(count: number | null, required: number): string {
  if (count === null) return `? / ${required} app sessions`;
  return `${count} / ${required} app sessions`;
}

export function getPlacementLabel(placement: string): string {
  const entry = PLACEMENT_CATALOG.find((p) => p.key === placement);
  return entry?.label ?? placement;
}
