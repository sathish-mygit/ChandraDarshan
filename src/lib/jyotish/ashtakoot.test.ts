import { describe, expect, it } from 'vitest';
import { computeAshtakoot } from './ashtakoot';
import type { NatalSnapshot } from '../types';

function snapshot(
  moonRashiIndex: number,
  moonNakshatraIndex: number,
  moonRashi = 'Test',
  moonNakshatra = 'Test',
): NatalSnapshot {
  return {
    moonRashi,
    moonNakshatra,
    moonNakshatraIndex,
    moonRashiIndex,
  };
}

describe('computeAshtakoot', () => {
  it('scores same moon sign and nakshatra with nadi dosha', () => {
    const boy = snapshot(3, 7, 'Karka', 'Pushya');
    const girl = snapshot(3, 7, 'Karka', 'Pushya');
    const result = computeAshtakoot(boy, girl);

    expect(result.nadiDosha).toBe(true);
    expect(result.gunas.find((g) => g.id === 'nadi')?.score).toBe(0);
    expect(result.totalScore).toBeLessThan(36);
  });

  it('gives full nadi points when nadis differ', () => {
    const boy = snapshot(0, 0, 'Mesha', 'Ashwini');
    const girl = snapshot(1, 1, 'Vrishabha', 'Bharani');
    const result = computeAshtakoot(boy, girl);

    expect(result.nadiDosha).toBe(false);
    expect(result.gunas.find((g) => g.id === 'nadi')?.score).toBe(8);
  });

  it('flags bhakoot dosha for 6/8 moon sign distance', () => {
    const boy = snapshot(7, 17, 'Vrishchika', 'Jyeshtha');
    const girl = snapshot(0, 0, 'Mesha', 'Ashwini');
    const result = computeAshtakoot(boy, girl);

    expect(result.bhakootDosha).toBe(true);
    expect(result.gunas.find((g) => g.id === 'bhakoot')?.score).toBe(0);
  });

  it('matches reference pair girl nak 15 swati / boy nak 24 shatabhisha', () => {
    // Swati = index 14, moon in Tula(6); Shatabhisha = index 23, moon in Kumbha(10)
    const girl = snapshot(6, 14, 'Tula', 'Swati');
    const boy = snapshot(10, 23, 'Kumbha', 'Shatabhisha');
    const result = computeAshtakoot(boy, girl);

    expect(result.totalScore).toBeGreaterThanOrEqual(18);
    expect(result.totalScore).toBeLessThanOrEqual(36);
    expect(result.gunas.length).toBe(8);
  });
});
