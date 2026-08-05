import type { AppLanguage } from '../types';
import { getDashaLordEffect, getTaraDescription } from './jyotish-themes';
import { getHouseTheme } from './jyotish-house-themes';

type LocalizedText = Record<AppLanguage, string>;

const GRAHA_NAMES = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
] as const;

function pick(language: AppLanguage, text: LocalizedText): string {
  return text[language] ?? text.en;
}

function grahasFromReasons(reasons: string[]): string[] {
  const found = new Set<string>();
  for (const reason of reasons) {
    for (const graha of GRAHA_NAMES) {
      if (reason.includes(graha)) {
        found.add(graha);
      }
    }
  }
  return [...found];
}

const YOGA_LIFE_EFFECTS: Record<string, LocalizedText> = {
  Sunapha: {
    en: 'Traditionally read as self-made comfort, reputation, and resources — what you earn through your own effort becomes visible.',
    hi: 'स्वयं के प्रयास से सुख, प्रतिष्ठा और संसाधन — आपकी मेहनत का फल दिखाई देता है।',
    sa: 'स्वकीयप्रयासेन सुखप्रतिष्ठासम्पदाः प्रकाशन्ते।',
    te: 'స్వంత ప్రయత్నంతో సౌకర్యం, గుర్తింపు, సంపద — మీ శ్రమ ఫలితం కనిపిస్తుంది.',
    ta: 'சொந்த முயற்சியால் வசதி, புகழ், வளம் — உங்கள் உழைப்பின் பலன் வெளிப்படும்.',
  },
  Anapha: {
    en: 'Traditionally linked to refinement, generosity, and life beyond the ego — spirituality, charity, or graceful spending.',
    hi: 'सौंदर्य, उदारता और आत्मा से परे जीवन — आध्यात्मिकता, दान या सुंदर व्यय।',
    sa: 'सौन्दर्योदारताधार्मिकविषयाः।',
    te: 'సంస్కారం, ఉదారత, ఆత్మకంటే అప్పుడు జీవిత అంశాలు.',
    ta: 'நேர்த்தி, தாராளம், தன்மைக்கு அப்பால் வாழ்க்கை தீம்கள்.',
  },
  Durudhura: {
    en: 'A fuller lunar pattern — both material support and inner/spiritual tone colour the mind and daily mood.',
    hi: 'पूर्ण चन्द्र योग — भौतिक सहारा और आंतरिक रंग दोनों मन को प्रभावित करते हैं।',
    sa: 'पूर्णचन्द्रयोगः — भौतिकआन्तरिकवर्णनं मनः प्रभावयति।',
    te: 'పూర్తి చంద్ర యోగం — భౌతిక మరియు అంతరంగిక రంగులు మనస్సును ప్రభావితం చేస్తాయి.',
    ta: 'முழு சந்திர யோகம் — பொருள் மற்றும் உள் தன்மை இரண்டும் மனதை வண்ணமயமாக்கும்.',
  },
  Kemadruma: {
    en: 'The Moon stands without planetary company — traditions note emotional self-reliance, feeling unsupported at times, or a reflective inner life; strength depends on the full chart.',
    hi: 'चन्द्र अकेला — भावनात्मक आत्मनिर्भरता या अंतर्मुखी जीवन; पूरी कुंडली देखें।',
    sa: 'चन्द्र एकाकी — भावात्मनिर्भरता अन्तर्मुखिता वा।',
    te: 'చంద్రుడు ఒంటరిగా — భావోద్వేగ ఆత్మనిర్భరత లేదా అంతర్గత జీవితం.',
    ta: 'சந்திரன் தனியாக — உணர்ச்சி சுயநிலை அல்லது உள்நோக்க வாழ்க்கை.',
  },
  Veshi: {
    en: 'Colours public presence, speech, and how you are perceived — authority and self-presentation matter.',
    hi: 'सार्वजनिक उपस्थिति, वाणी और छवि — अधिकार और स्वयं-प्रस्तुति महत्वपूर्ण।',
    sa: 'सार्वजनिकउपस्थितिवाक्प्रतिष्ठा प्रभाविता।',
    te: 'ప్రజా ఉనికి, మాట, చిత్రం — అధికారం మరియు ప్రదర్శన ముఖ్యం.',
    ta: 'பொது இருப்பு, பேச்சு, பிம்பம் — அதிகாரமும் வெளிப்பாடும் முக்கியம்.',
  },
  Vasi: {
    en: 'Influence works behind the scenes — service, charity, retreat, or power exercised indirectly rather than in the spotlight.',
    hi: 'पर्दे के पीछे प्रभाव — सेवा, दान, एकांत या अप्रत्यक्ष शक्ति।',
    sa: 'पृष्ठतः प्रभावः सेवादानविलम्बितशक्तिः।',
    te: 'వెనుకబడి ప్రభావం — సేవ, దానం, ఒంటరితనం.',
    ta: 'பின்னணி செல்வாக்கு — சேவை, தானம், தனிமை.',
  },
  Ubhayachari: {
    en: 'Both public face and private influence are active — you may be seen clearly while also shaping outcomes from behind the scenes.',
    hi: 'सार्वजनिक और निजी दोनों प्रभाव सक्रिय — दिखाई देते हुए भी पर्दे से प्रभाव।',
    sa: 'सार्वजनिकनिजप्रभावौ सक्रियौ।',
    te: 'ప్రజా మరియు ప్రైవేట్ ప్రభావం రెండూ సక్రియం.',
    ta: 'பொது மற்றும் தனிப்பட்ட செல்வாக்கு இரண்டும் செயலில்.',
  },
  Gajakesari: {
    en: 'Wisdom and emotional steadiness reinforce each other — good for learning, counsel, and calm judgment under pressure.',
    hi: 'ज्ञान और भावनात्मक स्थिरता एक-दूसरे को बढ़ाते हैं — शिक्षा और शांत निर्णय के लिए अनुकूल।',
    sa: 'ज्ञानभावस्थैर्ये परस्परं बलयतः।',
    te: 'జ్ఞానం మరియు భావోద్వేగ స్థిరత పరస్పరం బలపడతాయి.',
    ta: 'ஞானமும் உணர்ச்சி நிலைத்தன்மையும் ஒன்றை ஒன்று வலுப்படுத்தும்.',
  },
  'Raja Yoga': {
    en: 'Capacity to act (kendra) meets fortune and dharma (trikona) — themes of responsibility, rise, leadership, and recognition when you apply effort.',
    hi: 'कर्मक्षमता और भाग्य/धर्म का मेल — उत्तरदायित्व, उन्नति और नेतृत्व के विषय।',
    sa: 'कर्मक्षमताधर्मसमन्वयः — उत्तरदायित्वोन्नतिनेतृत्वविषयाः।',
    te: 'చర్యా సామర్థ్యం మరియు ధర్మం కలిసి — బాధ్యత, ఎదుగుదల, నాయకత్వం.',
    ta: 'செயல் திறனும் தர்மமும் இணை — பொறுப்பு, உயர்வு, தலைமைத்துவம்.',
  },
  'Dharma-Karmadhipati': {
    en: 'Purpose and career align — meaningful work, reputation through dharma, and acting with integrity in public life.',
    hi: 'धर्म और कर्म का मेल — अर्थपूर्ण कार्य और सार्वजनिक जीवन में ईमानदारी।',
    sa: 'धर्मकर्मसमन्वयः — अर्थपूर्णकार्यम्।',
    te: 'ధర్మం మరియు కర్మం కలిసి — అర్థవంతమైన పని.',
    ta: 'தர்மமும் கர்மமும் இணை — அர்த்தமுள்ள வேலை.',
  },
  'Vipareeta Raja Yoga': {
    en: 'Difficulty can forge strength — setbacks, hidden support, or growth through adversity rather than easy paths.',
    hi: 'कठिनाई से शक्ति — बाधाएँ अनुभव और सहनशीलता बढ़ा सकती हैं।',
    sa: 'कष्टात्शक्तिः — बाधाः अनुभवं वर्धयन्ति।',
    te: 'కష్టం నుండి బలం — అడ్డంకులు అనుభవాన్ని పెంచవచ్చు.',
    ta: 'சிரமத்திலிருந்து வலிமை — தடைகள் அனுபவத்தை வளர்க்கும்.',
  },
  'Daridra Yoga': {
    en: 'Classical caution about income flow and savings — not poverty as fate, but a nudge to manage resources consciously.',
    hi: 'आय और बचत पर सावधानी — गरीबी की भविष्यवाणी नहीं, संसाधन प्रबंधन का संकेत।',
    sa: 'आयसंचये सावधानी — दारिद्र्यभविष्यवाणी न।',
    te: 'ఆదాయ ప్రవాహంపై జాగ్రత్త — పేదరికం విధి కాదు.',
    ta: 'வருமான ஓட்டத்தில் கவனம் — வறுமை விதி அல்ல.',
  },
};

