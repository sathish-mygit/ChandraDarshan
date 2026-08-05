import type { AppLanguage, ExplainedInsight } from '../types';
import type { GlossaryTermId } from './glossary';
import { buildExplainedInsight } from '../jyotish/explained-insight';
import {
  getChandraBalamEffect,
  getDignityLifeEffect,
  getTarabalaEffect,
  getTransitEffect,
} from './jyotish-effects';
import { getHouseTheme } from './jyotish-house-themes';
import { getDashaLordEffect } from './jyotish-themes';

export { getHouseTheme } from './jyotish-house-themes';

type LocalizedText = Record<AppLanguage, string>;

const TARA_NAMES: LocalizedText[] = [
  { en: 'Janma', hi: 'जन्म', sa: 'जन्म', te: 'జన్మ', ta: 'ஜன்ம' },
  { en: 'Sampat', hi: 'सम्पत्', sa: 'सम्पत्', te: 'సంపత్', ta: 'சம்பத்' },
  { en: 'Vipat', hi: 'विपत्', sa: 'विपत्', te: 'విపత్', ta: 'விபத்' },
  { en: 'Kshema', hi: 'क्षेम', sa: 'क्षेम', te: 'క్షేమ', ta: 'க்ஷேம' },
  { en: 'Pratyari', hi: 'प्रत्यारि', sa: 'प्रत्यारि', te: 'ప్రత్యరి', ta: 'பிரத்யரி' },
  { en: 'Sadhaka', hi: 'साधक', sa: 'साधक', te: 'సాధక', ta: 'சாதக' },
  { en: 'Vadha', hi: 'वध', sa: 'वध', te: 'వధ', ta: 'வத' },
  { en: 'Mitra', hi: 'मित्र', sa: 'मित्र', te: 'మిత్ర', ta: 'மித்ர' },
  { en: 'Ati-Mitra', hi: 'अति-मित्र', sa: 'अतिमित्र', te: 'అతి-మిత్ర', ta: 'அதி-மித்ர' },
];

const EXPLAINED_LABELS: Record<
  'effect' | 'what' | 'how' | 'why' | 'practical',
  LocalizedText
> = {
  effect: {
    en: 'What it tends to mean',
    hi: 'इसका प्रभाव क्या हो सकता है',
    sa: 'प्रभावः किं भवति',
    te: 'దీని ప్రభావం ఏమిటి',
    ta: 'இதன் விளைவு என்ன',
  },
  what: {
    en: 'What we see',
    hi: 'क्या दिखता है',
    sa: 'किं दृश्यते',
    te: 'మనం చూసేది',
    ta: 'நாம் காண்பது',
  },
  how: {
    en: 'How it is calculated',
    hi: 'कैसे गणना होती है',
    sa: 'कथं गणना',
    te: 'ఎలా లెక్కిస్తారు',
    ta: 'எப்படி கணக்கிடப்படுகிறது',
  },
  why: {
    en: 'Why traditions use it',
    hi: 'परंपरा इसे क्यों देखती है',
    sa: 'परंपरा किमर्थम्',
    te: 'సంప్రదాయం ఎందుకు చూస్తుంది',
    ta: 'ஏன் பாரம்பரியம் இதைப் பயன்படுத்துகிறது',
  },
  practical: {
    en: 'Practical note',
    hi: 'व्यावहारिक सूचना',
    sa: 'व्यावहारिकसूचना',
    te: 'వ్యవహారిక గమనిక',
    ta: 'நடைமுறை குறிப்பு',
  },
};

export function getExplainedLabel(
  key: keyof typeof EXPLAINED_LABELS,
  language: AppLanguage,
): string {
  return EXPLAINED_LABELS[key][language];
}

