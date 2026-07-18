import type { AppLanguage } from '../types';
import { getDashaLordTheme } from './jyotish-themes';

type LocalizedText = Record<AppLanguage, string>;

export type DailyReading = {
  headline: string;
  summary: string;
  favor: string;
  pause: string;
  dashaNote: string;
};

type ReadingInput = {
  chandraQuality: 'strong' | 'weak';
  taraQuality: 'auspicious' | 'inauspicious';
  taraEnglishName: string;
  todayMoonRashi: string;
  antarDasha: string;
  pratyantarDasha: string;
  sadeSatiActive: boolean;
  horaPlanet?: string;
};

const HEADLINES: Record<
  'strong' | 'weak',
  Record<'auspicious' | 'inauspicious', LocalizedText>
> = {
  strong: {
    auspicious: {
      en: 'A steady, supportive day for you',
      hi: 'आपके लिए स्थिर और अनुकूल दिन',
      sa: 'स्थिरानुकूलदिनम् भवतः कृते',
      te: 'మీకు స్థిరమైన, అనుకూలమైన రోజు',
      ta: 'உங்களுக்கு நிலையான, ஆதரவான நாள்',
    },
    inauspicious: {
      en: 'Good Moon strength — move with care on timing',
      hi: 'चन्द्र बल अच्छा — समय पर सावधानी बरतें',
      sa: 'चन्द्रबलं शुभम् — समये सावधानी',
      te: 'మంచి చంద్ర బలం — సమయంలో జాగ్రత్త',
      ta: 'நல்ல சந்திர பலம் — நேரத்தில் கவனமாக',
    },
  },
  weak: {
    auspicious: {
      en: 'Tarabala helps — pace yourself gently',
      hi: 'ताराबल सहायक — धीरे-धीरे आगे बढ़ें',
      sa: 'ताराबलं सहायकम् — शनैः गच्छतु',
      te: 'తారాబలం సహాయపడుతుంది — నెమ్మదిగా ముందుకు',
      ta: 'தாராபலம் உதவுகிறது — மெதுவாக முன்னேறுங்கள்',
    },
    inauspicious: {
      en: 'A quiet day — patience over push',
      hi: 'शांत दिन — धैर्य को प्राथमिकता दें',
      sa: 'शान्तदिनम् — धैर्यं प्राथम्यम्',
      te: 'శాంతమైన రోజు — పట్టుదలను ముందుకు',
      ta: 'அமைதியான நாள் — பொறுமையை முன்னுரிமை',
    },
  },
};

const FAVOR: Record<
  'strong' | 'weak',
  Record<'auspicious' | 'inauspicious', LocalizedText>
> = {
  strong: {
    auspicious: {
      en: 'Routine work, conversations, errands, and finishing planned tasks.',
      hi: 'दिनचर्या, बातचीत, काम और पहले से तय किए कार्य पूरे करें।',
      sa: 'दिनचर्यासंवादकार्यपूर्वयोजितकार्याणि।',
      te: 'రోజువారీ పనులు, సంభాషణలు మరియు ఇప్పటికే ప్లాన్ చేసిన పనులు.',
      ta: 'வழக்கமான பணிகள், உரையாடல்கள் மற்றும் திட்டமிட்ட பணிகள்.',
    },
    inauspicious: {
      en: 'Steady progress on familiar work; use Abhijit or a supportive hora for important starts.',
      hi: 'परिचित कार्य में स्थिर प्रगति; महत्वपूर्ण शुरुआत के लिए अभिजित या शुभ होरा चुनें।',
      sa: 'परिचितकार्ये स्थिरप्रगतिः; महत्त्वपूर्णारम्भाय अभिजितं शुभहोरां वा।',
      te: 'పరిచితమైన పనిలో స్థిర పురోగతి; ముఖ్యమైన ప్రారంభాలకు అభిజిత్ లేదా శుభ హోర.',
      ta: 'பழக்கமான பணியில் நிலையான முன்னேற்றம்; முக்கிய தொடக்கங்களுக்கு அபிஜித் அல்லது சுப ஹோரா.',
    },
  },
  weak: {
    auspicious: {
      en: 'Rest, reflection, home matters, and gentle catch-up on pending work.',
      hi: 'विश्राम, चिंतन, घर के काम और लंबित कार्य धीरे-धीरे।',
      sa: 'विश्रामचिन्तनगृहकार्यलम्बितकार्याणि शनैः।',
      te: 'విశ్రాంతి, ఆలోచన, ఇంటి పనులు మరియు పెండింగ్ పనులు నెమ్మదిగా.',
      ta: 'ஓய்வு, சிந்தனை, வீட்டு வேலைகள் மற்றும் நிலுவையில் உள்ள பணிகள் மெதுவாக.',
    },
    inauspicious: {
      en: 'Low-key tasks, organizing, and completing what is already underway.',
      hi: 'साधारण कार्य, व्यवस्था और चल रहे काम पूरे करें।',
      sa: 'साधारणकार्यव्यवस्थाचलमानकार्यपूर्णता।',
      te: 'సాధారణ పనులు, అమరిక మరియు కొనసాగుతున్న పనులు పూర్తి చేయండి.',
      ta: 'எளிய பணிகள், ஒழுங்குபடுத்தல் மற்றும் நடந்து கொண்டிருக்கும் பணிகளை முடித்தல்.',
    },
  },
};

