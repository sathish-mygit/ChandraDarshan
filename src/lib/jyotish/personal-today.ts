import {
  computeSadeSati,
  computeVimshottariDashaFromBirth,
  getDailyPanchang,
} from 'panchang-ts';
import type { HoraInfo } from 'panchang-ts';
import type { ChoghadiyaInfo } from 'panchang-ts';
import type {
  AppLanguage,
  BirthProfile,
  PersonalTodayViewModel,
  StoredLocation,
  TimeWindow,
} from '../types';
import {
  getChandraBalamContext,
  getExpandedGuidance,
  getAbhijitPeriodExplanation,
  getHoraPeriodExplanation,
  getTaraDescription,
} from '../i18n/jyotish-themes';
import {
  buildChoghadiyaExplanation,
  buildRahuKalamExplanation,
  buildWeeklyTone,
} from '../i18n/jyotish-explanations';
import { buildDailyReading } from '../i18n/daily-reading';
import { buildExplainedDailyInsights } from './explained-daily';
import { buildTopTransitInsights } from './transits';
import { getJanmaIndices, computeNatalSnapshot } from './natal';
import {
  birthInstantFromProfile,
  geoFromLocation,
  toLibraryLanguage,
} from './utils';
import {
  getCachedPersonalToday,
  setCachedPersonalToday,
} from './personal-cache';

import {
  buildDashaPeriodInsights,
  findActiveDashaPeriods,
} from './dasha-periods';

