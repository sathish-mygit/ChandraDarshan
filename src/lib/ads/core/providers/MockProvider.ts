import type { AdProvider } from './AdProvider';
import type {
  AdMetrics,
  AdRequestParams,
  AdRewardedResult,
  NativeAd,
  NetworkType,
  ProviderInitOptions,
} from '../types';
import { NetworkType as NT } from '../types';

export class MockProvider implements AdProvider {
  private ready = false;

  async initialize(_options: ProviderInitOptions): Promise<void> {
    this.ready = true;
  }

  async destroy(): Promise<void> {
    this.ready = false;
  }

  async onAppStateChange(_state: 'active' | 'inactive'): Promise<void> {}

  async loadNativeAd(params: AdRequestParams): Promise<NativeAd> {
    return {
      id: `mock-${String(params.placement)}-${Date.now()}`,
      headline: `Mock ad: ${String(params.placement)}`,
      body: 'Sponsored placeholder for development and web preview.',
      cta: 'Learn more',
      images: [],
      network: NT.MOCK,
      impressionTimestamp: Date.now(),
    };
  }

  async preloadInterstitial(): Promise<void> {}

  async showInterstitial(): Promise<boolean> {
    console.info('[MockProvider] interstitial shown');
    return true;
  }

  async showRewarded(): Promise<AdRewardedResult> {
    console.info('[MockProvider] rewarded completed');
    return { earned: true, rewardAmount: 1 };
  }

  async showBanner(): Promise<void> {
    console.info('[MockProvider] banner shown');
  }

  async hideBanner(): Promise<void> {
    console.info('[MockProvider] banner hidden');
  }

  async showCardBanner(): Promise<void> {
    console.info('[MockProvider] card banner shown');
  }

  getNetwork(): NetworkType {
    return NT.MOCK;
  }

  getMetrics(): AdMetrics {
    return {
      provider: 'mock',
      placement: 'mock',
      format: 'native',
      loadLatency: 50,
      fillRate: 1,
      impressions: 0,
      clicks: 0,
      errors: 0,
    };
  }

  isReady(): boolean {
    return this.ready;
  }
}