const PAUSE: Record<
  'strong' | 'weak',
  Record<'auspicious' | 'inauspicious', LocalizedText>
> = {
  strong: {
    auspicious: {
      en: 'Avoid unnecessary conflict or over-scheduling yourself.',
      hi: 'अनावश्यक विवाद या अत्यधिक व्यस्तता से बचें।',
      sa: 'अनावश्यकविवादअत्यधिकव्यस्ततायाः परिहारः।',
      te: 'అనవసరమైన వివాదాలు లేదా అత్యధిక షెడ్యూల్ నుండి దూరంగా ఉండండి.',
      ta: 'தேவையற்ற மோதல் அல்லது அதிகப்படியான அட்டவணையைத் தவிர்க்கவும்.',
    },
    inauspicious: {
      en: 'Major commitments, big purchases, or confrontations without preparation.',
      hi: 'बड़ी प्रतिबद्धता, बड़ी खरीदारी या तैयारी के बिना टकराव से बचें।',
      sa: 'महाप्रतिबद्धतामहाक्रयणसज्जीकरणविना संघर्षवर्जनम्।',
      te: 'పెద్ద నిర్ణయాలు, భారీ ఖరీదులు లేదా సిద్ధత లేకుండా వివాదాలు.',
      ta: 'பெரிய முடிவுகள், பெரிய வாங்குதல்கள் அல்லது தயாரிப்பு இல்லாத மோதல்கள்.',
    },
  },
  weak: {
    auspicious: {
      en: 'Rushing new ventures or forcing outcomes today.',
      hi: 'नई शुरुआत में जल्दबाजी या परिणाम पर जोर देना।',
      sa: 'नूतनारम्भे त्वरापरिणामबलात्कारः।',
      te: 'కొత్త ప్రయత్నాలలో తొందర లేదా ఫలితాలను బలవంతం చేయడం.',
      ta: 'புதிய முயற்சிகளில் அவசரம் அல்லது விளைவுகளை கட்டாயப்படுத்துதல்.',
    },
    inauspicious: {
      en: 'Starting something entirely new, travel without need, or emotional reactions.',
      hi: 'बिल्कुल नई शुरुआत, अनावश्यक यात्रा या भावनात्मक प्रतिक्रिया।',
      sa: 'सम्पूर्णनूतनारम्भोऽनावश्यिकयात्राभावनात्मकप्रतिक्रिया।',
      te: 'పూర్తిగా కొత్త ప్రారంభం, అనవసర ప్రయాణం లేదా భావోద్వేగ ప్రతిస్పందనలు.',
      ta: 'முற்றிலும் புதிய தொடக்கம், தேவையற்ற பயணம் அல்லது உணர்ச்சி வெளிப்பாடுகள்.',
    },
  },
};