const GRAHA_MODIFIER: Record<string, LocalizedText> = {
  Sun: {
    en: 'With the Sun involved: identity, authority, father figures, and public visibility are emphasised.',
    hi: 'सूर्य से: पहचान, अधिकार, पिता और सार्वजनिक दृश्यता।',
    sa: 'सूर्येण: आत्मपरिचयाधिकारपितृविषयाः।',
    te: 'సూర్యుడు: గుర్తింపు, అధికారం, తండ్రి, ప్రజా దృశ్యమానత.',
    ta: 'சூரியன்: அடையாளம், அதிகாரம், தந்தை, பொது தோற்றம்.',
  },
  Moon: {
    en: 'With the Moon involved: emotions, mind, mother, and inner comfort are emphasised.',
    hi: 'चन्द्र से: भावनाएँ, मन, माता और आंतरिक सुख।',
    sa: 'चन्द्रेण: भावनामनोमातृविषयाः।',
    te: 'చంద్రుడు: భావాలు, మనస్సు, తల్లి, అంతర్గత సౌకర్యం.',
    ta: 'சந்திரன்: உணர்வுகள், மனம், தாய், உள் வசதி.',
  },
  Mars: {
    en: 'With Mars involved: courage, property, siblings, and decisive action are emphasised.',
    hi: 'मंगल से: साहस, संपत्ति, भाई-बहन और निर्णायक कार्य।',
    sa: 'मङ्गलेन: साहससम्पत्तिभ्रातृविषयाः।',
    te: 'మంగళం: ధైర్యం, ఆస్తి, సోదరులు, నిర్ణాయక చర్య.',
    ta: 'செவ்வாய்: தைரியம், சொத்து, உடன்பிறப்புகள், தீர்மான செயல்.',
  },
  Mercury: {
    en: 'With Mercury involved: speech, trade, study, and adaptability are emphasised.',
    hi: 'बुध से: वाणी, व्यापार, अध्ययन और अनुकूलन।',
    sa: 'बुधेन: वाणीव्यापाराध्ययनविषयाः।',
    te: 'బుధుడు: మాట, వ్యాపారం, అభ్యాసం, అనుకూలత.',
    ta: 'புதன்: பேச்சு, வணிகம், படிப்பு, தகவமைப்பு.',
  },
  Jupiter: {
    en: 'With Jupiter involved: wisdom, teachers, children, and growth through dharma are emphasised.',
    hi: 'गुरु से: ज्ञान, गुरु, संतान और धर्म से वृद्धि।',
    sa: 'गुरुणा: ज्ञानगुरुसन्तानविषयाः।',
    te: 'గురువు: జ్ఞానం, గురువులు, సంతానం, ధర్మం ద్వారా వృద్ధి.',
    ta: 'குரு: ஞானம், ஆசிரியர்கள், குழந்தைகள், தர்ம வளர்ச்சி.',
  },
  Venus: {
    en: 'With Venus involved: relationships, comfort, arts, and harmony are emphasised.',
    hi: 'शुक्र से: संबंध, सुख, कला और सामंजस्य।',
    sa: 'शुक्रेण: सम्बन्धसुखकलाविषयाः।',
    te: 'శుక్రుడు: సంబంధాలు, సౌకర్యం, కళలు, సామరస్యం.',
    ta: 'சுக்ரன்: உறவுகள், வசதி, கலை, இணக்கம்.',
  },
  Saturn: {
    en: 'With Saturn involved: discipline, delay, duty, and long-term foundations are emphasised.',
    hi: 'शनि से: अनुशासन, विलंब, कर्तव्य और दीर्घकालीन नींव।',
    sa: 'शनिना: अनुशासनविलम्बकर्तव्यविषयाः।',
    te: 'శని: శిక్షణ, ఆలస్యం, బాధ్యత, దీర్ఘకాల పునాదులు.',
    ta: 'சனி: ஒழுக்கம், தாமதம், கடமை, நீண்டகால அடித்தளம்.',
  },
  Rahu: {
    en: 'With Rahu involved: unconventional paths, ambition, foreign themes, or obsessive focus may feature.',
    hi: 'राहु से: अपरंपरागत मार्ग, महत्वाकांक्षा, विदेशी विषय।',
    sa: 'राहुणा: अपरम्परागतमार्गमहत्त्वाकाङ्क्षा।',
    te: 'రాహు: అసంప్రదాయ మార్గాలు, లక్ష్యం, విదేశీయ అంశాలు.',
    ta: 'ராகு: வழக்கத்திற்கு மாறான பாதைகள், லட்சியம், வெளிநாட்டு தீம்கள்.',
  },
  Ketu: {
    en: 'With Ketu involved: detachment, spirituality, research, or letting go may feature.',
    hi: 'केतु से: वैराग्य, आध्यात्मिकता, शोध या त्याग।',
    sa: 'केतुना: वैराग्यआध्यात्मिकताविषयाः।',
    te: 'కేతు: విరక్తి, ఆధ్యాత్మికత, పరిశోధన.',
    ta: 'கேது: விட்டுவிடுதல், ஆன்மீகம், ஆராய்ச்சி.',
  },
};

