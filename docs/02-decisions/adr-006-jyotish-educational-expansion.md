# ADR-006: Educational Jyotish expansion

## Status

Accepted

## Context

ADR-004 scoped Jyotish to templated daily guidance without event predictions. Users wanted deeper personalization while staying offline and beginner-friendly. The product should explain *why* each insight appears, not read like fortune-telling.

## Options considered

1. **AI-generated daily readings** — flexible prose, needs model + disclaimer burden (deferred in ADR-004).
2. **External astrology API** — rich interpretations, needs network and keys.
3. **Expand offline `panchang-ts` usage + educational UI** — transits, Navamsa, dignities, doshas, Tithi Pravesha, explained insight cards.

## Decision

Expand the Jyotish tab with four sub-tabs (**Today | Chart | Timeline | Learn**) and a reusable **ExplainedInsight** pattern: what / how / why / practical for every computed insight.

Add offline computation for:
- Explained daily reading (Chandra Balam, Tarabala, dasha, Sade Sati)
- Slow-graha transits (Saturn, Jupiter, Rahu)
- Choghadiya and Rahu Kalam windows
- Chart depth (Navamsa, yogas with reasons, dignities, doshas) when birth time is known
- Transit milestones and annual Tithi Pravesha outlook on Timeline
- Glossary browser and how-it-works articles on Learn

Explicit boundary: no event fortune-telling (marriage date, job offer, illness). Period themes and timing windows only.

## Consequences

- Positive: Much richer personalization without backend or AI.
- Positive: Educational framing builds trust and teaches classical rules.
- Negative: Large i18n surface (~200+ new strings across 5 languages).
- Negative: Jyotish UI complexity increases; sub-tabs mitigate scroll fatigue.
