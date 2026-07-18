import { computeSadeSati } from 'panchang-ts';
import type { computeVimshottariDashaFromBirth } from 'panchang-ts';
import type { AppLanguage, LifeMilestone } from '../types';
import {
  getDashaLordEffect,
  getMahaDashaLifeChapterTitle,
  getSadeSatiMilestoneDescription,
} from '../i18n/jyotish-themes';

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

export function buildLifeMilestones(
  dasha: DashaResult,
  birth: Date,
  moonRashiIndex: number,
  language: AppLanguage,
  formatDate: (date: Date) => string,
): LifeMilestone[] {
  const now = new Date();
  const horizon = new Date(birth);
  horizon.setFullYear(horizon.getFullYear() + 100);

  type RawMilestone = Omit<LifeMilestone, 'date' | 'endDate' | 'ageLabel'> & {
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