const TRANSIT_GRAHA_EFFECT: Record<string, LocalizedText> = {
  Saturn: {
    en: 'Saturn transits mature slowly — discipline, responsibility, tests of patience, and building lasting structure in',
    hi: 'शनि गोचर धीरे पकाता है — अनुशासन, जिम्मेदारी, धैर्य की परीक्षा और स्थायी संरचना',
    sa: 'शनिगोचरः धीरे परिपक्वयति — अनुशासनकर्तव्यधैर्यपरीक्षा',
    te: 'శని గోచరం నెమ్మదిగా పరిపక్వం చేస్తుంది — శిక్షణ, బాధ్యత, సహనం',
    ta: 'சனி கோசாரம் மெதுவாக முதிர்வடையச் செய்கிறது — ஒழுக்கம், பொறுப்பு, பொறுமை',
  },
  Jupiter: {
    en: 'Jupiter transits expand — learning, teachers, opportunity, faith, and growth through dharma in',
    hi: 'गुरु गोचर विस्तार करता है — शिक्षा, गुरु, अवसर और धर्म से वृद्धि',
    sa: 'गुरुगोचरः विस्तारयति — शिक्षागुरुअवसरधर्मवृद्धिः',
    te: 'గురు గోచరం విస్తరిస్తుంది — అభ్యాసం, గురువులు, అవకాశం, ధర్మం',
    ta: 'குரு கோசாரம் விரிவடையச் செய்கிறது — கற்றல், ஆசிரியர்கள், வாய்ப்பு, தர்மம்',
  },
  Rahu: {
    en: 'Rahu transits stir intensity — ambition, unconventional routes, foreign or tech themes, and restless focus in',
    hi: 'राहु गोचर तीव्रता लाता है — महत्वाकांक्षा, अपरंपरागत मार्ग, विदेशी/तकनीकी विषय',
    sa: 'राहुगोचरः तीव्रतां जनयति — महत्त्वाकाङ्क्षाअपरम्परागतमार्गाः',
    te: 'రాహు గోచరం తీవ్రతను రేకెత్తిస్తుంది — లక్ష్యం, అసంప్రదాయ మార్గాలు',
    ta: 'ராகு கோசாரம் தீவிரத்தை உண்டாக்குகிறது — லட்சியம், வழக்கத்திற்கு மாறான பாதைகள்',
  },
};

