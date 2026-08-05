import type { AppLanguage, AshtakootGunaId, ExplainedInsight } from '../types';
import { buildExplainedInsight } from '../jyotish/explained-insight';

const GUNA_NAMES: Record<AshtakootGunaId, Record<AppLanguage, string>> = {
  varna: {
    en: 'Varna',
    hi: 'वर्ण',
    sa: 'वर्णः',
    te: 'వర్ణ',
    ta: 'வர்ணம்',
  },
  vashya: {
    en: 'Vashya',
    hi: 'वश्य',
    sa: 'वश्यः',
    te: 'వశ్య',
    ta: 'வசியம்',
  },
  tara: {
    en: 'Tara',
    hi: 'तारा',
    sa: 'तारा',
    te: 'తార',
    ta: 'தாரா',
  },
  yoni: {
    en: 'Yoni',
    hi: 'योनि',
    sa: 'योनिः',
    te: 'యోని',
    ta: 'யோனி',
  },
  maitri: {
    en: 'Graha Maitri',
    hi: 'ग्रह मैत्री',
    sa: 'ग्रहमैत्री',
    te: 'గ్రహ మైత్రి',
    ta: 'கிரக மைத்ரி',
  },
  gana: {
    en: 'Gana',
    hi: 'गण',
    sa: 'गणः',
    te: 'గణ',
    ta: 'கணம்',
  },
  bhakoot: {
    en: 'Bhakoot',
    hi: 'भकूट',
    sa: 'भकूटः',
    te: 'భకూట్',
    ta: 'பகூட்',
  },
  nadi: {
    en: 'Nadi',
    hi: 'नाड़ी',
    sa: 'नाडी',
    te: 'నాడి',
    ta: 'நாடி',
  },
};

type GunaContext = {
  score: number;
  maxScore: number;
  dosha?: boolean;
  selfMoonRashi: string;
  partnerMoonRashi: string;
  selfMoonNakshatra: string;
  partnerMoonNakshatra: string;
};

function gunaTemplates(
  id: AshtakootGunaId,
  ctx: GunaContext,
  language: AppLanguage,
): ExplainedInsight {
  const title = GUNA_NAMES[id][language];
  const scoreLabel = `${ctx.score}/${ctx.maxScore}`;

  const en: Omit<ExplainedInsight, 'termIds'> = {
    title: `${title} — ${scoreLabel}`,
    summary:
      ctx.dosha
        ? `${title} shows a classical dosha flag — families often review this with an astrologer.`
        : `${title} contributes ${ctx.score} of ${ctx.maxScore} points in Ashtakoot.`,
    what: `Classical ${title} compares birth Moon rashis and nakshatras between two charts.`,
    how: `We apply North Indian Ashtakoot tables using your Moon (${ctx.selfMoonRashi}, ${ctx.selfMoonNakshatra}) and partner Moon (${ctx.partnerMoonRashi}, ${ctx.partnerMoonNakshatra}).`,
    why: 'Each guna reflects a traditional dimension — temperament, health themes, emotional flow — not a single life outcome.',
    practical:
      ctx.dosha
        ? 'Dosha flags are informational. Many charts with doshas proceed happily; cancellations and full-chart review matter.'
        : 'Use as one lens among many — not a yes/no marriage verdict.',
  };

  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en,
    hi: {
      title: `${title} — ${scoreLabel}`,
      summary: ctx.dosha ? `${title} में दोष चिह्न।` : `${title}: ${ctx.score}/${ctx.maxScore} अंक।`,
      what: 'जन्म चन्द्र राशि और नक्षत्र की तुलना।',
      how: 'उत्तर भारतीय अष्टकूट नियम।',
      why: 'प्रत्येक गुण एक पारंपरिक आयाम दर्शाता है।',
      practical: 'जानकारी मात्र — अंतिम निर्णय ज्योतिषी से।',
    },
    sa: {
      title: `${title} — ${scoreLabel}`,
      summary: ctx.dosha ? 'दोषचिह्नम्।' : `${ctx.score}/${ctx.maxScore}।`,
      what: 'चन्द्रराशिनक्षत्रतुलनम्।',
      how: 'अष्टकूटनियमाः।',
      why: 'प्रत्येकं गुणः एकं आयामं दर्शयति।',
      practical: 'सूचनामात्रम्।',
    },
    te: {
      title: `${title} — ${scoreLabel}`,
      summary: ctx.dosha ? 'దోష గుర్తు.' : `${ctx.score}/${ctx.maxScore} పాయింట్లు.`,
      what: 'జన్మ చంద్ర రాశి-నక్షత్ర పోలిక.',
      how: 'నార్త్ ఇండియన్ అష్టకూట్ నియమాలు.',
      why: 'ప్రతి గుణం ఒక సంప్రదాయ అంశం.',
      practical: 'సమాచారం మాత్రమే.',
    },
    ta: {
      title: `${title} — ${scoreLabel}`,
      summary: ctx.dosha ? 'தோஷ குறி.' : `${ctx.score}/${ctx.maxScore} புள்ளிகள்.`,
      what: 'பிறப்பு சந்திர ராசி-நட்சத்திர ஒப்பீடு.',
      how: 'வட இந்திய அஷ்டகூட் விதிகள்.',
      why: 'ஒவ்வொரு குணமும் ஒரு பாரம்பரிய பிரிவு.',
      practical: 'தகவல் மட்டும்.',
    },
  };

  const termIds: ExplainedInsight['termIds'] =
    id === 'nadi' ? ['nadiDosha', 'ashtakoot'] :
    id === 'bhakoot' ? ['bhakootDosha', 'ashtakoot'] :
    ['ashtakoot'];

  return buildExplainedInsight({ ...templates[language], termIds });
}

