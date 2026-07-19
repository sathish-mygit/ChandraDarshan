import { Capacitor } from '@capacitor/core';
import { AdAnalyticsEvent } from '../analytics/AdAnalyticsEvent';
import { mapBlockReasonToSkipReason } from '../analytics/skip-reason';
import { normalizeInterstitialLimit } from '../config/interstitial-limits';
import { PlacementRegistry } from '../config/PlacementRegistry';
import { RemoteConfigAds } from '../config/RemoteConfigAds';
import { DEFAULT_IVT_CONFIG } from '../config/ivt-defaults';
import {
  clearDebugLimitOverrides,
  hasActiveDebugOverrides,
  readDebugLimitOverrides,
  writeDebugLimitOverrides,
} from '../config/debug-limits';
import { NewUserManager } from '../lifecycle/NewUserManager';
import { resolveRequiredEngagementCount } from '../lifecycle/engagement-readiness';
import { IvtGuard } from '../safeguards/ivt-guard';
import { PlacementDecisionEngine } from '../decision/engine';
import { SessionAttemptLog } from '../diagnostics/session-log';
import {
  readSimulationOverrides,
  writeSimulationOverrides,
  clearSimulationOverrides,
  hasActiveSimulation,
} from '../diagnostics/simulation';
import { readAdUnitModeOverride } from '../diagnostics/ad-unit-mode';
import { resolveAdUnitMode, maskTestDeviceId } from '../config/ad-unit-mode';
import { buildDiagnosticsSnapshot } from '../diagnostics/snapshot';
import type { AdDecisionContext } from '../decision/types';
import type { AdProvider } from './providers/AdProvider';
import { MockProvider } from './providers/MockProvider';
import { AdMobProvider } from './providers/mediation/AdMobProvider';
import {
  NetworkType,
  PlacementStrategy,
  type AdFormat,
  type AdRequestParams,
  type AdRewardedResult,
  type AdsRuntimeConfig,
  type AdsLimitsSnapshot,
  type DebugLimitOverrides,
  type FrequencyCapMap,
  type IvtConfig,
  type IvtStatus,
  type NativeAd,
  type PlacementNetworkConfig,
  type ProviderInitOptions,
  type UserGraceState,
} from './types';

/** Bumped when default placement toggles change so stale local overrides are ignored. */
const SETTINGS_STORAGE_KEY = 'ads:settings:v2';
const CONSENT_STORAGE_KEY = 'ads:consent';
const PRELOAD_DEBOUNCE_MS = 5 * 60 * 1000;
const ENGAGEMENT_COUNT_TTL_MS = 30_000;

export type AdServiceInitOptions = {
  config: AdsRuntimeConfig;
  enabledNetworks?: NetworkType[];
  getEngagementItemCount?: () => Promise<number>;
};

/** When `debug: true`, skips rate limits, new-user grace, and placement toggles (debug panel only). */
export type ShowAdOptions = {
  debug?: boolean;
  /** When true, evaluate without writing skip analytics/session log (diagnostics polling). */
  silent?: boolean;
};

export type AdProviderEvent = {
  type: string;
  placement?: string;
  message: string;
};

/** Pick active mediation networks from merged config (AdMob-only until AppLovin phase). */
export function resolveEnabledNetworks(
  config: AdsRuntimeConfig,
  isNative: boolean
): NetworkType[] {
  if (!isNative) return [NetworkType.MOCK];

  const provider = config.mediationProvider ?? 'admob';
  switch (provider) {
    case 'admob':
      return [NetworkType.ADMOB];
    case 'applovin_max':
      console.warn('[AdService] applovin_max not implemented yet — using AdMob');
      return [NetworkType.ADMOB];
    default:
      console.warn(`[AdService] unknown mediationProvider "${provider}" — using AdMob`);
      return [NetworkType.ADMOB];
  }
}

export class AdService {
  private static instance: AdService;
  private providers = new Map<NetworkType, AdProvider>();
  private remoteConfig?: RemoteConfigAds;
  private analytics = new AdAnalyticsEvent();
  private newUserManager?: NewUserManager;
  private userState?: UserGraceState;
  private settings: Record<string, boolean> = {};
  private runtimeConfig: AdsRuntimeConfig = {};
  private inited = false;
  private canRequestAds = true;
  private lastInterstitial = 0;
  private interstitialCount = 0;
  private ivtGuard?: IvtGuard;
  private decisionEngine?: PlacementDecisionEngine;
  private sessionLog = new SessionAttemptLog();
  private currentRoute = '/';
  private activeBannerPlacement: string = 'banner.home';
  private lastPreloadAttemptAt = 0;
  private getEngagementItemCount?: () => Promise<number>;
  private cachedEngagementCount: number | null = null;
  private engagementCountFetchedAt = 0;
  private initResolve?: () => void;
  private initPromise = new Promise<void>((resolve) => {
    this.initResolve = resolve;
  });
  private providerCallbacks?: {
    onAdClick: (placement: string, format: string) => void;
    onAdImpression: (placement: string, format: string) => void;
    onProviderEvent: (event: AdProviderEvent) => void;
  };
  private providerEventListeners = new Set<(event: AdProviderEvent) => void>();

  private constructor() {}

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  /** Legacy alias used by useAppInit */
  async init(options: AdServiceInitOptions): Promise<void> {
    return this.initialize(options);
  }

