import type { AdSkipReason } from '../core/types';

/** Map a human block-reason string to analytics skip reason + console logging. */
export function mapBlockReasonToSkipReason(reason: string): AdSkipReason {
  if (reason.includes('IVT pause')) return 'ivt_pause';
  if (reason.includes('Frequency cap')) return 'frequency_cap';
  if (reason.includes('Consent')) return 'consent';
  if (reason.includes('Engagement gate')) return 'engagement_gate';
  if (reason.includes('Rate limit')) return 'rate_limit';
  if (reason.includes('disabled')) return 'disabled';
  return 'disabled';
}
