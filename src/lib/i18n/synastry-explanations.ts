import type {
  AppLanguage,
  ExplainedInsight,
  MangalPairingNote,
} from '../types';
import { buildExplainedInsight } from '../jyotish/explained-insight';
import type { computeRashiChart } from 'panchang-ts';

export function buildMangalPairingInsight(
  selfAfflicted: boolean,
  partnerAfflicted: boolean,
  note: MangalPairingNote,
  approximate: boolean,
  language: AppLanguage,
): ExplainedInsight {
  const afflictedSummary =
    selfAfflicted && partnerAfflicted
      ? 'both afflicted'
      : selfAfflicted
        ? 'self afflicted'
        : partnerAfflicted
          ? 'partner afflicted'
          : 'neither afflicted';

  const templates: Record<AppLanguage, ExplainedInsight> = {
    en: {
      title: 'Mangal pairing',
      summary: approximate
        ? 'Birth time needed for Mars-house Mangal check — Moon-based Ashtakoot still applies.'
        : note === 'both'
          ? 'Both charts show Mangal Dosha — traditionally often considered mutually acceptable.'
          : note === 'neither'
            ? 'Neither chart shows active Mangal Dosha.'
            : `One chart shows Mangal Dosha (${afflictedSummary}) — families often review cancellations and full charts.`,
      what: 'Mangal Dosha flags Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna, Moon, or Venus.',
      how: 'We compare Mangal status on both D1 charts when birth time is known for each.',
      why: 'Traditionally weighed in marriage matching — not a curse; cancellations are common.',
      practical: approximate
        ? 'Add birth times for accurate Mars-house review.'
        : 'Informational only — consult a qualified astrologer for marriage decisions.',
      termIds: ['mangalDosha'],
    },
    hi: {
      title: 'मंगल पैरिंग',
      summary: approximate ? 'जन्म समय आवश्यक।' : 'मंगल दोष तुलना।',
      what: 'मंगल विशेष भावों में।',
      how: 'दोनों कुंडलियों की तुलना।',
      why: 'विवाह मिलान में देखा जाता है।',
      practical: 'जानकारी मात्र।',
      termIds: ['mangalDosha'],
    },
    sa: {
      title: 'मङ्गलमिलनम्',
      summary: approximate ? 'जन्मकालः आवश्यकः।' : 'मङ्गलदोषतुलनम्।',
      what: 'मङ्गलं विशेषभावेषु।',
      how: 'उभयचक्रतुलनम्।',
      why: 'विवाहमिलनार्थम्।',
      practical: 'सूचनामात्रम्।',
      termIds: ['mangalDosha'],
    },
    te: {
      title: 'మంగళ పోలిక',
      summary: approximate ? 'జన్మ సమయం అవసరం.' : 'మంగళ దోష పోలిక.',
      what: 'మంగళం ప్రత్యేక భావాలలో.',
      how: 'రెండు చార్టుల తులన.',
      why: 'వివాహ పోలికలో చూస్తారు.',
      practical: 'సమాచారం మాత్రమే.',
      termIds: ['mangalDosha'],
    },
    ta: {
      title: 'மங்கல பொருத்தம்',
      summary: approximate ? 'பிறப்பு நேரம் தேவை.' : 'மங்கல தோஷ ஒப்பீடு.',
      what: 'மங்கலம் சிறப்பு வீடுகளில்.',
      how: 'இரண்டு சார்ட்கள் ஒப்பீடு.',
      why: 'திருமண பொருத்தத்தில் பார்க்கப்படுகிறது.',
      practical: 'தகவல் மட்டும்.',
      termIds: ['mangalDosha'],
    },
  };
  return templates[language];
}

export function buildLagnaHarmonyInsight(
  selfLagna: string,
  partnerLagna: string,
  selfElement: string,
  partnerElement: string,
  lordHarmony: number,
  language: AppLanguage,
): ExplainedInsight {
  return buildExplainedInsight({
    title: language === 'en' ? 'Lagna harmony' : 'लग्न सामंजस्य',
    summary:
      language === 'en'
        ? `Your lagna ${selfLagna} (${selfElement}) and partner lagna ${partnerLagna} (${partnerElement}) — lord friendship score ${lordHarmony}/5.`
        : `लग्न ${selfLagna} और ${partnerLagna}.`,
    what: 'Lagna sets the whole-sign chart frame — how each person meets life.',
    how: 'We compare lagna signs, elements, and Moon-sign lord friendship (Graha Maitri scale).',
    why: 'Classical synastry checks whether life-direction frames harmonize.',
    practical: 'Themes for mutual understanding — not compatibility verdict.',
    termIds: ['lagna'],
  });
}

