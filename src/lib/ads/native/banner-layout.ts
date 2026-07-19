/**
 * Layout helpers for native top banners (AdMob overlay + WebView spacer).
 */

import { Capacitor } from '@capacitor/core';

/** Tailwind padding below safe area to clear fixed adaptive top banner (~50–90px). */
export const BANNER_TOP_CLEARANCE_CLASS = 'pt-20';

/** Extra clearance when AppHeader is hidden (toss/playing) — content starts at main top. */
export const BANNER_TOP_CLEARANCE_GAME_CLASS = 'pt-24';

/** Fallback when Android WebView reports 0 for env(safe-area-inset-top) with overlay status bar. */
const ANDROID_STATUS_BAR_FALLBACK_PX = 28;

/** Read CSS safe-area-inset-top in px (viewport-fit=cover). */
export function readSafeAreaInsetTop(): number {
  if (typeof document === 'undefined') return 0;

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;left:0;height:env(safe-area-inset-top);pointer-events:none;visibility:hidden';
  document.body.appendChild(probe);
  const inset = Math.round(probe.getBoundingClientRect().height);
  document.body.removeChild(probe);
  return Math.max(0, inset);
}

/** Top margin for AdMob TOP_CENTER — must clear status bar on overlay WebViews. */
export function measureBannerTopMargin(anchor: HTMLElement | null): number {
  const anchorTop = anchor ? Math.round(anchor.getBoundingClientRect().top) : 0;
  const safeTop = readSafeAreaInsetTop();
  let margin = Math.max(anchorTop, safeTop);

  if (margin === 0 && Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    margin = ANDROID_STATUS_BAR_FALLBACK_PX;
  }

  return margin;
}
