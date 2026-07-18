import type { AppLanguage } from '../types';

export const PAKSHA_TERMS: Record<
  'shukla' | 'krishna',
  Record<AppLanguage, string>
> = {
  shukla: {
    en: 'Shukla Paksha',
    hi: 'शुक्ल पक्ष',
    sa: 'शुक्लपक्ष',
    te: 'శుక్ల పక్షం',
    ta: 'சுக்ள பக்ஷம்',
  },
  krishna: {
    en: 'Krishna Paksha',
    hi: 'कृष्ण पक्ष',
    sa: 'कृष्णपक्ष',
    te: 'కృష్ణ పక్షం',
    ta: 'கிருஷ்ண பக்ஷம்',
  },
};

const MASA_MAP_SA: Record<string, string> = {
  Chaitra: 'चैत्र',
  Vaishakha: 'वैशाख',
  Jyeshtha: 'ज्येष्ठ',
  Ashadha: 'आषाढ',
  Shravana: 'श्रावण',
  Bhadrapada: 'भाद्रपद',
  Ashwin: 'आश्विन',
  Kartika: 'कार्तिक',
  Margashirsha: 'मार्गशीर्ष',
  Pausha: 'पौष',
  Magha: 'माघ',
  Phalguna: 'फाल्गुन',
};

const MASA_MAP_TE: Record<string, string> = {
  Chaitra: 'చైత్రం',
  Vaishakha: 'వైశాఖం',
  Jyeshtha: 'జ్యేష్ఠం',
  Ashadha: 'ఆషాఢం',
  Shravana: 'శ్రావణం',
  Bhadrapada: 'భాద్రపదం',
  Ashwin: 'ఆశ్వయుజం',
  Kartika: 'కార్తీకం',
  Margashirsha: 'మార్గశిరం',
  Pausha: 'పుష్యం',
  Magha: 'మాఘం',
  Phalguna: 'ఫాల్గుణం',
};

const MASA_MAP_TA: Record<string, string> = {
  Chaitra: 'சைத்ர',
  Vaishakha: 'வைகாசி',
  Jyeshtha: 'ஆனி',
  Ashadha: 'ஆடி',
  Shravana: 'ஆவணி',
  Bhadrapada: 'புரட்டாசி',
  Ashwin: 'ஐப்பசி',
  Kartika: 'கார்த்திகை',
  Margashirsha: 'மார்கழி',
  Pausha: 'தை',
  Magha: 'மாசி',
  Phalguna: 'பங்குனி',
};

const VARA_MAP_TE: Record<string, string> = {
  Sunday: 'ఆదివారం',
  Monday: 'సోమవారం',
  Tuesday: 'మంగళవారం',
  Wednesday: 'బుధవారం',
  Thursday: 'గురువారం',
  Friday: 'శుక్రవారం',
  Saturday: 'శనివారం',
};

const VARA_MAP_TA: Record<string, string> = {
  Sunday: 'ஞாயிறு',
  Monday: 'திங்கள்',
  Tuesday: 'செவ்வாய்',
  Wednesday: 'புதன்',
  Thursday: 'வியாழன்',
  Friday: 'வெள்ளி',
  Saturday: 'சனி',
};

const NAKSHATRA_MAP_TE: Record<string, string> = {
  Ashwini: 'అశ్విని',
  Bharani: 'భరణి',
  Krittika: 'కృత్తిక',
  Rohini: 'రోహిణి',
  Mrigashira: 'మృగశిర',
  Ardra: 'ఆర్ద్ర',
  Punarvasu: 'పునర్వసు',
  Pushya: 'పుష్య',
  Ashlesha: 'ఆశ్లేష',
  Magha: 'మఘ',
  'Purva Phalguni': 'పూర్వ ఫల్గుణి',
  'Uttara Phalguni': 'ఉత్తర ఫల్గుణి',
  Hasta: 'హస్త',
  Chitra: 'చిత్ర',
  Swati: 'స్వాతి',
  Vishakha: 'విశాఖ',
  Anuradha: 'అనురాధ',
  Jyeshtha: 'జ్యేష్ఠ',
  Mula: 'మూల',
  'Purva Ashadha': 'పూర్వాషాఢ',
  'Uttara Ashadha': 'ఉత్తరాషాఢ',
  Shravana: 'శ్రవణ',
  Dhanishta: 'ధనిష్ఠ',
  Shatabhisha: 'శతభిష',
  'Purva Bhadrapada': 'పూర్వ భాద్రపద',
  'Uttara Bhadrapada': 'ఉత్తర భాద్రపద',
  Revati: 'రేవతి',
};

const NAKSHATRA_MAP_TA: Record<string, string> = {
  Ashwini: 'அசுவினி',
  Bharani: 'பரணி',
  Krittika: 'கிருத்திகை',
  Rohini: 'ரோகிணி',
  Mrigashira: 'மிருகசீரிடம்',
  Ardra: 'திருவாதிரை',
  Punarvasu: 'புனர்பூசம்',
  Pushya: 'பூசம்',
  Ashlesha: 'ஆயில்யம்',
  Magha: 'மகம்',
  'Purva Phalguni': 'பூரம்',
  'Uttara Phalguni': 'உத்திரம்',
  Hasta: 'ஹஸ்தம்',
  Chitra: 'சித்திரை',
  Swati: 'சுவாதி',
  Vishakha: 'விசாகம்',
  Anuradha: 'அனுஷம்',
  Jyeshtha: 'கேட்டை',
  Mula: 'மூலம்',
  'Purva Ashadha': 'பூராடம்',
  'Uttara Ashadha': 'உத்திராடம்',
  Shravana: 'திருவோணம்',
  Dhanishta: 'அவிட்டம்',
  Shatabhisha: 'சதயம்',
  'Purva Bhadrapada': 'பூரட்டாதி',
  'Uttara Bhadrapada': 'உத்திரட்டாதி',
  Revati: 'ரேவதி',
};

