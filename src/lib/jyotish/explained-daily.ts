import type { AppLanguage, ExplainedInsight, NatalSnapshot } from '../types';
import {
  buildChandraBalamInsight,
  buildDashaInsight,
  buildSadeSatiInsight,
  buildTarabalaInsight,
} from '../i18n/jyotish-explanations';

type DailyInsightInput = {
  chandraHouse: number;
  chandraQuality: 'strong' | 'weak';
  todayMoonRashi: string;
  birthMoonRashi: string;
  taraIndex: number;
  taraQuality: 'auspicious' | 'inauspicious';
  todayNakshatra: string;
  birthNakshatra: string;
  antarDasha: string;
  pratyantarDasha: string;
  sadeSatiActive: boolean;
  sadeSatiPhase?: 1 | 2 | 3;
  natal: NatalSnapshot;
};

function findPlanetHouse(
  natal: NatalSnapshot,
  lord: string,
): number | undefined {
  return natal.planets?.find((planet) => planet.planet === lord)?.house;
}

export function buildExplainedDailyInsights(
  input: DailyInsightInput,
  language: AppLanguage,
): ExplainedInsight[] {
  const insights: ExplainedInsight[] = [
    buildChandraBalamInsight(
      input.chandraHouse,
      input.chandraQuality,
      input.todayMoonRashi,
      input.birthMoonRashi,
      language,
    ),
    buildTarabalaInsight(
      input.taraIndex,
      input.taraQuality,
      input.todayNakshatra,
      input.birthNakshatra,
      language,
    ),
    buildDashaInsight(
      'antar',
      input.antarDasha,
      findPlanetHouse(input.natal, input.antarDasha),
      language,
    ),
    buildDashaInsight(
      'pratyantar',
      input.pratyantarDasha,
      findPlanetHouse(input.natal, input.pratyantarDasha),
      language,
    ),
  ];

  if (input.sadeSatiActive && input.sadeSatiPhase) {
    insights.push(
      buildSadeSatiInsight(
        input.sadeSatiPhase,
        input.birthMoonRashi,
        language,
      ),
    );
  }

  return insights;
}
