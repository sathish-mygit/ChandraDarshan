/**
 * Engagement gate for native ads — minimum app sessions before ads unlock.
 */
import { Preferences } from '@capacitor/preferences';
import { Placement } from '@/config/placements';

export const DEFAULT_ENGAGEMENT = {
  minWardrobeItems: 2,
  gatesDisabled: false,
} as const;

const SESSION_COUNT_KEY = 'analytics.appSessionCount';

let cachedCount: number | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 30_000;

async function readSessionCount(): Promise<number> {
  try {
    const { value } = await Preferences.get({ key: SESSION_COUNT_KEY });
    if (!value) return 0;
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

export async function getAppSessionCount(): Promise<number> {
  const now = Date.now();
  if (cachedCount !== null && now - cachedAt < CACHE_TTL_MS) {
    return cachedCount;
  }

  cachedCount = await readSessionCount();
  cachedAt = now;
  return cachedCount;
}

export async function incrementAppSessionCount(): Promise<number> {
  const current = await readSessionCount();
  const next = current + 1;
  try {
    await Preferences.set({ key: SESSION_COUNT_KEY, value: String(next) });
  } catch (err) {
    console.warn('[ads-engagement] incrementAppSessionCount failed', err);
  }
  cachedCount = next;
  cachedAt = Date.now();
  return next;
}

export const DEBUG_FREQ_CAP_PLACEMENTS = [
  Placement.INTERSTITIAL_TO_JYOTISH,
  Placement.INTERSTITIAL_TO_HOME,
  Placement.INTERSTITIAL_TO_SETTINGS,
] as const;

export const DEBUG_BLOCK_CHECK_PLACEMENTS = [
  Placement.INTERSTITIAL_TO_JYOTISH,
  Placement.INTERSTITIAL_TO_HOME,
  Placement.INTERSTITIAL_TO_SETTINGS,
] as const;
