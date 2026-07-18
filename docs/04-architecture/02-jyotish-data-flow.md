# Jyotish data flow

Personal astrology: birth profile, natal snapshot, and daily “For you” insights.

## Routes

| Route | Role |
|-------|------|
| `/` | Daily Panchang (Chandra Darshan) |
| `/jyotish/` | Birth profile, personal today, natal chart |
| `/settings/` | Language, location, masa system, birth profile link |

Bottom tab bar: **Today** | **Jyotish**. Settings via header icon.

## Birth profile

Stored in `app.preferences.v2` as `birthProfile`:

| Field | Purpose |
|-------|---------|
| `birthDate` | YYYY-MM-DD |
| `birthTime` | HH:mm local at birth place (optional) |
| `timeUnknown` | If true, use local noon for moon; skip lagna/houses |
| `birthLocation` | Lat/lon/timezone for birth chart |

## Computation

### Natal ([`src/lib/jyotish/natal.ts`](../../src/lib/jyotish/natal.ts))

- `getInstantPanchang` at birth instant → moon rashi, nakshatra
- If time known: `computeRashiChart` (whole-sign) → lagna, 9 grahas in houses

### Personal today ([`src/lib/jyotish/personal-today.ts`](../../src/lib/jyotish/personal-today.ts))

1. `getDailyPanchang` with `janmaRashi` + `janmaNakshatra` → Chandra Balam, Tarabala
2. `computeVimshottariDashaFromBirth` → active Maha/Antar dasha
3. `computeSadeSati` → Saturn phase vs birth moon
4. Glossary templates → guidance text

Cache: `jyotish.personal.v1`, invalidated at `nextSunrise` (same pattern as Panchang cache).

## Education layer

[`src/lib/i18n/glossary.ts`](../../src/lib/i18n/glossary.ts) — term definitions and daily guidance templates. [`LearnTooltip`](../../src/components/LearnTooltip.tsx) on Jyotish cards.

## Key paths

| Path | Role |
|------|------|
| `src/app/jyotish/JyotishClient.tsx` | Jyotish page |
| `src/components/BottomNav.tsx` | Tab navigation |
| `src/hooks/usePersonalToday.ts` | Daily personal data |
| `src/hooks/useNatalChart.ts` | Natal snapshot |

See [ADR-004](../02-decisions/adr-004-jyotish-scope.md) for scope boundaries.