export function buildDailyReading(
  input: ReadingInput,
  language: AppLanguage,
): DailyReading {
  const { chandraQuality, taraQuality } = input;
  const headline = HEADLINES[chandraQuality][taraQuality][language];
  const favor = FAVOR[chandraQuality][taraQuality][language];
  const pause = PAUSE[chandraQuality][taraQuality][language];

  const antarTheme = getDashaLordTheme(input.antarDasha, language);
  const pratyantarTheme = getDashaLordTheme(input.pratyantarDasha, language);

  const summaryTemplates: Record<AppLanguage, string> = {
    en: `Today's Moon is in ${input.todayMoonRashi}. Tarabala is ${input.taraEnglishName}. The sky favors ${chandraQuality === 'strong' ? 'steady outward activity' : 'inner pacing and caution'} while your ${input.antarDasha} Antardasha colors the background with themes of ${antarTheme.toLowerCase()}`,
    hi: `आज का चन्द्र ${input.todayMoonRashi} में है। ताराबल ${input.taraEnglishName} है। ${input.antarDasha} अंतर्दशा में ${antarTheme}`,
    sa: `अद्य चन्द्रः ${input.todayMoonRashi}राशौ। ताराबलं ${input.taraEnglishName}। ${input.antarDasha}अन्तर्दशायां ${antarTheme}`,
    te: `ఈరోజు చంద్రుడు ${input.todayMoonRashi}లో. తారాబలం ${input.taraEnglishName}. ${input.antarDasha} అంతర్దశలో ${antarTheme}`,
    ta: `இன்றைய சந்திரன் ${input.todayMoonRashi} இல். தாராபலம் ${input.taraEnglishName}. ${input.antarDasha} அந்தர்தசையில் ${antarTheme}`,
  };

  let dashaNoteTemplates: Record<AppLanguage, string> = {
    en: `This month’s finer tone comes from ${input.pratyantarDasha} Pratyantar — ${pratyantarTheme.toLowerCase()}`,
    hi: `इस महीने की सूक्ष्म लय ${input.pratyantarDasha} प्रत्यंतर से — ${pratyantarTheme}`,
    sa: `अस्य मासस्य सूक्ष्मलयः ${input.pratyantarDasha}प्रत्यन्तरात् — ${pratyantarTheme}`,
    te: `ఈ నెల సూక్ష్మ స్వరం ${input.pratyantarDasha} ప్రత్యంతరం నుండి — ${pratyantarTheme}`,
    ta: `இந்த மாதத்தின் நுட்ப நயம் ${input.pratyantarDasha} பிரत्यந்தரிலிருந்து — ${pratyantarTheme}`,
  };

  if (input.horaPlanet) {
    const horaSuffix: Record<AppLanguage, string> = {
      en: ` Right now the ${input.horaPlanet} hora is active — align short tasks with that planet.`,
      hi: ` अभी ${input.horaPlanet} होरा सक्रिय है — छोटे कार्य उसी ग्रह के अनुसार करें।`,
      sa: ` अद्य ${input.horaPlanet}होरा सक्रिया।`,
      te: ` ప్రస్తుతం ${input.horaPlanet} హోర సక్రియంగా ఉంది.`,
      ta: ` இப்போது ${input.horaPlanet} ஹோரா செயலில் உள்ளது.`,
    };
    dashaNoteTemplates = Object.fromEntries(
      (['en', 'hi', 'sa', 'te', 'ta'] as AppLanguage[]).map((lang) => [
        lang,
        dashaNoteTemplates[lang] + horaSuffix[lang],
      ]),
    ) as Record<AppLanguage, string>;
  }

  if (input.sadeSatiActive) {
    const sadeSuffix: Record<AppLanguage, string> = {
      en: ' Sade Sati is active — favor discipline and long-term thinking over quick wins.',
      hi: ' साढ़े साती सक्रिय है — त्वरित लाभ से अधिक अनुशासन और दीर्घकालिक सोच।',
      sa: ' साढ़ेसाती सक्रिया — शीघ्रलाभात्परं अनुशासनदीर्घदृष्टिः।',
      te: ' సాడే సాతి సక్రియంగా ఉంది — త్వరిత లాభాల కంటే శిక్షణ మరియు దీర్ఘకాలిక ఆలోచన.',
      ta: ' சாடே சாதி செயலில் — விரைவு வெற்றிகளை விட ஒழுக்கம் மற்றும் நீண்டகால சிந்தனை.',
    };
    dashaNoteTemplates = Object.fromEntries(
      (['en', 'hi', 'sa', 'te', 'ta'] as AppLanguage[]).map((lang) => [
        lang,
        dashaNoteTemplates[lang] + sadeSuffix[lang],
      ]),
    ) as Record<AppLanguage, string>;
  }

  return {
    headline,
    summary: summaryTemplates[language],
    favor,
    pause,
    dashaNote: dashaNoteTemplates[language],
  };
}
