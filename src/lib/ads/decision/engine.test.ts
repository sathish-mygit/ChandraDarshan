import { describe, it, expect, beforeEach } from 'vitest';
import { PlacementDecisionEngine } from './engine';
import type { AdsPolicySnapshot } from './types';

const createMockPolicy = (): AdsPolicySnapshot => ({
  masterEnabled: true,
  placementToggles: {
    'interstitial.toHome': true,
    'interstitial.postItemSave': true,
  },
  interstitialLimits: {
    minIntervalMs: 60000,
    maxPerSession: 2,
  },
  ivtConfig: {
    enabled: true,
    maxClicksPerSession: 10,
    maxClicksPerDay: 50,
    pauseDurationMs: 3600000,
  },
  engagement: {
    globalMinEngagementCount: 0,
    placementMins: {
      'interstitial.toHome': 8,
      'interstitial.postItemSave': 5,
    },
  },
  freqCap: {},
});

describe('PlacementDecisionEngine', () => {
  let engine: PlacementDecisionEngine;
  let policy: AdsPolicySnapshot;

  beforeEach(() => {
    policy = createMockPolicy();
    engine = new PlacementDecisionEngine(policy);
  });

  describe('master disabled', () => {
    it('blocks preload when master is off', async () => {
      policy.masterEnabled = false;
      engine.updatePolicy(policy);

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'preload',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('master_disabled');
      }
    });

    it('allows in debug mode', async () => {
      policy.masterEnabled = false;
      engine.updatePolicy(policy);

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
        debug: true,
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe('placement disabled', () => {
    it('blocks when placement toggle is off', async () => {
      policy.placementToggles['interstitial.toHome'] = false;
      engine.updatePolicy(policy);

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('placement_disabled');
      }
    });
  });

  describe('consent', () => {
    it('blocks when consent not given', async () => {
      engine.setConsentGiven(false);

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('consent_blocked');
      }
    });
  });

  describe('IVT pause', () => {
    it('blocks when IVT paused', async () => {
      engine.setIvtPaused(true);

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('ivt_paused');
      }
    });
  });

  describe('engagement gate', () => {
    it('blocks when engagement below required', async () => {
      const engagementProvider = () => Promise.resolve(2);
      engine = new PlacementDecisionEngine(policy, engagementProvider);

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('engagement_gate');
      }
    });

    it('allows when engagement meets required', async () => {
      const engagementProvider = () => Promise.resolve(8);
      engine = new PlacementDecisionEngine(policy, engagementProvider);

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe('session rate limit (show phase)', () => {
    it('blocks after max per session reached', async () => {
      engine.recordInterstitialShow();
      engine.recordInterstitialShow();

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('session_rate_limit');
      }
    });
  });

  describe('min interval (show phase)', () => {
    it('blocks if not enough time elapsed', async () => {
      engine.recordInterstitialShow();

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('min_interval');
      }
    });
  });

  describe('preload debounce (preload phase)', () => {
    it('blocks rapid preloads', async () => {
      engine.recordPreload();

      const result = await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'preload',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('preload_debounce');
      }
    });

    it('allows preload after interstitial shown', async () => {
      engine.recordPreload();
      engine.recordInterstitialShow();

      const result = await engine.evaluate({
        placement: 'interstitial.postItemSave',
        phase: 'preload',
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe('frequency cap', () => {
    it('blocks when injected checker reports hour cap hit', async () => {
      engine.setFreqCapChecker(() => ({
        allowed: false,
        capType: 'hour',
        capValue: 2,
        currentCount: 2,
      }));

      const result = await engine.evaluate({
        placement: 'interstitial.toPlanner',
        phase: 'show',
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.ruleId).toBe('frequency_cap');
        expect(result.message).toContain('hour');
      }
    });
  });

  describe('decision log', () => {
    it('logs all evaluations', async () => {
      await engine.evaluate({
        placement: 'interstitial.toHome',
        phase: 'show',
      });

      const log = engine.getLog().getAll();
      expect(log.length).toBeGreaterThan(0);
    });

    it('maintains max 50 entries', async () => {
      for (let i = 0; i < 60; i++) {
        await engine.evaluate({
          placement: 'interstitial.toHome',
          phase: 'show',
          debug: true,
        });
      }

      const log = engine.getLog().getAll();
      expect(log.length).toBeLessThanOrEqual(50);
    });
  });
});
