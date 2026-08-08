import type { GlossaryTermId } from './i18n/glossary';

export type AppLanguage = 'en' | 'hi' | 'sa' | 'te' | 'ta';

export type MasaSystem = 'amanta' | 'purnimanta';

export type MasaSystemPreference = 'auto' | MasaSystem;

export type LocationSource = 'city' | 'gps' | 'approx';

export type StoredLocation = {
  source: LocationSource;
  label: string;
  latitude: number;
  longitude: number;
  timezone: number | string;
};

export type DailyReminderPreferences = {
  enabled: boolean;
  time: string;
};

export type AppPreferences = {
  language: AppLanguage;
  masaSystem: MasaSystemPreference;
  location: StoredLocation;
  locationAutoDetected?: boolean;
  birthProfile?: BirthProfile;
  partnerBirthProfile?: BirthProfile;
  dailyReminder?: DailyReminderPreferences;
};

export type BirthProfile = {
  name?: string;
  birthDate: string;
  birthTime?: string;
  timeUnknown: boolean;
  birthLocation: StoredLocation;
};

export type NatalPlanetRow = {
  planet: string;
  house: number;
  rashi: string;
  retrograde: boolean;
};

export type NatalSnapshot = {
  moonRashi: string;
  moonNakshatra: string;
  moonNakshatraIndex: number;
  moonRashiIndex: number;
  lagna?: string;
  lagnaRashiIndex?: number;
  lagnaNakshatra?: string;
  planets?: NatalPlanetRow[];
};

export type DashaPeriodLevel = 'maha' | 'antar' | 'pratyantar';

export type DashaPeriodInsight = {
  level: DashaPeriodLevel;
  lord: string;
  endDate?: string;
  levelMeaning: string;
  planetEffect: string;
  chartNote?: string;
};

export type DailyReading = {
  headline: string;
  summary: string;
  favor: string;
  pause: string;
  dashaNote: string;
};

export type ExplainedInsight = {
  title: string;
  summary: string;
  effect?: string;
  what: string;
  how: string;
  why: string;
  practical: string;
  termIds?: GlossaryTermId[];
};

export type TimeWindow = {
  label: string;
  start: string;
  end: string;
  quality?: 'auspicious' | 'inauspicious' | 'neutral';
  explanation: string;
};

export type PersonalTodayViewModel = {
  chandraBalam: {
    name: string;
    quality: 'strong' | 'weak';
    house: number;
  };
  tarabala: {
    name: string;
    quality: 'auspicious' | 'inauspicious';
    taraIndex: number;
    englishName: string;
  };
  todayMoonRashi: string;
  birthMoonRashi: string;
  todayNakshatra: string;
  birthNakshatra: string;
  chandraBalamContext: string;
  taraDescription: string;
  currentHora?: {
    planet: string;
    start: string;
    end: string;
    explanation: string;
  };
  abhijitMuhurta?: {
    start: string;
    end: string;
    explanation: string;
  };
  mahaDasha: string;
  antarDasha: string;
  pratyantarDasha: string;
  antarDashaEnd?: string;
  pratyantarDashaEnd?: string;
  dashaPeriods: DashaPeriodInsight[];
  sadeSati: {
    active: boolean;
    phase?: 1 | 2 | 3;
  };
  dailyReading: DailyReading;
  guidance: string;
  teaserSummary: string;
  explainedInsights: ExplainedInsight[];
  transitInsights: ExplainedInsight[];
  currentChoghadiya?: TimeWindow;
  nextChoghadiya?: TimeWindow;
  rahuKalam?: TimeWindow;
  weeklyTone?: string;
};

export type DashaTimelineEntry = {
  lord: string;
  startDate: string;
  endDate: string;
  ageAtStart: string;
  ageAtEnd: string;
  theme: string;
  lifeChapter: string;
  isCurrent: boolean;
  isPast: boolean;
};

export type LifeMilestoneKind =
  | 'mahaDasha'
  | 'sadeSati'
  | 'jupiterTransit'
  | 'saturnTransit';

export type LifeMilestone = {
  kind: LifeMilestoneKind;
  date: string;
  endDate?: string;
  ageLabel: string;
  title: string;
  description: string;
  how?: string;
  isPast: boolean;
  isCurrent: boolean;
};

export type YogaInsight = {
  name: string;
  type: string;
  description: string;
  effect: string;
  reasons: string[];
  how: string;
};

export type PlanetHouseInsight = {
  planet: string;
  house: number;
  rashi: string;
  insight: string;
  effect: string;
};

export type DignityKind =
  | 'exalted'
  | 'moolatrikona'
  | 'own'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'debilitated';