const DIGNITY_MODIFIER: Record<string, LocalizedText> = {
  exalted: {
    en: 'expresses strongly and clearly — themes of this graha are vivid and easier to channel constructively',
    hi: 'प्रबल और स्पष्ट अभिव्यक्ति — इस ग्रह के विषय स्पष्ट और रचनात्मक',
    sa: 'प्रबलस्पष्टाभिव्यक्तिः',
    te: 'బలంగా స్పష్టంగా వ్యక్తం — ఈ గ్రహ అంశాలు స్పష్టం',
    ta: 'வலுவாகவும் தெளிவாகவும் வெளிப்படும் — இந்த கிரக தீம்கள் துல்லியம்',
  },
  moolatrikona: {
    en: 'operates with natural strength — reliable expression of this graha\'s gifts',
    hi: 'स्वाभाविक शक्ति से कार्य — इस ग्रह की प्रतिभा विश्वसनीय',
    sa: 'स्वाभाविकबलेन कार्यम्',
    te: 'సహజ బలంతో పనిచేస్తుంది — ఈ గ్రహ బహుమతులు నమ్మకమైనవి',
    ta: 'இயற்கை வலிமையுடன் செயல்படும் — இந்த கிரகத்தின் பண்புகள் நம்பகம்',
  },
  own: {
    en: 'is at home in this sign — comfortable, consistent expression of its themes',
    hi: 'स्वराशि में सहज — विषयों की स्थिर अभिव्यक्ति',
    sa: 'स्वराशौ सहजाभिव्यक्तिः',
    te: 'స్వరాశిలో సౌకర్యంగా — స్థిరమైన అభివ్యక్తి',
    ta: 'சொந்த ராசியில் வசதியாக — நிலையான வெளிப்பாடு',
  },
  friend: {
    en: 'is generally supported in this sign — themes flow with moderate ease',
    hi: 'मित्र राशि में सहायता — विषय मध्यम सहजता से',
    sa: 'मित्रराशौ सहायता',
    te: 'మిత్ర రాశిలో మద్దతు — మధ్యస్థ సౌకర్యం',
    ta: 'நட்பு ராசியில் ஆதரவு — மிதமான சுலபம்',
  },
  neutral: {
    en: 'is neither especially strong nor weak here — expression depends on other chart factors',
    hi: 'न तो विशेष बल न कमजोरी — अन्य कारकों पर निर्भर',
    sa: 'न बलं न दुर्बलता',
    te: 'బలం లేదా బలహీనత లేదు — ఇతర కారకాలపై ఆధారపడి ఉంటుంది',
    ta: 'வலிமையும் பலவீனமும் இல்லை — பிற காரணிகளைப் பொறுத்தது',
  },
  enemy: {
    en: 'may need extra conscious effort — themes can feel friction or require patience to develop',
    hi: 'अतिरिक्त प्रयास चाहिए — घर्षण या धैर्य की जरूरत',
    sa: 'अतिरिक्तप्रयासः आवश्यकः',
    te: 'అదనపు ప్రయత్నం అవసరం — ఘర్షణ లేదా సహనం',
    ta: 'கூடுதல் முயற்சி தேவை — உராய்வு அல்லது பொறுமை',
  },
  debilitated: {
    en: 'may feel strained or inverted — themes need more care and self-awareness to express well',
    hi: 'दबाव या उलटा अनुभव — अभिव्यक्ति के लिए अधिक सजगता चाहिए',
    sa: 'दुर्बलाभिव्यक्तिः — अधिकसजगता आवश्यकी',
    te: 'ఒత్తిడి లేదా తిరుగుబాటు — మెరుగైన అభివ్యక్తికి జాగ్రత్త అవసరం',
    ta: 'அழுத்தம் அல்லது தலைகீழ் — நன்கு வெளிப்பட கவனம் தேவை',
  },
};