export function buildGunaInsight(
  id: AshtakootGunaId,
  score: number,
  maxScore: number,
  dosha: boolean | undefined,
  context: Omit<GunaContext, 'score' | 'maxScore' | 'dosha'>,
  language: AppLanguage,
): ExplainedInsight {
  return gunaTemplates(id, { ...context, score, maxScore, dosha }, language);
}

export function buildMatchSummaryInsight(
  totalScore: number,
  qualityBand: string,
  nadiDosha: boolean,
  bhakootDosha: boolean,
  language: AppLanguage,
): ExplainedInsight {
  const templates: Record<AppLanguage, ExplainedInsight> = {
    en: {
      title: 'Ashtakoot total',
      summary: `${totalScore}/36 — traditionally ${qualityBand} band. Classical tables use first profile as groom, partner as bride.`,
      what: 'Ashtakoot sums eight gunas (max 36) from Moon rashi and nakshatra compatibility.',
      how: 'Offline North Indian lookup tables — Varna through Nadi.',
      why: 'Families use this as a starting conversation, not a final answer.',
      practical:
        nadiDosha || bhakootDosha
          ? 'Nadi or Bhakoot dosha flagged — many pandits check cancellations and full charts before advising.'
          : 'Reflect on themes that score lower; consult a qualified astrologer for major decisions.',
      termIds: ['ashtakoot'],
    },
    hi: {
      title: 'अष्टकूट कुल',
      summary: `${totalScore}/36 — ${qualityBand}।`,
      what: 'आठ गुणों का योग।',
      how: 'उत्तर भारतीय तालिकाएँ।',
      why: 'आरंभिक संदर्भ, अंतिम उत्तर नहीं।',
      practical: 'योग्य ज्योतिषी से परामर्श करें।',
      termIds: ['ashtakoot'],
    },
    sa: {
      title: 'अष्टकूटकुलम्',
      summary: `${totalScore}/36।`,
      what: 'अष्टगुणयोगः।',
      how: 'शास्त्रीयनियमाः।',
      why: 'आरम्भिकसन्दर्भः।',
      practical: 'ज्योतिषीं पृच्छत।',
      termIds: ['ashtakoot'],
    },
    te: {
      title: 'అష్టకూట్ మొత్తం',
      summary: `${totalScore}/36।`,
      what: 'ఎనిమిది గుణాల మొత్తం.',
      how: 'నార్త్ ఇండియన్ నియమాలు.',
      why: 'ప్రారంభ సూచన.',
      practical: 'జ్యోతిషిని సంప్రదించండి.',
      termIds: ['ashtakoot'],
    },
    ta: {
      title: 'அஷ்டகூட் மொத்தம்',
      summary: `${totalScore}/36.`,
      what: 'எட்டு குணங்களின் தொகை.',
      how: 'வட இந்திய விதிகள்.',
      why: 'தொடக்க குறிப்பு.',
      practical: 'ஜோதிடரை அணுகவும்.',
      termIds: ['ashtakoot'],
    },
  };
  return templates[language];
}

export function qualityBandLabel(
  band: 'low' | 'moderate' | 'good' | 'excellent',
  language: AppLanguage,
): string {
  const labels: Record<string, Record<AppLanguage, string>> = {
    low: {
      en: 'below 18 — often reviewed carefully',
      hi: '18 से कम — सावधानी से देखा जाता है',
      sa: 'अधो 18',
      te: '18 కింద',
      ta: '18 கீழ்',
    },
    moderate: {
      en: '18–23 — workable in many traditions',
      hi: '18–23 — अनेक परंपराओं में स्वीकार्य',
      sa: '18–23',
      te: '18–23',
      ta: '18–23',
    },
    good: {
      en: '24–31 — generally favorable',
      hi: '24–31 — सामान्यतः अनुकूल',
      sa: '24–31',
      te: '24–31',
      ta: '24–31',
    },
    excellent: {
      en: '32+ — high classical score',
      hi: '32+ — उच्च अंक',
      sa: '32+',
      te: '32+',
      ta: '32+',
    },
  };
  return labels[band][language];
}
