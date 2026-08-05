# Jyotish data flow

Personal astrology: birth profile, natal snapshot, explained daily insights, chart depth, and timeline.

## Routes

| Route | Role |
|-------|------|
| `/` | Daily Panchang (Chandra Darshan) |
| `/jyotish/` | Birth profile + sub-tabs: Today, Chart, Timeline, Learn |
| `/match/` | Kundali matching (Ashtakoot + synastry) — see [03-kundali-match-data-flow.md](03-kundali-match-data-flow.md) |
| `/settings/` | Language, location, masa system, birth profile link |

Bottom tab bar: **Today** | **Jyotish** | **Match** | **Settings**.

## Birth profile

Stored in `app.preferences.v2` as `birthProfile`:

| Field | Purpose |
|-------|---------|
| `birthDate` | YYYY-MM-DD |
| `birthTime` | HH:mm local at birth place (optional) |
| `timeUnknown` | If true, use local noon for moon; skip lagna/houses/chart depth |
| `birthLocation` | Lat/lon/timezone for birth chart |

## Jyotish sub-tabs

| Tab | Data source | Birth time |
|-----|-------------|------------|
| **Today** | `fetchPersonalToday` | Optional (moon-based insights work without) |
| **Chart** | `computeChartDepth` + `computeNatalSnapshot` | Required for full chart |
| **Timeline** | `computeLifeDirection` + `computeAnnualOutlook` | Partial (dasha without time; chart-linked transits with time) |
| **Learn** | `glossary.ts` + `jyotish-explanations.ts` articles | — |

## Computation

### Natal ([`src/lib/jyotish/natal.ts`](../../src/lib/jyotish/natal.ts))

- `getInstantPanchang` at birth instant → moon rashi, nakshatra
- If time known: `computeRashiChart` (whole-sign) → lagna, lagnaRashiIndex, 9 grahas in houses

### Personal today ([`src/lib/jyotish/personal-today.ts`](../../src/lib/jyotish/personal-today.ts))

1. `getDailyPanchang` with `janmaRashi` + `janmaNakshatra` → Chandra Balam, Tarabala, choghadiya, Rahu Kalam
2. `computeVimshottariDashaFromBirth` → active Maha/Antar/Pratyantar dasha
3. `computeSadeSati` → Saturn phase vs birth moon
4. `buildExplainedDailyInsights` → what/how/why/practical cards
5. `buildTopTransitInsights` → slow-graha gochara vs natal Moon/lagna

Cache: `jyotish.personal.v6`, invalidated at `nextSunrise`.

### Chart depth ([`src/lib/jyotish/chart-depth.ts`](../../src/lib/jyotish/chart-depth.ts))

- `computeNavamsa` → D9 lagna/moon, Vargottama
- `computeYogas(d1, { navamsa: d9 })` → reasons[]
- `computeDignity` per planet
- `computeMangalDosha`, `computeKaalSarp`, `computePitruDosha`

### Timeline ([`src/lib/jyotish/life-direction.ts`](../../src/lib/jyotish/life-direction.ts), [`life-milestones.ts`](../../src/lib/jyotish/life-milestones.ts), [`annual-outlook.ts`](../../src/lib/jyotish/annual-outlook.ts))

- Vimshottari dasha timeline + Sade Sati arcs
- Jupiter/Saturn sign-change milestones (30-year horizon)
- `computeTithiPravesha` near birthday (±30 days)

## Education layer

- [`ExplainedInsight`](../../src/lib/types.ts) — title, summary, what, how, why, practical
- [`src/lib/i18n/jyotish-explanations.ts`](../../src/lib/i18n/jyotish-explanations.ts) — builders + Learn articles
- [`src/lib/i18n/glossary.ts`](../../src/lib/i18n/glossary.ts) — term definitions
- [`ExplainedInsightCard`](../../src/components/ExplainedInsightCard.tsx) — collapsible UI

## Key paths

| Path | Role |
|------|------|
| `src/app/jyotish/JyotishClient.tsx` | Jyotish page + sub-tab shell |
| `src/components/JyotishTodayTab.tsx` | Today tab |
| `src/components/JyotishChartTab.tsx` | Chart tab |
| `src/components/JyotishTimelineTab.tsx` | Timeline tab |
| `src/components/JyotishLearnTab.tsx` | Learn tab |
| `src/hooks/usePersonalToday.ts` | Daily personal data |
| `src/hooks/useChartDepth.ts` | Chart depth |
| `src/hooks/useAnnualOutlook.ts` | Annual outlook |

See [ADR-004](../02-decisions/adr-004-jyotish-scope.md) for original scope and [ADR-006](../02-decisions/adr-006-jyotish-educational-expansion.md) for this expansion.
