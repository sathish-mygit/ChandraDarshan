import {
  computeDignity,
  computeKaalSarp,
  computeMangalDosha,
  computeNavamsa,
  computePitruDosha,
  computeRashiChart,
  computeYogas,
} from 'panchang-ts';
import type {
  AppLanguage,
  BirthProfile,
  ChartDepthViewModel,
  DignityInsight,
  DignityKind,
  DoshaInsight,
  ExplainedInsight,
} from '../types';
import {
  buildDignityInsight,
  buildNavamsaInsight,
  translateYogaReason,
} from '../i18n/jyotish-explanations';
import { getYogaDescription } from '../i18n/jyotish-themes';
import { getPlanetHouseInsight } from '../i18n/jyotish-themes';
import {
  getDoshaLifeEffect,
  getPlanetInHouseEffect,
  getYogaEffect,
} from '../i18n/jyotish-effects';
import { getGlossaryTerm } from '../i18n/glossary';
import type { GlossaryTermId } from '../i18n/glossary';
import { buildExplainedInsight } from './explained-insight';
import { computeNatalSnapshot } from './natal';
import {
  birthInstantFromProfile,
  geoFromLocation,
  toLibraryLanguage,
} from './utils';

const DIGNITY_MAP: Record<string, DignityKind> = {
  exalted: 'exalted',
  moolatrikona: 'moolatrikona',
  own: 'own',
  friend: 'friend',
  neutral: 'neutral',
  enemy: 'enemy',
  debilitated: 'debilitated',
};

function buildMangalDoshaInsight(
  active: boolean,
  cancellations: string[],
  language: AppLanguage,
): ExplainedInsight {
  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Mangal Dosha',
      summary: active
        ? 'Mars in classical manglik houses from Lagna, Moon, or Venus.'
        : 'No active Mangal Dosha (or cancelled).',
      effect: getDoshaLifeEffect('mangal', active, 'en'),
      what: active
        ? 'Mars occupies houses 1, 2, 4, 7, 8, or 12 from Lagna, Moon, or Venus.'
        : 'Mars is not in manglik positions, or cancellations apply.',
      how: 'We check Mars from three reference points per drik-panchang rules. Cancellations: own sign, exalted, conjunct Jupiter/Moon/Venus, or Jupiter aspect.',
      why: 'Traditionally noted for marriage matching — many charts have cancellations. Not a curse.',
      practical:
        cancellations.length > 0
          ? `Cancellations: ${cancellations.join('; ')}. Informational only — consult a qualified astrologer for marriage decisions.`
          : 'Informational only — not a prediction of relationship failure.',
    },
    hi: {
      title: 'मंगल दोष',
      summary: active ? 'मंगल दोष सक्रिय या रद्द।' : 'मंगल दोष नहीं।',
      effect: getDoshaLifeEffect('mangal', active, 'hi'),
      what: 'मंगल लग्न/चन्द्र/शुक्र से 1,2,4,7,8,12 में।',
      how: 'दृक पंचांग नियम + रद्दीकरण।',
      why: 'विवाह मिलान में देखा जाता है — शाप नहीं।',
      practical: 'जानकारी मात्र।',
    },
    sa: {
      title: 'मङ्गलदोषः',
      summary: active ? 'मङ्गलदोषः' : 'नास्ति',
      effect: getDoshaLifeEffect('mangal', active, 'sa'),
      what: 'मङ्गलं लग्नचन्द्रशुक्रात्।',
      how: 'शास्त्रीयनियमाः।',
      why: 'विवाहमिलनार्थम्।',
      practical: 'सूचनामात्रम्।',
    },
    te: {
      title: 'మంగళ దోషం',
      summary: active ? 'మంగళ దోషం' : 'లేదు',
      effect: getDoshaLifeEffect('mangal', active, 'te'),
      what: 'మంగళం లగ్న/చంద్ర/శుక్ర నుండి మంగళిక భావాలు.',
      how: 'శాస్త్రీయ నియమాలు + రద్దులు.',
      why: 'వివాహ పోలికలో చూస్తారు.',
      practical: 'సమాచారం మాత్రమే.',
    },
    ta: {
      title: 'மங்கல தோஷம்',
      summary: active ? 'மங்கல தோஷம்' : 'இல்லை',
      effect: getDoshaLifeEffect('mangal', active, 'ta'),
      what: 'செவ்வாய் லக்ன/சந்திர/சுக்ரத்திலிருந்து மங்களிக பாவங்கள்.',
      how: 'சாஸ்திர விதிகள் + ரத்துகள்.',
      why: 'திருமண பொருத்தத்தில் பார்க்கப்படுகிறது.',
      practical: 'தகவல் மட்டும்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['mangalDosha'],
  });
}

