import { describe, it, expect } from 'vitest';
import { mergeConfigWithDefaults, parseRemoteConfigValue } from '@/lib/remote-config-ads';
import { FIREBASE_RC_KEY_MAP } from '@/config/ads-remote-config';
import adsConfig from '@/config/ads';

describe('mergeConfigWithDefaults', () => {
  it('merges placement toggles from remote config', () => {
    const merged = mergeConfigWithDefaults({
      settings: { 'banner.home': false },
    });
    expect(merged.settings['banner.home']).toBe(false);
    expect(merged.settings['ads.master']).toBe(true);
    expect(merged.settings['interstitial.toJyotish']).toBe(true);
    expect(merged.settings['interstitial.toMatch']).toBe(true);
  });

  it('remote config overrides defaults to disable placements', () => {
    const merged = mergeConfigWithDefaults({
      settings: {
        'ads.master': false,
        'interstitial.toJyotish': false,
        'interstitial.toMatch': false,
      },
    });
    expect(merged.settings['ads.master']).toBe(false);
    expect(merged.settings['interstitial.toJyotish']).toBe(false);
    expect(merged.settings['interstitial.toMatch']).toBe(false);
  });

  it('routes interstitial limits into interstitial object', () => {
    const merged = mergeConfigWithDefaults({
      interstitial: { minIntervalMs: 120000, maxPerSession: 5 },
    });
    expect(merged.interstitial.minIntervalMs).toBe(120000);
    expect(merged.interstitial.maxPerSession).toBe(5);
  });

  it('parses interstitial.maxPerSession from RC string as integer (not boolean)', () => {
    expect(parseRemoteConfigValue('2', 'interstitial.maxPerSession')).toBe(2);
    expect(parseRemoteConfigValue('2', 'interstitial.maxPerSession')).not.toBe(false);
  });

  it('parses interstitial.minIntervalMs from RC string as integer', () => {
    expect(parseRemoteConfigValue('300000', 'interstitial.minIntervalMs')).toBe(300000);
  });

  it('does not override testMode from remote', () => {
    const merged = mergeConfigWithDefaults({ testMode: false } as never);
    expect(merged.testMode).toBe(adsConfig.testMode);
  });

  it('does not override useProductionAdUnits from remote', () => {
    const merged = mergeConfigWithDefaults({ useProductionAdUnits: true } as never);
    expect(merged.useProductionAdUnits).toBe(adsConfig.useProductionAdUnits);
  });

  it('merges newUserGrace from remote', () => {
    const merged = mergeConfigWithDefaults({
      newUserGrace: { maxSessions: 10 },
    });
    expect(merged.newUserGrace?.maxSessions).toBe(10);
    expect(merged.newUserGrace?.enabled).toBe(false);
  });

  it('merges mediationProvider from remote', () => {
    const merged = mergeConfigWithDefaults({ mediationProvider: 'admob' });
    expect(merged.mediationProvider).toBe('admob');
  });

  it('merges IVT config from remote', () => {
    const merged = mergeConfigWithDefaults({
      ivt: { maxClicksPerSession: 2, navigationDelayMs: 500 },
    });
    expect(merged.ivt?.maxClicksPerSession).toBe(2);
    expect(merged.ivt?.navigationDelayMs).toBe(500);
    expect(merged.ivt?.maxClicksPerDay).toBe(3);
  });

  it('merges frequency caps from remote', () => {
    const merged = mergeConfigWithDefaults({
      freqCap: { 'native.feed': { perHour: 4, perDay: 12 } },
    });
    expect(merged.freqCap?.['native.feed']).toEqual({ perHour: 4, perDay: 12 });
  });

  it('fans out deprecated interstitial.postAction to backup and restore', () => {
    const merged = mergeConfigWithDefaults({
      settings: { 'interstitial.postAction': true },
    });
    expect(merged.settings['interstitial.postBackup']).toBe(true);
    expect(merged.settings['interstitial.postRestore']).toBe(true);
    expect(merged.settings['interstitial.postAction']).toBeUndefined();
  });

  it('fans out deprecated interstitial.postSave to item and outfit saves', () => {
    const merged = mergeConfigWithDefaults({
      settings: { 'interstitial.postSave': false },
    });
    expect(merged.settings['interstitial.postItemSave']).toBe(false);
    expect(merged.settings['interstitial.postOutfitSave']).toBe(false);
  });

  it('merges engagement.minWardrobeItems from remote', () => {
    const merged = mergeConfigWithDefaults({
      engagement: { minWardrobeItems: 5 },
    });
    expect(merged.engagement?.minWardrobeItems).toBe(5);
  });
});

describe('FIREBASE_RC_KEY_MAP', () => {
  it('maps Firebase underscore keys to app dot notation', () => {
    expect(FIREBASE_RC_KEY_MAP.ads_master).toBe('ads.master');
    expect(FIREBASE_RC_KEY_MAP.banner_home).toBe('banner.home');
    expect(FIREBASE_RC_KEY_MAP.adUnitId_banner).toBe('adUnitId.banner');
    expect(FIREBASE_RC_KEY_MAP.newUserGrace_maxSessions).toBe('newUserGrace.maxSessions');
  });

  it('includes all Firebase RC parameters including IVT keys', () => {
    expect(Object.keys(FIREBASE_RC_KEY_MAP).length).toBeGreaterThanOrEqual(48);
    expect(FIREBASE_RC_KEY_MAP.interstitial_postBackup).toBe('interstitial.postBackup');
    expect(FIREBASE_RC_KEY_MAP.ivt_enabled).toBe('ivt.enabled');
    expect(FIREBASE_RC_KEY_MAP.freqCap_native_feed_perHour).toBe('freqCap.native.feed.perHour');
  });
});

describe('resolveEnabledNetworks', () => {
  it('returns mock on web', async () => {
    const { resolveEnabledNetworks } = await import('./core/AdService');
    const networks = resolveEnabledNetworks({ mediationProvider: 'admob' }, false);
    expect(networks).toEqual(['mock']);
  });

  it('returns admob on native when mediationProvider is admob', async () => {
    const { resolveEnabledNetworks } = await import('./core/AdService');
    const networks = resolveEnabledNetworks({ mediationProvider: 'admob' }, true);
    expect(networks).toEqual(['admob']);
  });

  it('falls back to admob when applovin_max is not implemented', async () => {
    const { resolveEnabledNetworks } = await import('./core/AdService');
    const networks = resolveEnabledNetworks({ mediationProvider: 'applovin_max' }, true);
    expect(networks).toEqual(['admob']);
  });
});
