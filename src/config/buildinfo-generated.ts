/**
 * Local fallback when buildinfo-generated.ts is absent (before first `npm run build`).
 * Overwritten on each build by scripts/increment-build.cjs.
 */
export interface BuildInfo {
  buildNumber: number;
  branchName: string;
  buildDate: string;
  formattedBuild: string;
}

export const buildInfo: BuildInfo = {
  buildNumber: 0,
  branchName: 'local',
  buildDate: 'n/a',
  formattedBuild: 'local dev',
};