export function buildChandraBalamInsight(
  house: number,
  quality: 'strong' | 'weak',
  todayMoon: string,
  birthMoon: string,
  language: AppLanguage,
): ExplainedInsight {
  const qualityLabel =
    quality === 'strong'
      ? { en: 'Shubha (favorable)', hi: 'शुभ', sa: 'शुभ', te: 'శుభ', ta: 'சுப' }
      : { en: 'Ashubha (cautious)', hi: 'अशुभ', sa: 'अशुभ', te: 'అశుభ', ta: 'அசுப' };

  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Chandra Balam',
      summary: `Today's Moon in ${todayMoon} is ${qualityLabel.en.toLowerCase()} from your birth Moon in ${birthMoon}.`,
      effect: getChandraBalamEffect(house, quality, 'en'),
      what: `The transit Moon sits in your ${house}th sign counted from birth Moon — ${qualityLabel.en}.`,
      how: `We count signs from your birth Moon (${birthMoon}) to today's Moon (${todayMoon}). That count is ${house}. Houses 1, 3, 6, 7, 10, and 11 are traditionally Shubha; others suggest caution.`,
      why: `Classical muhurta texts use Chandra Balam to judge whether the Moon's daily sign supports routine activity relative to your natal Moon.`,
      practical: `Use this as a pacing guide for the day — not a guarantee of outcomes. ${quality === 'strong' ? 'Good for steady planned work.' : 'Favor patience and avoid rushing major starts.'}`,
    },
    hi: {
      title: 'चन्द्र बल',
      summary: `आज का चन्द्र ${todayMoon} में आपकी जन्म चन्द्र ${birthMoon} से ${qualityLabel.hi} है।`,
      effect: getChandraBalamEffect(house, quality, 'hi'),
      what: `गोचर चन्द्र जन्म चन्द्र से ${house}वीं राशि में है — ${qualityLabel.hi}।`,
      how: `जन्म चन्द्र (${birthMoon}) से आज के चन्द्र (${todayMoon}) तक राशियों की गिनती ${house} है। 1, 3, 6, 7, 10, 11 शुभ माने जाते हैं।`,
      why: `शास्त्रीय मुहूर्त ग्रंथ दैनिक चन्द्र की अनुकूलता जानने के लिए चन्द्र बल का उपयोग करते हैं।`,
      practical: 'यह दिन की गति का मार्गदर्शन है, परिणाम की गारंटी नहीं।',
    },
    sa: {
      title: 'चन्द्रबलम्',
      summary: `अद्य चन्द्रः ${todayMoon}राशौ जन्मचन्द्रात् ${qualityLabel.sa}।`,
      effect: getChandraBalamEffect(house, quality, 'sa'),
      what: `गोचरचन्द्रः जन्मचन्द्रात् ${house}राशौ — ${qualityLabel.sa}।`,
      how: `जन्मचन्द्रात् (${birthMoon}) अद्यचन्द्र (${todayMoon}) पर्यन्तं गणना ${house}।`,
      why: `मुहूर्तशास्त्रे चन्द्रबलं दैनिकानुकूलतायै।`,
      practical: 'दैनिकमार्गदर्शनम्, न फलगारंटी।',
    },
    te: {
      title: 'చంద్ర బలం',
      summary: `ఈరోజు చంద్రుడు ${todayMoon}లో — మీ జన్మ చంద్ర ${birthMoon} నుండి ${qualityLabel.te}.`,
      effect: getChandraBalamEffect(house, quality, 'te'),
      what: `గోచర చంద్రుడు జన్మ చంద్రం నుండి ${house}వ రాశిలో — ${qualityLabel.te}.`,
      how: `జన్మ చంద్రం (${birthMoon}) నుండి ఈరోజు చంద్రం (${todayMoon}) వరకు లెక్క ${house}.`,
      why: `శాస్త్రీయ ముహూర్తం రోజువారీ చంద్ర అనుకూలత కోసం చంద్ర బలం ఉపయోగిస్తుంది.`,
      practical: 'ఇది మార్గదర్శనం మాత్రమే — ఫలితాల హామీ కాదు.',
    },
    ta: {
      title: 'சந்திர பலம்',
      summary: `இன்றைய சந்திரன் ${todayMoon} இல் — உங்கள் பிறப்பு சந்திர ${birthMoon} இலிருந்து ${qualityLabel.ta}.`,
      effect: getChandraBalamEffect(house, quality, 'ta'),
      what: `செல்லும் சந்திரன் பிறப்பு சந்திரத்திலிருந்து ${house}ம் ராசியில் — ${qualityLabel.ta}.`,
      how: `பிறப்பு சந்திரம் (${birthMoon}) இலிருந்து இன்றைய சந்திரம் (${todayMoon}) வரை எண்ணிக்கை ${house}.`,
      why: `சாஸ்திர முகூர்த்தம் தினசரி சந்திர உகந்ததை அளவிட இதைப் பயன்படுத்துகிறது.`,
      practical: 'இது வழிகாட்டுதல் மட்டும் — விளைவுகளின் உத்தரவாதம் அல்ல.',
    },
  };

  const t = templates[language];
  return buildExplainedInsight({
    ...t,
    termIds: ['chandraBalam', `house${house}` as GlossaryTermId],
  });
}

