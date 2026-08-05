import {
  computeRashiChart,
  computeSadeSati,
  computeVimshottariDashaFromBirth,
  computeNavamsa,
  computeYogas,
} from 'panchang-ts';
import type {
  AppLanguage,
  BirthProfile,
  LifeDirectionViewModel,
} from '../types';
import { getGlossaryTerm } from '../i18n/glossary';
import type { GlossaryTermId } from '../i18n/glossary';
import {
  getDashaLordEffect,
  getDashaLordTheme,
  getPlanetHouseInsight,
  getSadeSatiPhaseDescription,
  getYogaDescription,
} from '../i18n/jyotish-themes';
import { translateYogaReason } from '../i18n/jyotish-explanations';
import {
  getPlanetInHouseEffect,
  getYogaEffect,
} from '../i18n/jyotish-effects';
import {
  buildDashaPeriodInsights,
  findActiveDashaPeriods,
} from './dasha-periods';
import { buildLifeMilestones, formatAgeLabel } from './life-milestones';
import { computeNatalSnapshot } from './natal';
import {
  birthInstantFromProfile,
  geoFromLocation,
  toLibraryLanguage,
} from './utils';

function formatDate(date: Date, language: AppLanguage): string {
  const locale = language === 'en' ? 'en-IN' : 'hi-IN';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function computeLifeDirection(
  profile: BirthProfile,
  language: AppLanguage,
): LifeDirectionViewModel {
  const now = new Date();
  const birth = birthInstantFromProfile(profile);
  const location = geoFromLocation(profile.birthLocation);
  const libraryLanguage = toLibraryLanguage(language);
  const natal = computeNatalSnapshot(profile, language);

  const dasha = computeVimshottariDashaFromBirth(birth, 'lahiri');
  const active = findActiveDashaPeriods(dasha, now);
  const sadeSati = computeSadeSati(natal.moonRashiIndex, now, 'lahiri');
  const formatDashaDate = (date: Date) => formatDate(date, language);
  const dashaPeriods = buildDashaPeriodInsights(
    active,
    language,
    natal,
    formatDashaDate,
  );

  const mahaTheme = getDashaLordTheme(active.maha, language);
  const antarTheme = getDashaLordTheme(active.antar, language);
  const pratyantarTheme = getDashaLordTheme(active.pratyantar, language);

  const periodNarrativeTemplates: Record<AppLanguage, string> = {
    en: `Your life is in ${active.maha} Mahadasha, ${active.antar} Antardasha, and ${active.pratyantar} Pratyantar. The big picture: ${mahaTheme.toLowerCase()} What you feel now: ${antarTheme.toLowerCase()} This month's tone: ${pratyantarTheme.toLowerCase()}`,
    hi: `आप ${active.maha} महादशा, ${active.antar} अंतर्दशा और ${active.pratyantar} प्रत्यंतर में हैं। बड़ी तस्वीर: ${mahaTheme} अभी का अनुभव: ${antarTheme} इस महीने की लय: ${pratyantarTheme}`,
    sa: `भवान् ${active.maha}महादशायां ${active.antar}अन्तर्दशायां ${active.pratyantar}प्रत्यन्तरे च। महाचित्रम्: ${mahaTheme} अद्यानुभवः: ${antarTheme} अस्य मासस्य लयः: ${pratyantarTheme}`,
    te: `మీరు ${active.maha} మహాదశ, ${active.antar} అంతర్దశ మరియు ${active.pratyantar} ప్రత్యంతరలో ఉన్నారు. పెద్ద చిత్రం: ${mahaTheme} ఇప్పుడు అనుభవం: ${antarTheme} ఈ నెల స్వరం: ${pratyantarTheme}`,
    ta: `நீங்கள் ${active.maha} மகாதசை, ${active.antar} அந்தர்தசை மற்றும் ${active.pratyantar} பிரत्यந்தரில் உள்ளீர்கள். பெரிய படம்: ${mahaTheme} இப்போதைய அனுபவம்: ${antarTheme} இந்த மாதத்தின் நயம்: ${pratyantarTheme}`,
  };

  const dashaTimeline = dasha.mahaDashas.slice(0, 9).map((maha) => ({
    lord: maha.lord,
    startDate: formatDate(maha.startDate, language),
    endDate: formatDate(maha.endDate, language),
    ageAtStart: formatAgeLabel(birth, maha.startDate, language),
    ageAtEnd: formatAgeLabel(birth, maha.endDate, language),
    theme: getDashaLordTheme(maha.lord, language),
    lifeChapter: getDashaLordEffect('maha', maha.lord, language),
    isCurrent: now >= maha.startDate && now < maha.endDate,
    isPast: now >= maha.endDate,
  }));

  const lifeMilestones = buildLifeMilestones(
    dasha,
    birth,
    natal.moonRashiIndex,
    language,
    formatDashaDate,
  );

  let yogas: LifeDirectionViewModel['yogas'] = [];
  if (!profile.timeUnknown) {
    const chart = computeRashiChart(birth, location, {
      houseSystem: 'whole-sign',
      language: libraryLanguage,
    });
    const d9 = computeNavamsa(birth, location, {
      language: libraryLanguage,
    });
    const detected = computeYogas(chart, { navamsa: d9 });
    yogas = detected.slice(0, 6).map((yoga) => ({
      name: yoga.name,
      type: yoga.type,
      description: getYogaDescription(yoga.name, language),
      effect:
        getYogaEffect(yoga.name, yoga.reasons, language) ||
        getYogaDescription(yoga.name, language),
      reasons: yoga.reasons,
      how:
        yoga.reasons.length > 0
          ? yoga.reasons
              .map((r) => translateYogaReason(r, language))
              .join(' ')
          : '',
    }));
  }

  const planetInsights: LifeDirectionViewModel['planetInsights'] =
    natal.planets?.map((planet) => {
      const houseTermId = `house${planet.house}` as GlossaryTermId;
      const houseTheme = getGlossaryTerm(houseTermId, language);
      return {
        planet: planet.planet,
        house: planet.house,
        rashi: planet.rashi,
        insight: getPlanetHouseInsight(
          planet.planet,
          planet.house,
          houseTheme,
          language,
        ),
        effect: getPlanetInHouseEffect(
          planet.planet,
          planet.house,
          language,
        ),
      };
    }) ?? [];

  return {
    mahaDasha: active.maha,
    antarDasha: active.antar,
    pratyantarDasha: active.pratyantar,
    antarDashaEnd: active.antarEnd
      ? formatDate(active.antarEnd, language)
      : undefined,
    pratyantarDashaEnd: active.pratyantarEnd
      ? formatDate(active.pratyantarEnd, language)
      : undefined,
    mahaDashaTheme: mahaTheme,
    antarDashaTheme: antarTheme,
    pratyantarDashaTheme: pratyantarTheme,
    periodNarrative: periodNarrativeTemplates[language],
    dashaPeriods,
    dashaTimeline,
    lifeMilestones,
    yogas,
    planetInsights,
    sadeSati: {
      active: sadeSati.active,
      phase: sadeSati.phase ?? undefined,
      description:
        sadeSati.active && sadeSati.phase
          ? getSadeSatiPhaseDescription(sadeSati.phase, language)
          : undefined,
      arcEnd: sadeSati.currentArcEnd
        ? formatDate(sadeSati.currentArcEnd, language)
        : undefined,
      nextArcStart: sadeSati.nextArcStart
        ? formatDate(sadeSati.nextArcStart, language)
        : undefined,
    },
  };
}
