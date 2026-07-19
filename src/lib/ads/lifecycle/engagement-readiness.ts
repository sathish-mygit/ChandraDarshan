import type { NewUserPlacementPolicy } from '../core/types';

/** Effective engagement count required before a placement may show ads. */
export function resolveRequiredEngagementCount(
  globalMin: number,
  policy?: NewUserPlacementPolicy
): number {
  if (policy?.showForNewUsers) {
    return Math.max(0, globalMin);
  }

  const placementMin =
    policy?.minWardrobeItems ?? policy?.startAfterSession ?? 0;

  return Math.max(0, globalMin, placementMin);
}

/** @deprecated Use resolveRequiredEngagementCount */
export const resolveRequiredWardrobeItems = resolveRequiredEngagementCount;