  async initialize({
    config,
    enabledNetworks,
    getEngagementItemCount,
  }: AdServiceInitOptions): Promise<void> {
    if (this.inited) return;

    this.runtimeConfig = config;
    this.getEngagementItemCount = getEngagementItemCount;
    this.remoteConfig = RemoteConfigAds.fromMergedAdsConfig(config);
    this.settings = { ...(config.settings ?? {}) };
    this.mergePersistedSettings();
    this.syncSettingsToRuntimeConfig();

    if (config.placementDefinitions) {
      PlacementRegistry.registerBatch(config.placementDefinitions);
    }

    const ivtConfig = this.remoteConfig.getIvtConfig();
    const freqCap = this.remoteConfig.getFrequencyCapMap();
    this.ivtGuard = new IvtGuard(ivtConfig, freqCap);

    // Initialize decision engine
    const engagementProvider = getEngagementItemCount
      ? async () => {
          const sim = readSimulationOverrides();
          if (sim.engagementCount != null) return sim.engagementCount;
          return this.getEngagementCountCached();
        }
      : undefined;
    this.decisionEngine = new PlacementDecisionEngine(
      this.buildPolicySnapshot(),
      engagementProvider
    );
    this.decisionEngine.setConsentGiven(this.canRequestAds);
    this.decisionEngine.setFreqCapChecker((placement) =>
      this.ivtGuard!.checkFrequencyCap(placement)
    );

    this.applyDebugLimitOverrides();

    this.newUserManager = new NewUserManager(this.remoteConfig.getNewUserGraceConfig());
    this.userState = await this.newUserManager.getGraceState();

    const networks =
      enabledNetworks ??
      resolveEnabledNetworks(config, Capacitor.isNativePlatform());

    const adCallbacks = {
      onAdClick: (placement: string, format: string) => {
        void this.onAdClick(placement, format as AdFormat, NetworkType.ADMOB);
      },
      onAdImpression: (placement: string, format: string) => {
        this.recordImpressionInternal(placement, format as AdFormat, NetworkType.ADMOB);
      },
      onProviderEvent: (event: AdProviderEvent) => {
        this.sessionLog.recordProviderEvent(event);
        for (const listener of this.providerEventListeners) {
          try {
            listener(event);
          } catch (err) {
            console.warn('[AdService] provider event listener failed', err);
          }
        }
      },
    };
    this.providerCallbacks = adCallbacks;

    for (const networkType of networks) {
      const provider = this.createProvider(networkType);
      try {
        await provider.initialize({
          ...this.buildProviderInitOptions(),
          ...adCallbacks,
        });
        this.providers.set(networkType, provider);
      } catch (err) {
        console.warn(`[AdService] failed to init ${networkType}`, err);
      }
    }

    if (this.providers.size === 0) {
      const mock = new MockProvider();
      await mock.initialize({ testMode: true });
      this.providers.set(NetworkType.MOCK, mock);
    }

    this.inited = true;
    void this.checkConsent().finally(() => this.initResolve?.());
    void this.refreshEngagementCount();
    void this.warmInterstitialIfAllowed();

    console.info(
      `[AdService] ready — mediation=${config.mediationProvider ?? 'admob'}; networks: ${[...this.providers.keys()].join(', ')}; newUser=${this.userState?.isNewUser}`
    );

    if (process.env.NODE_ENV === 'development' && !config.testMode) {
      this.analytics.recordTestModeWarning();
    }
  }

