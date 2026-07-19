'use client';

import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Placement } from '@/config/placements';
import {
  DEBUG_PLACEMENT_MATRIX,
  formatEngagementLabel,
  getPlacementLabel,
} from '@/config/ads-diagnostics';
import { useAdDiagnostics } from '@/lib/ads';
import {
  hasVisitedJyotishThisSession,
  resetJyotishVisit,
} from '@/lib/ads/jyotish-visit-tracker';
import { adService } from '@/lib/ads';
import { resolveNavInterstitialPlacement } from '@/lib/ads/placement-resolver';

function resolveTransitionPlacement(toRoute: string): string | null {
  return resolveNavInterstitialPlacement(toRoute);
}

export function AdDiagnosticsPanel() {
  const debugApp = process.env.NEXT_PUBLIC_TEST_MODE !== 'false';
  const {
    snapshot,
    sessionLog,
    testShowInterstitial,
    testPreloadInterstitial,
    evaluateAllPlacements,
    exportReport,
    openAdInspector,
  } = useAdDiagnostics(DEBUG_PLACEMENT_MATRIX, resolveTransitionPlacement);

  const [message, setMessage] = useState('');
  const [astroVisited, setAstroVisited] = useState(hasVisitedJyotishThisSession());

  const showMsg = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  if (!debugApp) {
    return null;
  }

  if (!Capacitor.isNativePlatform()) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5 text-sm text-slate-400">
        Ad diagnostics are available on native Android only.
      </section>
    );
  }

  if (!snapshot) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5 text-sm text-slate-400">
        Loading ad diagnostics…
      </section>
    );
  }

  const fallbackAds = adService.getRuntimeConfig().fallbackAds ?? {};

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-card/60 p-5">
      <div>
        <h2 className="text-sm font-medium text-amber-100">Ad diagnostics</h2>
        <p className="mt-1 text-xs text-slate-400">Test mode only — native Android</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-800 px-2 py-1">
          Init {snapshot.initReady ? 'ready' : 'pending'}
        </span>
        <span className="rounded-full bg-slate-800 px-2 py-1">
          IVT {snapshot.ivtPaused ? 'paused' : 'active'}
        </span>
        <span className="rounded-full bg-slate-800 px-2 py-1">
          Astro visited: {astroVisited ? 'yes' : 'no'}
        </span>
      </div>

      <div className="text-xs text-slate-300 space-y-1">
        <p>
          Fallback:{' '}
          {fallbackAds.enableWhenJyotishNotVisited ? 'on' : 'off'} · home{' '}
          {fallbackAds.enableHomePlacement ? 'on' : 'off'} · settings{' '}
          {fallbackAds.enableSettingsPlacement ? 'on' : 'off'}
        </p>
        <p>
          Engagement:{' '}
          {snapshot.limits.wardrobe.gatesDisabled
            ? 'gates bypassed'
            : formatEngagementLabel(
                snapshot.limits.wardrobe.current,
                snapshot.limits.wardrobe.globalMin,
              )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-amber-200 hover:bg-slate-800"
          onClick={() => {
            resetJyotishVisit();
            setAstroVisited(false);
            showMsg('Astro visit reset for this session');
          }}
        >
          Reset Astro visit
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-amber-200 hover:bg-slate-800"
          onClick={() =>
            void testShowInterstitial(Placement.INTERSTITIAL_TO_JYOTISH).then((ok) =>
              showMsg(ok ? 'Interstitial shown' : 'Blocked'),
            )
          }
        >
          Test Astro interstitial
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-amber-200 hover:bg-slate-800"
          onClick={() =>
            void testPreloadInterstitial(Placement.INTERSTITIAL_TO_JYOTISH).then(() =>
              showMsg('Preload requested'),
            )
          }
        >
          Preload Astro
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-amber-200 hover:bg-slate-800"
          onClick={() => evaluateAllPlacements()}
        >
          Evaluate all
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-amber-200 hover:bg-slate-800"
          onClick={() => exportReport()}
        >
          Export report
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-amber-200 hover:bg-slate-800"
          onClick={() => void openAdInspector().catch((err) => showMsg(String(err)))}
        >
          Ad Inspector
        </button>
      </div>

      <div className="space-y-1 font-mono text-xs text-slate-400">
        {DEBUG_PLACEMENT_MATRIX.map((key) => {
          const diag = snapshot.placements.find((p) => p.placement === key);
          return (
            <div key={key} className="flex justify-between gap-2">
              <span>{getPlacementLabel(key)}</span>
              <span>{diag?.toggle ? 'on' : 'off'}</span>
            </div>
          );
        })}
      </div>

      {sessionLog.length > 0 && (
        <div className="max-h-32 overflow-y-auto font-mono text-xs text-slate-500 space-y-1">
          {sessionLog.slice(-15).map((entry, index) => (
            <div key={index}>{entry.message ?? entry.kind}</div>
          ))}
        </div>
      )}

      {message ? <p className="text-xs text-amber-300">{message}</p> : null}
    </section>
  );
}
