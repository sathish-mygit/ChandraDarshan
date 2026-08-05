import { describe, expect, it } from 'vitest';
import { cityToLocation, CITIES } from '../cities';
import { computeKundaliMatch } from './kundali-match';
import type { BirthProfile } from '../types';

function profile(
  name: string,
  date: string,
  nakshatraOffset = 0,
): BirthProfile {
  return {
    name,
    birthDate: date,
    birthTime: '12:00',
    timeUnknown: false,
    birthLocation: cityToLocation(CITIES[nakshatraOffset % CITIES.length]),
  };
}

describe('computeKundaliMatch', () => {
  it('produces full match view model', () => {
    const self = profile('Self', '1990-05-10', 0);
    const partner = profile('Partner', '1992-08-22', 1);
    const result = computeKundaliMatch(self, partner, 'en');

    expect(result.gunas).toHaveLength(8);
    expect(result.maxTotal).toBe(36);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(36);
    expect(result.mangalPairing).toBeDefined();
    expect(result.summaryInsight.title).toBeTruthy();
  });
});
