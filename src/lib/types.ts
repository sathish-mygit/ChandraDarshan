export type AppLanguage = 'en' | 'hi' | 'sa' | 'te' | 'ta';

export type MasaSystem = 'amanta' | 'purnimanta';

export type LocationSource = 'city' | 'gps';

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
  masaSystem: MasaSystem;
  location: StoredLocation;
  birthProfile?: BirthProfile;
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

export type LifeMilestoneKind = 'mahaDasha' | 'sadeSati';

export type LifeMilestone = {
  kind: LifeMilestoneKind;
  date: string;
  endDate?: string;
  ageLabel: string;
  title: string;
  description: string;
  isPast: boolean;
  isCurrent: boolean;
};

export type YogaInsight = {
  name: string;
  type: string;
  description: string;
};

export type PlanetHouseInsight = {
  planet: string;
  house: number;
  rashi: string;
  insight: string;
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
};