function buildKaalSarpInsight(
  active: boolean,
  subtype: string | undefined,
  language: AppLanguage,
): ExplainedInsight {
  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Kaal Sarp Dosha',
      summary: active
        ? `All seven visible planets lie within 180° of Rahu–Ketu axis (${subtype ?? 'subtype'}).`
        : 'Kaal Sarp not active in your chart.',
      effect: getDoshaLifeEffect('kaalSarp', active, 'en'),
      what: active
        ? 'Classical definition: Sun through Saturn all on one side of the Rahu–Ketu axis.'
        : 'Planets are distributed on both sides of the nodal axis.',
      how: 'We test forward and backward 180° arcs from Rahu longitude. Subtype named by Rahu\'s house.',
      why: 'Some traditions note intensity or karmic themes — widely debated; many eminent charts have this.',
      practical: 'Educational flag only. Not a life sentence.',
    },
    hi: {
      title: 'काल सर्प दोष',
      summary: active ? 'काल सर्प सक्रिय' : 'नहीं',
      what: 'सात ग्रह राहु-केतु अक्ष के एक ओर।',
      how: '180° चाप परीक्षण।',
      why: 'परंपराओं में विवादित।',
      practical: 'शैक्षिक।',
    },
    sa: {
      title: 'कालसर्पदोषः',
      summary: active ? 'सक्रियः' : 'नास्ति',
      what: 'सप्तग्रहाः एकपार्श्वे।',
      how: '180°परीक्षणम्।',
      why: 'विवादितः।',
      practical: 'शैक्षिकम्।',
    },
    te: {
      title: 'కాల సర్ప దోషం',
      summary: active ? 'సక్రియం' : 'లేదు',
      what: 'ఏడు గ్రహాలు రాహు-కేతు అక్షం ఒక వైపు.',
      how: '180° వృత్తం పరీక్ష.',
      why: 'చర్చనీయం.',
      practical: 'విద్యాపరమైనది.',
    },
    ta: {
      title: 'கால சர்ப்ப தோஷம்',
      summary: active ? 'செயலில்' : 'இல்லை',
      what: 'ஏழு கிரகங்கள் ராகு-கேது அச்சின் ஒரு பக்கம்.',
      how: '180° வில் சோதனை.',
      why: 'விவாதிக்கப்படுகிறது.',
      practical: 'கல்வி நோக்கம்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['kaalSarp'],
  });
}

function buildPitruDoshaInsight(
  active: boolean,
  reasons: string[],
  language: AppLanguage,
): ExplainedInsight {
  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Pitru Dosha',
      summary: active
        ? 'Classical pitru affliction indicators present.'
        : 'No Pitru Dosha triggers in your chart.',
      effect: getDoshaLifeEffect('pitru', active, 'en'),
      what: active ? reasons.join('; ') : 'None of the four pandit-consensus triggers found.',
      how: 'Four triggers: Sun+Rahu, Sun+Saturn, Rahu in 9th, 9th lord+Rahu.',
      why: 'Linked to ancestral themes in some traditions — informational, not blame.',
      practical: 'Consult traditions and qualified guides for remedies if desired. Not a diagnosis.',
    },
    hi: {
      title: 'पितृ दोष',
      summary: active ? 'पितृ दोष संकेत' : 'नहीं',
      what: reasons.join('; ') || 'कोई ट्रिगर नहीं',
      how: 'चार शास्त्रीय ट्रिगर।',
      why: 'पैतृक विषयों से जुड़ा।',
      practical: 'जानकारी मात्र।',
    },
    sa: {
      title: 'पितृदोषः',
      summary: active ? 'सङ्केताः' : 'नास्ति',
      what: reasons.join('; '),
      how: 'चतुष्ट्रिगराः।',
      why: 'पैतृकविषयाः।',
      practical: 'सूचना।',
    },
    te: {
      title: 'పితృ దోషం',
      summary: active ? 'సంకేతాలు' : 'లేదు',
      what: reasons.join('; '),
      how: 'నాలుగు ట్రిగర్లు.',
      why: 'పూర్వీక విషయాలు.',
      practical: 'సమాచారం మాత్రమే.',
    },
    ta: {
      title: 'பித்ரு தோஷம்',
      summary: active ? 'குறிகாட்டிகள்' : 'இல்லை',
      what: reasons.join('; '),
      how: 'நான்கு தூண்டுதல்கள்.',
      why: 'மூதாதையர் தீம்கள்.',
      practical: 'தகவல் மட்டும்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['pitruDosha'],
  });
}