export function buildTarabalaInsight(
  taraIndex: number,
  quality: 'auspicious' | 'inauspicious',
  todayNakshatra: string,
  birthNakshatra: string,
  language: AppLanguage,
): ExplainedInsight {
  const taraName = TARA_NAMES[taraIndex]?.[language] ?? String(taraIndex + 1);
  const step = (taraIndex % 9) + 1;

  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Tarabala',
      summary: `Today's nakshatra ${todayNakshatra} gives you ${taraName} tara — traditionally ${quality === 'auspicious' ? 'supportive' : 'cautious'}.`,
      effect: getTarabalaEffect(taraIndex, 'en'),
      what: `You are on tara ${step} of 9 in the nakshatra cycle from your birth star ${birthNakshatra}.`,
      how: `Count nakshatras from your birth nakshatra (${birthNakshatra}) to today's (${todayNakshatra}). The remainder maps to one of nine taras: Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Ati-Mitra.`,
      why: `Tarabala is used in electional astrology to time activities relative to one's birth star — each tara has a traditional quality.`,
      practical: quality === 'auspicious'
        ? 'A supportive background for planned tasks; still use common sense.'
        : 'Move carefully with new commitments; routine and preparation help.',
    },
    hi: {
      title: 'ताराबल',
      summary: `आज की नक्षत्र ${todayNakshatra} से ${taraName} तारा — ${quality === 'auspicious' ? 'अनुकूल' : 'सावधानी'}.`,
      effect: getTarabalaEffect(taraIndex, 'hi'),
      what: `जन्म नक्षत्र ${birthNakshatra} से 9-चक्र में ${step}वाँ तारा।`,
      how: `जन्म नक्षत्र से आज की नक्षत्र गिनकर 9 तारों में से एक मिलता है।`,
      why: `ताराबल शुभ मुहूर्त चुनने के लिए जन्म नक्षत्र से तुलना करता है।`,
      practical: 'मार्गदर्शन है, भविष्यवाणी नहीं।',
    },
    sa: {
      title: 'ताराबलम्',
      summary: `अद्यनक्षत्रात् ${taraName}तारा।`,
      effect: getTarabalaEffect(taraIndex, 'sa'),
      what: `जन्मनक्षत्रात् नवचक्रे ${step}तारा।`,
      how: `जन्मनक्षत्रात् अद्यनक्षत्रं गणयित्वा नवताराः।`,
      why: `मुहूर्तशास्त्रे ताराबलम्।`,
      practical: 'मार्गदर्शनम्।',
    },
    te: {
      title: 'తారాబలం',
      summary: `ఈరోజు నక్షత్రం ${todayNakshatra} — ${taraName} తారా.`,
      effect: getTarabalaEffect(taraIndex, 'te'),
      what: `జన్మ నక్షత్రం ${birthNakshatra} నుండి 9-చక్రంలో ${step}వ తారా.`,
      how: `జన్మ నక్షత్రం నుండి ఈరోజు నక్షత్రం లెక్కించి 9 తారాలలో ఒకది.`,
      why: `ముహూర్త శాస్త్రం జన్మ నక్షత్రానికి సంబంధించి తారాబలం ఉపయోగిస్తుంది.`,
      practical: 'మార్గదర్శనం మాత్రమే.',
    },
    ta: {
      title: 'தாராபலம்',
      summary: `இன்றைய நட்சத்திரம் ${todayNakshatra} — ${taraName} தாரா.`,
      effect: getTarabalaEffect(taraIndex, 'ta'),
      what: `பிறப்பு நட்சத்திரம் ${birthNakshatra} இலிருந்து 9-சுழற்சியில் ${step}ம் தாரா.`,
      how: `பிறப்பு நட்சத்திரத்திலிருந்து இன்றைய நட்சத்திரம் எண்ணி 9 தாராக்களில் ஒன்று.`,
      why: `முகூர்த்த சாஸ்திரம் பிறப்பு நட்சத்திரத்துடன் ஒப்பிட தாராபலத்தைப் பயன்படுத்துகிறது.`,
      practical: 'வழிகாட்டுதல் மட்டும்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['tarabala', 'nakshatra'],
  });
}

export function buildDashaInsight(
  level: 'antar' | 'pratyantar',
  lord: string,
  house: number | undefined,
  language: AppLanguage,
): ExplainedInsight {
  const levelLabel =
    level === 'antar'
      ? { en: 'Antardasha', hi: 'अंतर्दशा', sa: 'अन्तर्दशा', te: 'అంతర్దశ', ta: 'அந்தர்தசை' }
      : { en: 'Pratyantar', hi: 'प्रत्यंतर', sa: 'प्रत्यन्तर', te: 'ప్రత్యంతర', ta: 'பிரत्यந்தர்' };

  const theme = getHouseTheme(house ?? 1, language);
  const houseNote = house
    ? `In your chart, ${lord} rules from the ${house}th house — themes of ${theme}.`
    : `Add birth time to see which house ${lord} occupies in your chart.`;

  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: `${lord} ${levelLabel.en}`,
      summary: `You are in ${lord} ${levelLabel.en.toLowerCase()} — a ${level === 'antar' ? 'months-scale' : 'weeks-scale'} planetary period.`,
      effect: getDashaLordEffect(level, lord, 'en'),
      what: `Vimshottari dasha places ${lord} as the active ${levelLabel.en.toLowerCase()} lord.`,
      how: `From your birth Moon nakshatra, the 120-year Vimshottari cycle assigns each planet a main period (Mahadasha), sub-period (Antardasha), and sub-sub-period (Pratyantar). We find which lord rules right now.`,
      why: `Dasha shows which planet's themes color your experience — not specific events, but the background tone of the period.`,
      practical: houseNote,
    },
    hi: {
      title: `${lord} ${levelLabel.hi}`,
      summary: `आप ${lord} ${levelLabel.hi} में हैं।`,
      effect: getDashaLordEffect(level, lord, 'hi'),
      what: `विंशोत्तरी दशा में ${lord} सक्रिय ${levelLabel.hi} स्वामी है।`,
      how: `जन्म नक्षत्र से 120 वर्षीय विंशोत्तरी चक्र की गणना।`,
      why: `दशा बताती है कि कौन-से ग्रह के विषय प्रभावी हैं — विशिष्ट घटना नहीं, पृष्ठभूमि का स्वर।`,
      practical: house ? `${lord} ${house}वें भाव में — ${theme}।` : 'जन्म समय जोड़ें।',
    },
    sa: {
      title: `${lord} ${levelLabel.sa}`,
      summary: `${lord}${levelLabel.sa}।`,
      effect: getDashaLordEffect(level, lord, 'sa'),
      what: `विंशोत्तरिदशायां ${lord}सक्रियः।`,
      how: `जन्मनक्षत्रात् विंशोत्तरीचक्रगणना।`,
      why: `दशा ग्रहविषयान् दर्शयति।`,
      practical: houseNote,
    },
    te: {
      title: `${lord} ${levelLabel.te}`,
      summary: `మీరు ${lord} ${levelLabel.te}లో ఉన్నారు.`,
      effect: getDashaLordEffect(level, lord, 'te'),
      what: `వింశోత్తరి దశలో ${lord} సక్రియ స్వామి.`,
      how: `జన్మ నక్షత్రం నుండి 120-సంవత్సర చక్రం.`,
      why: `దశ ఏ గ్రహ అంశాలు ప్రభావితమో చూపిస్తుంది.`,
      practical: houseNote,
    },
    ta: {
      title: `${lord} ${levelLabel.ta}`,
      summary: `நீங்கள் ${lord} ${levelLabel.ta} இல் உள்ளீர்கள்.`,
      effect: getDashaLordEffect(level, lord, 'ta'),
      what: `விம்சோத்தரி தசையில் ${lord} செயலில் உள்ளது.`,
      how: `பிறப்பு நட்சத்திரத்திலிருந்து 120-ஆண்டு சுழற்சி.`,
      why: `தசை எந்த கிரக தீம்களை வெளிப்படுத்துகிறது என்பதைக் காட்டுகிறது.`,
      practical: houseNote,
    },
  };

  const termId =
    level === 'antar' ? 'antarDasha' : ('pratyantarDasha' as GlossaryTermId);

  return buildExplainedInsight({
    ...templates[language],
    termIds: [termId],
  });
}

