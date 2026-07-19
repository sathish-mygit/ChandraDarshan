'use client';

import { useEffect, useState, useCallback } from 'react';
import type {
  DiagnosticsSnapshot,
  SessionAttemptEntry,
  SimulationOverrides,
  PolicyMode,
} from './types';
import { buildDiagnosticsSnapshot } from './snapshot';
import {
  readSimulationOverrides,
  writeSimulationOverrides,
  clearSimulationOverrides,
} from './simulation';
import {
  readAdUnitModeOverride,
  writeAdUnitModeOverride,
} from './ad-unit-mode';
import { formatDiagnosticsReport } from './export-report';
import adService from '../core/AdService';
import type { DecisionLogEntry } from '../decision/types';

export interface UseAdDiagnosticsReturn {
  snapshot: DiagnosticsSnapshot | null;
  sessionLog: SessionAttemptEntry[];
  decisionLog: DecisionLogEntry[];
  policyMode: PolicyMode;
  setPolicyMode: (mode: PolicyMode) => void;
  simulationOverrides: SimulationOverrides;
  setSimulationOverrides: (overrides: SimulationOverrides) => void;
  clearSimulation: () => void;
  testShowInterstitial: (placement: string) => Promise<boolean>;
  testPreloadInterstitial: (placement: string) => Promise<void>;
  simulateNavigation: (from: string, to: string) => Promise<void>;
  simulateSettingsBackup: () => Promise<void>;
  simulateSettingsRestore: () => Promise<void>;
  evaluateAllPlacements: () => Promise<void>;
  refresh: () => Promise<void>;
  exportReport: () => string;
  useProductionAdUnits: boolean;
  setUseProductionAdUnits: (enabled: boolean) => Promise<void>;
  openAdInspector: () => Promise<void>;
}

export function useAdDiagnostics(
  placements: string[],
  resolvePlacement?: (route: string) => string | null
): UseAdDiagnosticsReturn {
  const [snapshot, setSnapshot] = useState<DiagnosticsSnapshot | null>(null);
  const [sessionLog, setSessionLog] = useState<SessionAttemptEntry[]>([]);
  const [decisionLog, setDecisionLog] = useState<DecisionLogEntry[]>([]);
  const [policyMode, setPolicyMode] = useState<PolicyMode>('production');
  const [simulationOverrides, setSimulationOverridesState] =
    useState<SimulationOverrides>(() => readSimulationOverrides());

  const refresh = useCallback(async () => {
    const newSnapshot = await buildDiagnosticsSnapshot(adService, placements, policyMode);
    setSnapshot(newSnapshot);
    setSessionLog(adService.getSessionAttemptLog().slice(-20));
    setDecisionLog(adService.getDecisionLog().slice(-20));
  }, [placements, policyMode]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- diagnostics polling
    void refresh();
    const interval = setInterval(() => void refresh(), 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  const setSimulationOverrides = useCallback(
    (overrides: SimulationOverrides) => {
      adService.setSimulationOverrides(overrides);
      writeSimulationOverrides(overrides);
      setSimulationOverridesState(overrides);
      void refresh();
    },
    [refresh]
  );

  const clearSimulation = useCallback(() => {
    adService.clearSimulationOverrides();
    clearSimulationOverrides();
    setSimulationOverridesState({});
    void refresh();
  }, [refresh]);

  const testShowInterstitial = useCallback(
    async (placement: string): Promise<boolean> => {
      const debug = policyMode === 'admob_only';
      try {
        const shown = await adService.showInterstitial(placement, { debug });
        void refresh();
        return shown;
      } catch {
        return false;
      }
    },
    [policyMode, refresh]
  );

  const testPreloadInterstitial = useCallback(
    async (placement: string) => {
      await adService.maybePreloadInterstitial(placement);
      void refresh();
    },
    [refresh]
  );

  const simulateNavigation = useCallback(
    async (from: string, to: string) => {
      if (!resolvePlacement) return;
      await adService.simulateNavigation(from, to, resolvePlacement);
      void refresh();
    },
    [resolvePlacement, refresh]
  );

  const simulateSettingsBackup = useCallback(async () => {
    await adService.simulateSettingsBackup();
    void refresh();
  }, [refresh]);

  const simulateSettingsRestore = useCallback(async () => {
    await adService.simulateSettingsRestore();
    void refresh();
  }, [refresh]);

  const evaluateAllPlacements = useCallback(async () => {
    await adService.evaluateAllPlacements(placements);
    void refresh();
  }, [placements, refresh]);

  const exportReport = useCallback((): string => {
    if (!snapshot) return '';
    return formatDiagnosticsReport(snapshot, sessionLog).formattedText;
  }, [snapshot, sessionLog]);

  const useProductionAdUnits =
    snapshot?.adUnitMode.effective ??
    (readAdUnitModeOverride() ?? true);

  const setUseProductionAdUnits = useCallback(
    async (enabled: boolean) => {
      writeAdUnitModeOverride(enabled);
      await adService.reinitializeAdProvider();
      void refresh();
    },
    [refresh]
  );

  const openAdInspector = useCallback(async () => {
    const { openAdInspector: open } = await import('../native/ad-inspector');
    await open();
  }, []);

  return {
    snapshot,
    sessionLog,
    decisionLog,
    policyMode,
    setPolicyMode,
    simulationOverrides,
    setSimulationOverrides,
    clearSimulation,
    testShowInterstitial,
    testPreloadInterstitial,
    simulateNavigation,
    simulateSettingsBackup,
    simulateSettingsRestore,
    evaluateAllPlacements,
    refresh,
    exportReport,
    useProductionAdUnits,
    setUseProductionAdUnits,
    openAdInspector,
  };
}
