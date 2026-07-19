import type { AdProvider } from '../AdProvider';
import type {
  AdMetrics,
  AdRequestParams,
  AdRewardedResult,
  NativeAd,
  NetworkType,
  ProviderInitOptions,
} from '../../types';
import { NetworkType as NT } from '../../types';
import { resolveAdUnitMode } from '../../../config/ad-unit-mode';

type PluginListenerHandle = { remove: () => void };

type AdMobPlugin = {
  initialize: (opts: Record<string, unknown>) => Promise<void>;
  showBanner: (opts: Record<string, unknown>) => Promise<void>;
  hideBanner: () => Promise<void>;
  prepareInterstitial: (opts: Record<string, unknown>) => Promise<{ adUnitId?: string }>;
  showInterstitial: () => Promise<void>;
  prepareRewardVideoAd: (opts: Record<string, unknown>) => Promise<{ adUnitId?: string }>;
  showRewardVideoAd: () => Promise<unknown>;
  addListener: (event: string, cb: (payload: unknown) => void) => Promise<PluginListenerHandle>;
  requestConsentInfo: () => Promise<unknown>;
};

type AdMobRewardItem = { type?: string; amount?: number };

let AdMob: AdMobPlugin | null = null;
let BannerAdPluginEvents: Record<string, string> | null = null;
let InterstitialAdPluginEvents: Record<string, string> | null = null;
let RewardAdPluginEvents: Record<string, string> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const admobModule = require('@capacitor-community/admob');
  AdMob = admobModule.AdMob ?? admobModule;
  BannerAdPluginEvents = admobModule.BannerAdPluginEvents ?? null;
  InterstitialAdPluginEvents = admobModule.InterstitialAdPluginEvents ?? null;
  RewardAdPluginEvents = admobModule.RewardAdPluginEvents ?? null;
} catch {
  AdMob = null;
}

const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  native: 'ca-app-pub-3940256099942544/2247696110',
};

export class AdMobProvider implements AdProvider {
  private testMode = false;
  private useGoogleSampleUnits = true;
  private markSdkTestRequests = true;
  private adUnitSource: 'google_sample' | 'production' = 'google_sample';
  private testDeviceIds: string[] = [];
  private adUnitIds: Record<string, string> = {};
  private listeners = new Map<string, PluginListenerHandle>();
  private initialized = false;
  private interstitialReady = false;
  private activeBannerPlacement = 'banner.home';
  private bannerMarginTop = 0;
  private onAdClick?: (placement: string, format: string) => void;
  private onAdImpression?: (placement: string, format: string) => void;
  private onProviderEvent?: (event: { type: string; placement?: string; message: string }) => void;

  setActiveBannerPlacement(placement: string): void {
    this.activeBannerPlacement = placement;
  }

  setBannerMarginTop(marginPx: number): void {
    this.bannerMarginTop = Math.max(0, Math.round(marginPx));
  }

  async initialize(options: ProviderInitOptions & { onProviderEvent?: (event: { type: string; placement?: string; message: string }) => void }): Promise<void> {
    this.testMode = !!options.testMode;
    this.testDeviceIds = options.testDeviceIds ?? [];
    this.adUnitIds = options.adUnitIds ?? {};
    this.onAdClick = options.onAdClick;
    this.onAdImpression = options.onAdImpression;
    this.onProviderEvent = options.onProviderEvent;

    const mode = resolveAdUnitMode({
      useProductionAdUnits: !!options.useProductionAdUnits,
      runtimeOverride: options.adUnitModeRuntimeOverride ?? null,
      testingDeviceCount: this.testDeviceIds.length,
    });
    this.useGoogleSampleUnits = mode.useGoogleSampleUnits;
    this.markSdkTestRequests = mode.markSdkTestRequests;
    this.adUnitSource = mode.source;

    if (!AdMob) {
      console.info('[AdMobProvider] plugin unavailable — noop mode');
      return;
    }

    const initOpts: Record<string, unknown> = {
      requestTrackingAuthorization: false,
      tagForChildDirectedTreatment: false,
      maxAdContentRating: 'MA',
    };

    if (this.testDeviceIds.length) {
      initOpts.testingDevices = this.testDeviceIds;
      initOpts.initializeForTesting = true;
    }

    await AdMob.initialize(initOpts);
    await this.setupEventListeners();
    this.initialized = true;

    console.info(
      `[AdMobProvider] adUnitMode=${this.adUnitSource}, testDevices=${this.testDeviceIds.length}, markSdkTest=${this.markSdkTestRequests}`
    );
  }

