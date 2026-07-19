import type { DiagnosticsSnapshot, SessionAttemptEntry, DiagnosticsExportReport } from './types';

export function formatDiagnosticsReport(
  snapshot: DiagnosticsSnapshot,
  recentAttempts: SessionAttemptEntry[]
): DiagnosticsExportReport {
  const lines: string[] = [];

  lines.push('=== WardrobeWise Ad Diagnostics Report ===');
  lines.push(`Timestamp: ${new Date(snapshot.timestamp).toISOString()}`);
  lines.push(`Policy Mode: ${snapshot.policyMode}`);
  lines.push('');

  lines.push('--- Status ---');
  lines.push(`Init Ready: ${snapshot.initReady}`);
  lines.push(`Consent Given: ${snapshot.consentGiven}`);
  lines.push(`IVT Paused: ${snapshot.ivtPaused}`);
  lines.push(`Simulation Active: ${snapshot.simulationActive}`);
  lines.push('');

  lines.push('--- Placement Status ---');
  for (const p of snapshot.placements) {
    lines.push(`${p.placement}: ${p.toggle ? 'ON' : 'OFF'}`);
    if (p.showBlock) {
      lines.push(
        `  Show blocked: [${p.showBlock.ruleId}] ${p.showBlock.message}`
      );
      if (p.showBlock.hint) {
        lines.push(`  → ${p.showBlock.hint}`);
      }
    } else {
      lines.push('  Show: Ready');
    }
    if (p.preloadBlock) {
      lines.push(
        `  Preload blocked: [${p.preloadBlock.ruleId}] ${p.preloadBlock.message}`
      );
    } else {
      lines.push('  Preload: Ready');
    }
  }
  lines.push('');

  lines.push('--- Limits ---');
  lines.push(
    `Wardrobe: ${snapshot.limits.wardrobe.current ?? '?'} / ${snapshot.limits.wardrobe.globalMin} (global min)`
  );
  lines.push(
    `Interstitial Session: ${snapshot.limits.interstitial.shownThisSession} / ${snapshot.limits.interstitial.maxPerSession}`
  );
  lines.push(
    `Interstitial Interval: ${snapshot.limits.interstitial.minIntervalMs}ms (${snapshot.limits.interstitial.cooldownSec}s cooldown)`
  );
  lines.push(
    `IVT Clicks: ${snapshot.limits.ivt.sessionClicks} / ${snapshot.limits.ivt.maxClicksPerSession} session`
  );
  lines.push('');

  lines.push('--- Recent Attempts (last 20) ---');
  for (const entry of recentAttempts) {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    const phase = entry.phase ? ` [${entry.phase}]` : '';
    const ruleId = entry.ruleId ? ` (${entry.ruleId})` : '';
    const status = entry.allowed ? '✓' : '✗';
    lines.push(
      `${time} ${status} ${entry.kind}${phase} ${entry.placement}${ruleId}: ${entry.message}`
    );
  }

  const formattedText = lines.join('\n');

  return {
    timestamp: snapshot.timestamp,
    snapshot,
    recentAttempts,
    formattedText,
  };
}