export function computeChartDepth(
  profile: BirthProfile,
  language: AppLanguage,
): ChartDepthViewModel {
  const natal = computeNatalSnapshot(profile, language);
  const timeRequired = profile.timeUnknown;
  const unlocked = !profile.timeUnknown;

  if (!unlocked) {
    return {
      dignities: [],
      doshas: [],
      yogas: [],
      planetInsights: [],
      timeRequired: true,
      unlocked: false,
    };
  }

  const birth = birthInstantFromProfile(profile);
  const location = geoFromLocation(profile.birthLocation);
  const libraryLanguage = toLibraryLanguage(language);

  const d1 = computeRashiChart(birth, location, {
    houseSystem: 'whole-sign',
    language: libraryLanguage,
  });
  const d9 = computeNavamsa(birth, location, {
    language: libraryLanguage,
  });
  const detectedYogas = computeYogas(d1, { navamsa: d9 });

  const vargottamaPlanets = d1.planets
    .filter((p1) => {
      const p9 = d9.planets.find((p) => p.planet === p1.planet);
      return p9 && p9.rashi.index === p1.rashi.index;
    })
    .map((p) => p.planet);

  const d9Moon = d9.planets.find((p) => p.planet === 'Moon');

  const navamsa = {
    lagna: d9.lagnaRashi.name,
    moonRashi: d9Moon?.rashi.name ?? '—',
    vargottamaPlanets,
    insight: buildNavamsaInsight(
      d9.lagnaRashi.name,
      d9Moon?.rashi.name ?? '—',
      vargottamaPlanets,
      language,
    ),
  };

  const dignities: DignityInsight[] = d1.planets.map((planet) => {
    const dignityRaw = computeDignity(planet.planet, planet.rashi.index);
    const dignity = DIGNITY_MAP[dignityRaw] ?? 'neutral';
    return {
      planet: planet.planet,
      rashi: planet.rashi.name,
      dignity,
      insight: buildDignityInsight(
        planet.planet,
        planet.rashi.name,
        dignityRaw,
        language,
      ),
    };
  });

  const mangal = computeMangalDosha(d1);
  const kaalSarp = computeKaalSarp(d1);
  const pitru = computePitruDosha(d1);

  const doshas: DoshaInsight[] = [
    {
      name: 'Mangal Dosha',
      active: mangal.afflicted,
      cancellations: mangal.cancellations,
      insight: buildMangalDoshaInsight(
        mangal.afflicted,
        mangal.cancellations,
        language,
      ),
    },
    {
      name: 'Kaal Sarp',
      active: kaalSarp.afflicted,
      insight: buildKaalSarpInsight(
        kaalSarp.afflicted,
        kaalSarp.subtype ?? undefined,
        language,
      ),
    },
    {
      name: 'Pitru Dosha',
      active: pitru.afflicted,
      cancellations: pitru.reasons,
      insight: buildPitruDoshaInsight(
        pitru.afflicted,
        pitru.reasons,
        language,
      ),
    },
  ];

  const yogas = detectedYogas.slice(0, 8).map((yoga) => ({
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

  const planetInsights =
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
    navamsa,
    dignities,
    doshas,
    yogas,
    planetInsights,
    timeRequired,
    unlocked,
  };
}
