import { computeTithiPravesha } from 'panchang-ts';
import type {
  AnnualOutlookViewModel,
  AppLanguage,
  BirthProfile,
  ExplainedInsight,
} from '../types';
import { buildExplainedInsight } from './explained-insight';
import {
  birthInstantFromProfile,
  geoFromLocation,
  toLibraryLanguage,
} from './utils';

function ageAtDate(birth: Date, now: Date): number {
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(1, age);
}

function isNearBirthday(birth: Date, now: Date, windowDays = 30): boolean {
  const thisYearBirthday = new Date(
    now.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
  );
  const diff = Math.abs(now.getTime() - thisYearBirthday.getTime());
  return diff <= windowDays * 86_400_000;
}

function formatDate(date: Date, language: AppLanguage): string {
  const locale = language === 'en' ? 'en-IN' : 'hi-IN';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function buildVarshaLagnaInsight(
  varshaLagna: string,
  language: AppLanguage,
): ExplainedInsight {
  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Varsha Lagna',
      summary: `Your annual chart rises in ${varshaLagna}.`,
      what: `At this year's Tithi Pravesha moment, ${varshaLagna} was rising on the eastern horizon.`,
      how: 'Tithi Pravesha finds the instant when Sun-Moon separation matches your birth tithi, near your solar-return year.',
      why: 'Annual lagna colors the year\'s outward tone — which sign "hosts" the year.',
      practical: 'Thematic background for the year, not event prediction.',
    },
    hi: {
      title: 'वर्ष लग्न',
      summary: `वार्षिक लग्न ${varshaLagna}।`,
      what: `तिथि प्रवेश क्षण पर ${varshaLagna} उदय।`,
      how: 'जन्म तिथि से मेल खाता सूर्य-चन्द्र कोण।',
      why: 'वर्ष का बाहरी स्वर।',
      practical: 'विषयगत मार्गदर्शन।',
    },
    sa: {
      title: 'वर्षलग्नम्',
      summary: `${varshaLagna}राशौ उदयः।`,
      what: 'तिथिप्रवेशक्षणे लग्नम्।',
      how: 'जन्मतिथिसमकोणः।',
      why: 'वर्षस्वरः।',
      practical: 'विषयमात्रम्।',
    },
    te: {
      title: 'వర్ష లగ్నం',
      summary: `వార్షిక లగ్నం ${varshaLagna}.`,
      what: 'తిథి ప్రవేశ క్షణంలో ఉదయ రాశి.',
      how: 'జన్మ తిథికి సరిపోయే సూర్య-చంద్ర కోణం.',
      why: 'సంవత్సర స్వరం.',
      practical: 'థీమాటిక్ మార్గదర్శనం.',
    },
    ta: {
      title: 'வர்ஷ லக்னம்',
      summary: `வார்ஷிக லக்னம் ${varshaLagna}.`,
      what: 'திதி பிரவேச தருணத்தில் உதய ராசி.',
      how: 'பிறப்பு திதிக்கு பொருந்தும் சூரிய-சந்திர கோணம்.',
      why: 'ஆண்டின் நயம்.',
      practical: 'தீமாட்டிக் வழிகாட்டுதல்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['varshaphala', 'lagna'],
  });
}

export function computeAnnualOutlook(
  profile: BirthProfile,
  language: AppLanguage,
  now: Date = new Date(),
): AnnualOutlookViewModel {
  const birth = birthInstantFromProfile(profile);
  const age = ageAtDate(birth, now);
  const visible = isNearBirthday(birth, now);

  if (!visible) {
    return {
      visible: false,
      age,
      varshaLagna: '',
      munthaHouse: 0,
      yearLord: '',
      insights: [],
      praveshDate: '',
    };
  }

  const location = geoFromLocation(profile.birthLocation);
  const libraryLanguage = toLibraryLanguage(language);

  const tp = computeTithiPravesha(birth, age, location, {
    language: libraryLanguage,
  });

  const varshaLagna = tp.varshaLagna.rashi.name;
  const yearLord =
    tp.planets.find((p) => p.planet === 'Sun')?.planet ?? 'Sun';

  const insights: ExplainedInsight[] = [
    buildVarshaLagnaInsight(varshaLagna, language),
  ];

  return {
    visible: true,
    age,
    varshaLagna,
    munthaHouse: 0,
    yearLord,
    insights,
    praveshDate: formatDate(tp.praveshInstant, language),
  };
}
