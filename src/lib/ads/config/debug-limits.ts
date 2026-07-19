import type { DebugLimitOverrides } from '../core/types';

export const DEBUG_LIMITS_STORAGE_KEY = 'ads:debug:limits';

export function readDebugLimitOverrides(): DebugLimitOverrides {
  if (typeof sessionStorage === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(DEBUG_LIMITS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DebugLimitOverrides) : {};
  } catch {
    return {};
  }
}

export function writeDebugLimitOverrides(overrides: DebugLimitOverrides): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    if (Object.keys(overrides).length === 0) {
      sessionStorage.removeItem(DEBUG_LIMITS_STORAGE_KEY);
    } else {
      sessionStorage.setItem(DEBUG_LIMITS_STORAGE_KEY, JSON.stringify(overrides));
    }
  } catch {
    // ignore
  }
}

export function clearDebugLimitOverrides(): void {
  writeDebugLimitOverrides({});
}

export function hasActiveDebugOverrides(overrides: DebugLimitOverrides): boolean {
  return Object.keys(overrides).length > 0;
}
