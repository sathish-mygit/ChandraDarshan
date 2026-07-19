export type AdUnitSource = 'google_sample' | 'production';

export type ResolveAdUnitModeInput = {
  useProductionAdUnits: boolean;
  runtimeOverride?: boolean | null;
  testingDeviceCount?: number;
};

export type ResolvedAdUnitMode = {
  effectiveUseProductionAdUnits: boolean;
  useGoogleSampleUnits: boolean;
  markSdkTestRequests: boolean;
  source: AdUnitSource;
};

/**
 * Resolves which ad unit IDs to load and whether SDK requests are marked as test.
 *
 * - Google sample units: always mark SDK test requests.
 * - Production units: mark test only when test devices are registered.
 */
export function resolveAdUnitMode({
  useProductionAdUnits,
  runtimeOverride = null,
  testingDeviceCount = 0,
}: ResolveAdUnitModeInput): ResolvedAdUnitMode {
  const effectiveUseProductionAdUnits = runtimeOverride ?? useProductionAdUnits;
  const useGoogleSampleUnits = !effectiveUseProductionAdUnits;
  const markSdkTestRequests = useGoogleSampleUnits || testingDeviceCount > 0;

  return {
    effectiveUseProductionAdUnits,
    useGoogleSampleUnits,
    markSdkTestRequests,
    source: useGoogleSampleUnits ? 'google_sample' : 'production',
  };
}

export function maskTestDeviceId(id: string): string {
  if (id.length <= 8) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}
