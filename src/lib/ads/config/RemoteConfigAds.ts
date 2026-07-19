import type {
  AdsRuntimeConfig,
  FrequencyCapMap,
  FrequencyCapValue,
  IvtConfig,
  NewUserGraceConfig,
  NewUserPlacementPolicy,
} from '../core/types';
import { mergeGraceConfig } from './NewUserGraceConfig';
import { DEFAULT_IVT_CONFIG } from './ivt-defaults';
import { normalizeInterstitialLimit } from './interstitial-limits';
import { PlacementRegistry } from './PlacementRegistry';

export class RemoteConfigAds {
  private config: AdsRuntimeConfig;

  constructor(config: AdsRuntimeConfig) {
    this.config = config;
  }

  static fromMergedAdsConfig(config: AdsRuntimeConfig): RemoteConfigAds {
    return new RemoteConfigAds(config);
  }

  getNewUserGraceConfig(): NewUserGraceConfig {
    return mergeGraceConfig(this.config.newUserGrace);
  }

  getPlacementNewUserPolicy(placement: string): NewUserPlacementPolicy | undefined {
    return this.config.placementNewUserPolicy?.[placement];
  }

  isPlacementEnabled(placement: string, settings?: Record<string, boolean>): boolean {
    const source = settings ?? this.config.settings;
    if (source?.['ads.master'] === false) return false;
    const value = source?.[placement];
    return value === undefined ? true : !!value;
  }

  updateSettings(settings: Record<string, boolean>): void {
    this.config = {
      ...this.config,
      settings: { ...this.config.settings, ...settings },
    };
  }

  getInterstitialLimits(): { minIntervalMs: number; maxPerSession: number } {
    return {
      minIntervalMs: normalizeInterstitialLimit(
        this.config.interstitial?.minIntervalMs,
        5 * 60 * 1000
      ),
      maxPerSession: normalizeInterstitialLimit(this.config.interstitial?.maxPerSession, 2),
    };
  }

  getIvtConfig(): IvtConfig {
    return {
      ...DEFAULT_IVT_CONFIG,
      ...(this.config.ivt ?? {}),
    };
  }

  getFrequencyCap(placement: string): FrequencyCapValue {
    const override = this.config.freqCap?.[placement];
    if (override) {
      return {
        perHour: override.perHour ?? 0,
        perDay: override.perDay ?? 0,
      };
    }
    const def = PlacementRegistry.get(placement);
    return {
      perHour: def?.frequencyCap?.perHour ?? 0,
      perDay: def?.frequencyCap?.perDay ?? 0,
    };
  }

  getFrequencyCapMap(): FrequencyCapMap {
    return { ...(this.config.freqCap ?? {}) };
  }

  getRuntimeConfig(): AdsRuntimeConfig {
    return this.config;
  }
}
