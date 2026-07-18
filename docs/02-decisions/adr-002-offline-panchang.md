# ADR-002: Offline Panchang via panchang-ts

## Status

Accepted

## Context

The app must show accurate tithi, paksha, maasa, and samvatsara for the user’s location. Many users may open it daily without reliable network. Calendar data should not depend on a paid or rate-limited API.

## Options considered

1. **External Panchang API** (DivineAPI, DevDarsha) — fast MVP, needs network and API keys.
2. **Mock data first, API later** — good for UI only, not shippable product.
3. **panchang-ts on device** — pure TypeScript, Lahiri ayanamsa, ~0.5 ms per calculation.
4. **Python/backend library** — accurate but requires hosted API for mobile.

## Decision

Use **`panchang-ts`** locally in the Capacitor WebView. Cache daily results in `@capacitor/preferences`. Invalidate cache at local sunrise. Location from GPS or preset cities (lat/lon + timezone).

## Consequences

- Positive: Works in airplane mode; no API cost or keys for calendar.
- Positive: Location-aware tithi (~99%+ alignment with Drik Panchang using Lahiri).
- Negative: Must implement location picker, cache keys, and Sanskrit labels via our own term map (`en`/`hi` from library, `sa` from `terms.ts`).
- Negative: Firebase/ads still need network; only calendar is offline.
