/** Generic rule ID to hint mapping — portable across apps */

export interface RuleHint {
  label: string;
  hint: string;
}

export const RULE_HINTS: Record<string, RuleHint> = {
  not_initialized: {
    label: 'Not initialized',
    hint: 'Ad service still initializing. Try again in a moment.',
  },
  master_disabled: {
    label: 'Master disabled',
    hint: 'Master ads toggle is off in settings.',
  },
  placement_disabled: {
    label: 'Placement off',
    hint: 'This placement is disabled in settings or Remote Config.',
  },
  consent_blocked: {
    label: 'No consent',
    hint: 'User has not given ad consent.',
  },
  ivt_paused: {
    label: 'IVT paused',
    hint: 'Click limit exceeded. Ads paused for safety.',
  },
  engagement_gate: {
    label: 'Engagement gate',
    hint: 'User does not meet minimum engagement requirement.',
  },
  frequency_cap: {
    label: 'Frequency cap',
    hint: 'Too many ad impressions in this period.',
  },
  session_rate_limit: {
    label: 'Session limit',
    hint: 'Max ads per session reached.',
  },
  min_interval: {
    label: 'Cooldown active',
    hint: 'Minimum time between ads not met.',
  },
  preload_debounce: {
    label: 'Preload debounce',
    hint: 'Preload cooldown active to avoid excessive loading.',
  },
  provider_not_ready: {
    label: 'Ad not ready',
    hint: 'AdMob ad still loading or failed to prepare.',
  },
};

export function getRuleHint(ruleId?: string): RuleHint | undefined {
  if (!ruleId) return undefined;
  return RULE_HINTS[ruleId];
}

export function getRuleLabel(ruleId?: string): string {
  return getRuleHint(ruleId)?.label ?? 'Unknown';
}

export function getRuleHintText(ruleId?: string): string {
  return getRuleHint(ruleId)?.hint ?? 'An unknown rule blocked this ad.';
}