export function buildSadeSatiInsight(
  phase: 1 | 2 | 3,
  birthMoon: string,
  language: AppLanguage,
): ExplainedInsight {
  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Sade Sati',
      summary: `Saturn is in phase ${phase} of Sade Sati relative to your Moon in ${birthMoon}.`,
      what: `Transit Saturn is near your birth Moon sign — the classical 7.5-year Sade Sati cycle.`,
      how: `We track Saturn's sign relative to your birth Moon. Phase 1: sign before Moon; Phase 2: same sign as Moon; Phase 3: sign after Moon.`,
      why: `Traditions associate this period with discipline, responsibility, and testing — not punishment, but maturation.`,
      practical: 'Use for long-term planning and patience. Not a prediction of specific hardship.',
    },
    hi: {
      title: 'साढ़े साती',
      summary: `शनि साढ़े साती के चरण ${phase} में — जन्म चन्द्र ${birthMoon} के सापेक्ष।`,
      what: `गोचर शनि जन्म चन्द्र राशि के निकट है।`,
      how: `शनि की राशि जन्म चन्द्र से गिनी जाती है — तीन चरण, प्रत्येक ~2.5 वर्ष।`,
      why: `परंपरा इसे अनुशासन और परिपक्वता का समय मानती है।`,
      practical: 'दीर्घकालिक योजना के लिए — विशिष्ट घटना की भविष्यवाणी नहीं।',
    },
    sa: {
      title: 'साढ़ेसाती',
      summary: `शनिः साढ़ेसात्याः ${phase}चरणे।`,
      what: `गोचरशनिः जन्मचन्द्रसमीपे।`,
      how: `जन्मचन्द्रात् शनिराशिगणना।`,
      why: `अनुशासनपरिपक्वताकालः।`,
      practical: 'दीर्घदृष्टिः।',
    },
    te: {
      title: 'సాడే సాతి',
      summary: `శని సాడే సాతి దశ ${phase}లో — జన్మ చంద్ర ${birthMoon}.`,
      what: `గోచర శని జన్మ చంద్ర రాశి సమీపంలో.`,
      how: `జన్మ చంద్రం నుండి శని రాశి లెక్క — మూడు దశలు.`,
      why: `శిక్షణ మరియు పరిపక్వత కాలంగా పరిగణిస్తారు.`,
      practical: 'దీర్ఘకాలిక ప్రణాళికకు మాత్రమే.',
    },
    ta: {
      title: 'சாடே சாதி',
      summary: `சனி சாடே சாதி கட்டம் ${phase} — பிறப்பு சந்திர ${birthMoon}.`,
      what: `செல்லும் சனி பிறப்பு சந்திர ராசிக்கு அருகில்.`,
      how: `பிறப்பு சந்திரத்திலிருந்து சனி ராசி எண்ணிக்கை — மூன்று கட்டங்கள்.`,
      why: `ஒழுக்கம் மற்றும் முதிர்ச்சியின் காலமாகக் கருதப்படுகிறது.`,
      practical: 'நீண்டகால திட்டமிடலுக்கு மட்டும்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['sadeSati', 'moonRashi'],
  });
}

