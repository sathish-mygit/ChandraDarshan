import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  readSimulationOverrides,
  writeSimulationOverrides,
  clearSimulationOverrides,
  hasActiveSimulation,
} from './simulation';

describe('simulation overrides', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    });
    clearSimulationOverrides();
  });

  it('persists and reads engagement count override', () => {
    writeSimulationOverrides({ engagementCount: 0, engagementMin: 5 });
    const overrides = readSimulationOverrides();
    expect(overrides.engagementCount).toBe(0);
    expect(overrides.engagementMin).toBe(5);
    expect(hasActiveSimulation(overrides)).toBe(true);
  });

  it('persists freq cap hour/day usage overrides', () => {
    writeSimulationOverrides({
      freqCap: {
        'interstitial.toPlanner': { perHour: 2, hourUsed: 2 },
      },
    });
    const overrides = readSimulationOverrides();
    expect(overrides.freqCap?.['interstitial.toPlanner']?.hourUsed).toBe(2);
  });

  it('clears all overrides', () => {
    writeSimulationOverrides({ ivtPaused: true });
    clearSimulationOverrides();
    expect(hasActiveSimulation(readSimulationOverrides())).toBe(false);
  });
});
