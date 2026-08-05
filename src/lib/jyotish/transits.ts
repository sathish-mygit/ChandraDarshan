import { computePlanetaryPositions } from 'panchang-ts';
import type { AppLanguage, ExplainedInsight, NatalSnapshot } from '../types';
import {
  buildTransitInsight,
  getHouseTheme,
} from '../i18n/jyotish-explanations';
import { houseFromReference } from './explained-insight';

const SLOW_GRAHAS = ['Saturn', 'Jupiter', 'Rahu'] as const;

type SlowGraha = (typeof SLOW_GRAHAS)[number];

function grahaPosition(
  positions: ReturnType<typeof computePlanetaryPositions>,
  planet: SlowGraha,
) {
  switch (planet) {
    case 'Saturn':
      return positions.saturn;
    case 'Jupiter':
      return positions.jupiter;
    case 'Rahu':
      return positions.rahu;
  }
}

function scoreTransit(
  planet: SlowGraha,
  houseFromMoon: number,
  houseFromLagna?: number,
): number {
  let score = planet === 'Saturn' ? 3 : planet === 'Jupiter' ? 2 : 1;
  if ([1, 4, 7, 10].includes(houseFromMoon)) {
    score += 2;
  }
  if (houseFromLagna && [1, 4, 7, 10].includes(houseFromLagna)) {
    score += 1;
  }
  return score;
}

export function buildTopTransitInsights(
  natal: NatalSnapshot,
  language: AppLanguage,
  now: Date = new Date(),
  limit = 3,
): ExplainedInsight[] {
  const positions = computePlanetaryPositions(now, 'lahiri');

  const ranked = SLOW_GRAHAS.map((planet) => {
    const graha = grahaPosition(positions, planet);
    const houseFromMoon = houseFromReference(
      natal.moonRashiIndex,
      graha.rashi.index,
    );
    const houseFromLagna =
      natal.lagnaRashiIndex !== undefined
        ? houseFromReference(natal.lagnaRashiIndex, graha.rashi.index)
        : undefined;

    return {
      planet,
      graha,
      houseFromMoon,
      houseFromLagna,
      score: scoreTransit(planet, houseFromMoon, houseFromLagna),
    };
  }).sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit).map((entry) =>
    buildTransitInsight(
      entry.planet,
      entry.graha.rashi.name,
      natal.moonRashi,
      entry.houseFromMoon,
      entry.houseFromLagna,
      getHouseTheme(entry.houseFromMoon, language),
      language,
    ),
  );
}

export { houseFromReference };