const DOSHA_EFFECTS = {
  mangal: {
    active: {
      en: 'Traditionally noted in marriage matching — may indicate strong Mars energy in partnership houses; many charts have cancellations. Not a curse on relationships.',
      hi: 'विवाह मिलान में देखा जाता है — संबंध भावों में मंगल ऊर्जा; कई कुंडलियों में रद्दीकरण। शाप नहीं।',
      sa: 'विवाहमिलने मङ्गलोर्जा — रद्दीकरणैः शान्तिः।',
      te: 'వివాహ పోలికలో చూస్తారు — భాగస్వామ్య శక్తి; రద్దులు సాధారణం.',
      ta: 'திருமண பொருத்தத்தில் குறிப்பிடப்படுகிறது — உறவு சக்தி; ரத்துகள் பொதுவானவை.',
    },
    inactive: {
      en: 'No active manglik pattern — Mars does not sit in the classical marriage-stress houses from key references, or cancellations apply.',
      hi: 'सक्रिय मांगलिक पैटर्न नहीं — रद्दीकरण या ग्रह स्थिति अनुकूल।',
      sa: 'न सक्रियमाङ्गलिकम्।',
      te: 'సక్రియ మాంగ్లిక్ నమూనా లేదు.',
      ta: 'செயலில் மங்களிக் வடிவம் இல்லை.',
    },
  },
  kaalSarp: {
    active: {
      en: 'Some traditions read this as intensity, karmic focus, or feeling that life moves in concentrated chapters — widely debated; many successful charts have it.',
      hi: 'कुछ परंपराएँ तीव्रता या कर्म केंद्रित जीवन पढ़ती हैं — विवादित; कई सफल कुंडलियों में है।',
      sa: 'तीव्रताकर्मविषयाः — विवादितम्।',
      te: 'కొన్ని సంప్రదాయాలు తీవ్రత లేదా కర్మ కేంద్రీకృత జీవితం చదువుతాయి.',
      ta: 'சில பாரம்பரியங்கள் தீவிரம் அல்லது கர்ம கவன வாழ்க்கையாகப் பார்க்கின்றன.',
    },
    inactive: {
      en: 'Planets are spread on both sides of the nodal axis — no Kaal Sarp pattern.',
      hi: 'ग्रह राहु-केतु अक्ष के दोनों ओर — काल सर्प नहीं।',
      sa: 'ग्रहाः उभयपार्श्वे — न कालसर्पम्।',
      te: 'గ్రహాలు రాహు-కేతు అక్షం రెండు వైపులా.',
      ta: 'கிரகங்கள் ராகு-கேது அச்சின் இருபுறமும்.',
    },
  },
  pitru: {
    active: {
      en: 'Some traditions link this to ancestral or father-line themes — feeling distant from guidance, honouring elders, or working through inherited patterns. Informational, not blame.',
      hi: 'पैतृक या पितृ-वंश विषय — मार्गदर्शन से दूरी, बड़ों का सम्मान, विरासत के पैटर्न। दोष नहीं।',
      sa: 'पैतृकविषयाः — मार्गदर्शनविरासतपैटर्नाः।',
      te: 'పూర్వీక లేదా తండ్రి వంశ విషయాలు — మార్గదర్శనం, పెద్దల గౌరవం.',
      ta: 'மூதாதையர் அல்லது தந்தை வழி தீம்கள் — வழிகாட்டல், மரியாதை.',
    },
    inactive: {
      en: 'No classical pitru triggers — ancestral-theme indicators are not flagged in your chart.',
      hi: 'पितृ दोष के शास्त्रीय संकेत नहीं।',
      sa: 'न पितृसङ्केताः।',
      te: 'పితృ దోష ట్రిగర్లు లేవు.',
      ta: 'பித்ரு தூண்டுதல்கள் இல்லை.',
    },
  },
} as const;

