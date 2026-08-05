import { computePlanetaryPositions, computeSadeSati } from 'panchang-ts';
import type { computeVimshottariDashaFromBirth } from 'panchang-ts';
import type { AppLanguage, LifeMilestone } from '../types';
import {
  getDashaLordEffect,
  getMahaDashaLifeChapterTitle,
  getSadeSatiMilestoneDescription,
} from '../i18n/jyotish-themes';
import { getHouseTheme } from '../i18n/jyotish-explanations';
import { houseFromReference } from './explained-insight';

type DashaResult = ReturnType<typeof computeVimshottariDashaFromBirth>;

function ageAtDate(birth: Date, date: Date): number {
  let age = date.getFullYear() - birth.getFullYear();
  const monthDiff = date.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && date.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

export function formatAgeLabel(
  birth: Date,
  date: Date,
  language: AppLanguage,
): string {
  const age = ageAtDate(birth, date);
  const templates: Record<AppLanguage, string> = {
    en: `Age ${age}`,
    hi: `आयु ${age}`,
    sa: `वयः ${age}`,
    te: `వయస్సు ${age}`,
    ta: `வயது ${age}`,
  };
  return templates[language];
}

function findAllSadeSatiArcs(
  moonRashiIndex: number,
  birth: Date,
  horizon: Date,
): Array<{ start: Date; end: Date }> {
  const arcs: Array<{ start: Date; end: Date }> = [];
  let cursor = new Date(birth);
  const seen = new Set<string>();

  while (cursor < horizon) {
    const info = computeSadeSati(moonRashiIndex, cursor, 'lahiri');

    if (info.active && info.currentArcStart && info.currentArcEnd) {
      const key = info.currentArcStart.toISOString();
      if (!seen.has(key)) {
        seen.add(key);
        arcs.push({
          start: info.currentArcStart,
          end: info.currentArcEnd,
        });
      }
      cursor = new Date(info.currentArcEnd.getTime() + 86_400_000);
      continue;
    }

    if (info.nextArcStart && info.nextArcStart < horizon) {
      cursor = new Date(info.nextArcStart);
      continue;
    }

    cursor = new Date(cursor.getFullYear() + 2, cursor.getMonth(), cursor.getDate());
  }

  return arcs;
}

const SLOW_GRAHAS = ['Saturn', 'Jupiter'] as const;

function findTransitSignChanges(
  planet: 'Saturn' | 'Jupiter',
  moonRashiIndex: number,
  start: Date,
  horizon: Date,
): Array<{ date: Date; rashi: string; houseFromMoon: number }> {
  const changes: Array<{ date: Date; rashi: string; houseFromMoon: number }> =
    [];
  let cursor = new Date(start);
  let lastIndex = computePlanetaryPositions(cursor, 'lahiri')[
    planet.toLowerCase() as 'saturn' | 'jupiter'
  ].rashi.index;

  while (cursor < horizon) {
    cursor = new Date(cursor.getTime() + 7 * 86_400_000);
    const pos = computePlanetaryPositions(cursor, 'lahiri')[
      planet.toLowerCase() as 'saturn' | 'jupiter'
    ];
    if (pos.rashi.index !== lastIndex) {
      changes.push({
        date: new Date(cursor),
        rashi: pos.rashi.name,
        houseFromMoon: houseFromReference(moonRashiIndex, pos.rashi.index),
      });
      lastIndex = pos.rashi.index;
    }
  }

  return changes;
}

function transitMilestoneTitle(
  planet: string,
  rashi: string,
  house: number,
  language: AppLanguage,
): string {
  const templates: Record<AppLanguage, string> = {
    en: `${planet} enters ${rashi} (${house}th from Moon)`,
    hi: `${planet} ${rashi} में (${house}वाँ चन्द्र से)`,
    sa: `${planet} ${rashi}राशौ (${house}भावः)`,
    te: `${planet} ${rashi}లోకి (${house}వ చంద్రం నుండి)`,
    ta: `${planet} ${rashi} க்கு (${house}ம் சந்திரத்திலிருந்து)`,
  };
  return templates[language];
}

export function buildLifeMilestones(
  dasha: DashaResult,
  birth: Date,
  moonRashiIndex: number,
  language: AppLanguage,
  formatDate: (date: Date) => string,
): LifeMilestone[] {
  const now = new Date();
  const horizon = new Date(birth);
  horizon.setFullYear(horizon.getFullYear() + 30);

  type RawMilestone = Omit<
    LifeMilestone,
    'date' | 'endDate' | 'ageLabel'
  > & {
    start: Date;
    end?: Date;
  };

  const raw: RawMilestone[] = [];

  for (const maha of dasha.mahaDashas) {
    if (maha.startDate > horizon) {
      break;
    }

    raw.push({
      kind: 'mahaDasha',
      start: maha.startDate,
      end: maha.endDate,
      title: getMahaDashaLifeChapterTitle(maha.lord, language),
      description: getDashaLordEffect('maha', maha.lord, language),
      isPast: now >= maha.endDate,
      isCurrent: now >= maha.startDate && now < maha.endDate,
    });
  }

  for (const arc of findAllSadeSatiArcs(moonRashiIndex, birth, horizon)) {
    raw.push({
      kind: 'sadeSati',
      start: arc.start,
      end: arc.end,
      title: 'Sade Sati',
      description: getSadeSatiMilestoneDescription(language),
      isPast: now >= arc.end,
      isCurrent: now >= arc.start && now < arc.end,
    });
  }

  for (const planet of SLOW_GRAHAS) {
    const kind =
      planet === 'Jupiter' ? 'jupiterTransit' : 'saturnTransit';
    for (const change of findTransitSignChanges(
      planet,
      moonRashiIndex,
      birth,
      horizon,
    )) {
      const theme = getHouseTheme(change.houseFromMoon, language);
      raw.push({
        kind,
        start: change.date,
        title: transitMilestoneTitle(
          planet,
          change.rashi,
          change.houseFromMoon,
          language,
        ),
        description: `Traditions link the ${change.houseFromMoon}th house to ${theme}.`,
        how: `We detect when ${planet} changes sidereal sign and count houses from your birth Moon.`,
        isPast: now >= change.date,
        isCurrent: false,
      });
    }
  }

  raw.sort((a, b) => a.start.getTime() - b.start.getTime());

  return raw.map((entry) => ({
    kind: entry.kind,
    date: formatDate(entry.start),
    endDate: entry.end ? formatDate(entry.end) : undefined,
    ageLabel: formatAgeLabel(birth, entry.start, language),
    title: entry.title,
    description: entry.description,
    isPast: entry.isPast,
    isCurrent: entry.isCurrent,
  }));
}
