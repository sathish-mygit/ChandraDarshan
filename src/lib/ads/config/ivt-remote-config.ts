import type { FrequencyCapMap, IvtConfig } from '../core/types';
import { DEFAULT_IVT_CONFIG } from './ivt-defaults';

/** Core IVT safeguard keys — not placement-specific */
export const CORE_IVT_RC_KEY_MAP: Record<string, string> = {
  ivt_enabled: 'ivt.enabled',
  ivt_maxClicksPerSession: 'ivt.maxClicksPerSession',
  ivt_maxClicksPerDay: 'ivt.maxClicksPerDay',
  ivt_pauseDurationMs: 'ivt.pauseDurationMs',
  ivt_navigationDelayMs: 'ivt.navigationDelayMs',
};

export type FreqCapRemoteRouting = {
  freqCapPlacementKeys: Record<string, string>;
  deprecatedFreqCapAliases: Record<string, string[]>;
};

export const EMPTY_FREQ_CAP_ROUTING: FreqCapRemoteRouting = {
  freqCapPlacementKeys: {},
  deprecatedFreqCapAliases: {},
};

export function parseIvtRemoteValue(value: string | number | boolean, internalKey: string): string | number | boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value;

  if (internalKey === 'ivt.enabled') {
    return value === 'true' || value === '1' || value === 'yes';
  }

  if (
    internalKey.startsWith('ivt.') ||
    internalKey.startsWith('freqCap.')
  ) {
    const n = parseInt(String(value), 10);
    return Number.isFinite(n) ? n : 0;
  }

  return String(value);
}

export function routeIvtRemoteValue(
  target: Record<string, unknown>,
  internalKey: string,
  parsedValue: string | number | boolean,
  routing: FreqCapRemoteRouting = EMPTY_FREQ_CAP_ROUTING
): void {
  const ivt = (target.ivt ?? {}) as Record<string, unknown>;
  const freqCap = (target.freqCap ?? {}) as FrequencyCapMap;

  if (internalKey.startsWith('ivt.')) {
    const field = internalKey.replace('ivt.', '');
    ivt[field] = parsedValue;
    target.ivt = ivt;
    return;
  }

  if (internalKey.startsWith('freqCap.')) {
    const parts = internalKey.split('.');
    const capField = parts[parts.length - 1] as 'perHour' | 'perDay';
    const prefix = parts.slice(0, -1).join('.');
    const placement = routing.freqCapPlacementKeys[prefix];
    if (!placement) return;

    const applyCap = (placementKey: string) => {
      const existing = freqCap[placementKey] ?? { perHour: 0, perDay: 0 };
      existing[capField] = parsedValue as number;
      freqCap[placementKey] = existing;
    };

    const aliasTargets = routing.deprecatedFreqCapAliases[prefix];
    if (aliasTargets) {
      for (const key of aliasTargets) {
        applyCap(key);
      }
    } else {
      applyCap(placement);
    }
    target.freqCap = freqCap;
  }
}

export function mergeIvtRemoteConfig(
  remote: Record<string, unknown>,
  base: { ivt?: Partial<IvtConfig>; freqCap?: FrequencyCapMap } = {}
): { ivt: IvtConfig; freqCap: FrequencyCapMap } {
  const remoteIvt = (remote.ivt ?? {}) as Partial<IvtConfig>;
  const remoteFreq = (remote.freqCap ?? {}) as FrequencyCapMap;

  const ivt: IvtConfig = {
    ...DEFAULT_IVT_CONFIG,
    ...(base.ivt ?? {}),
    ...remoteIvt,
  };

  const freqCap: FrequencyCapMap = {
    ...(base.freqCap ?? {}),
  };

  for (const [placement, caps] of Object.entries(remoteFreq)) {
    freqCap[placement] = {
      perHour: caps.perHour ?? freqCap[placement]?.perHour ?? 0,
      perDay: caps.perDay ?? freqCap[placement]?.perDay ?? 0,
    };
  }

  return { ivt, freqCap };
}