export function getYogaEffect(
  yogaName: string,
  reasons: string[],
  language: AppLanguage,
): string {
  const base =
    YOGA_LIFE_EFFECTS[yogaName]?.[language] ??
    YOGA_LIFE_EFFECTS[yogaName]?.en;
  if (!base) {
    return '';
  }

  const grahas = grahasFromReasons(reasons);
  if (grahas.length === 0) {
    return base;
  }

  const modifiers = grahas
    .map((graha) => GRAHA_MODIFIER[graha]?.[language] ?? GRAHA_MODIFIER[graha]?.en)
    .filter(Boolean);

  if (modifiers.length === 0) {
    return base;
  }

  return `${base} ${modifiers.join(' ')}`;
}

export function getPlanetInHouseEffect(
  planet: string,
  house: number,
  language: AppLanguage,
): string {
  const houseTheme = getHouseTheme(house, language).toLowerCase();
  const planetEffect = getDashaLordEffect('antar', planet, language);

  const templates: Record<AppLanguage, string> = {
    en: `${planetEffect} Placed in the ${house}th house, this especially colours ${houseTheme}.`,
    hi: `${planet} ${house}वें भाव में — विशेष रूप से ${houseTheme} के विषयों को रंग देता है।`,
    sa: `${planet} ${house}भावे — ${houseTheme}विषयान् विशेषतः रञ्जयति।`,
    te: `${house}వ భావంలో ${planet} — ప్రత్యేకంగా ${houseTheme} అంశాలను ప్రభావితం చేస్తుంది.`,
    ta: `${house}ம் பாவத்தில் ${planet} — குறிப்பாக ${houseTheme} தீம்களை வண்ணமயமாக்குகிறது.`,
  };

  if (language === 'en') {
    return templates.en;
  }
  return templates[language] ?? templates.en;
}

