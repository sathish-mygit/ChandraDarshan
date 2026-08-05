import type { ExplainedInsight } from '../types';

/** Count whole-sign houses from a reference rashi (0–11) to a target rashi (0–11). */
export function houseFromReference(
  referenceRashiIndex: number,
  targetRashiIndex: number,
): number {
  return ((targetRashiIndex - referenceRashiIndex + 12) % 12) + 1;
}

export function buildExplainedInsight(
  fields: ExplainedInsight,
): ExplainedInsight {
  return fields;
}

export function ordinalHouse(house: number, language: string): string {
  if (language === 'hi' || language === 'sa') {
    return `${house}`;
  }
  const suffix =
    house % 10 === 1 && house !== 11
      ? 'st'
      : house % 10 === 2 && house !== 12
        ? 'nd'
        : house % 10 === 3 && house !== 13
          ? 'rd'
          : 'th';
  return `${house}${suffix}`;
}
