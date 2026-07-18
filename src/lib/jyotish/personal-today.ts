import {
  computeSadeSati,
  computeVimshottariDashaFromBirth,
  getDailyPanchang,
} from 'panchang-ts';
import type { HoraInfo } from 'panchang-ts';
import type {
  AppLanguage,
  BirthProfile,
  PersonalTodayViewModel,
  StoredLocation,
} from '../types';
import {
  getChandraBalamContext,
  getExpandedGuidance,
  getAbhijitPeriodExplanation,
  getHoraPeriodExplanation,
  getTaraDescription,
} from '../i18n/jyotish-themes';
import { buildDailyReading } from '../i18n/daily-reading';
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
