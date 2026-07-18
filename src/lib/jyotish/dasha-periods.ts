import { computeVimshottariPratyantar } from 'panchang-ts';
import type { computeVimshottariDashaFromBirth } from 'panchang-ts';
import type { AppLanguage, DashaPeriodInsight, NatalSnapshot } from '../types';
import {
  buildDashaPeriodInsight,
  getDashaLordChartNote,
} from '../i18n/jyotish-themes';

export type ActiveDashaPeriods = {
  maha: string;
  antar: string;
  pratyantar: string;
  mahaEnd?: Date;
  antarEnd?: Date;
  pratyantarEnd?: Date;
};

type DashaResult = ReturnType<typeof computeVimshottariDashaFromBirth>;

export function findActiveDashaPeriods(
  dasha: DashaResult,
  now: Date,
): ActiveDashaPeriods {
  for (const maha of dasha.mahaDashas) {
    if (now < maha.startDate || now >= maha.endDate) {
      continue;
    }

    for (const antar of maha.antarDashas) {
      if (now >= antar.startDate && now < antar.endDate) {
        const pratyantars = computeVimshottariPratyantar(antar);
        for (const pratyantar of pratyantars) {
          if (now >= pratyantar.startDate && now < pratyantar.endDate) {
            return {
              maha: maha.lord,
              antar: antar.lord,
              pratyantar: pratyantar.lord,
              mahaEnd: maha.endDate,
              antarEnd: antar.endDate,
              pratyantarEnd: pratyantar.endDate,
            };
          }
        }

        return {
          maha: maha.lord,
          antar: antar.lord,
          pratyantar: antar.lord,
          mahaEnd: maha.endDate,
          antarEnd: antar.endDate,
        };
      }
    }

    return {
      maha: maha.lord,
      antar: maha.lord,
      pratyantar: maha.lord,
      mahaEnd: maha.endDate,
    };
  }

  const fallbackLord = dasha.currentMahaDashaLord;
  return {
    maha: fallbackLord,
    antar: fallbackLord,
    pratyantar: fallbackLord,
  };
}

function findPlanetHouse(
  natal: NatalSnapshot | null,
  lord: string,
): number | undefined {
  return natal?.planets?.find((planet) => planet.planet === lord)?.house;
}

export function buildDashaPeriodInsights(
  active: ActiveDashaPeriods,
  language: AppLanguage,
  natal: NatalSnapshot | null,
  formatDate: (date: Date) => string,
): DashaPeriodInsight[] {
  const levels: Array<{
    level: DashaPeriodInsight['level'];
    lord: string;
    end?: Date;
  }> = [
    { level: 'maha', lord: active.maha, end: active.mahaEnd },
    { level: 'antar', lord: active.antar, end: active.antarEnd },
    { level: 'pratyantar', lord: active.pratyantar, end: active.pratyantarEnd },
  ];

  return levels.map(({ level, lord, end }) => {
    const house = findPlanetHouse(natal, lord);
    const chartNote =
      house !== undefined
        ? getDashaLordChartNote(lord, house, language)
        : undefined;

    return buildDashaPeriodInsight(level, lord, language, {
      endDate: end ? formatDate(end) : undefined,
      chartNote,
    });
  });
}
