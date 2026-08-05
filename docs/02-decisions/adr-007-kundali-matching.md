# ADR-007: Offline Kundali matching (Ashtakoot)

## Status

Accepted

## Context

Users requested marriage compatibility (Gun Milan / Ashtakoot) alongside personal Jyotish. ADR-004 deferred matching; ADR-006 established offline educational Jyotish with ExplainedInsight cards and no event fortune-telling.

## Options considered

1. **External matching API** — needs network and keys.
2. **Jyotish sub-tab** — adds fifth sub-tab; crowded next to Today/Chart/Timeline/Learn.
3. **Dedicated `/match/` bottom tab** — discoverable; keeps Jyotish personal.
4. **South Indian Porutham first** — different tables; North Indian users expect 36-point Ashtakoot.

## Decision

Add a **Match** bottom tab (`/match/`) with offline **North Indian Ashtakoot** (8 gunas, 36 points), **Mangal cross-check**, and **chart synastry** (7th house, Venus/Jupiter, Navamsa) when both profiles have birth time.

- Store optional `partnerBirthProfile` in `app.preferences.v2` (single partner; no profile database — ADR-003).
- Self profile remains `birthProfile` for existing Jyotish flows.
- Classical groom-bride table convention: self = first chart, partner = second (documented in UI).
- Educational framing only — no marriage-date or outcome predictions (ADR-006 boundary).

Defer: Porutham/Dashakoot, multiple partners, ayur matching, kundli wheel.

## Consequences

- Positive: High-value feature fully offline with existing `panchang-ts` stack.
- Positive: Clear product separation — personal Jyotish vs pair matching.
- Negative: Large i18n surface across five languages.
- Negative: Four bottom tabs; labels must stay short on small screens.
