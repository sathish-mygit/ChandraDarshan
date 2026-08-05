/** North Indian Ashtakoot lookup tables (classical groom-bride convention). */

export type GanaKind = 'deva' | 'manushya' | 'rakshasa';
export type NadiKind = 'adi' | 'madhya' | 'antya';
export type GrahaLord =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn';

/** Kshatriya=3, Vaishya=2, Shudra=1, Brahmin=4 */
export const VARNA_RANK_BY_RASHI: readonly number[] = [
  3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4,
];

/** Boy moon sign row, girl moon sign column. Max 2 points. */
export const VASHYA_MATRIX: readonly (readonly number[])[] = [
  [2, 1, 1, 0, 2, 1, 1, 0, 2, 1, 1, 0],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1],
  [1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1],
  [0, 1, 1, 2, 0, 1, 1, 2, 0, 1, 1, 2],
  [2, 1, 1, 0, 2, 1, 1, 0, 2, 1, 1, 0],
  [1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1],
  [1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1],
  [0, 1, 1, 2, 0, 1, 1, 2, 0, 1, 1, 2],
  [2, 1, 1, 0, 2, 1, 1, 0, 2, 1, 1, 0],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1],
  [1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1],
  [0, 1, 1, 2, 0, 1, 1, 2, 0, 1, 1, 2],
];

export const RASHI_LORDS: readonly GrahaLord[] = [
  'Mars',
  'Venus',
  'Mercury',
  'Moon',
  'Sun',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Saturn',
  'Jupiter',
];

export const GANA_BY_NAKSHATRA: readonly GanaKind[] = [
  'deva', 'manushya', 'rakshasa', 'manushya', 'deva', 'manushya', 'deva',
  'deva', 'rakshasa', 'rakshasa', 'manushya', 'manushya', 'deva', 'rakshasa',
  'deva', 'rakshasa', 'deva', 'rakshasa', 'rakshasa', 'manushya', 'manushya',
  'deva', 'rakshasa', 'deva', 'manushya', 'manushya', 'deva',
];

export const NADI_BY_NAKSHATRA: readonly NadiKind[] = [
  'adi', 'madhya', 'antya', 'antya', 'madhya', 'adi', 'adi', 'madhya', 'antya',
  'antya', 'madhya', 'adi', 'adi', 'madhya', 'antya', 'antya', 'madhya', 'adi',
  'adi', 'madhya', 'antya', 'antya', 'madhya', 'adi', 'adi', 'madhya', 'antya',
];

/** Yoni animal index 0–13 (14 animals). */
export const YONI_BY_NAKSHATRA: readonly number[] = [
  0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 11, 11, 12,
  0, 12, 7, 1,
];

/** Bhakoot score by (boyRashi - girlRashi + 12) % 12. Max 7. */
export const BHAKOOT_BY_DISTANCE: readonly number[] = [
  7, 0, 7, 7, 0, 0, 7, 0, 7, 7, 0, 0,
];

/** Gana points: boy row, girl column. Max 6. */
export const GANA_MATRIX: readonly (readonly number[])[] = [
  [6, 5, 1],
  [6, 6, 0],
  [1, 0, 6],
];

/** Graha maitri points by lord pair. Max 5. */
export const MAITRI_MATRIX: readonly (readonly number[])[] = [
  [5, 5, 5, 4, 5, 0, 0],
  [5, 5, 4, 1, 4, 0.5, 0.5],
  [5, 4, 5, 0.5, 5, 3, 0.5],
  [4, 1, 0.5, 5, 0.5, 5, 3],
  [5, 4, 5, 0.5, 5, 1, 0.5],
  [0, 0.5, 3, 5, 1, 5, 5],
  [0, 0.5, 0.5, 3, 0.5, 5, 5],
];

const LORD_INDEX: Record<GrahaLord, number> = {
  Sun: 0,
  Moon: 1,
  Mars: 2,
  Mercury: 3,
  Jupiter: 4,
  Venus: 5,
  Saturn: 6,
};

/** Yoni compatibility 14×14. Max 4. */
export const YONI_MATRIX: readonly (readonly number[])[] = [
  [4, 3, 2, 2, 2, 2, 2, 1, 0, 1, 1, 3, 3, 2],
  [3, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 2, 2, 1],
  [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 2, 2, 1],
  [2, 3, 2, 4, 2, 1, 1, 1, 2, 2, 2, 2, 0, 2],
  [2, 2, 1, 2, 4, 2, 1, 2, 2, 2, 2, 1, 3, 3],
  [2, 2, 2, 1, 2, 4, 0, 2, 2, 2, 2, 1, 2, 2],
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 1, 2, 2, 2, 2],
  [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 2, 2, 2, 1],
  [0, 3, 3, 2, 2, 2, 2, 3, 4, 2, 1, 2, 1, 2],
  [1, 1, 1, 2, 2, 2, 1, 0, 2, 4, 1, 1, 2, 2],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 4, 1, 2, 2],
  [3, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 4, 1, 2],
  [3, 2, 2, 0, 3, 2, 2, 2, 1, 2, 2, 1, 4, 2],
  [2, 1, 1, 2, 3, 2, 2, 1, 2, 2, 2, 2, 2, 4],
];

const AUSPICIOUS_TARAS = new Set([2, 4, 6, 8, 9]);

export function ganaIndex(kind: GanaKind): number {
  if (kind === 'deva') return 0;
  if (kind === 'manushya') return 1;
  return 2;
}

export function lordIndex(lord: GrahaLord): number {
  return LORD_INDEX[lord];
}

export function computeTaraPoints(
  fromNakshatra: number,
  toNakshatra: number,
): number {
  let count = (toNakshatra - fromNakshatra) % 27;
  if (count < 0) count += 27;
  if (count === 0) count = 27;
  const tara = ((count - 1) % 9) + 1;
  return AUSPICIOUS_TARAS.has(tara) ? 1.5 : 0;
}

export function computeTaraScore(boyNak: number, girlNak: number): number {
  const total = computeTaraPoints(girlNak, boyNak) + computeTaraPoints(boyNak, girlNak);
  return Math.min(3, Math.floor(total));
}
