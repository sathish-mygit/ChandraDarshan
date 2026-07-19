import type { SimulationOverrides } from './types';

const SIMULATION_STORAGE_KEY = 'ads:diagnostics:simulation';

export function readSimulationOverrides(): SimulationOverrides {
  if (typeof sessionStorage === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(SIMULATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SimulationOverrides) : {};
  } catch {
    return {};
  }
}

export function writeSimulationOverrides(overrides: SimulationOverrides): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    if (Object.keys(overrides).length === 0) {
      sessionStorage.removeItem(SIMULATION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(overrides));
    }
  } catch {
    // ignore
  }
}

export function clearSimulationOverrides(): void {
  writeSimulationOverrides({});
}

export function hasActiveSimulation(overrides: SimulationOverrides): boolean {
  return Object.keys(overrides).length > 0;
}

export function mergeSimulationOverrides(
  current: SimulationOverrides,
  updates: Partial<SimulationOverrides>
): SimulationOverrides {
  return {
    ...current,
    ...updates,
  };
}
