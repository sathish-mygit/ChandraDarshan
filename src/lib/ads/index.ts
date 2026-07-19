export { adService, AdService, resolveEnabledNetworks, type ShowAdOptions, type AdProviderEvent } from './core/AdService';
export * from './core/types';
export { PlacementRegistry } from './config/PlacementRegistry';
export { DEFAULT_IVT_CONFIG } from './config/ivt-defaults';
export {
  CORE_IVT_RC_KEY_MAP,
  mergeIvtRemoteConfig,
  parseIvtRemoteValue,
  routeIvtRemoteValue,
  type FreqCapRemoteRouting,
} from './config/ivt-remote-config';
export { NewUserManager } from './lifecycle/NewUserManager';
export { useAdService, useNativeAd } from './hooks/useNativeAd';
export { useNavigationInterstitial } from './hooks/useNavigationInterstitial';
export { useAdSessionAnalytics } from './hooks/useAdSessionAnalytics';
export { runWithParallelInterstitial } from './hooks/runWithParallelInterstitial';
export type { ParallelInterstitialResult } from './hooks/runWithParallelInterstitial';
export { showInterstitialOnTransition } from './hooks/showInterstitialOnTransition';
export { AdAnalyticsEvent } from './analytics/AdAnalyticsEvent';
export { IvtGuard, ClickLimiter, FrequencyCapTracker } from './safeguards';
export * from './diagnostics';
export type { AdDecisionContext, DecisionResult } from './decision';

import { adService } from './core/AdService';
export default adService;
