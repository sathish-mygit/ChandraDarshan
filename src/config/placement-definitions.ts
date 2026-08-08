import {
  PlacementStrategy,
  NetworkType,
  type PlacementDefinition,
} from '@/lib/ads/core/types';
import { Placement } from './placements';

function interstitialDef(
  perHour: number,
  perDay: number,
  minWardrobeItems: number,
): PlacementDefinition {
  return {
    format: 'interstitial',
    position: 'fullscreen',
    refreshIntervalSec: 0,
    frequencyCap: { perHour, perDay },
    priority: 1,
    networkConfig: {
      strategy: PlacementStrategy.MEDIATION,
      mediationProvider: NetworkType.ADMOB,
    },
    newUserPolicy: {
      showForNewUsers: false,
      minWardrobeItems,
    },
  };
}

export const DEFAULT_PLACEMENT_DEFINITIONS: Record<string, PlacementDefinition> = {
  [Placement.INTERSTITIAL_TO_JYOTISH]: interstitialDef(1, 3, 2),
  [Placement.INTERSTITIAL_TO_MATCH]: interstitialDef(1, 3, 2),
  [Placement.INTERSTITIAL_TO_HOME]: interstitialDef(1, 2, 3),
  [Placement.INTERSTITIAL_TO_SETTINGS]: interstitialDef(1, 2, 3),
};
