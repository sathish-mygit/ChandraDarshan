# Kundali match data flow

Offline North Indian Ashtakoot matching with Mangal pairing and chart synastry.

## Routes

| Route | Role |
|-------|------|
| `/match/` | Self + partner profiles → Ashtakoot score, doshas, synastry |

Bottom tab bar: **Today** | **Jyotish** | **Match** | **Settings**.

## Profiles

| Key | Purpose |
|-----|---------|
| `birthProfile` | Self — shared with Jyotish tab |
| `partnerBirthProfile` | Partner for matching only |

Both stored in `app.preferences.v2`. Classical tables use self as first chart (groom), partner as second (bride).

## Computation chain

1. `computeNatalSnapshot` ×2 → Moon rashi/nakshatra indices
2. `computeAshtakoot` → 8 gunas, total /36, Nadi/Bhakoot flags
3. `computeMangalPairing` → cross-chart Mangal Dosha (birth time required for full check)
4. `computeChartSynastry` → lagna, 7th house, Venus/Jupiter, Navamsa (both times required)
5. `computeKundaliMatch` → orchestrator + i18n ExplainedInsight cards

## UI

| Path | Role |
|------|------|
| `src/app/match/MatchClient.tsx` | Profile gates + edit forms |
| `src/components/KundaliMatchContent.tsx` | Score, gunas, Mangal, synastry |
| `src/hooks/useKundaliMatch.ts` | Memoized view model |

See [ADR-007](../02-decisions/adr-007-kundali-matching.md).
