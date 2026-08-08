/**
 * Chandra Darshan placement catalog — native Android only.
 */
import type { AdFormat } from '@/lib/ads/core/types';

export const Placement = {
  ADS_MASTER: 'ads.master',
  INTERSTITIAL_TO_JYOTISH: 'interstitial.toJyotish',
  INTERSTITIAL_TO_MATCH: 'interstitial.toMatch',
  INTERSTITIAL_TO_HOME: 'interstitial.toHome',
  INTERSTITIAL_TO_SETTINGS: 'interstitial.toSettings',
} as const;

export type PlacementKey = (typeof Placement)[keyof typeof Placement];

export type PlacementCatalogEntry = {
  key: PlacementKey | string;
  label: string;
  description: string;
  format: AdFormat | 'master';
  group: 'master' | 'interstitial';
  defaultEnabled: boolean;
};

export const DEPRECATED_RC_ALIASES: Record<string, string[]> = {};

export const DEPRECATED_FIREBASE_RC_ALIASES: Record<string, string[]> = {};

export const PLACEMENT_CATALOG: PlacementCatalogEntry[] = [
  {
    key: Placement.ADS_MASTER,
    label: 'Enable Ads',
    description: 'Master switch to enable/disable all native ads',
    format: 'master',
    group: 'master',
    defaultEnabled: true,
  },
  {
    key: Placement.INTERSTITIAL_TO_JYOTISH,
    label: 'Astro Navigation Interstitial',
    description: 'Full-screen interstitial when navigating to Astro tab',
    format: 'interstitial',
    group: 'interstitial',
    defaultEnabled: true,
  },
  {
    key: Placement.INTERSTITIAL_TO_MATCH,
    label: 'Match Navigation Interstitial',
    description: 'Full-screen interstitial when navigating to Match tab',
    format: 'interstitial',
    group: 'interstitial',
    defaultEnabled: true,
  },
  {
    key: Placement.INTERSTITIAL_TO_HOME,
    label: 'Home Navigation (fallback)',
    description: 'Interstitial on Home when Astro not visited this session',
    format: 'interstitial',
    group: 'interstitial',
    defaultEnabled: false,
  },
  {
    key: Placement.INTERSTITIAL_TO_SETTINGS,
    label: 'Settings Navigation (fallback)',
    description: 'Interstitial on Settings when Astro not visited this session',
    format: 'interstitial',
    group: 'interstitial',
    defaultEnabled: false,
  },
];

export const ALL_PLACEMENT_KEYS = PLACEMENT_CATALOG.map((p) => p.key);

export function applyDeprecatedPlacementAliases(
  settings: Record<string, boolean>,
  remoteOnly: Record<string, boolean> = settings,
): Record<string, boolean> {
  const result = { ...settings };

  for (const [deprecatedKey, targetKeys] of Object.entries(DEPRECATED_RC_ALIASES)) {
    const deprecatedValue = result[deprecatedKey];
    if (deprecatedValue === undefined) continue;

    for (const targetKey of targetKeys) {
      if (remoteOnly[targetKey] === undefined) {
        result[targetKey] = deprecatedValue;
      }
    }
    delete result[deprecatedKey];
  }

  return result;
}