const TITHI_SUFFIX_SA: [RegExp, string][] = [
  [/Pratipada/i, 'प्रतिपदा'],
  [/Dwitiya/i, 'द्वितीया'],
  [/Tritiya/i, 'तृतीया'],
  [/Chaturthi/i, 'चतुर्थी'],
  [/Panchami/i, 'पञ्चमी'],
  [/Shashthi/i, 'षष्ठी'],
  [/Saptami/i, 'सप्तमी'],
  [/Ashtami/i, 'अष्टमी'],
  [/Navami/i, 'नवमी'],
  [/Dashami/i, 'दशमी'],
  [/Ekadashi/i, 'एकादशी'],
  [/Dwadashi/i, 'द्वादशी'],
  [/Trayodashi/i, 'त्रयोदशी'],
  [/Chaturdashi/i, 'चतुर्दशी'],
  [/Purnima/i, 'पूर्णिमा'],
  [/Amavasya/i, 'अमावस्या'],
];

const TITHI_SUFFIX_TE: [RegExp, string][] = [
  [/Pratipada/i, 'పాడ్యమి'],
  [/Dwitiya/i, 'విదియ'],
  [/Tritiya/i, 'తదియ'],
  [/Chaturthi/i, 'చవితి'],
  [/Panchami/i, 'పంచమి'],
  [/Shashthi/i, 'షష్ఠి'],
  [/Saptami/i, 'సప్తమి'],
  [/Ashtami/i, 'అష్టమి'],
  [/Navami/i, 'నవమి'],
  [/Dashami/i, 'దశమి'],
  [/Ekadashi/i, 'ఏకాదశి'],
  [/Dwadashi/i, 'ద్వాదశి'],
  [/Trayodashi/i, 'త్రయోదశి'],
  [/Chaturdashi/i, 'చతుర్దశి'],
  [/Purnima/i, 'పూర్ణిమ'],
  [/Amavasya/i, 'అమావాస్య'],
];

const TITHI_SUFFIX_TA: [RegExp, string][] = [
  [/Pratipada/i, 'பிரதமை'],
  [/Dwitiya/i, 'துவிதியை'],
  [/Tritiya/i, 'திருதியை'],
  [/Chaturthi/i, 'சதுர்த்தி'],
  [/Panchami/i, 'பஞ்சமி'],
  [/Shashthi/i, 'சஷ்டி'],
  [/Saptami/i, 'சப்தமி'],
  [/Ashtami/i, 'அஷ்டமி'],
  [/Navami/i, 'நவமி'],
  [/Dashami/i, 'தசமி'],
  [/Ekadashi/i, 'ஏகாதசி'],
  [/Dwadashi/i, 'துவாதசி'],
  [/Trayodashi/i, 'திரயோதசி'],
  [/Chaturdashi/i, 'சதுர்தசி'],
  [/Purnima/i, 'பௌர்ணமி'],
  [/Amavasya/i, 'அமாவாசை'],
];

function applyTithiReplacements(
  libraryName: string,
  language: AppLanguage,
): string {
  const pakshaPrefix: [RegExp, string][] =
    language === 'sa'
      ? [
          [/^Shukla\s+/i, 'शुक्ल '],
          [/^Krishna\s+/i, 'कृष्ण '],
        ]
      : language === 'te'
        ? [
            [/^Shukla\s+/i, 'శుక్ల '],
            [/^Krishna\s+/i, 'కృష్ణ '],
          ]
        : language === 'ta'
          ? [
              [/^Shukla\s+/i, 'சுக்ள '],
              [/^Krishna\s+/i, 'கிருஷ்ண '],
            ]
          : [];

  const suffixes =
    language === 'sa'
      ? TITHI_SUFFIX_SA
      : language === 'te'
        ? TITHI_SUFFIX_TE
        : language === 'ta'
          ? TITHI_SUFFIX_TA
          : [];

  let result = libraryName;
  for (const [pattern, replacement] of pakshaPrefix) {
    result = result.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of suffixes) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function localizePaksha(
  paksha: 'shukla' | 'krishna',
  language: AppLanguage,
): string {
  return PAKSHA_TERMS[paksha][language];
}

export function localizeTithi(
  libraryName: string,
  language: AppLanguage,
): string {
  if (language === 'en' || language === 'hi') {
    return libraryName;
  }
  return applyTithiReplacements(libraryName, language);
}

export function localizeMaasa(
  libraryName: string,
  language: AppLanguage,
): string {
  if (language === 'en' || language === 'hi') {
    return libraryName;
  }

  const map =
    language === 'sa'
      ? MASA_MAP_SA
      : language === 'te'
        ? MASA_MAP_TE
        : language === 'ta'
          ? MASA_MAP_TA
          : null;

  return map?.[libraryName] ?? libraryName;
}

export function localizeVara(name: string, language: AppLanguage): string {
  if (language === 'te') {
    return VARA_MAP_TE[name] ?? name;
  }
  if (language === 'ta') {
    return VARA_MAP_TA[name] ?? name;
  }
  return name;
}

export function localizeNakshatra(
  name: string,
  language: AppLanguage,
): string {
  if (language === 'te') {
    return NAKSHATRA_MAP_TE[name] ?? name;
  }
  if (language === 'ta') {
    return NAKSHATRA_MAP_TA[name] ?? name;
  }
  return name;
}

export function localizeFestival(
  name: string,
  language: AppLanguage,
): string {
  if (language !== 'te' && language !== 'ta') {
    return name;
  }
  // Festival names from panchang-ts are English; keep as-is until dedicated maps exist.
  return name;
}
