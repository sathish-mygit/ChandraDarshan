import type { IvtConfig } from '../core/types';

export const DEFAULT_IVT_CONFIG: IvtConfig = {
  enabled: true,
  maxClicksPerSession: 1,
  maxClicksPerDay: 3,
  pauseDurationMs: 86_400_000,
  navigationDelayMs: 800,
};