function formatTime(date: Date, language: AppLanguage): string {
  const locale = language === 'en' ? 'en-IN' : 'hi-IN';
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDashaEnd(date: Date, language: AppLanguage): string {
  const locale = language === 'en' ? 'en-IN' : 'hi-IN';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function findCurrentHora(
  hora: HoraInfo,
  now: Date,
): { planet: string; start: Date; end: Date } | null {
  const slots = [...hora.day, ...hora.night];
  return (
    slots.find((slot) => now >= slot.start && now < slot.end) ?? null
  );
}

function findCurrentChoghadiya(
  choghadiya: ChoghadiyaInfo,
  now: Date,
): { current: TimeWindow; next?: TimeWindow } | null {
  const slots = [...choghadiya.day, ...choghadiya.night];
  const currentIndex = slots.findIndex(
    (slot) => now >= slot.start && now < slot.end,
  );
  if (currentIndex < 0) {
    return null;
  }

  const currentSlot = slots[currentIndex]!;
  const nextSlot = slots[currentIndex + 1];

  return {
    current: {
      label: currentSlot.name,
      start: currentSlot.start.toISOString(),
      end: currentSlot.end.toISOString(),
      quality: currentSlot.quality,
      explanation: '',
    },
    next: nextSlot
      ? {
          label: nextSlot.name,
          start: nextSlot.start.toISOString(),
          end: nextSlot.end.toISOString(),
          quality: nextSlot.quality,
          explanation: '',
        }
      : undefined,
  };
}

function formatChoghadiyaWindow(
  slot: TimeWindow,
  language: AppLanguage,
): TimeWindow {
  const start = new Date(slot.start);
  const end = new Date(slot.end);
  return {
    ...slot,
    start: formatTime(start, language),
    end: formatTime(end, language),
    explanation: buildChoghadiyaExplanation(
      slot.label,
      slot.quality ?? 'neutral',
      language,
    ),
  };
}

function buildTeaserSummary(
  chandraQuality: 'strong' | 'weak',
  antarDasha: string,
  language: AppLanguage,
): string {
  const chandraLabel =
    chandraQuality === 'strong'
      ? { en: 'Shubha', hi: 'शुभ', sa: 'शुभ', te: 'శుభ', ta: 'சுப' }
      : { en: 'Ashubha', hi: 'अशुभ', sa: 'अशुभ', te: 'అశుభ', ta: 'அசுப' };

  const templates: Record<AppLanguage, string> = {
    en: `Chandra Balam: ${chandraLabel.en} · ${antarDasha} antardasha`,
    hi: `चन्द्र बल: ${chandraLabel.hi} · ${antarDasha} अंतर्दशा`,
    sa: `चन्द्रबलम्: ${chandraLabel.sa} · ${antarDasha} अन्तर्दशा`,
    te: `చంద్ర బలం: ${chandraLabel.te} · ${antarDasha} అంతర్దశ`,
    ta: `சந்திர பலம்: ${chandraLabel.ta} · ${antarDasha} அந்தர்தசை`,
  };

  return templates[language];
}

export async function fetchPersonalToday(
  profile: BirthProfile,
  todayLocation: StoredLocation,
  language: AppLanguage,
): Promise<PersonalTodayViewModel> {
  const now = new Date();
  const cached = await getCachedPersonalToday(
    profile,
    todayLocation,
    language,
    now,
  );
  if (cached) {
    return cached;
  }

  const { janmaRashi, janmaNakshatra } = getJanmaIndices(profile);
  const natal = computeNatalSnapshot(profile, language);
  const geo = geoFromLocation(todayLocation);
  const libraryLanguage = toLibraryLanguage(language);

  const daily = getDailyPanchang(now, geo, {
    timezone: todayLocation.timezone,
    language: libraryLanguage,
    janmaRashi,
    janmaNakshatra,
    computeEndTimes: false,
  });

  if (!daily?.chandraBalam || !daily.tarabala) {
    throw new Error('Personal insights unavailable for this location');
  }

  const birth = birthInstantFromProfile(profile);
  const dasha = computeVimshottariDashaFromBirth(birth, 'lahiri');
  const activeDasha = findActiveDashaPeriods(dasha, now);
  const dashaPeriods = buildDashaPeriodInsights(
    activeDasha,
    language,
    natal,
    (date) => formatDashaEnd(date, language),
  );
  const sadeSati = computeSadeSati(janmaRashi, now, 'lahiri');

  const todayNakshatra =
    daily.nakshatras[0]?.name ?? daily.nakshatras.at(-1)?.name ?? '—';

  const chandraBalamContext = getChandraBalamContext(
    daily.chandraBalam.house,
    natal.moonRashi,
    daily.chandraRashi.name,
    language,
  );

  const taraDescription = getTaraDescription(
    daily.tarabala.taraIndex,
    language,
  );

  const guidance = getExpandedGuidance(
    daily.chandraBalam.quality,
    daily.tarabala.quality,
    language,
  );

  const currentHoraSlot = findCurrentHora(daily.hora, now);
  const currentHora = currentHoraSlot
    ? {
        planet: currentHoraSlot.planet,
        start: formatTime(currentHoraSlot.start, language),
        end: formatTime(currentHoraSlot.end, language),
        explanation: getHoraPeriodExplanation(
          currentHoraSlot.planet,
          language,
        ),
      }
    : undefined;

  const abhijitMuhurta = daily.abhijitMuhurta
    ? {
        start: formatTime(daily.abhijitMuhurta.start, language),
        end: formatTime(daily.abhijitMuhurta.end, language),
        explanation: getAbhijitPeriodExplanation(language),
      }
    : undefined;

  const dailyReading = buildDailyReading(
    {
      chandraQuality: daily.chandraBalam.quality,
      taraQuality: daily.tarabala.quality,
      taraEnglishName: daily.tarabala.englishName,
      todayMoonRashi: daily.chandraRashi.name,
      antarDasha: activeDasha.antar,
      pratyantarDasha: activeDasha.pratyantar,
      sadeSatiActive: sadeSati.active,
      horaPlanet: currentHoraSlot?.planet,
    },
    language,
  );

  const explainedInsights = buildExplainedDailyInsights(
    {
      chandraHouse: daily.chandraBalam.house,
      chandraQuality: daily.chandraBalam.quality,
      todayMoonRashi: daily.chandraRashi.name,
      birthMoonRashi: natal.moonRashi,
      taraIndex: daily.tarabala.taraIndex,
      taraQuality: daily.tarabala.quality,
      todayNakshatra,
      birthNakshatra: natal.moonNakshatra,
      antarDasha: activeDasha.antar,
      pratyantarDasha: activeDasha.pratyantar,
      sadeSatiActive: sadeSati.active,
      sadeSatiPhase: sadeSati.phase ?? undefined,
      natal,
    },
    language,
  );

  const transitInsights = buildTopTransitInsights(natal, language, now, 3);

  const choghadiyaSlots = findCurrentChoghadiya(daily.choghadiya, now);
  const currentChoghadiya = choghadiyaSlots
    ? formatChoghadiyaWindow(choghadiyaSlots.current, language)
    : undefined;
  const nextChoghadiya = choghadiyaSlots?.next
    ? formatChoghadiyaWindow(choghadiyaSlots.next, language)
    : undefined;

  const rahuKalam: TimeWindow = {
    label: 'Rahu Kalam',
    start: formatTime(daily.rahuKalam.start, language),
    end: formatTime(daily.rahuKalam.end, language),
    quality: 'inauspicious',
    explanation: buildRahuKalamExplanation(language),
  };

  const weeklyTone = buildWeeklyTone(
    activeDasha.pratyantar,
    transitInsights[0]?.summary ?? '',
    language,
  );

  const viewModel: PersonalTodayViewModel = {
    chandraBalam: {
      name: daily.chandraBalam.name,
      quality: daily.chandraBalam.quality,
      house: daily.chandraBalam.house,
    },
    tarabala: {
      name: daily.tarabala.name,
      quality: daily.tarabala.quality,
      taraIndex: daily.tarabala.taraIndex,
      englishName: daily.tarabala.englishName,
    },
    todayMoonRashi: daily.chandraRashi.name,
    birthMoonRashi: natal.moonRashi,
    todayNakshatra,
    birthNakshatra: natal.moonNakshatra,
    chandraBalamContext,
    taraDescription,
    currentHora,
    abhijitMuhurta,
    mahaDasha: activeDasha.maha,
    antarDasha: activeDasha.antar,
    pratyantarDasha: activeDasha.pratyantar,
    antarDashaEnd: activeDasha.antarEnd
      ? formatDashaEnd(activeDasha.antarEnd, language)
      : undefined,
    pratyantarDashaEnd: activeDasha.pratyantarEnd
      ? formatDashaEnd(activeDasha.pratyantarEnd, language)
      : undefined,
    dashaPeriods,
    sadeSati: {
      active: sadeSati.active,
      phase: sadeSati.phase ?? undefined,
    },
    dailyReading,
    guidance,
    teaserSummary: buildTeaserSummary(
      daily.chandraBalam.quality,
      activeDasha.antar,
      language,
    ),
    explainedInsights,
    transitInsights,
    currentChoghadiya,
    nextChoghadiya,
    rahuKalam,
    weeklyTone,
  };

  await setCachedPersonalToday(
    profile,
    todayLocation,
    language,
    viewModel,
    daily.sunrise,
    daily.nextSunrise,
  );

  return viewModel;
}