export type DignityInsight = {
  planet: string;
  rashi: string;
  dignity: DignityKind;
  insight: ExplainedInsight;
};

export type DoshaInsight = {
  name: string;
  active: boolean;
  insight: ExplainedInsight;
  cancellations?: string[];
};

export type NavamsaSummary = {
  lagna: string;
  moonRashi: string;
  vargottamaPlanets: string[];
  insight: ExplainedInsight;
};

export type ChartDepthViewModel = {
  navamsa?: NavamsaSummary;
  dignities: DignityInsight[];
  doshas: DoshaInsight[];
  yogas: YogaInsight[];
  planetInsights: PlanetHouseInsight[];
  timeRequired: boolean;
  unlocked: boolean;
};

export type AnnualOutlookViewModel = {
  visible: boolean;
  age: number;
  varshaLagna: string;
  munthaHouse: number;
  yearLord: string;
  insights: ExplainedInsight[];
  praveshDate: string;
};

export type LearnArticleId =
  | 'chandraBalamCalc'
  | 'vimshottariDasha'
  | 'birthTimeMatters'
  | 'whatWePredict'
  | 'transits'
  | 'navamsa'
  | 'ashtakootBasics';

export type AshtakootGunaId =
  | 'varna'
  | 'vashya'
  | 'tara'
  | 'yoni'
  | 'maitri'
  | 'gana'
  | 'bhakoot'
  | 'nadi';

export type AshtakootGunaResult = {
  id: AshtakootGunaId;
  score: number;
  maxScore: number;
  dosha?: boolean;
  insight: ExplainedInsight;
};

export type MangalPairingNote =
  | 'both'
  | 'neither'
  | 'self_only'
  | 'partner_only';

export type MangalPairingResult = {
  selfAfflicted: boolean;
  partnerAfflicted: boolean;
  pairingNote: MangalPairingNote;
  approximate: boolean;
  insight: ExplainedInsight;
};

export type KundaliMatchQualityBand = 'low' | 'moderate' | 'good' | 'excellent';

export type KundaliMatchViewModel = {
  selfName?: string;
  partnerName?: string;
  selfMoonRashi: string;
  selfMoonNakshatra: string;
  partnerMoonRashi: string;
  partnerMoonNakshatra: string;
  gunas: AshtakootGunaResult[];
  totalScore: number;
  maxTotal: 36;
  qualityBand: KundaliMatchQualityBand;
  nadiDosha: boolean;
  bhakootDosha: boolean;
  mangalPairing: MangalPairingResult;
  synastry: {
    unlocked: boolean;
    timeRequiredMessage?: string;
    insights: ExplainedInsight[];
  };
  summaryInsight: ExplainedInsight;
};

export type LifeDirectionViewModel = {
  mahaDasha: string;
  antarDasha: string;
  pratyantarDasha: string;
  antarDashaEnd?: string;
  pratyantarDashaEnd?: string;
  mahaDashaTheme: string;
  antarDashaTheme: string;
  pratyantarDashaTheme: string;
  periodNarrative: string;
  dashaPeriods: DashaPeriodInsight[];
  dashaTimeline: DashaTimelineEntry[];
  lifeMilestones: LifeMilestone[];
  yogas: YogaInsight[];
  planetInsights: PlanetHouseInsight[];
  sadeSati: {
    active: boolean;
    phase?: 1 | 2 | 3;
    description?: string;
    arcEnd?: string;
    nextArcStart?: string;
  };
};

export type Paksha = 'shukla' | 'krishna';

export type TithiTimingEntry = {
  name: string;
  start: Date | null;
  end: Date | null;
  isCurrent: boolean;
  /** Stored so cached timelines can resolve paksha without recomputing daily panchang. */
  paksha?: Paksha;
};

export type PanchangViewModel = {
  tithi: string;
  paksha: Paksha;
  pakshaLabel: string;
  maasa: string;
  isAdhika: boolean;
  samvatsara: string;
  vikramSamvat: number;
  shakaSamvat: number;
  vara: string;
  nakshatra: string;
  tithiUntil: Date | null;
  tithiStart: Date | null;
  previousTithi: string | null;
  previousTithiEnd: Date | null;
  tithiTimeline: TithiTimingEntry[];
  moonFill: number;
  isWaxing: boolean;
  sunrise: Date;
  sunset: Date;
  moonrise: Date | null;
  moonset: Date | null;
  festivals: string[];
  locationLabel: string;
  gregorianDate: string;
};

export type CityEntry = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  timezone: number | string;
  masaSystem: MasaSystem;
};
