# ADR-004: Offline personal Jyotish scope

## Status

Accepted

## Context

Phase 2 delivered daily Panchang. Users want personal astrology: birth chart, daily relevance, and beginner-friendly explanations — without a backend or paid API.

## Options considered

1. **External astrology API** — rich interpretations, needs network and keys.
2. **Full kundli app** — divisional charts, matching, doshas, KP — large scope.
3. **`panchang-ts` on device** — birth chart, Chandra Balam, Tarabala, Vimshottari dasha, Sade Sati offline.
4. **AI daily readings** — flexible text, needs model + disclaimer burden.

## Decision

Add a **Jyotish** tab (`/jyotish/`) using **`panchang-ts`** locally:

- Birth profile in `@capacitor/preferences` (optional birth time).
- Without time: moon rashi/nakshatra + daily personal insights.
- With time: whole-sign D1 chart (lagna + planets in houses).
- Glossary tooltips and templated guidance — not event predictions.
- Disclaimer on Jyotish screens.

Defer: kundli wheel SVG, Navamsa, doshas, matching, multiple profiles, AI readings.

## Consequences

- Positive: Extends product without new dependencies or database.
- Positive: Beginner education built into UI.
- Negative: Birth time unknown limits lagna/houses accuracy.
- Negative: Interpretations are simplified templates, not pandit-grade counsel.
