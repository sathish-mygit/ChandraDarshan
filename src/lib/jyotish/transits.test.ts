import { describe, expect, it } from 'vitest';
import { buildTopTransitInsights } from './transits';
import type { NatalSnapshot } from '../types';

const natal: NatalSnapshot = {
  moonRashi: 'Mesha',
  moonNakshatra: 'Ashwini',
  moonNakshatraIndex: 0,
  moonRashiIndex: 0,
  lagna: 'Simha',
  lagnaRashiIndex: 4,
  planets: [
    {
      planet: 'Sun',
      house: 1,
      rashi: 'Simha',
      retrograde: false,
    },
  ],
};

describe('buildTopTransitInsights', () => {
  it('returns explained transit insights for slow grahas', () => {
    const insights = buildTopTransitInsights(
      natal,
      'en',
      new Date('2026-01-15T12:00:00Z'),
      3,
    );

    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0]).toMatchObject({
      title: expect.stringContaining('transit'),
      what: expect.any(String),
      how: expect.any(String),
      why: expect.any(String),
      practical: expect.any(String),
    });
  });
});
