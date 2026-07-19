import type {
  AdMetrics,
  AdRequestParams,
  AdRewardedResult,
  NativeAd,
  NetworkType,
  ProviderInitOptions,
} from '../types';

export interface AdProvider {
  initialize(options: ProviderInitOptions): Promise<void>;
  destroy(): Promise<void>;
  onAppStateChange(state: 'active' | 'inactive'): Promise<void>;

  loadNativeAd(params: AdRequestParams): Promise<NativeAd>;
  preloadInterstitial?(placement?: string): Promise<void>;
  showInterstitial(): Promise<boolean>;
  showRewarded(): Promise<AdRewardedResult>;

  showBanner?(): Promise<void>;
  hideBanner?(): Promise<void>;
  showCardBanner?(): Promise<void>;

  getNetwork(): NetworkType;
  getMetrics(): AdMetrics;
  isReady(): boolean;
}
