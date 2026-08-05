import { describe, expect, it } from 'vitest';
import { buildExplainedDailyInsights } from './explained-daily';
import type { NatalSnapshot } from '../types';

const natal: NatalSnapshot = {
  moonRashi: 'Karka',
  moonNakshatra: 'Pushya',
  moonNakshatraIndex: 7,
  moonRashiIndex: 3,
};

describe('buildExplainedDailyInsights', () => {
  it('returns core daily insights without sade sati when inactive', () => {
    const insights = buildExplainedDailyInsights(
      {
        chandraHouse: 5,
        chandraQuality: 'strong',
        todayMoonRashi: 'Vrishchika',
        birthMoonRashi: 'Karka',
        taraIndex: 2,
        taraQuality: 'inauspicious',
        todayNakshatra: 'Anuradha',
        birthNakshatra: 'Pushya',
        antarDasha: 'Jupiter',
        pratyantarDasha: 'Saturn',
        sadeSatiActive: false,
        natal,
      },
      'en',
    );

    expect(insights).toHaveLength(4);
    expect(insights[0]?.title).toBe('Chandra Balam');
    expect(insights[1]?.title).toBe('Tarabala');
  });

  it('adds sade sati insight when active', () => {
    const insights = buildExplainedDailyInsights(
      {
        chandraHouse: 2,
        chandraQuality: 'weak',
        todayMoonRashi: 'Simha',
        birthMoonRashi: 'Karka',
        taraIndex: 0,
        taraQuality: 'inauspicious',
        todayNakshatra: 'Magha',
        birthNakshatra: 'Pushya',
        antarDasha: 'Saturn',
        pratyantarDasha: 'Mercury',
        sadeSatiActive: true,
        sadeSatiPhase: 2,
        natal,
      },
      'en',
    );

    expect(insights).toHaveLength(5);
    expect(insights.at(-1)?.title).toBe('Sade Sati');
  });
});
