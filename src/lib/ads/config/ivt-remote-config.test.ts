import { describe, it, expect } from 'vitest';
import {
  CORE_IVT_RC_KEY_MAP,
  mergeIvtRemoteConfig,
  parseIvtRemoteValue,
  routeIvtRemoteValue,
} from '@/lib/ads/config/ivt-remote-config';
import { PLACEMENT_FREQ_CAP_ROUTING } from '@/config/ads-remote-config';

describe('parseIvtRemoteValue', () => {
  it('parses ivt.enabled from string', () => {
    expect(parseIvtRemoteValue('true', 'ivt.enabled')).toBe(true);
    expect(parseIvtRemoteValue('false', 'ivt.enabled')).toBe(false);
  });

  it('parses numeric IVT fields', () => {
    expect(parseIvtRemoteValue('5', 'ivt.maxClicksPerSession')).toBe(5);
    expect(parseIvtRemoteValue('120000', 'freqCap.native.feed.perHour')).toBe(120000);
  });
});

describe('routeIvtRemoteValue', () => {
  it('routes ivt fields into target.ivt', () => {
    const target: Record<string, unknown> = {};
    routeIvtRemoteValue(target, 'ivt.maxClicksPerDay', 10);
    expect((target.ivt as Record<string, number>).maxClicksPerDay).toBe(10);
  });

  it('routes freqCap fields into nested placement caps', () => {
    const target: Record<string, unknown> = {};
    routeIvtRemoteValue(target, 'freqCap.native.feed.perHour', 4, PLACEMENT_FREQ_CAP_ROUTING);
    routeIvtRemoteValue(target, 'freqCap.native.feed.perDay', 12, PLACEMENT_FREQ_CAP_ROUTING);
    const freqCap = target.freqCap as Record<string, { perHour: number; perDay: number }>;
    expect(freqCap['native.feed']).toEqual({ perHour: 4, perDay: 12 });
  });
});

describe('mergeIvtRemoteConfig', () => {
  it('merges remote overrides on top of defaults', () => {
    const { ivt, freqCap } = mergeIvtRemoteConfig({
      ivt: { maxClicksPerSession: 2 },
      freqCap: { 'native.feed': { perHour: 3, perDay: 15 } },
    });

    expect(ivt.maxClicksPerSession).toBe(2);
    expect(ivt.maxClicksPerDay).toBe(3);
    expect(freqCap['native.feed'].perHour).toBe(3);
  });
});

describe('CORE_IVT_RC_KEY_MAP', () => {
  it('includes core IVT keys only', () => {
    expect(Object.keys(CORE_IVT_RC_KEY_MAP)).toHaveLength(5);
  });

  it('fans out deprecated postAction freqCap to backup and restore', () => {
    const target: Record<string, unknown> = {};
    routeIvtRemoteValue(
      target,
      'freqCap.interstitial.postAction.perHour',
      1,
      PLACEMENT_FREQ_CAP_ROUTING
    );
    routeIvtRemoteValue(
      target,
      'freqCap.interstitial.postAction.perDay',
      2,
      PLACEMENT_FREQ_CAP_ROUTING
    );
    const freqCap = target.freqCap as Record<string, { perHour: number; perDay: number }>;
    expect(freqCap['interstitial.postBackup']).toEqual({ perHour: 1, perDay: 2 });
    expect(freqCap['interstitial.postRestore']).toEqual({ perHour: 1, perDay: 2 });
  });
});
