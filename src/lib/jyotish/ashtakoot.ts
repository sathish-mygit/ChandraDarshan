import type { NatalSnapshot } from '../types';
import type { AshtakootGunaId } from '../types';
import {
  BHAKOOT_BY_DISTANCE,
  GANA_BY_NAKSHATRA,
  GANA_MATRIX,
  ganaIndex,
  MAITRI_MATRIX,
  NADI_BY_NAKSHATRA,
  RASHI_LORDS,
  VARNA_RANK_BY_RASHI,
  VASHYA_MATRIX,
  YONI_BY_NAKSHATRA,
  YONI_MATRIX,
  computeTaraScore,
  lordIndex,
} from './ashtakoot-tables';

export type RawAshtakootGuna = {
  id: AshtakootGunaId;
  score: number;
  maxScore: number;
  dosha?: boolean;
};

export type RawAshtakootResult = {
  gunas: RawAshtakootGuna[];
  totalScore: number;
  maxTotal: 36;
  nadiDosha: boolean;
  bhakootDosha: boolean;
};

/** Groom = boy (self), bride = girl (partner) per classical North Indian tables. */
export function computeAshtakoot(
  boy: NatalSnapshot,
  girl: NatalSnapshot,
): RawAshtakootResult {
  const boyRashi = boy.moonRashiIndex;
  const girlRashi = girl.moonRashiIndex;
  const boyNak = boy.moonNakshatraIndex;
  const girlNak = girl.moonNakshatraIndex;

  const varnaScore =
    VARNA_RANK_BY_RASHI[boyRashi] >= VARNA_RANK_BY_RASHI[girlRashi] ? 1 : 0;

  const vashyaScore = VASHYA_MATRIX[boyRashi][girlRashi];

  const taraScore = computeTaraScore(boyNak, girlNak);

  const boyYoni = YONI_BY_NAKSHATRA[boyNak];
  const girlYoni = YONI_BY_NAKSHATRA[girlNak];
  const yoniScore = YONI_MATRIX[boyYoni][girlYoni];

  const boyLord = RASHI_LORDS[boyRashi];
  const girlLord = RASHI_LORDS[girlRashi];
  const maitriRaw =
    boyLord === girlLord
      ? 5
      : MAITRI_MATRIX[lordIndex(boyLord)][lordIndex(girlLord)];
  const maitriScore = Math.floor(maitriRaw);

  const boyGana = GANA_BY_NAKSHATRA[boyNak];
  const girlGana = GANA_BY_NAKSHATRA[girlNak];
  const ganaScore = GANA_MATRIX[ganaIndex(boyGana)][ganaIndex(girlGana)];

  const bhakootDistance = (boyRashi - girlRashi + 12) % 12;
  const bhakootScore = BHAKOOT_BY_DISTANCE[bhakootDistance];
  const bhakootDosha = bhakootScore === 0;

  const boyNadi = NADI_BY_NAKSHATRA[boyNak];
  const girlNadi = NADI_BY_NAKSHATRA[girlNak];
  const nadiDosha = boyNadi === girlNadi;
  const nadiScore = nadiDosha ? 0 : 8;

  const gunas: RawAshtakootGuna[] = [
    { id: 'varna', score: varnaScore, maxScore: 1 },
    { id: 'vashya', score: vashyaScore, maxScore: 2 },
    { id: 'tara', score: taraScore, maxScore: 3 },
    { id: 'yoni', score: yoniScore, maxScore: 4 },
    { id: 'maitri', score: maitriScore, maxScore: 5 },
    { id: 'gana', score: ganaScore, maxScore: 6 },
    { id: 'bhakoot', score: bhakootScore, maxScore: 7, dosha: bhakootDosha },
    { id: 'nadi', score: nadiScore, maxScore: 8, dosha: nadiDosha },
  ];

  const totalScore = gunas.reduce((sum, g) => sum + g.score, 0);

  return {
    gunas,
    totalScore,
    maxTotal: 36,
    nadiDosha,
    bhakootDosha,
  };
}
