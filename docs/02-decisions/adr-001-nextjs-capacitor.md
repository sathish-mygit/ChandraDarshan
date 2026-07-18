# ADR-001: Next.js + Capacitor (Android first)

## Status

Accepted

## Context

Chandra Darshan is a daily lunar calendar app (moon phase, tithi, paksha, maasa). The author already ships **WardrobeWise** using Next.js 16 + Capacitor 8. Reusing that stack reduces learning curve and allows porting Firebase, Remote Config, and AdMob patterns.

## Options considered

1. **Next.js + Capacitor** — static export in WebView; same as WardrobeWise.
2. **React + Vite + Capacitor** — simpler build, but new pattern vs existing apps.
3. **React Native (Expo)** — native UI; would rewrite UI layer and diverge from WardrobeWise.
4. **Flutter** — new language and ecosystem.

## Decision

Use **Next.js 16** (static export, `output: 'export'`) + **Capacitor 8**, **Android first**. Mirror WardrobeWise for build scripts, branch-based `capacitor.config.ts`, and Firebase integration (simplified).

## Consequences

- Positive: Reuse proven pipeline; one codebase for optional web landing later.
- Positive: Author’s existing skills transfer directly.
- Negative: UI runs in WebView (acceptable for this product).
- Negative: Next.js server features (SSR, API routes) are not used inside the APK.
