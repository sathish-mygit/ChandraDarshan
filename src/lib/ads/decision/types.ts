/** Decision phase determines which checks apply */
export type DecisionPhase = 'preload' | 'show';

/** Represents a placement in the ad decision context */
export interface AdDecisionContext {
  placement: string;
  phase: DecisionPhase;
  debug?: boolean;
}

/** Result of ad decision evaluation */
export type DecisionResult =
  | { allowed: true }
  | { allowed: false; ruleId: string; message: string };

/** Engagement gate provider—returns current item/user count */
export type EngagementGateProvider = () => Promise<number>;

/** Frequency cap checker—injected from IvtGuard */
export type FreqCapChecker = (placement: string) => {
  allowed: boolean;
  capType?: 'hour' | 'day';
  capValue?: number;
  currentCount?: number;
};

/** Ad policy snapshot—frozen configuration for decision making */
export interface AdsPolicySnapshot {
  masterEnabled: boolean;
  placementToggles: Record<string, boolean>;
  interstitialLimits: {
    minIntervalMs: number;
    maxPerSession: number;
  };
  ivtConfig: {
    enabled: boolean;
    maxClicksPerSession: number;
    maxClicksPerDay: number;
    pauseDurationMs: number;
  };
  engagement: {
    globalMinEngagementCount: number;
    placementMins: Record<string, number>;
    gatesDisabled?: boolean;
  };
  freqCap: Record<string, { perHour: number; perDay: number }>;
}

/** Log entry for decision history */
export interface DecisionLogEntry {
  placement: string;
  phase: DecisionPhase;
  ruleId: string;
  message: string;
  allowed: boolean;
  timestamp: number;
}
