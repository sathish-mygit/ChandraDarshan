import type { AppLanguage } from '../types';

type LocalizedText = Record<AppLanguage, string>;

export const HOUSE_THEMES: Record<number, LocalizedText> = {
  1: {
    en: 'self, body, and personality',
    hi: 'स्वयं, शरीर और व्यक्तित्व',
    sa: 'आत्मा, शरीरं, व्यक्तित्वम्',
    te: 'స్వయం, శరీరం, వ్యక్తిత్వం',
    ta: 'தன்மை, உடல், ஆளுமை',
  },
  2: {
    en: 'wealth, speech, and family',
    hi: 'धन, वाणी और परिवार',
    sa: 'धनं, वाणी, कुटुम्बम्',
    te: 'ధనం, వాణి, కుటుంబం',
    ta: 'செல்வம், பேச்சு, குடும்பம்',
  },
  3: {
    en: 'courage, skills, and siblings',
    hi: 'साहस, कौशल और भाई-बहन',
    sa: 'साहसं, कौशलम्, भ्रातृ',
    te: 'ధైర్యం, నైపుణ్యం, సోదరులు',
    ta: 'தைரியம், திறன்கள், உடன்பிறப்புகள்',
  },
  4: {
    en: 'home, mother, and inner peace',
    hi: 'घर, माता और मन की शांति',
    sa: 'गृहं, माता, अन्तःशान्तिः',
    te: 'ఇల్లు, తల్లి, అంతర్గత శాంతి',
    ta: 'வீடு, தாய், உள் அமைதி',
  },
  5: {
    en: 'creativity, children, and learning',
    hi: 'सृजन, संतान और ज्ञान',
    sa: 'सृजनं, सन्तानं, विद्या',
    te: 'సృజనాత్మకత, సంతానం, విద్య',
    ta: 'படைப்பாற்றல், குழந்தைகள், கல்வி',
  },
  6: {
    en: 'service, health, and daily work',
    hi: 'सेवा, स्वास्थ्य और दैनिक कार्य',
    sa: 'सेवा, आरोग्यं, दैनिककार्यम्',
    te: 'సేవ, ఆరోగ్యం, రోజువారీ పని',
    ta: 'சேவை, உடல்நலம், தினசரி பணி',
  },
  7: {
    en: 'partnerships and public agreements',
    hi: 'साझेदारी और सार्वजनिक समझौते',
    sa: 'साझेदारी, सार्वजनिकसमझौते',
    te: 'భాగస్వామ్యం మరియు ఒప్పందాలు',
    ta: 'கூட்டாண்மை மற்றும் ஒப்பந்தங்கள்',
  },
  8: {
    en: 'transformation and shared resources',
    hi: 'परिवर्तन और साझा संसाधन',
    sa: 'परिवर्तनं, साझासंसाधनानि',
    te: 'పరివర్తన మరియు పంచుకునే వనరులు',
    ta: 'மாற்றம் மற்றும் பகிர்ந்த வளங்கள்',
  },
  9: {
    en: 'dharma, teachers, and long journeys',
    hi: 'धर्म, गुरु और दीर्घ यात्रा',
    sa: 'धर्मः, गुरुः, दीर्घयात्रा',
    te: 'ధర్మం, గురువులు, దీర్ఘ ప్రయాణం',
    ta: 'தர்மம், குருக்கள், நீண்ட பயணம்',
  },
  10: {
    en: 'career, reputation, and public life',
    hi: 'करियर, प्रतिष्ठा और सार्वजनिक जीवन',
    sa: 'कार्यं, कीर्तिः, सार्वजनिकजीवनम्',
    te: 'వృత్తి, ప్రతిష్ఠ, ప్రజా జీవితం',
    ta: 'தொழில், புகழ், பொது வாழ்க்கை',
  },
  11: {
    en: 'gains, friends, and aspirations',
    hi: 'लाभ, मित्र और आकांक्षाएँ',
    sa: 'लाभः, मित्राणि, आशाः',
    te: 'లాభం, మిత్రులు, ఆకాంక్షలు',
    ta: 'லாபம், நண்பர்கள், ஆசைகள்',
  },
  12: {
    en: 'spirituality, rest, and release',
    hi: 'आध्यात्म, विश्राम और मोक्ष',
    sa: 'आध्यात्मं, विश्रामः, मोक्षः',
    te: 'ఆధ్యాత్మికత, విశ్రాంతి, విముక్తి',
    ta: 'ஆன்மீகம், ஓய்வு, விடுதலை',
  },
};

export function getHouseTheme(house: number, language: AppLanguage): string {
  return HOUSE_THEMES[house]?.[language] ?? HOUSE_THEMES[1][language];
}