export function getTransitEffect(
  planet: string,
  houseFromMoon: number,
  language: AppLanguage,
): string {
  const houseTheme = getHouseTheme(houseFromMoon, language).toLowerCase();
  const grahaLead =
    TRANSIT_GRAHA_EFFECT[planet]?.[language] ??
    TRANSIT_GRAHA_EFFECT[planet]?.en ??
    `${planet} transit influences`;

  const templates: Record<AppLanguage, string> = {
    en: `${grahaLead} the ${houseFromMoon}th area from your birth Moon (${houseTheme}).`,
    hi: `${planet} गोचर जन्म चन्द्र से ${houseFromMoon}वें क्षेत्र (${houseTheme}) को प्रभावित करता है।`,
    sa: `${planet}गोचरः जन्मचन्द्रात् ${houseFromMoon}क्षेत्रं प्रभावयति।`,
    te: `${planet} గోచరం జన్మ చంద్రం నుండి ${houseFromMoon}వ ప్రాంతాన్ని (${houseTheme}) ప్రభావితం చేస్తుంది.`,
    ta: `${planet} கோசாரம் பிறப்பு சந்திரத்திலிருந்து ${houseFromMoon}ம் பகுதியை (${houseTheme}) பாதிக்கிறது.`,
  };

  if (language === 'hi') {
    return `${planet} गोचर जन्म चन्द्र से ${houseFromMoon}वें क्षेत्र (${houseTheme}) को प्रभावित करता है।`;
  }

  return templates[language] ?? templates.en;
}

export function getDignityLifeEffect(
  planet: string,
  dignity: string,
  language: AppLanguage,
): string {
  const planetThemes = getDashaLordEffect('antar', planet, language);
  const modifier =
    DIGNITY_MODIFIER[dignity]?.[language] ??
    DIGNITY_MODIFIER[dignity]?.en ??
    'is positioned in this sign';

  const templates: Record<AppLanguage, string> = {
    en: `In daily life, ${planet} ${modifier}. ${planetThemes}`,
    hi: `दैनिक जीवन में ${planet} ${modifier}।`,
    sa: `दैनिकजीवने ${planet} ${modifier}।`,
    te: `రోజువారీ జీవితంలో ${planet} ${modifier}.`,
    ta: `தினசரி வாழ்க்கையில் ${planet} ${modifier}.`,
  };

  if (language === 'en') {
    return templates.en;
  }
  return templates[language] ?? templates.en;
}

export function getChandraBalamEffect(
  house: number,
  quality: 'strong' | 'weak',
  language: AppLanguage,
): string {
  const theme = getHouseTheme(house, language).toLowerCase();
  const templates: Record<AppLanguage, string> = {
    en:
      quality === 'strong'
        ? `The Moon supports activity relative to your birth Moon — steady progress in ${theme} is favored today.`
        : `The Moon suggests caution relative to your birth Moon — pace yourself in ${theme}; avoid forcing outcomes.`,
    hi:
      quality === 'strong'
        ? `चन्द्र बल अनुकूल — ${theme} में स्थिर प्रगति के लिए अच्छा दिन।`
        : `चन्द्र बल सावधानी — ${theme} में धीरे चलें।`,
    sa:
      quality === 'strong'
        ? `चन्द्रबलमनुकूलम् — ${theme}विषये स्थिरप्रगतिः।`
        : `चन्द्रबलं सावधानी — ${theme}विषये धैर्यम्।`,
    te:
      quality === 'strong'
        ? `చంద్ర బలం అనుకూలం — ${theme}లో స్థిర పురోగతికి మంచి రోజు.`
        : `చంద్ర బలం జాగ్రత్త — ${theme}లో నెమ్మదిగా ముందుకు.`,
    ta:
      quality === 'strong'
        ? `சந்திர பலம் சாதகம் — ${theme} இல் நிலையான முன்னேற்றத்திற்கு நல்ல நாள்.`
        : `சந்திர பலம் கவனம் — ${theme} இல் நிதானமாக செல்லுங்கள்.`,
  };
  return templates[language] ?? templates.en;
}

export function getTarabalaEffect(
  taraIndex: number,
  language: AppLanguage,
): string {
  return getTaraDescription(taraIndex, language);
}

export function getDoshaLifeEffect(
  kind: 'mangal' | 'kaalSarp' | 'pitru',
  active: boolean,
  language: AppLanguage,
): string {
  const bucket = DOSHA_EFFECTS[kind][active ? 'active' : 'inactive'];
  return bucket[language] ?? bucket.en;
}
