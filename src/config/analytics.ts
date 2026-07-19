/** Firebase Analytics is on only when explicitly enabled at build time. */
export function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
}
