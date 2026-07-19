/** Coerce interstitial limit values from RC / overrides (guards against boolean misparsing). */
export function normalizeInterstitialLimit(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}