export function buildTransitInsight(
  planet: string,
  transitRashi: string,
  birthMoon: string,
  houseFromMoon: number,
  houseFromLagna: number | undefined,
  houseTheme: string,
  language: AppLanguage,
): ExplainedInsight {
  const lagnaNote =
    houseFromLagna !== undefined
      ? ` From lagna it is the ${houseFromLagna}th house.`
      : '';

  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: `${planet} transit`,
      summary: `${planet} is in ${transitRashi} — the ${houseFromMoon}th sign from your birth Moon.`,
      effect: getTransitEffect(planet, houseFromMoon, 'en'),
      what: `Today ${planet} occupies ${transitRashi}, which is house ${houseFromMoon} counted from your Moon in ${birthMoon}.${lagnaNote}`,
      how: `We compute ${planet}'s current sidereal position and count whole-sign houses from your natal Moon (and lagna if birth time is known).`,
      why: `Gochara (transit) analysis links slow planets to life areas — ${houseFromMoon}th house themes: ${houseTheme}.`,
      practical: 'Transits describe background tones for weeks or months. They do not predict single events.',
    },
    hi: {
      title: `${planet} गोचर`,
      summary: `${planet} ${transitRashi} में — जन्म चन्द्र से ${houseFromMoon}वीं राशि।`,
      effect: getTransitEffect(planet, houseFromMoon, 'hi'),
      what: `आज ${planet} ${transitRashi} में है, जन्म चन्द्र ${birthMoon} से ${houseFromMoon}वाँ भाव।`,
      how: `गोचर स्थिति से जन्म चन्द्र तक राशियों की गिनती।`,
      why: `${houseFromMoon}वें भाव के विषय: ${houseTheme}।`,
      practical: 'सप्ताहों-महीनों की पृष्ठभूमि — एक घटना की भविष्यवाणी नहीं।',
    },
    sa: {
      title: `${planet}गोचरः`,
      summary: `${planet} ${transitRashi}राशौ।`,
      effect: getTransitEffect(planet, houseFromMoon, 'sa'),
      what: `अद्य ${planet} ${transitRashi}राशौ, जन्मचन्द्रात् ${houseFromMoon}भावः।`,
      how: `गोचरस्थितेः जन्मचन्द्रात् राशिगणना।`,
      why: `${houseFromMoon}भावविषयाः: ${houseTheme}।`,
      practical: 'पृष्ठभूमिस्वरः।',
    },
    te: {
      title: `${planet} గోచరం`,
      summary: `${planet} ${transitRashi}లో — జన్మ చంద్రం నుండి ${houseFromMoon}వ రాశి.`,
      effect: getTransitEffect(planet, houseFromMoon, 'te'),
      what: `ఈరోజు ${planet} ${transitRashi}లో, జన్మ చంద్ర ${birthMoon} నుండి ${houseFromMoon}వ భావం.`,
      how: `గోచర స్థితి నుండి జన్మ చంద్రం వరకు రాశి లెక్క.`,
      why: `${houseFromMoon}వ భావ అంశాలు: ${houseTheme}.`,
      practical: 'వారాలు-నెలల నేపథ్యం మాత్రమే.',
    },
    ta: {
      title: `${planet} கோசாரம்`,
      summary: `${planet} ${transitRashi} இல் — பிறப்பு சந்திரத்திலிருந்து ${houseFromMoon}ம் ராசி.`,
      effect: getTransitEffect(planet, houseFromMoon, 'ta'),
      what: `இன்று ${planet} ${transitRashi} இல், பிறப்பு சந்திர ${birthMoon} இலிருந்து ${houseFromMoon}ம் பாவம்.`,
      how: `கோசார நிலையிலிருந்து பிறப்பு சந்திரம் வரை ராசி எண்ணிக்கை.`,
      why: `${houseFromMoon}ம் பாவ தீம்கள்: ${houseTheme}.`,
      practical: 'வாரங்கள்-மாதங்கள் பின்னணி மட்டும்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['transit', `house${houseFromMoon}` as GlossaryTermId],
  });
}

export function buildChoghadiyaExplanation(
  name: string,
  quality: string,
  language: AppLanguage,
): string {
  const templates: Record<AppLanguage, string> = {
    en: `Choghadiya divides day and night into 8 slots each. "${name}" is rated ${quality}. The sequence rotates by weekday.`,
    hi: `चौघड़िया दिन-रात को 8 भागों में बाँटती है। "${name}" — ${quality}।`,
    sa: `चौघड़िया अष्टभागविभाजनम्। "${name}" — ${quality}।`,
    te: `చోఘడియ రోజు-రాత్రిని 8 భాగాలుగా విభజిస్తుంది। "${name}" — ${quality}.`,
    ta: `சோகடியா பகல்-இரவை 8 பிரிவுகளாகப் பிரிக்கிறது। "${name}" — ${quality}.`,
  };
  return templates[language];
}

export function buildRahuKalamExplanation(language: AppLanguage): string {
  const templates: Record<AppLanguage, string> = {
    en: 'Rahu Kalam is the 8th of 8 day-segments from sunrise to sunset. Which segment is inauspicious rotates by weekday (Sunday → 4th segment, Monday → 7th, etc.).',
    hi: 'राहु काल सूर्योदय से सूर्यास्त तक 8 भागों में 8वाँ अशुभ खंड है — वार के अनुसार बदलता है।',
    sa: 'राहुकालः अष्टमदिवसखण्डः — वारानुसारं परिवर्तते।',
    te: 'రాహు కాలం సూర్యోదయం నుండి అస్తమయం వరకు 8వ భాగం — వారం ప్రకారం మారుతుంది.',
    ta: 'ராகு காலம் சூரிய உதயத்திலிருந்து 8வது பிரிவு — வாரத்திற்கேற்ப மாறும்.',
  };
  return templates[language];
}

export function translateYogaReason(
  reason: string,
  language: AppLanguage,
): string {
  if (language === 'en') {
    return reason;
  }
  return reason;
}