  async getInitReady(): Promise<void> {
    if (this.inited) return this.initPromise;
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.inited) {
          clearInterval(timer);
          this.initPromise.then(resolve);
        }
      }, 50);
    });
  }

  getRuntimeConfig(): AdsRuntimeConfig {
    return { ...this.runtimeConfig };
  }

  isPlacementEnabled(placement: string): boolean {
    if (this.settings['ads.master'] === false) return false;
    const value = this.settings[placement];
    return value === undefined ? false : !!value;
  }

  async checkConsent(): Promise<void> {
    this.canRequestAds = true;
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ checked: true, timestamp: Date.now(), canRequestAds: true })
      );
    } catch {
      // ignore
    }
  }

  /** Sync decision engine with live AdService state (called before every evaluate) */
  private syncDecisionEngineState(): void {
    if (!this.decisionEngine) return;

    this.decisionEngine.updatePolicy(this.buildPolicySnapshot());
    this.decisionEngine.setIvtPaused(this.ivtGuard?.checkIvtPause() ?? false);
    this.decisionEngine.setConsentGiven(this.getEffectiveConsent());

    this.decisionEngine.setInterstitialState({
      count: this.interstitialCount,
      lastShownAt: this.lastInterstitial > 0 ? this.lastInterstitial : undefined,
      lastPreloadAt: this.lastPreloadAttemptAt > 0 ? this.lastPreloadAttemptAt : undefined,
    });

    const simulation = readSimulationOverrides();
    if (hasActiveSimulation(simulation)) {
      this.decisionEngine.applySimulationOverrides(simulation);
      if (simulation.freqCap && this.ivtGuard) {
        this.ivtGuard.applyFreqCapSimulation(simulation.freqCap);
      }
    }

    this.applyMergedLimitOverrides();
  }

  private getEffectiveConsent(): boolean {
    const sim = readSimulationOverrides();
    if (sim.consentGranted != null) return sim.consentGranted;
    return this.canRequestAds;
  }

  private buildPolicySnapshot(): import('../decision/types').AdsPolicySnapshot {
    const simulation = readSimulationOverrides();
    const debugLimits = readDebugLimitOverrides();
    const ivtConfig = this.ivtGuard?.getIvtConfig() ?? { ...DEFAULT_IVT_CONFIG };
    const interstitialLimits = this.getEffectiveInterstitialLimits();

    const placementToggles: Record<string, boolean> = { ...this.settings };
    for (const key of Object.keys(placementToggles)) {
      if (placementToggles[key] === undefined) placementToggles[key] = true;
    }
    if (simulation.placementToggles) {
      Object.assign(placementToggles, simulation.placementToggles);
    }

    const engagementMin =
      simulation.engagementMin ??
      debugLimits.engagement?.minWardrobeItems ??
      this.runtimeConfig.engagement?.minWardrobeItems ??
      0;

    const placementMins = Object.entries(this.runtimeConfig.placementNewUserPolicy ?? {}).reduce(
      (acc, [placement, policy]) => {
        if (policy?.minWardrobeItems) acc[placement] = policy.minWardrobeItems;
        return acc;
      },
      {} as Record<string, number>
    );

    const baseFreq = this.remoteConfig?.getFrequencyCapMap() ?? {};
    const mergedFreq: Record<string, { perHour: number; perDay: number }> = {
      ...baseFreq,
      ...(debugLimits.freqCap ?? {}),
    };
    if (simulation.freqCap) {
      for (const [placement, cap] of Object.entries(simulation.freqCap)) {
        mergedFreq[placement] = {
          perHour: cap.perHour ?? mergedFreq[placement]?.perHour ?? 0,
          perDay: cap.perDay ?? mergedFreq[placement]?.perDay ?? 0,
        };
      }
    }

    const engagementGatesDisabled =
      simulation.engagementGatesDisabled === true ||
      debugLimits.engagement?.gatesDisabled === true ||
      this.runtimeConfig.engagement?.gatesDisabled === true;

    return {
      masterEnabled: this.isEnabled('ads.master'),
      placementToggles,
      interstitialLimits: {
        minIntervalMs:
          simulation.interstitial?.minIntervalMs ??
          debugLimits.interstitial?.minIntervalMs ??
          interstitialLimits.minIntervalMs,
        maxPerSession:
          simulation.interstitial?.maxPerSession ??
          debugLimits.interstitial?.maxPerSession ??
          interstitialLimits.maxPerSession,
      },
      ivtConfig: {
        enabled: ivtConfig.enabled,
        maxClicksPerSession:
          simulation.ivt?.maxClicksPerSession ??
          debugLimits.ivt?.maxClicksPerSession ??
          ivtConfig.maxClicksPerSession,
        maxClicksPerDay:
          simulation.ivt?.maxClicksPerDay ??
          debugLimits.ivt?.maxClicksPerDay ??
          ivtConfig.maxClicksPerDay,
        pauseDurationMs: ivtConfig.pauseDurationMs,
      },
      engagement: {
        globalMinEngagementCount: engagementMin,
        placementMins,
        gatesDisabled: engagementGatesDisabled,
      },
      freqCap: Object.fromEntries(
        Object.entries(mergedFreq).map(([k, v]) => [
          k,
          { perHour: v.perHour ?? 0, perDay: v.perDay ?? 0 },
        ])
      ),
    };
  }

  private applyMergedLimitOverrides(): void {
    const simulation = readSimulationOverrides();
    const debugLimits = readDebugLimitOverrides();
    const merged: DebugLimitOverrides = {
      engagement: {
        minWardrobeItems: simulation.engagementMin ?? debugLimits.engagement?.minWardrobeItems,
      },
      interstitial: {
        minIntervalMs:
          simulation.interstitial?.minIntervalMs ?? debugLimits.interstitial?.minIntervalMs,
        maxPerSession:
          simulation.interstitial?.maxPerSession ?? debugLimits.interstitial?.maxPerSession,
      },
      ivt: {
        maxClicksPerSession:
          simulation.ivt?.maxClicksPerSession ?? debugLimits.ivt?.maxClicksPerSession,
        maxClicksPerDay: simulation.ivt?.maxClicksPerDay ?? debugLimits.ivt?.maxClicksPerDay,
      },
      freqCap: (() => {
        const freqMerged: Record<string, { perHour?: number; perDay?: number }> = {
          ...debugLimits.freqCap,
        };
        if (simulation.freqCap) {
          for (const [placement, cap] of Object.entries(simulation.freqCap)) {
            freqMerged[placement] = {
              perHour: cap.perHour ?? freqMerged[placement]?.perHour,
              perDay: cap.perDay ?? freqMerged[placement]?.perDay,
            };
          }
        }
        return freqMerged as FrequencyCapMap;
      })(),
    };
    const baseIvt = this.remoteConfig?.getIvtConfig() ?? { ...DEFAULT_IVT_CONFIG };
    const baseFreq = this.remoteConfig?.getFrequencyCapMap() ?? {};
    this.ivtGuard?.updateConfig(
      { ...baseIvt, ...(merged.ivt ?? {}) },
      { ...baseFreq, ...(merged.freqCap ?? {}) } as FrequencyCapMap
    );
  }

  /** Get session attempt log (for diagnostics UI) */
  getSessionAttemptLog() {
    return this.sessionLog.getAll();
  }

  /** Get placement diagnostics snapshot for UI */
  async getPlacementDiagnostics(placements: string[]) {
    const snapshot = await this.buildDiagnosticsSnapshot(placements);
    return snapshot.placements;
  }

  /** Build full diagnostics snapshot */
  async buildDiagnosticsSnapshot(placements: string[], policyMode?: import('../diagnostics/types').PolicyMode) {
    return buildDiagnosticsSnapshot(this, placements, policyMode);
  }

  /** Ad unit mode for diagnostics (production vs Google sample). */
  getAdUnitModeDiagnostics() {
    const runtimeOverride = readAdUnitModeOverride();
    const testingDevices = this.runtimeConfig.testingDevices ?? [];
    const mode = resolveAdUnitMode({
      useProductionAdUnits: !!this.runtimeConfig.useProductionAdUnits,
      runtimeOverride,
      testingDeviceCount: testingDevices.length,
    });

    return {
      effective: mode.effectiveUseProductionAdUnits,
      source: mode.source,
      runtimeOverride,
      testingDeviceCount: testingDevices.length,
      testingDeviceMasks: testingDevices.map(maskTestDeviceId),
    };
  }

  /** Re-init AdMob provider after diagnostics ad-unit mode toggle. */
  async reinitializeAdProvider(): Promise<void> {
    if (!this.inited || !this.providerCallbacks) return;

    const existing = this.providers.get(NetworkType.ADMOB);
    if (existing) {
      await existing.destroy?.();
    }

    const provider = new AdMobProvider();
    await provider.initialize({
      ...this.buildProviderInitOptions(),
      ...this.providerCallbacks,
    });
    this.providers.set(NetworkType.ADMOB, provider);
    void this.warmInterstitialIfAllowed();
  }

  private buildProviderInitOptions(): ProviderInitOptions {
    return {
      testMode: !!this.runtimeConfig.testMode,
      useProductionAdUnits: !!this.runtimeConfig.useProductionAdUnits,
      adUnitModeRuntimeOverride: readAdUnitModeOverride(),
      testDeviceIds: this.runtimeConfig.testingDevices,
      appIds: this.runtimeConfig.appIds,
      adUnitIds: this.runtimeConfig.adUnitIds,
    };
  }

  /** Apply simulation overrides for testing */
  setSimulationOverrides(overrides: import('../diagnostics/types').SimulationOverrides) {
    writeSimulationOverrides(overrides);
    const engagement: import('../core/types').EngagementConfig | undefined =
      overrides.engagementMin != null || overrides.engagementGatesDisabled != null
        ? {
            minWardrobeItems: overrides.engagementMin ?? 0,
            ...(overrides.engagementGatesDisabled != null
              ? { gatesDisabled: overrides.engagementGatesDisabled }
              : {}),
          }
        : undefined;
    writeDebugLimitOverrides({
      engagement,
      interstitial: overrides.interstitial,
      ivt: overrides.ivt,
      freqCap: overrides.freqCap as FrequencyCapMap | undefined,
    });
    this.applyMergedLimitOverrides();
    this.decisionEngine?.applySimulationOverrides(overrides);
    if (overrides.freqCap && this.ivtGuard) {
      this.ivtGuard.applyFreqCapSimulation(overrides.freqCap);
    }
  }

  /** Clear all simulation overrides */
  clearSimulationOverrides() {
    clearSimulationOverrides();
    clearDebugLimitOverrides();
    this.ivtGuard?.clearFreqCapSimulation();
    this.applyDebugLimitOverrides();
    this.decisionEngine?.applySimulationOverrides({});
  }

  /** Test show interstitial with optional policy bypass */
  async testShowInterstitial(placement: string, options?: { policyMode?: 'production' | 'admob_only' }) {
    const debug = options?.policyMode === 'admob_only';
    return this.showInterstitial(placement, { debug });
  }

  /** Test preload interstitial */
  async testPreloadInterstitial(placement: string) {
    return this.maybePreloadInterstitial(placement);
  }

  isEnabled(key: string): boolean {
    const sim = readSimulationOverrides();
    if (sim.placementToggles && key in sim.placementToggles) {
      if (key === 'ads.master') return sim.placementToggles[key] !== false;
      return !!sim.placementToggles[key];
    }
    if (this.settings['ads.master'] === false) return false;
    const value = this.settings[key];
    return value === undefined ? false : !!value;
  }

  setEnabled(key: string, value: boolean): void {
    this.settings[key] = value;
    this.syncSettingsToRuntimeConfig();
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // ignore
    }
  }

  /** Log + analytics for a blocked placement (nav hook, debug UI). */
  reportPlacementSkip(placement: string, blockReason: string, ruleId?: string): void {
    const skipReason = mapBlockReasonToSkipReason(blockReason);
    console.info(`[AdService] ad skipped: ${placement} — ${blockReason}`);
    this.analytics.recordSkipped(
      placement,
      skipReason,
      this.userState?.sessionCount,
      blockReason,
      ruleId
    );
    this.sessionLog.recordSkip(placement, 'show', ruleId || 'unknown', blockReason);
  }

  getSettings(): Record<string, boolean> {
    return { ...this.settings };
  }

  getUserState(): UserGraceState | undefined {
    return this.userState;
  }

  getIvtConfig(): IvtConfig {
    return this.ivtGuard?.getIvtConfig() ?? { ...DEFAULT_IVT_CONFIG };
  }

  getIvtStatus(): IvtStatus | null {
    return this.ivtGuard?.getStatus() ?? null;
  }

  getDebugLimitOverrides(): DebugLimitOverrides {
    return readDebugLimitOverrides();
  }

  setDebugLimitOverrides(overrides: DebugLimitOverrides): void {
    writeDebugLimitOverrides(overrides);
    this.applyDebugLimitOverrides();
  }

  clearDebugLimitOverrides(): void {
    clearDebugLimitOverrides();
    this.applyDebugLimitOverrides();
  }

  async getEngagementCountCached(): Promise<number> {
    const now = Date.now();
    if (
      this.cachedEngagementCount !== null &&
      this.engagementCountFetchedAt > 0 &&
      now - this.engagementCountFetchedAt < ENGAGEMENT_COUNT_TTL_MS
    ) {
      return this.cachedEngagementCount;
    }
    return this.refreshEngagementCount();
  }

  async refreshEngagementCount(): Promise<number> {
    if (!this.getEngagementItemCount) {
      this.cachedEngagementCount = null;
      return 0;
    }
    try {
      const count = await this.getEngagementItemCount();
      this.cachedEngagementCount = count;
      this.engagementCountFetchedAt = Date.now();
      return count;
    } catch {
      return this.cachedEngagementCount ?? 0;
    }
  }

  async getAdsLimitsSnapshot(freqCapPlacements: string[] = []): Promise<AdsLimitsSnapshot> {
    await this.refreshEngagementCountIfStale();

    const minItems = this.getEffectiveEngagementMin();
    const itemCount = this.cachedEngagementCount;
    const interstitial = this.getEffectiveInterstitialLimits();
    const overrides = readDebugLimitOverrides();
    const snapshotPlacements = [
      'native.feed',
      'interstitial.postItemSave',
      'interstitial.toPlanner',
      'interstitial.toInsights',
      ...freqCapPlacements,
    ];
    const uniquePlacements = [...new Set(snapshotPlacements)];
    const placementMins = Object.fromEntries(
      uniquePlacements.map((placement) => [
        placement,
        this.getRequiredWardrobeItemsForPlacement(placement),
      ])
    );

    return {
      wardrobeReadiness: {
        globalMinWardrobeItems: minItems,
        currentItemCount: itemCount,
        placementMins,
        sessionCount: this.userState?.sessionCount ?? 0,
        gatesDisabled: this.areEngagementGatesDisabled(),
      },
      interstitial: {
        minIntervalMs: interstitial.minIntervalMs,
        maxPerSession: interstitial.maxPerSession,
        shownThisSession: this.interstitialCount,
        msSinceLast: this.lastInterstitial > 0 ? Date.now() - this.lastInterstitial : null,
      },
      ivt: this.getIvtStatus(),
      freqCaps: this.ivtGuard?.getFreqCapUsageForPlacements(freqCapPlacements) ?? {},
      debugOverridesActive: hasActiveDebugOverrides(overrides),
    };
  }

  isIvtPaused(): boolean {
    return this.ivtGuard?.checkIvtPause() ?? false;
  }

  setCurrentRoute(route: string): void {
    this.currentRoute = route;
    this.ivtGuard?.setCurrentRoute(route);
  }

  async onAdClick(
    placement: string,
    format: AdFormat,
    network: NetworkType | string = NetworkType.ADMOB
  ): Promise<void> {
    if (!this.ivtGuard) return;

    const clickResult = this.ivtGuard.recordClick();
    this.analytics.recordClick(placement, network, {
      format,
      sessionClicks: clickResult.sessionClicks,
      dayClicks: clickResult.dayClicks,
    });

    if (clickResult.shouldPause && clickResult.trigger) {
      const config = this.ivtGuard.getIvtConfig();
      this.analytics.recordIvtPause({
        trigger: clickResult.trigger,
        sessionClicks: clickResult.sessionClicks,
        dayClicks: clickResult.dayClicks,
        pausedUntilMs: this.ivtGuard.getStatus().pausedUntil,
        maxSession: config.maxClicksPerSession,
        maxDay: config.maxClicksPerDay,
      });
      await this.hideBanner('banner.home');
    }
  }

  flushSessionAnalytics(): void {
    if (!this.ivtGuard) return;

    const resumeMs = this.ivtGuard.consumeResumeEvent();
    if (resumeMs != null) {
      this.analytics.recordIvtResume(resumeMs);
    }

    const stats = this.ivtGuard.getSessionStats();
    const ctr = stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0;
    const topSkip = Object.entries(stats.skipsByReason).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

    this.analytics.recordSessionSummary({
      impressions: stats.impressions,
      clicks: stats.clicks,
      ctrPercent: Math.round(ctr * 10) / 10,
      ivtPaused: this.ivtGuard.checkIvtPause(),
      topSkipReason: topSkip,
    });
  }

  recordNavigationDelay(
    placement: string,
    delayMs: number,
    fromRoute: string,
    toRoute: string
  ): void {
    this.analytics.recordNavigationDelay(placement, delayMs, fromRoute, toRoute);
  }

  async loadNativeAd(params: AdRequestParams): Promise<NativeAd | null> {
    const placement = String(params.placement);
    if (!this.canShowPlacement(placement, 'native')) return null;

    const placementDef = PlacementRegistry.get(placement);
    const start = Date.now();
    this.analytics.recordRequest(placement, 'native', 'waterfall');

    const sequence = this.getNetworkSequence(placementDef?.networkConfig);

    for (const networkType of sequence) {
      const provider = this.providers.get(networkType);
      if (!provider?.isReady()) continue;

      try {
        const ad = await Promise.race([
          provider.loadNativeAd(params),
          this.delay(params.timeout ?? 3000),
        ]);
        this.analytics.recordLoaded(placement, 'native', Date.now() - start, provider.getNetwork());
        this.recordImpressionInternal(placement, 'native', provider.getNetwork());
        return ad;
      } catch (err) {
        const code = err instanceof Error ? err.message : 'LOAD_FAILED';
        this.analytics.recordError(placement, code, networkType);
      }
    }

    this.analytics.recordError(placement, 'NO_FILL');
    return null;
  }

  setBannerTopMargin(marginPx: number): void {
    const provider = this.providers.get(NetworkType.ADMOB);
    if (provider instanceof AdMobProvider) {
      provider.setBannerMarginTop(marginPx);
    }
  }

  /** Subscribe to AdMob provider events (banner loaded/failed, etc.). */
  subscribeProviderEvents(listener: (event: AdProviderEvent) => void): () => void {
    this.providerEventListeners.add(listener);
    return () => {
      this.providerEventListeners.delete(listener);
    };
  }

  /** Whether a top banner may be shown (placement toggles, consent, grace, caps). */
  canShowBanner(placement: string = 'banner.home', options?: ShowAdOptions): boolean {
    return this.canShowPlacement(placement, 'banner', options);
  }

  async showBanner(placement: string = 'banner.home'): Promise<void> {
    if (!this.canShowPlacement(placement, 'banner')) return;
    this.activeBannerPlacement = String(placement);
    const provider = this.getPrimaryProvider(placement);
    if (provider instanceof AdMobProvider) {
      provider.setActiveBannerPlacement(String(placement));
    }
    await provider?.showBanner?.();
    this.recordImpressionInternal(placement, 'banner', provider?.getNetwork() ?? 'unknown');
  }

  /** Re-apply native banner at the current top margin (after layout or safe-area changes). */
  async repositionBanner(placement: string = 'banner.home'): Promise<void> {
    if (!this.canShowPlacement(placement, 'banner')) return;
    const provider = this.getPrimaryProvider(placement);
    if (!(provider instanceof AdMobProvider)) return;
    provider.setActiveBannerPlacement(String(placement));
    await provider.hideBanner();
    await provider.showBanner();
  }

  async hideBanner(_placement: string = 'banner.home'): Promise<void> {
    const provider = this.providers.get(NetworkType.ADMOB) ?? this.providers.values().next().value;
    await provider?.hideBanner?.();
  }

  async showCardBanner(placement: string = 'banner.cardFeed'): Promise<void> {
    if (!this.canShowPlacement(placement, 'banner')) return;
    const provider = this.getPrimaryProvider(placement);
    await provider?.showCardBanner?.();
    this.recordImpressionInternal(placement, 'banner', provider?.getNetwork() ?? 'unknown');
  }

  /** Preload one interstitial on startup when policy allows (engagement, toggles, caps). */
  private async warmInterstitialIfAllowed(): Promise<void> {
    try {
      if (!this.isEnabled('ads.master')) return;
      if (this.ivtGuard?.checkIvtPause()) return;
      if (!this.canRequestAds) return;

      const interstitialPlacements = [
        'interstitial.toJyotish',
        'interstitial.toHome',
        'interstitial.toSettings',
      ];

      for (const placement of interstitialPlacements) {
        if (!this.isEnabled(placement)) continue;
        const preloaded = await this.maybePreloadInterstitial(placement);
        if (preloaded) return;
      }
    } catch (err) {
      console.warn('[AdService] warmInterstitialIfAllowed error:', err);
    }
  }

  async maybePreloadInterstitial(
    placement: string,
    options?: ShowAdOptions
  ): Promise<boolean> {
    if (!this.inited) return false;

    const blockResult = await this.evaluatePlacement(placement, 'preload', options);
    if (!blockResult.allowed) return false;

    this.lastPreloadAttemptAt = Date.now();
    this.decisionEngine?.recordPreload();
    this.sessionLog.recordPreload(placement, true, 'Preload started');
    await this.preloadInterstitial(placement, options);
    return true;
  }

  async preloadInterstitial(
    placement: string,
    options?: ShowAdOptions
  ): Promise<void> {
    if (!options?.debug && !this.isEnabled(placement)) return;
    const provider = this.getPrimaryProvider(placement);
    await provider?.preloadInterstitial?.(placement);
  }

  /** Explains why an interstitial would be blocked (for debug UI). */
  async getInterstitialBlockReason(
    placement: string,
    options?: ShowAdOptions
  ): Promise<string | null> {
    if (!this.inited) return 'Ad service not initialized yet';
    const result = await this.evaluatePlacement(placement, 'show', {
      ...options,
      silent: true,
    });
    return result.allowed ? null : result.message;
  }

  /** Evaluate ad decision (for diagnostics/debug UI) */
  async evaluateDecision(context: AdDecisionContext): Promise<import('../decision/types').DecisionResult> {
    if (!this.decisionEngine) {
      return { allowed: false, ruleId: 'not_initialized', message: 'Decision engine not ready' };
    }
    this.syncDecisionEngineState();
    return this.decisionEngine.evaluate(context);
  }

  /** Get decision log (last N evaluations) */
  getDecisionLog() {
    return this.decisionEngine?.getLog().getAll() ?? [];
  }

  async showInterstitial(
    placement: string,
    options?: ShowAdOptions
  ): Promise<boolean> {
    if (!this.inited) return false;

    if (!options?.debug) {
      const result = await this.evaluatePlacement(placement, 'show', options);
      if (!result.allowed) return false;
    } else {
      console.info(`[AdService] debug interstitial for ${placement} — bypassing guards`);
    }

    const placementDef = PlacementRegistry.get(placement);
    const sequence = this.getNetworkSequence(placementDef?.networkConfig);

    for (const networkType of sequence) {
      const provider = this.providers.get(networkType);
      if (!provider) continue;
      try {
        const shown = await provider.showInterstitial();
        if (shown) {
          this.lastInterstitial = Date.now();
          this.interstitialCount += 1;
          this.decisionEngine?.recordInterstitialShow();
          this.recordImpressionInternal(placement, 'interstitial', provider.getNetwork());
          this.sessionLog.recordShow(placement, true, 'Interstitial shown');
          console.info(`[AdService] interstitial shown: ${placement}`);
          return true;
        }
      } catch (err) {
        const code = err instanceof Error ? err.message : 'SHOW_FAILED';
        this.analytics.recordError(placement, code, networkType);
      }
    }

    this.sessionLog.recordProviderEvent({
      type: 'provider_not_ready',
      placement,
      message: 'Interstitial not ready or provider returned false',
    });
    console.warn(
      `[AdService] interstitial show failed: ${placement} — ad not ready or provider returned false`
    );
    return false;
  }

  async showRewarded(placement: string): Promise<boolean> {
    if (!this.canShowPlacement(placement, 'rewarded')) return false;

    const placementDef = PlacementRegistry.get(placement);
    const sequence = this.getNetworkSequence(placementDef?.networkConfig);

    for (const networkType of sequence) {
      const provider = this.providers.get(networkType);
      if (!provider) continue;
      try {
        const result: AdRewardedResult = await provider.showRewarded();
        if (result.earned) {
          this.recordImpressionInternal(placement, 'rewarded', provider.getNetwork());
          return true;
        }
      } catch (err) {
        const code = err instanceof Error ? err.message : 'REWARD_FAILED';
        this.analytics.recordError(placement, code, networkType);
      }
    }

    return false;
  }

  async isReady(): Promise<boolean> {
    return [...this.providers.values()].some((p) => p.isReady());
  }

  private getPlacementBlockReason(
    placement: string,
    format: 'native' | 'banner' | 'interstitial' | 'rewarded',
    options?: ShowAdOptions
  ): string | null {
    if (!this.inited) return 'Ad service not initialized';
    if (!options?.debug && this.ivtGuard?.checkIvtPause()) {
      return 'IVT pause: click limit exceeded';
    }
    if (!this.isEnabled(placement)) {
      return `Placement disabled: ${placement} (toggle off in ads settings or Remote Config)`;
    }
    if (!this.canRequestAds) return 'Consent / canRequestAds is false';

    if (!options?.debug) {
      const engagementReason = this.getEngagementBlockReason(placement);
      if (engagementReason) return engagementReason;
    }

    if (!options?.debug && this.ivtGuard) {
      const cap = this.ivtGuard.checkFrequencyCap(placement);
      if (!cap.allowed && cap.capType) {
        return `Frequency cap: ${placement} ${cap.capType} limit ${cap.capValue}`;
      }
    }

    void format;
    return null;
  }

  private recordSkipFromBlockReason(placement: string, reason: string): void {
    this.reportPlacementSkip(placement, reason);
  }

  private canShowPlacement(
    placement: string,
    format: 'native' | 'banner' | 'interstitial' | 'rewarded',
    options?: ShowAdOptions
  ): boolean {
    const reason = this.getPlacementBlockReason(placement, format, options);
    if (!reason) return true;

    if (reason.includes('IVT pause')) {
      this.ivtGuard?.recordSkip('ivt_pause');
    } else if (reason.includes('Frequency cap') && this.ivtGuard) {
      const cap = this.ivtGuard.checkFrequencyCap(placement);
      if (!cap.allowed && cap.capType && cap.capValue != null && cap.currentCount != null) {
        this.analytics.recordFrequencyCapHit(placement, cap.capType, cap.capValue, cap.currentCount);
      }
      this.ivtGuard.recordSkip('frequency_cap');
    }

    this.recordSkipFromBlockReason(placement, reason);
    return false;
  }

  /** Unified evaluation path: sync state, evaluate via decision engine */
  private async evaluatePlacement(
    placement: string,
    phase: 'show' | 'preload',
    options?: ShowAdOptions
  ): Promise<{ allowed: boolean; message: string; ruleId?: string }> {
    if (!this.inited) {
      return {
        allowed: false,
        message: 'Ad service not initialized yet',
        ruleId: 'not_initialized',
      };
    }

    this.syncDecisionEngineState();

    const context: AdDecisionContext = {
      placement,
      phase,
      debug: options?.debug ?? false,
    };

    const result = await this.decisionEngine!.evaluate(context);

    if (!result.allowed && !options?.silent) {
      if (phase === 'show') {
        this.reportPlacementSkip(placement, result.message, result.ruleId);
      } else {
        this.analytics.recordPreloadSkipped(placement, result.ruleId, result.message);
        this.sessionLog.recordSkip(placement, 'preload', result.ruleId, result.message);
      }
    }

    return {
      allowed: result.allowed,
      message: result.allowed ? 'Allowed' : result.message,
      ruleId: !result.allowed ? result.ruleId : undefined,
    };
  }

  /** Record navigation evaluation for diagnostics timeline */
  recordNavigationEval(fromRoute: string, toRoute: string, placement: string | null): void {
    const message = placement
      ? `Nav ${fromRoute} → ${toRoute}: placement ${placement}`
      : `Nav ${fromRoute} → ${toRoute}: no transition placement`;
    this.sessionLog.record({
      timestamp: Date.now(),
      kind: 'evaluate',
      placement: placement ?? toRoute,
      message,
      source: 'policy',
      allowed: placement != null,
    });
  }

  /** Simulate a navigation transition (debug panel) */
  async simulateNavigation(
    fromRoute: string,
    toRoute: string,
    resolvePlacement: (route: string) => string | null
  ): Promise<void> {
    const placement = resolvePlacement(toRoute);
    this.recordNavigationEval(fromRoute, toRoute, placement);
    if (!placement) return;
    await this.maybePreloadInterstitial(placement);
    await this.showInterstitial(placement);
  }

  /** Simulate settings backup ad flow */
  async simulateSettingsBackup(): Promise<void> {
    const placement = 'interstitial.postBackup';
    this.sessionLog.recordDebugAction(placement, 'Simulate Settings backup');
    await this.maybePreloadInterstitial(placement);
    await this.showInterstitial(placement);
  }

  /** Simulate settings restore ad flow */
  async simulateSettingsRestore(): Promise<void> {
    const placement = 'interstitial.postRestore';
    this.sessionLog.recordDebugAction(placement, 'Simulate Settings restore');
    await this.maybePreloadInterstitial(placement);
    await this.showInterstitial(placement);
  }

  /** Force evaluate all placements for show + preload (debug panel) */
  async evaluateAllPlacements(placements: string[]): Promise<void> {
    for (const placement of placements) {
      await this.evaluatePlacement(placement, 'show', { silent: true });
      await this.evaluatePlacement(placement, 'preload', { silent: true });
    }
  }

  getConsentGiven(): boolean {
    return this.getEffectiveConsent();
  }

  private recordImpressionInternal(
    placement: string,
    format: AdFormat,
    network: NetworkType | string
  ): void {
    this.ivtGuard?.recordImpression(placement);
    this.analytics.recordImpression(placement, network, format);
  }

  private getPrimaryProvider(placement: string): AdProvider | undefined {
    const placementDef = PlacementRegistry.get(placement);
    const sequence = this.getNetworkSequence(placementDef?.networkConfig);
    for (const networkType of sequence) {
      const provider = this.providers.get(networkType);
      if (provider?.isReady()) return provider;
    }
    return this.providers.values().next().value;
  }

  private getNetworkSequence(config?: PlacementNetworkConfig): NetworkType[] {
    if (!config) return [NetworkType.MOCK];

    switch (config.strategy) {
      case PlacementStrategy.MEDIATION:
        return [config.mediationProvider ?? NetworkType.ADMOB];
      case PlacementStrategy.DIRECT:
        return [config.directNetwork ?? NetworkType.META];
      case PlacementStrategy.HYBRID_WATERFALL:
        return config.waterfall?.length ? config.waterfall : [NetworkType.ADMOB, NetworkType.MOCK];
      default:
        return [NetworkType.MOCK];
    }
  }

  private createProvider(networkType: NetworkType): AdProvider {
    switch (networkType) {
      case NetworkType.ADMOB:
        return new AdMobProvider();
      case NetworkType.MOCK:
      default:
        return new MockProvider();
    }
  }

  private mergePersistedSettings(): void {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        this.settings = { ...this.settings, ...parsed };
      }
    } catch {
      // ignore
    }
  }

  private syncSettingsToRuntimeConfig(): void {
    this.runtimeConfig = {
      ...this.runtimeConfig,
      settings: { ...this.settings },
    };
    this.remoteConfig?.updateSettings(this.settings);
  }

  private getEffectiveEngagementMin(): number {
    const overrides = readDebugLimitOverrides();
    const base = this.runtimeConfig.engagement?.minWardrobeItems ?? 0;
    return overrides.engagement?.minWardrobeItems ?? base;
  }

  private getPlacementPolicy(placement: string) {
    const placementDef = PlacementRegistry.get(placement);
    return this.remoteConfig?.getPlacementNewUserPolicy(placement) ?? placementDef?.newUserPolicy;
  }

  private getRequiredWardrobeItemsForPlacement(placement: string): number {
    return resolveRequiredEngagementCount(
      this.getEffectiveEngagementMin(),
      this.getPlacementPolicy(placement)
    );
  }

  private areEngagementGatesDisabled(): boolean {
    const simulation = readSimulationOverrides();
    const debugLimits = readDebugLimitOverrides();
    return (
      simulation.engagementGatesDisabled === true ||
      debugLimits.engagement?.gatesDisabled === true ||
      this.runtimeConfig.engagement?.gatesDisabled === true
    );
  }

  private getEngagementBlockReason(placement: string): string | null {
    if (this.areEngagementGatesDisabled()) return null;
    const required = this.getRequiredWardrobeItemsForPlacement(placement);
    if (required <= 0) return null;
    const count = this.cachedEngagementCount;
    if (count == null) return null;
    if (count < required) {
      return `Engagement gate: need ${required} items (have ${count})`;
    }
    return null;
  }

  private async refreshEngagementCountIfStale(): Promise<void> {
    if (!this.getEngagementItemCount) return;
    if (Date.now() - this.engagementCountFetchedAt < ENGAGEMENT_COUNT_TTL_MS) return;
    await this.refreshEngagementCount();
  }

  private getEffectiveInterstitialLimits(): { minIntervalMs: number; maxPerSession: number } {
    const base = this.remoteConfig?.getInterstitialLimits() ?? {
      minIntervalMs: 5 * 60 * 1000,
      maxPerSession: 2,
    };
    const overrides = readDebugLimitOverrides().interstitial;
    return {
      minIntervalMs: normalizeInterstitialLimit(
        overrides?.minIntervalMs ?? base.minIntervalMs,
        5 * 60 * 1000
      ),
      maxPerSession: normalizeInterstitialLimit(overrides?.maxPerSession ?? base.maxPerSession, 2),
    };
  }

  private applyDebugLimitOverrides(): void {
    const overrides = readDebugLimitOverrides();
    const baseIvt = this.remoteConfig?.getIvtConfig() ?? { ...DEFAULT_IVT_CONFIG };
    const baseFreq = this.remoteConfig?.getFrequencyCapMap() ?? {};
    const mergedIvt: IvtConfig = {
      ...baseIvt,
      ...(overrides.ivt ?? {}),
    };
    const mergedFreq: Record<string, { perHour: number; perDay: number }> = {
      ...baseFreq,
      ...(overrides.freqCap ?? {}),
    };
    this.ivtGuard?.updateConfig(mergedIvt, mergedFreq);
  }

  private delay(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('TIMEOUT')), ms);
    });
  }
}

export const adService = AdService.getInstance();
export default adService;