  async destroy(): Promise<void> {
    for (const listener of this.listeners.values()) {
      try {
        listener.remove();
      } catch {
        // ignore
      }
    }
    this.listeners.clear();
    this.initialized = false;
    this.interstitialReady = false;
  }

  async onAppStateChange(_state: 'active' | 'inactive'): Promise<void> {}

  private async setupEventListeners(): Promise<void> {
    if (!AdMob) return;

    if (BannerAdPluginEvents) {
      await this.addListener(BannerAdPluginEvents.Loaded, () => {
        console.info('[AdMobProvider] Banner loaded');
        this.onProviderEvent?.({
          type: 'banner_loaded',
          placement: this.activeBannerPlacement,
          message: 'Banner loaded successfully',
        });
      });
      await this.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
        console.warn('[AdMobProvider] Banner failed to load', err);
        this.onProviderEvent?.({
          type: 'banner_error',
          placement: this.activeBannerPlacement,
          message: `Banner failed to load: ${String(err)}`,
        });
      });
      await this.addListener(BannerAdPluginEvents.Opened, () => {
        this.onAdClick?.(this.activeBannerPlacement, 'banner');
      });
    }

    if (InterstitialAdPluginEvents) {
      await this.addListener(InterstitialAdPluginEvents.Loaded, () => {
        this.interstitialReady = true;
        console.info('[AdMobProvider] Interstitial loaded');
        this.onProviderEvent?.({
          type: 'interstitial_loaded',
          message: 'Interstitial loaded and ready to show',
        });
      });
      await this.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
        this.interstitialReady = false;
        console.warn('[AdMobProvider] Interstitial failed to load', err);
        this.onProviderEvent?.({
          type: 'interstitial_error',
          message: `Interstitial failed to load: ${String(err)}`,
        });
      });
      await this.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        this.interstitialReady = false;
        console.info('[AdMobProvider] Interstitial dismissed');
        this.onProviderEvent?.({
          type: 'interstitial_dismissed',
          message: 'Interstitial was dismissed',
        });
        void this.preloadInterstitial();
      });
      await this.addListener(InterstitialAdPluginEvents.FailedToShow, (err) => {
        console.warn('[AdMobProvider] Interstitial failed to show', err);
        this.onProviderEvent?.({
          type: 'interstitial_show_error',
          message: `Interstitial failed to show: ${String(err)}`,
        });
      });
    }
  }

  private async addListener(
    event: string,
    callback: (payload: unknown) => void
  ): Promise<void> {
    if (!AdMob) return;
    const handle = await AdMob.addListener(event, callback);
    this.listeners.set(event, handle);
  }

  private adId(key: keyof typeof TEST_IDS): string | undefined {
    return this.useGoogleSampleUnits ? TEST_IDS[key] : this.adUnitIds[key];
  }

  private pluginReady(): boolean {
    return !!AdMob && this.initialized;
  }

  async showBanner(): Promise<void> {
    if (!this.pluginReady()) return;
    const adId = this.adId('banner');
    if (!adId) return;

    await AdMob!.showBanner({
      adId,
      adSize: 'ADAPTIVE_BANNER',
      position: 'TOP_CENTER',
      margin: this.bannerMarginTop,
      isTesting: this.markSdkTestRequests,
      npa: false,
    });
  }

  async hideBanner(): Promise<void> {
    if (!AdMob) return;
    await AdMob.hideBanner();
  }

  async showCardBanner(): Promise<void> {
    if (!this.pluginReady()) return;
    const adId = this.adId('banner');
    if (!adId) return;

    await AdMob!.showBanner({
      adId,
      adSize: 'LARGE_BANNER',
      position: 'BOTTOM',
      margin: 8,
      isTesting: this.markSdkTestRequests,
      npa: false,
    });
  }

  async preloadInterstitial(): Promise<void> {
    if (!this.pluginReady()) return;
    const adId = this.adId('interstitial');
    if (!adId) return;

    this.interstitialReady = false;
    try {
      await AdMob!.prepareInterstitial({
        adId,
        isTesting: this.markSdkTestRequests,
        npa: false,
      });
      await this.waitForInterstitialReady();
    } catch (err) {
      this.interstitialReady = false;
      console.warn('[AdMobProvider] preloadInterstitial failed', err);
    }
  }

  private waitForInterstitialReady(timeoutMs = 15_000): Promise<boolean> {
    if (this.interstitialReady) return Promise.resolve(true);

    return new Promise((resolve) => {
      const started = Date.now();
      const poll = () => {
        if (this.interstitialReady) {
          resolve(true);
          return;
        }
        if (Date.now() - started >= timeoutMs) {
          console.warn('[AdMobProvider] interstitial load timed out');
          resolve(false);
          return;
        }
        setTimeout(poll, 100);
      };
      poll();
    });
  }

  async showInterstitial(): Promise<boolean> {
    if (!this.pluginReady()) return false;

    if (!this.interstitialReady) {
      await this.preloadInterstitial();
    }
    if (!this.interstitialReady) {
      console.warn('[AdMobProvider] interstitial not ready to show');
      return false;
    }

    try {
      await AdMob!.showInterstitial();
      this.interstitialReady = false;
      return true;
    } catch (err) {
      console.warn('[AdMobProvider] showInterstitial failed', err);
      void this.preloadInterstitial();
      return false;
    }
  }

  async showRewarded(): Promise<AdRewardedResult> {
    if (!this.pluginReady()) return { earned: false };

    const adId = this.adId('rewarded');
    if (!adId) return { earned: false };

    if (!RewardAdPluginEvents || !AdMob) {
      return { earned: false };
    }

    let result: AdRewardedResult = { earned: false };
    const rewardEvent = RewardAdPluginEvents.Rewarded;
    const dismissEvent = RewardAdPluginEvents.Dismissed;
    const failEvent = RewardAdPluginEvents.FailedToShow;

    return new Promise<AdRewardedResult>((resolve) => {
      let settled = false;
      const finish = (value: AdRewardedResult) => {
        if (settled) return;
        settled = true;
        void cleanup();
        resolve(value);
      };

      const handles: PluginListenerHandle[] = [];
      const cleanup = async () => {
        for (const handle of handles) {
          try {
            handle.remove();
          } catch {
            // ignore
          }
        }
      };

      void (async () => {
        try {
          handles.push(
            await AdMob!.addListener(rewardEvent, (item: unknown) => {
              const reward = item as AdMobRewardItem;
              result = {
                earned: true,
                rewardType: reward.type,
                rewardAmount: reward.amount ?? 1,
              };
            })
          );
          handles.push(
            await AdMob!.addListener(dismissEvent, () => {
              finish(result);
            })
          );
          handles.push(
            await AdMob!.addListener(failEvent, (err) => {
              console.warn('[AdMobProvider] rewarded failed to show', err);
              finish({ earned: false });
            })
          );

          await AdMob!.prepareRewardVideoAd({
            adId,
            isTesting: this.markSdkTestRequests,
            npa: false,
          });
          await AdMob!.showRewardVideoAd();
        } catch (err) {
          console.warn('[AdMobProvider] showRewarded failed', err);
          finish({ earned: false });
        }
      })();
    });
  }

  async loadNativeAd(params: AdRequestParams): Promise<NativeAd> {
    if (this.testMode) {
      return {
        id: `admob-mock-${String(params.placement)}`,
        headline: 'Try new styles',
        body: 'Sponsored: curated outfits for you.',
        cta: 'Explore',
        images: [],
        network: NT.ADMOB,
        impressionTimestamp: Date.now(),
      };
    }

    return {
      id: `admob-native-${String(params.placement)}`,
      headline: 'Sponsored',
      body: 'Native ad slot — configure native template in mediation.',
      cta: 'Learn more',
      images: [],
      network: NT.ADMOB,
      impressionTimestamp: Date.now(),
    };
  }

  getNetwork(): NetworkType {
    return NT.ADMOB;
  }

  getMetrics(): AdMetrics {
    return {
      provider: 'admob',
      placement: 'admob',
      format: 'banner',
      loadLatency: 0,
      fillRate: 0.95,
      impressions: 0,
      clicks: 0,
      errors: 0,
    };
  }

  isReady(): boolean {
    return this.pluginReady() || this.testMode;
  }
}
