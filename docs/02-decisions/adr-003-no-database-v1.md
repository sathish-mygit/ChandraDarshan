# ADR-003: No local database in v1

## Status

Accepted

## Context

WardrobeWise uses PGlite, migrations, and backup services. Chandra Darshan v1 is read-heavy: today’s panchang, language, city, and simple preferences. A full database adds complexity without clear v1 benefit.

## Options considered

1. **PGlite / SQLite** (WardrobeWise pattern) — powerful, heavy for v1.
2. **Capacitor Preferences only** — key/value for language, location, daily panchang cache.
3. **Firestore sync** — cloud persistence; network and scope creep.

## Decision

**No database in v1.** Use `@capacitor/preferences` for settings and panchang cache. Revisit only if we need history, favorites, or sync across devices.

## Consequences

- Positive: Smaller app init; no migrations or backup code to port.
- Positive: Faster Phase 1–2 delivery.
- Negative: No built-in history of past tithis or multi-device sync until a later ADR.
