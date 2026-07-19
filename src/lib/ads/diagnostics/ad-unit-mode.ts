const AD_UNIT_MODE_STORAGE_KEY = 'ads:diagnostics:useProductionUnits';

export function readAdUnitModeOverride(): boolean | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(AD_UNIT_MODE_STORAGE_KEY);
    if (raw === null) return null;
    return raw === 'true';
  } catch {
    return null;
  }
}

export function writeAdUnitModeOverride(useProductionUnits: boolean): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(AD_UNIT_MODE_STORAGE_KEY, String(useProductionUnits));
  } catch {
    // ignore
  }
}

export function clearAdUnitModeOverride(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(AD_UNIT_MODE_STORAGE_KEY);
  } catch {
    // ignore
  }
}
