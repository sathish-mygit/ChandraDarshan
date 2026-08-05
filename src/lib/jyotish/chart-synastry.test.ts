import { describe, expect, it } from 'vitest';
import { cityToLocation, CITIES } from '../cities';
import { computeChartSynastry } from './chart-synastry';
import type { BirthProfile } from '../types';

function profile(timeUnknown: boolean): BirthProfile {
  return {
    birthDate: '1990-01-15',
    birthTime: timeUnknown ? undefined : '08:00',
    timeUnknown,
    birthLocation: cityToLocation(CITIES[0]),
  };
}

describe('computeChartSynastry', () => {
  it('is locked when either profile lacks birth time', () => {
    const result = computeChartSynastry(
      profile(false),
      profile(true),
      'en',
    );
    expect(result.unlocked).toBe(false);
    expect(result.insights).toHaveLength(0);
  });

  it('returns insights when both profiles have birth time', () => {
    const result = computeChartSynastry(profile(false), profile(false), 'en');
    expect(result.unlocked).toBe(true);
    expect(result.insights.length).toBeGreaterThan(0);
  });
});
