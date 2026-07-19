import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdService } from './AdService';
import adsConfig from '@/config/ads';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => false },
}));

describe('AdService diagnostics', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    });
    vi.stubGlobal('sessionStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    });
    const service = AdService.getInstance() as AdService & { inited: boolean };
    service.inited = false;
  });

  it('records navigation eval when placement is null', async () => {
    const service = AdService.getInstance();
    await service.initialize({ config: adsConfig });

    service.recordNavigationEval('/home', '/settings', null);
    const log = service.getSessionAttemptLog();
    expect(log.some((e) => e.message.includes('no transition placement'))).toBe(true);
  });

  it('showInterstitial skip writes session log with rule_id', async () => {
    const service = AdService.getInstance();
    await service.initialize({
      config: {
        ...adsConfig,
        settings: { ...adsConfig.settings, 'interstitial.toPlanner': false },
      },
    });

    await service.showInterstitial('interstitial.toPlanner');
    const log = service.getSessionAttemptLog();
    expect(log.some((e) => e.kind === 'skip' && e.ruleId === 'placement_disabled')).toBe(true);
  });

  it('evaluateDecision returns ruleId for blocked placement', async () => {
    const service = AdService.getInstance();
    await service.initialize({
      config: {
        ...adsConfig,
        settings: { ...adsConfig.settings, 'interstitial.toHome': false },
      },
    });

    const result = await service.evaluateDecision({
      placement: 'interstitial.toHome',
      phase: 'show',
    });
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.ruleId).toBe('placement_disabled');
    }
  });
});
