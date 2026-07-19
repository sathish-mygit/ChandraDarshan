const STORAGE_KEY = 'ads:astro:visited';

export function markJyotishVisited(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  } catch {
    // ignore
  }
}

export function hasVisitedJyotishThisSession(): boolean {
  try {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function resetJyotishVisit(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