export function buildDignityInsight(
  planet: string,
  rashi: string,
  dignity: string,
  language: AppLanguage,
): ExplainedInsight {
  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: `${planet} dignity`,
      summary: `${planet} in ${rashi} is ${dignity} in classical dignity tables.`,
      effect: getDignityLifeEffect(planet, dignity, 'en'),
      what: `Planetary dignity describes how comfortably a graha expresses in a sign.`,
      how: `Per BPHS Ch.3–4, each planet has exaltation, own sign, debilitation, and friend/enemy signs. We look up ${planet} in ${rashi}.`,
      why: `Strong dignity is read as clearer expression of that planet's themes; weak dignity as more effort needed — not good or bad luck.`,
      practical: 'One factor among many in chart reading. Do not judge a person by a single dignity.',
    },
    hi: {
      title: `${planet} बल`,
      summary: `${planet} ${rashi} में ${dignity} है।`,
      effect: getDignityLifeEffect(planet, dignity, 'hi'),
      what: `ग्रह बल बताता है कि ग्रह राशि में कितनी सहजता से व्यक्त होता है।`,
      how: `बृहत्पाराशर होरा शास्त्र की उच्च-नीच-स्वराशि तालिका।`,
      why: `बल अभिव्यक्ति की स्पष्टता दर्शाता है — भाग्य नहीं।`,
      practical: 'एक कारक मात्र; पूरे चार्ट से न्याय करें।',
    },
    sa: {
      title: `${planet}बलम्`,
      summary: `${planet} ${rashi}राशौ ${dignity}।`,
      effect: getDignityLifeEffect(planet, dignity, 'sa'),
      what: `ग्रहबलं राशौ सहजताम्।`,
      how: `बीएचपीएस उच्चनीचस्वराशितालिका।`,
      why: `अभिव्यक्तिस्पष्टता।`,
      practical: 'एककारकः।',
    },
    te: {
      title: `${planet} బలం`,
      summary: `${planet} ${rashi}లో ${dignity}.`,
      effect: getDignityLifeEffect(planet, dignity, 'te'),
      what: `గ్రహ బలం రాశిలో సౌకర్యాన్ని సూచిస్తుంది.`,
      how: `శాస్త్రీయ ఉన్నత-నీచ-స్వరాశి పట్టిక.`,
      why: `బలం అభివ్యక్తి స్పష్టత — అదృష్టం కాదు.`,
      practical: 'ఒకే కారకం; మొత్తం కుండలితో చూడండి.',
    },
    ta: {
      title: `${planet} பலம்`,
      summary: `${planet} ${rashi} இல் ${dignity}.`,
      effect: getDignityLifeEffect(planet, dignity, 'ta'),
      what: `கிரக பலம் ராசியில் வசதியைக் குறிக்கிறது.`,
      how: `சாஸ்திர உயர்வு-தாழ்வு-சொந்த ராசி அட்டவணை.`,
      why: `பலம் வெளிப்பாட்டின் தெளிவு — அதிர்ஷ்டம் அல்ல.`,
      practical: 'ஒரு காரணி மட்டும்; முழு ஜாதகத்துடன் பார்க்கவும்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['dignity'],
  });
}

export function buildNavamsaInsight(
  d9Lagna: string,
  d9Moon: string,
  vargottama: string[],
  language: AppLanguage,
): ExplainedInsight {
  const vargottamaNote =
    vargottama.length > 0
      ? ` Vargottama (same sign in D1 and D9): ${vargottama.join(', ')}.`
      : '';

  const templates: Record<AppLanguage, Omit<ExplainedInsight, 'termIds'>> = {
    en: {
      title: 'Navamsa (D9)',
      summary: `D9 lagna: ${d9Lagna}, Moon: ${d9Moon}.${vargottamaNote}`,
      what: 'Navamsa divides each sign into 9 parts — a second chart for deeper themes.',
      how: 'Each 3°20′ of the zodiac maps to one Navamsa sign. We compute D9 lagna and Moon from your birth time and place.',
      why: 'Classical texts use D9 for dharma, marriage, and inner strength — especially when a planet is Vargottama (same sign in D1 and D9).',
      practical: 'Educational snapshot only. Full D9 analysis needs a qualified astrologer.',
    },
    hi: {
      title: 'नवांश (D9)',
      summary: `D9 लग्न: ${d9Lagna}, चन्द्र: ${d9Moon}।`,
      what: 'नवांश प्रत्येक राशि को 9 भागों में विभाजित करता है।',
      how: 'जन्म समय और स्थान से D9 की गणना।',
      why: 'धर्म, विवाह और आंतरिक शक्ति के लिए उपयोग।',
      practical: 'शैक्षिक जानकारी मात्र।',
    },
    sa: {
      title: 'नवांशः',
      summary: `D9लग्नः ${d9Lagna}, चन्द्रः ${d9Moon}।`,
      what: 'नवांशः नवधाविभाजनम्।',
      how: 'जन्मक्षणगणना।',
      why: 'धर्मविवाहविषयाः।',
      practical: 'शैक्षिकम्।',
    },
    te: {
      title: 'నవాంశ (D9)',
      summary: `D9 లగ్నం: ${d9Lagna}, చంద్రం: ${d9Moon}.`,
      what: 'నవాంశం ప్రతి రాశిని 9 భాగాలుగా విభజిస్తుంది.',
      how: 'జన్మ సమయం మరియు స్థలం నుండి D9 లెక్క.',
      why: 'ధర్మం, వివాహం మరియు అంతర్గత బలం కోసం.',
      practical: 'విద్యాపరమైన స్నాప్‌షాట్ మాత్రమే.',
    },
    ta: {
      title: 'நவாம்சம் (D9)',
      summary: `D9 லக்னம்: ${d9Lagna}, சந்திரன்: ${d9Moon}.`,
      what: 'நவாம்சம் ஒவ்வொரு ராசியையும் 9 பாகங்களாகப் பிரிக்கிறது.',
      how: 'பிறப்பு நேரம் மற்றும் இடத்திலிருந்து D9 கணக்கீடு.',
      why: 'தர்மம், திருமணம் மற்றும் உள் வலிமைக்கு.',
      practical: 'கல்வி நோக்க சுருக்கம் மட்டும்.',
    },
  };

  return buildExplainedInsight({
    ...templates[language],
    termIds: ['navamsa', 'lagna', 'moonRashi'],
  });
}

