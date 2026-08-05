import {
  computeDignity,
  computeNavamsa,
  computeRashiChart,
} from 'panchang-ts';
import type { AppLanguage, BirthProfile, ExplainedInsight } from '../types';
import {
  buildNavamsaPairingInsight,
  buildSeventhHouseInsight,
  buildVenusJupiterInsight,
  buildLagnaHarmonyInsight,
} from '../i18n/synastry-explanations';
import {
  birthInstantFromProfile,
  geoFromLocation,
  toLibraryLanguage,
} from './utils';
import { RASHI_LORDS, lordIndex, MAITRI_MATRIX } from './ashtakoot-tables';

const SIGN_ELEMENTS = [
  'fire',
  'earth',
  'air',
  'water',
  'fire',
  'earth',
  'air',
  'water',
  'fire',
  'earth',
  'air',
  'water',
] as const;

function seventhLordHouse(chart: ReturnType<typeof computeRashiChart>): {
  lord: string;
  house: number;
  dignity: string;
} {
  const lagnaIndex = chart.lagna.rashi.index;
  const seventhRashi = (lagnaIndex + 6) % 12;
  const lord = RASHI_LORDS[seventhRashi];
  const planet = chart.planets.find((p) => p.planet === lord);
  const dignity = planet
    ? computeDignity(planet.planet, planet.rashi.index)
    : 'neutral';
  return {
    lord,
    house: planet?.house ?? 0,
    dignity,
  };
}

export function computeChartSynastry(
  self: BirthProfile,
  partner: BirthProfile,
  language: AppLanguage,
): { unlocked: boolean; insights: ExplainedInsight[] } {
  if (self.timeUnknown || partner.timeUnknown) {
    return { unlocked: false, insights: [] };
  }

  const libraryLanguage = toLibraryLanguage(language);
  const selfBirth = birthInstantFromProfile(self);
  const partnerBirth = birthInstantFromProfile(partner);
  const selfLoc = geoFromLocation(self.birthLocation);
  const partnerLoc = geoFromLocation(partner.birthLocation);

  const selfD1 = computeRashiChart(selfBirth, selfLoc, {
    houseSystem: 'whole-sign',
    language: libraryLanguage,
  });
  const partnerD1 = computeRashiChart(partnerBirth, partnerLoc, {
    houseSystem: 'whole-sign',
    language: libraryLanguage,
  });
  const selfD9 = computeNavamsa(selfBirth, selfLoc, { language: libraryLanguage });
  const partnerD9 = computeNavamsa(partnerBirth, partnerLoc, {
    language: libraryLanguage,
  });

  const selfLagna = selfD1.lagna.rashi.index;
  const partnerLagna = partnerD1.lagna.rashi.index;
  const selfLord = RASHI_LORDS[selfLagna];
  const partnerLord = RASHI_LORDS[partnerLagna];
  const lordHarmony =
    selfLord === partnerLord
      ? 5
      : MAITRI_MATRIX[lordIndex(selfLord)][lordIndex(partnerLord)];

  const insights: ExplainedInsight[] = [
    buildLagnaHarmonyInsight(
      selfD1.lagna.rashi.name,
      partnerD1.lagna.rashi.name,
      SIGN_ELEMENTS[selfLagna],
      SIGN_ELEMENTS[partnerLagna],
      lordHarmony,
      language,
    ),
    buildSeventhHouseInsight(
      seventhLordHouse(selfD1),
      seventhLordHouse(partnerD1),
      language,
    ),
    buildVenusJupiterInsight(selfD1, partnerD1, selfLagna, partnerLagna, language),
    buildNavamsaPairingInsight(
      selfD9.lagnaRashi.name,
      partnerD9.lagnaRashi.name,
      selfD9.planets.find((p) => p.planet === 'Moon')?.rashi.name ?? '—',
      partnerD9.planets.find((p) => p.planet === 'Moon')?.rashi.name ?? '—',
      language,
    ),
  ];

  return { unlocked: true, insights };
}