export function buildSeventhHouseInsight(
  selfSeventh: { lord: string; house: number; dignity: string },
  partnerSeventh: { lord: string; house: number; dignity: string },
  language: AppLanguage,
): ExplainedInsight {
  return buildExplainedInsight({
    title: language === 'en' ? '7th house themes' : 'सप्तम भाव',
    summary:
      language === 'en'
        ? `Your 7th lord ${selfSeventh.lord} (house ${selfSeventh.house}, ${selfSeventh.dignity}); partner 7th lord ${partnerSeventh.lord} (house ${partnerSeventh.house}, ${partnerSeventh.dignity}).`
        : 'सप्तमेश स्थिति।',
    what: 'The 7th house governs partnerships and public agreements in Vedic chart reading.',
    how: 'Whole-sign D1: 7th lord placement and dignity for each chart.',
    why: 'Marriage matching traditionally reviews partnership houses on both charts.',
    practical: 'Note which themes each person brings to partnership — reflection, not prediction.',
    termIds: ['house7'],
  });
}

export function buildVenusJupiterInsight(
  selfChart: ReturnType<typeof computeRashiChart>,
  partnerChart: ReturnType<typeof computeRashiChart>,
  selfLagna: number,
  partnerLagna: number,
  language: AppLanguage,
  extraNote?: string,
): ExplainedInsight {
  const selfVenus = selfChart.planets.find((p) => p.planet === 'Venus');
  const selfJupiter = selfChart.planets.find((p) => p.planet === 'Jupiter');
  const partnerVenus = partnerChart.planets.find((p) => p.planet === 'Venus');
  const partnerJupiter = partnerChart.planets.find((p) => p.planet === 'Jupiter');

  const summary =
    language === 'en'
      ? `Venus/Jupiter — you: V house ${selfVenus?.house ?? '—'}, J house ${selfJupiter?.house ?? '—'}; partner: V house ${partnerVenus?.house ?? '—'}, J house ${partnerJupiter?.house ?? '—'}.${extraNote ? ` ${extraNote}` : ''}`
      : 'शुक्र/गुरु भावस्थिति।';

  return buildExplainedInsight({
    title: language === 'en' ? 'Venus & Jupiter' : 'शुक्र और गुरु',
    summary,
    what: 'Venus themes: harmony, affection. Jupiter themes: wisdom, growth — classical marriage karakas.',
    how: 'House placement of Venus and Jupiter in each D1 chart.',
    why: 'Synastry checks whether relationship karakas sit in supportive houses.',
    practical: 'Educational chart note — not a romance or commitment forecast.',
    termIds: ['house7'],
  });
}

export function buildNavamsaPairingInsight(
  selfD9Lagna: string,
  partnerD9Lagna: string,
  selfD9Moon: string,
  partnerD9Moon: string,
  language: AppLanguage,
): ExplainedInsight {
  return buildExplainedInsight({
    title: language === 'en' ? 'Navamsa pairing' : 'नवांश मिलान',
    summary:
      language === 'en'
        ? `D9 lagna: ${selfD9Lagna} / ${partnerD9Lagna}; D9 Moon: ${selfD9Moon} / ${partnerD9Moon}.`
        : 'नवांश लग्न और चन्द्र।',
    what: 'Navamsa (D9) is the divisional chart for deeper dharma and partnership themes.',
    how: 'Compare Navamsa lagna and Moon rashis between charts.',
    why: 'Classical matching often reviews D9 after D1 Moon compatibility.',
    practical: 'Inner-chart themes — consult a pandit for nuanced D9 rules.',
    termIds: ['navamsa'],
  });
}

export function synastryLockedMessage(language: AppLanguage): string {
  const messages: Record<AppLanguage, string> = {
    en: 'Add birth time for both profiles to unlock lagna, 7th house, Venus/Jupiter, and Navamsa synastry.',
    hi: 'दोनों के जन्म समय से पूर्ण चार्ट समन्वय देखें।',
    sa: 'उभयजन्मकालेन पूर्णचक्रम्।',
    te: 'రెండు ప్రొఫైల్‌లకు జన్మ సమయం జోడించండి.',
    ta: 'இரண்டு சுயவிவரங்களுக்கும் பிறப்பு நேரம் சேர்க்கவும்.',
  };
  return messages[language];
}