export const LEARN_ARTICLES: Record<
  import('../types').LearnArticleId,
  Record<AppLanguage, { title: string; body: string }>
> = {
  chandraBalamCalc: {
    en: {
      title: 'How Chandra Balam is calculated',
      body: 'Count whole signs from your birth Moon rashi to today\'s Moon rashi. Houses 1, 3, 6, 7, 10, 11 = Shubha. Others = Ashubha. This is a simple daily muhurta rule, not a life prediction.',
    },
    hi: {
      title: 'चन्द्र बल की गणना',
      body: 'जन्म चन्द्र राशि से आज की चन्द्र राशि तक राशियाँ गिनें। 1, 3, 6, 7, 10, 11 = शुभ; अन्य = अशुभ।',
    },
    sa: {
      title: 'चन्द्रबलगणना',
      body: 'जन्मचन्द्रात् अद्यचन्द्रं गणयित्वा शुभाशुभनिर्णयः।',
    },
    te: {
      title: 'చంద్ర బలం ఎలా లెక్కిస్తారు',
      body: 'జన్మ చంద్ర రాశి నుండి ఈరోజు చంద్ర రాశి వరకు రాశులు లెక్కించండి.',
    },
    ta: {
      title: 'சந்திர பலம் எப்படி கணக்கிடப்படுகிறது',
      body: 'பிறப்பு சந்திர ராசியிலிருந்து இன்றைய சந்திர ராசி வரை ராசிகளை எண்ணுங்கள்.',
    },
  },
  vimshottariDasha: {
    en: {
      title: 'What Vimshottari dasha means',
      body: 'A 120-year cycle of planetary periods based on your birth Moon nakshatra. Mahadasha (years), Antardasha (months), Pratyantar (weeks). Each lord brings its themes — not specific events.',
    },
    hi: {
      title: 'विंशोत्तरी दशा क्या है',
      body: 'जन्म नक्षत्र पर आधारित 120 वर्षीय ग्रह काल चक्र।',
    },
    sa: {
      title: 'विंशोत्तरीदशा',
      body: 'जन्मनक्षत्राधारितं 120वर्षचक्रम्।',
    },
    te: {
      title: 'వింశోత్తరి దశ అంటే ఏమిటి',
      body: 'జన్మ నక్షత్రం ఆధారంగా 120-సంవత్సర గ్రహ కాల చక్రం.',
    },
    ta: {
      title: 'விம்சோத்தரி தசை என்றால் என்ன',
      body: 'பிறப்பு நட்சத்திரத்தின் அடிப்படையில் 120 ஆண்டு கிரக கால சுழற்சி.',
    },
  },
  birthTimeMatters: {
    en: {
      title: 'Birth time: why it matters',
      body: 'Without birth time we use noon for Moon position — accurate for rashi/nakshatra. With exact time you get lagna, houses, yogas, Navamsa, and dosha checks. Even approximate time helps.',
    },
    hi: {
      title: 'जन्म समय क्यों महत्वपूर्ण है',
      body: 'समय के बिना दोपहर का उपयोग — चन्द्र राशि सटीक। सटीक समय से लग्न, भाव, योग मिलते हैं।',
    },
    sa: {
      title: 'जन्मसमयमहत्त्वम्',
      body: 'समयेन लग्नभावयोगाः।',
    },
    te: {
      title: 'జన్మ సమయం ఎందుకు ముఖ్యం',
      body: 'సమయం లేకుండా మధ్యాహ్నం — చంద్ర రాశి ఖచ్చితం. సమయంతో లగ్నం, భావాలు, యోగాలు.',
    },
    ta: {
      title: 'பிறப்பு நேரம் ஏன் முக்கியம்',
      body: 'நேரம் இல்லாமல் மதியம் — சந்திர ராசி துல்லியம். நேரத்துடன் லக்னம், பாவங்கள், யோகங்கள்.',
    },
  },
  whatWePredict: {
    en: {
      title: 'What this app does and does not predict',
      body: 'We show astronomical positions, classical rules, and period themes. We do NOT predict marriage dates, job offers, illness, or lottery wins. Use insights for reflection and timing — consult a qualified astrologer for major decisions.',
    },
    hi: {
      title: 'यह ऐप क्या भविष्यवाणी करता और नहीं करता',
      body: 'हम खगोलीय स्थिति और शास्त्रीय नियम दिखाते हैं। विवाह/नौकरी/बीमारी की तारीख नहीं।',
    },
    sa: {
      title: 'अनुप्रयोगस्य सीमाः',
      body: 'खगोलीयनियमाः, न तु घटनाभविष्यवाणी।',
    },
    te: {
      title: 'ఈ యాప్ ఏమి చెప్పదు',
      body: 'ఖగోళ స్థితి మరియు శాస్త్రీయ నియమాలు — సంఘటన ఊహలు కాదు.',
    },
    ta: {
      title: 'இந்த பயன்பாடு என்ன கணிப்பது இல்லை',
      body: 'வானியல் நிலைகள் மற்றும் சாஸ்திர விதிகள் — நிகழ்வு கணிப்புகள் அல்ல.',
    },
  },
  transits: {
    en: {
      title: 'Understanding transits (Gochara)',
      body: 'A transit is where a planet is today compared to your birth chart. Slow planets (Saturn, Jupiter, Rahu) stay in a sign for months or years. We count which house they occupy from your Moon or lagna.',
    },
    hi: {
      title: 'गोचर को समझना',
      body: 'गोचर = आज ग्रह कहाँ है बनाम जन्म कुंडली। धीमे ग्रह महीनों तक एक राशि में।',
    },
    sa: {
      title: 'गोचरविज्ञानम्',
      body: 'अद्यग्रहस्थितिः जन्मकुण्डल्याः सापेक्षम्।',
    },
    te: {
      title: 'గోచరాలను అర్థం చేసుకోవడం',
      body: 'గోచరం = ఈరోజు గ్రహం ఎక్కడ ఉంది జన్మ కుండలికి సంబంధించి.',
    },
    ta: {
      title: 'கோசாரங்களைப் புரிந்துகொள்வது',
      body: 'கோசாரம் = இன்று கிரகம் எங்கே உள்ளது பிறப்பு ஜாதகத்துடன் ஒப்பிட.',
    },
  },
  navamsa: {
    en: {
      title: 'What is Navamsa (D9)?',
      body: 'Each sign is split into 9 parts of 3°20′ each. The Navamsa chart is cast from these divisions. It is used for deeper life themes, especially relationships and spiritual inclination.',
    },
    hi: {
      title: 'नवांश (D9) क्या है',
      body: 'प्रत्येक राशि 9 भागों में — गहन विषयों के लिए दूसरी कुंडली।',
    },
    sa: {
      title: 'नवांशः',
      body: 'राशिनवधाविभाजनम् — गहनविषयार्थम्।',
    },
    te: {
      title: 'నవాంశ (D9) అంటే ఏమిటి',
      body: 'ప్రతి రాశి 9 భాగాలు — లోతైన జీవిత అంశాలకు.',
    },
    ta: {
      title: 'நவாம்சம் (D9) என்றால் என்ன',
      body: 'ஒவ்வொரு ராசியும் 9 பாகங்கள் — ஆழமான வாழ்க்கை தீம்களுக்கு.',
    },
  },
  ashtakootBasics: {
    en: {
      title: 'What Ashtakoot matching means',
      body: 'Eight gunas (max 36 points) compare birth Moon rashis and nakshatras. Nadi and Bhakoot are often reviewed even when the total is high. Scores follow classical groom-bride tables — educational, not a marriage verdict.',
    },
    hi: {
      title: 'अष्टकूट मिलान क्या है',
      body: 'आठ गुण, अधिकतम 36 अंक — जन्म चन्द्र की तुलना। नाड़ी और भकूट अक्सर देखे जाते हैं।',
    },
    sa: {
      title: 'अष्टकूटमिलनम्',
      body: 'अष्टगुणाः — 36 अङ्काः। नाडीभकूटविशेषेण।',
    },
    te: {
      title: 'అష్టకూట్ పోలిక అంటే ఏమిటి',
      body: 'ఎనిమిది గుణాలు — 36 పాయింట్లు. నాడి/భకూట్ ప్రత్యేకంగా చూస్తారు.',
    },
    ta: {
      title: 'அஷ்டகூட் பொருத்தம் என்றால் என்ன',
      body: 'எட்டு குணங்கள் — 36 புள்ளிகள். நாடி/பகூட் குறிப்பாக பார்க்கப்படுகிறது.',
    },
  },
};

export function buildWeeklyTone(
  pratyantarLord: string,
  transitSummary: string,
  language: AppLanguage,
): string {
  const templates: Record<AppLanguage, string> = {
    en: `This week's background tone comes from ${pratyantarLord} Pratyantar. ${transitSummary} This is thematic guidance, not a daily forecast.`,
    hi: `इस सप्ताह की पृष्ठभूमि ${pratyantarLord} प्रत्यंतर से। ${transitSummary}`,
    sa: `अस्य सप्ताहस्य स्वरः ${pratyantarLord}प्रत्यन्तरात्।`,
    te: `ఈ వార నేపథ్యం ${pratyantarLord} ప్రత్యంతరం నుండి. ${transitSummary}`,
    ta: `இந்த வார பின்னணி ${pratyantarLord} பிரत्यந்தரிலிருந்து. ${transitSummary}`,
  };
  return templates[language];
}
