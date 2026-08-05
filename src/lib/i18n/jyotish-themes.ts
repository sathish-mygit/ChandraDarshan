import type { AppLanguage } from '../types';

type LocalizedText = Record<AppLanguage, string>;

const DASHA_LORD_THEMES: Record<string, LocalizedText> = {
  Sun: {
    en: 'Self-expression, authority, vitality, and public recognition.',
    hi: 'आत्म-अभिव्यक्ति, अधिकार, ऊर्जा और सार्वजनिक मान्यता।',
    sa: 'आत्माभिव्यक्तिः, अधिकारः, ऊर्जा, प्रतिष्ठा च।',
    te: 'ఆత్మ వ్యక్తీకరణ, అధికారం, శక్తి మరియు ప్రజా గుర్తింపు.',
    ta: 'சுய வெளிப்பாடு, அதிகாரம், உயிர்ச்சக்தி மற்றும் பொது அங்கீகாரம்.',
  },
  Moon: {
    en: 'Emotions, home, nurturing, and inner rhythms.',
    hi: 'भावनाएँ, घर, पोषण और आंतरिक लय।',
    sa: 'भावनाः, गृहं, पोषणं, अन्तर्लयः च।',
    te: 'భావాలు, ఇల్లు, పోషణ మరియు అంతర్గత లయలు.',
    ta: 'உணர்வுகள், வீடு, பராமரிப்பு மற்றும் உள் தாளங்கள்.',
  },
  Mars: {
    en: 'Courage, action, competition, and physical drive.',
    hi: 'साहस, कर्म, प्रतिस्पर्धा और शारीरिक ऊर्जा।',
    sa: 'साहसं, कर्म, स्पर्धा, शारीरिकोर्जा च।',
    te: 'ధైర్యం, చర్య, పోటీ మరియు శారీరక శక్తి.',
    ta: 'தைரியம், செயல், போட்டி மற்றும் உடல் உந்துதல்.',
  },
  Mercury: {
    en: 'Learning, communication, trade, and adaptability.',
    hi: 'ज्ञान, संवाद, व्यापार और अनुकूलन।',
    sa: 'विद्या, संवादः, व्यापारः, अनुकूलनं च।',
    te: 'అభ్యాసం, సంభాషణ, వ్యాపారం మరియు అనుకూలత.',
    ta: 'கற்றல், தொடர்பு, வணிகம் மற்றும் தகவமைப்பு.',
  },
  Jupiter: {
    en: 'Wisdom, growth, dharma, teachers, and good fortune.',
    hi: 'ज्ञान, विकास, धर्म, गुरु और सौभाग्य।',
    sa: 'ज्ञानं, वृद्धिः, धर्मः, गुरुः, भाग्यं च।',
    te: 'జ్ఞానం, వృద్ధి, ధర్మం, గురువులు మరియు శుభం.',
    ta: 'ஞானம், வளர்ச்சி, தர்மம், குருக்கள் மற்றும் நல்ல அதிர்ஷ்டம்.',
  },
  Venus: {
    en: 'Relationships, comfort, creativity, and refinement.',
    hi: 'संबंध, सुख, सृजनात्मकता और सौंदर्य।',
    sa: 'सम्बन्धाः, सुखं, सृजनात्मकता, सौन्दर्यं च।',
    te: 'సంబంధాలు, సౌకర్యం, సృజనాత్మకత మరియు సౌందర్యం.',
    ta: 'உறவுகள், வசதி, படைப்பாற்றல் மற்றும் நேர்த்தி.',
  },
  Saturn: {
    en: 'Discipline, responsibility, patience, and long-term building.',
    hi: 'अनुशासन, जिम्मेदारी, धैर्य और दीर्घकालिक निर्माण।',
    sa: 'अनुशासनं, उत्तरदायित्वं, धैर्यं, दीर्घकालिकनिर्माणं च।',
    te: 'శిక్షణ, బాధ్యత, సహనం మరియు దీర్ఘకాలిక నిర్మాణం.',
    ta: 'ஒழுக்கம், பொறுப்பு, பொறுமை மற்றும் நீண்டகால கட்டமைப்பு.',
  },
  Rahu: {
    en: 'Ambition, unconventional paths, and worldly desires.',
    hi: 'महत्वाकांक्षा, अपरंपरागत मार्ग और भौतिक इच्छाएँ।',
    sa: 'महत्त्वाकाङ्क्षा, अपरम्परागतमार्गाः, भौतिकेच्छाः च।',
    te: 'ఆశలు, అసాంప్రదాయిక మార్గాలు మరియు భౌతిక కోరికలు.',
    ta: 'ஆசைகள், மரபு வழியற்ற பாதைகள் மற்றும் உலக ஆசைகள்.',
  },
  Ketu: {
    en: 'Detachment, spirituality, introspection, and release.',
    hi: 'वैराग्य, आध्यात्म, आत्मनिरीक्षण और मोक्ष।',
    sa: 'वैराग्यं, आध्यात्मिकता, आत्मनिरीक्षणं, मोक्षः च।',
    te: 'విరక్తి, ఆధ్యాత్మికత, ఆత్మపరిశీలన మరియు విముక్తి.',
    ta: 'விடுபட்ட நிலை, ஆன்மீகம், உள்நோக்கு மற்றும் விடுதலை.',
  },
};

const TARA_DESCRIPTIONS: LocalizedText[] = [
  {
    en: 'Janma — a day for self-reflection; mild caution with new starts.',
    hi: 'जन्म — आत्म-चिंतन का दिन; नई शुरुआत में सावधानी।',
    sa: 'जन्म — आत्मचिन्तनदिनम्; नवारम्भे सावधानी।',
    te: 'జన్మ — ఆత్మపరిశీలన రోజు; కొత్త ప్రారంభాలలో జాగ్రత్త.',
    ta: 'ஜன்ம — சுய பிரதிபலிப்பு நாள்; புதிய தொடக்கங்களில் கவனம்.',
  },
  {
    en: 'Sampat — favorable for wealth, resources, and steady gains.',
    hi: 'सम्पत् — धन, संसाधन और स्थिर लाभ के लिए अनुकूल।',
    sa: 'सम्पत् — धनसंसाधनस्थिरलाभेभ्योऽनुकूलम्।',
    te: 'సంపత్ — సంపద, వనరులు మరియు స్థిర లాభాలకు అనుకూలం.',
    ta: 'சம்பத் — செல்வம், வளங்கள் மற்றும் நிலையான லாபத்திற்கு சாதகம்.',
  },
  {
    en: 'Vipat — traditionally cautious; avoid major risks.',
    hi: 'विपत् — सावधानी बरतें; बड़े जोखिम से बचें।',
    sa: 'विपत् — सावधानी; महारिस्कं वर्जयेत्।',
    te: 'విపత్ — జాగ్రత్త; పెద్ద ప్రమాదాలను నివారించండి.',
    ta: 'விபத் — கவனமாக இருங்கள்; பெரிய ஆபத்துகளைத் தவிர்க்கவும்.',
  },
  {
    en: 'Kshema — supportive for well-being, rest, and stability.',
    hi: 'क्षेम — कल्याण, विश्राम और स्थिरता के लिए अनुकूल।',
    sa: 'क्षेम — कल्याणविश्रामस्थैर्येभ्योऽनुकूलम्।',
    te: 'క్షేమ — శ్రేయస్సు, విశ్రాంతి మరియు స్థిరత్వానికి అనుకూలం.',
    ta: 'க்ஷேம — நல்வாழ்வு, ஓய்வு மற்றும் நிலைத்தன்மைக்கு சாதகம்.',
  },
  {
    en: 'Pratyari — obstacles may arise; patience and planning help.',
    hi: 'प्रत्यारि — बाधाएँ आ सकती हैं; धैर्य और योजना सहायक।',
    sa: 'प्रत्यारि — बाधाः सम्भवन्ति; धैर्ययोजना सहायकौ।',
    te: 'ప్రత్యరి — అడ్డంకులు రావచ్చు; సహనం మరియు ప్రణాళిక సహాయపడుతుంది.',
    ta: 'பிரத்யரி — தடைகள் வரலாம்; பொறுமையும் திட்டமும் உதவும்.',
  },
  {
    en: 'Sadhaka — good for accomplishment and focused effort.',
    hi: 'साधक — उपलब्धि और एकाग्र प्रयास के लिए शुभ।',
    sa: 'साधक — सिद्धिएकाग्रप्रयासयोः शुभम्।',
    te: 'సాధక — సాధన మరియు ఏకాగ్ర ప్రయత్నానికి శుభం.',
    ta: 'சாதக — சாதனை மற்றும் கவனமான முயற்சிக்கு சுபம்.',
  },
  {
    en: 'Vadha — traditionally inauspicious; favor routine over bold moves.',
    hi: 'वध — अशुभ; साहसिक कदमों से बचें, दिनचर्या पर ध्यान दें।',
    sa: 'वध — अशुभम्; साहसिकक्रियां वर्जयित्वा दिनचर्यां कुरुत।',
    te: 'వధ — అశుభం; ధైర్యమైన చర్యల కంటే రోజువారీ పనులకు ప్రాధాన్యత.',
    ta: 'வத — அசுபம்; துணிச்சலான நடவடிக்கைகளை விட வழக்கமான பணிகளை முன்னுரிமை.',
  },
  {
    en: 'Mitra — friendly energy; cooperation and social harmony.',
    hi: 'मित्र — मित्रता, सहयोग और सामाजिक सामंजस्य।',
    sa: 'मित्र — मैत्रीसहयोगसामाजिकसामञ्जस्यं च।',
    te: 'మిత్ర — స్నేహశక్తి; సహకారం మరియు సామాజిక సామరస్యం.',
    ta: 'மித்ர — நட்பு சக்தி; ஒத்துழைப்பு மற்றும் சமூக நல்லிணக்கம்.',
  },
  {
    en: 'Ati-Mitra — highly favorable; one of the best taras.',
    hi: 'अति-मित्र — अत्यंत शुभ; सर्वोत्तम ताराओं में से एक।',
    sa: 'अतिमित्र — अत्यन्तशुभम्; श्रेष्ठताराणाम् एकः।',
    te: 'అతి-మిత్ర — అత్యంత శుభం; ఉత్తమ తారాలలో ఒకటి.',
    ta: 'அதி-மித்ர — மிகவும் சுபம்; சிறந்த தாராக்களில் ஒன்று.',
  },
];

const YOGA_DESCRIPTIONS: Record<string, LocalizedText> = {
  Ruchaka: {
    en: 'Mars in a kendra in its own or exalted sign — courage and leadership.',
    hi: 'कendra में स्वगृही/उच्च मंगल — साहस और नेतृत्व।',
    sa: 'केन्द्रे स्वोच्चमङ्गलः — साहसनेतृत्वे।',
    te: 'కేంద్రంలో స్వగృహ/ఉచ్చ మంగళం — ధైర్యం మరియు నాయకత్వం.',
    ta: 'கேந்திரத்தில் சுய/உச்ச செவ்வாய் — தைரியமும் தலைமைத்துவமும்.',
  },
  Bhadra: {
    en: 'Mercury in a kendra in its own or exalted sign — intellect and eloquence.',
    hi: 'कendra में स्वगृही/उच्च बुध — बुद्धि और वाक्पटुता।',
    sa: 'केन्द्रे स्वोच्चबुधः — बुद्धिवाक्पटुता।',
    te: 'కేంద్రంలో స్వగృహ/ఉచ్చ బుధుడు — బుద్ధి మరియు వాక్చాతుర్యం.',
    ta: 'கேந்திரத்தில் சுய/உச்ச புதன் — அறிவும் சொல்லாற்றலும்.',
  },
  Hamsa: {
    en: 'Jupiter in a kendra in its own or exalted sign — wisdom and grace.',
    hi: 'कendra में स्वगृही/उच्च गुरु — ज्ञान और कृपा।',
    sa: 'केन्द्रे स्वोच्चगुरुः — ज्ञानकृपे।',
    te: 'కేంద్రంలో స్వగృహ/ఉచ్చ గురువు — జ్ఞానం మరియు కృప.',
    ta: 'கேந்திரத்தில் சுய/உச்ச குரு — ஞானமும் கருணையும்.',
  },
  Malavya: {
    en: 'Venus in a kendra in its own or exalted sign — beauty and harmony.',
    hi: 'कendra में स्वगृही/उच्च शुक्र — सौंदर्य और सामंजस्य।',
    sa: 'केन्द्रे स्वोच्चशुक्रः — सौन्दर्यसामञ्जस्ये।',
    te: 'కేంద్రంలో స్వగృహ/ఉచ్చ శుక్రుడు — సౌందర్యం మరియు సామరస్యం.',
    ta: 'கேந்திரத்தில் சுய/உச்ச சுக்ரன் — அழகும் இணக்கமும்.',
  },
  Sasha: {
    en: 'Saturn in a kendra in its own or exalted sign — discipline and authority.',
    hi: 'कendra में स्वगृही/उच्च शनि — अनुशासन और अधिकार।',
    sa: 'केन्द्रे स्वोच्चशनिः — अनुशासनाधिकारौ।',
    te: 'కేంద్రంలో స్వగృహ/ఉచ్చ శని — శిక్షణ మరియు అధికారం.',
    ta: 'கேந்திரத்தில் சுய/உச்ச சனி — ஒழுக்கமும் அதிகாரமும்.',
  },
  Gajakesari: {
    en: 'Jupiter in a kendra from the Moon — wisdom supports emotional strength.',
    hi: 'चन्द्र से kendra में गुरु — ज्ञान भावनात्मक शक्ति को बढ़ाता है।',
    sa: 'चन्द्रात्केन्द्रे गुरुः — ज्ञानं भावशक्तिं वर्धयति।',
    te: 'చంద్రుని నుండి కేంద్రంలో గురువు — జ్ఞానం భావశక్తిని బలపరుస్తుంది.',
    ta: 'சந்திரத்திலிருந்து கேந்திரத்தில் குரு — ஞானம் உணர்ச்சி வலிமையை ஆதரிக்கிறது.',
  },
  Sunapha: {
    en: 'A graha (not Sun/Moon) in the 2nd sign from Moon — self-earned comfort, reputation, and visible resources through your own effort.',
    hi: 'चन्द्र से दूसरी राशि में ग्रह — स्वयं के प्रयास से सुख, प्रतिष्ठा और संसाधन।',
    sa: 'चन्द्रात् द्वितीयराशौ ग्रहः — स्वकीयप्रयासेन सुखप्रतिष्ठासम्पदः।',
    te: 'చంద్రుని నుండి 2వ రాశిలో గ్రహం — స్వంత ప్రయత్నంతో సౌకర్యం, గుర్తింపు, సంపద.',
    ta: 'சந்திரத்திலிருந்து 2ம் ராசியில் கிரகம் — சொந்த முயற்சியால் வசதி, புகழ், வளம்.',
  },
  Anapha: {
    en: 'A graha in the 12th sign from Moon — refinement, generosity, and themes beyond the self; the planet colours the tone.',
    hi: 'चन्द्र से बारहवीं राशि में ग्रह — सौंदर्य, उदारता और आत्म से परे विषय; ग्रह स्वभाव तय करता है।',
    sa: 'चन्द्रात् द्वादशराशौ ग्रहः — सौन्दर्योदारतापरविषयाः; ग्रहः स्वभावं दर्शयति।',
    te: 'చంద్రుని నుండి 12వ రాశిలో గ్రహం — సంస్కారం, ఉదారత, ఆత్మకంటే అప్పుడు అంశాలు.',
    ta: 'சந்திரத்திலிருந்து 12ம் ராசியில் கிரகம் — நேர்த்தி, தாராளம், தன்மைக்கு அப்பால் தீம்கள்.',
  },
  Durudhura: {
    en: 'Grahas in both 2nd and 12th from Moon — material support and inner/spiritual colouring both active around the mind.',
    hi: 'चन्द्र से 2 और 12 दोनों में ग्रह — भौतिक सहारा और आंतरिक/आध्यात्मिक रंग दोनों सक्रिय।',
    sa: 'चन्द्रात् द्वितीयद्वादशयोः ग्रहाः — भौतिकसहारश्च आन्तरिकवर्णनं च।',
    te: 'చంద్రుని నుండి 2 మరియు 12 రెండింటిలో గ్రహాలు — భౌతిక మరియు అంతరంగిక రంగులు రెండూ.',
    ta: 'சந்திரத்திலிருந்து 2 மற்றும் 12 இல் கிரகங்கள் — பொருள் ஆதரவும் உள் தன்மையும் இரண்டும்.',
  },
  Kemadruma: {
    en: 'No graha conjunct Moon or in 2nd/12th from Moon — Moon stands alone; texts note emotional self-reliance or feeling unsupported; other chart factors matter.',
    hi: 'चन्द्र के साथ या 2/12 में कोई ग्रह नहीं — चन्द्र अकेला; भावनात्मक आत्मनिर्भरता या अलगाव; अन्य कारक भी देखें।',
    sa: 'चन्द्रे सह द्वितीयद्वादशयोः ग्रहो नास्ति — चन्द्र एकाकी; भावात्मनिर्भरता; अन्यकारकाः अपि।',
    te: 'చంద్రునికి సమీపంలో లేదా 2/12లో గ్రహం లేదు — చంద్రుడు ఒంటరిగా; భావోద్వేగ ఆత్మనిర్భరత.',
    ta: 'சந்திரத்துடன் அல்லது 2/12 இல் கிரகம் இல்லை — சந்திரன் தனியாக; உணர்ச்சி சுயநிலை.',
  },
  'Budha-Aditya': {
    en: 'Sun and Mercury together — sharp intellect and communication.',
    hi: 'सूर्य-बुध योग — तीक्ष्ण बुद्धि और संवाद।',
    sa: 'सूर्यबुध्योगः — तीक्ष्णबुद्धिसंवादौ।',
    te: 'సూర్య-బుధ యోగం — తీక్ష్ణ బుద్ధి మరియు సంభాషణ.',
    ta: 'சூரிய-புதன் யோகம் — கூர்மையான அறிவும் தொடர்பும்.',
  },
  Veshi: {
    en: 'A graha in the 2nd sign from Sun — public poise, speech, and how you present yourself to the world.',
    hi: 'सूर्य से दूसरी राशि में ग्रह — सार्वजनिक शालीनता, वाणी और स्वयं को प्रस्तुत करने का ढंग।',
    sa: 'सूर्यात् द्वितीयराशौ ग्रहः — सार्वजनिकशालीनता वाक्प्रस्तुतिः च।',
    te: 'సూర్యుని నుండి 2వ రాశిలో గ్రహం — ప్రజా వినయం, మాట, ప్రపంచానికి ప్రదర్శన.',
    ta: 'சூரியத்திலிருந்து 2ம் ராசியில் கிரகம் — பொது நாகரிகம், பேச்சு, வெளிப்பாடு.',
  },
  Vasi: {
    en: 'A graha in the 12th sign from Sun — influence behind the scenes, service, charity, or power exercised indirectly.',
    hi: 'सूर्य से बारहवीं राशि में ग्रह — पर्दे के पीछे प्रभाव, सेवा, दान या अप्रत्यक्ष शक्ति।',
    sa: 'सूर्यात् द्वादशराशौ ग्रहः — पृष्ठतः प्रभावः सेवादानं वा।',
    te: 'సూర్యుని నుండి 12వ రాశిలో గ్రహం — వెనుకబడి ప్రభావం, సేవ, దానం.',
    ta: 'சூரியத்திலிருந்து 12ம் ராசியில் கிரகம் — பின்னணி செல்வாக்கு, சேவை, தானம்.',
  },
  Ubhayachari: {
    en: 'Grahas in both 2nd and 12th from Sun — both public presentation and behind-the-scenes influence are active.',
    hi: 'सूर्य से 2 और 12 दोनों में ग्रह — सार्वजनिक और पर्दे के पीछे दोनों प्रभाव सक्रिय।',
    sa: 'सूर्यात् द्वितीयद्वादशयोः ग्रहाः — सार्वजनिकपृष्ठभागप्रभावौ सक्रियौ।',
    te: 'సూర్యుని నుండి 2 మరియు 12 రెండింటిలో గ్రహాలు — ప్రజా మరియు వెనుకబడి ప్రభావం రెండూ.',
    ta: 'சூரியத்திலிருந்து 2 மற்றும் 12 இல் கிரகங்கள் — பொது மற்றும் பின்னணி செல்வாக்கு இரண்டும்.',
  },
  'Raja Yoga': {
    en: 'Kendra lords (capacity to act) link with trikona lords (fortune/dharma) — potential for responsibility, rise, and recognition when effort meets opportunity.',
    hi: 'कendra स्वामी (कर्मक्षमता) और trikona स्वामी (भाग्य/धर्म) जुड़े — उत्तरदायित्व, उन्नति और मान्यता की संभावना।',
    sa: 'केन्द्रत्रिकोणस्वामिसंयोगः — उत्तरदायित्वोन्नतिप्रतिष्ठासम्भावना।',
    te: 'కేంద్ర-త్రికోణ స్వాముల సంబంధం — బాధ్యత, ఎదుగుదల, గుర్తింపు సాధ్యత.',
    ta: 'கேந்திர-திரிகோண அதிபதிகள் இணைவு — பொறுப்பு, உயர்வு, அங்கீகார வாய்ப்பு.',
  },
  'Dharma-Karmadhipati': {
    en: '9th lord (dharma/purpose) and 10th lord (karma/career) combine — meaningful work where values and action align.',
    hi: 'नवमेश (धर्म) और दशमेश (कर्म) योग — मूल्य और कार्य का मेल; अर्थपूर्ण कर्म।',
    sa: 'नवमदशमेशयोगः — धर्मकर्मसमन्वयः।',
    te: '9వ-10వ స్వాముల యోగం — ధర్మం మరియు కర్మం కలిసి అర్థవంతమైన పని.',
    ta: '9ம்-10ம் அதிபதி யோகம் — தர்மமும் கர்மமும் இணைந்த அர்த்தமுள்ள வேலை.',
  },
  'Lakshmi Yoga': {
    en: 'Venus and 9th lord in strong positions — comfort and fortune.',
    hi: 'शुक्र और नवमेश की शक्ति — सुख और भाग्य।',
    sa: 'शुक्रनवमेशशक्तिः — सुखभाग्ये।',
    te: 'శుక్ర మరియు 9వ స్వామి బలం — సౌకర్యం మరియు భాగ్యం.',
    ta: 'சுக்ரனும் 9ம் அதிபதியும் வலுவாக — வசதியும் அதிர்ஷ்டமும்.',
  },
  'Dhana Yoga (2-11)': {
    en: '2nd and 11th lords combine — themes of wealth and gains.',
    hi: 'द्वितीय-एकादशेश योग — धन और लाभ के विषय।',
    sa: 'द्वितीयैकादशेशयोगः — धनलाभविषयाः।',
    te: '2వ-11వ స్వామి యోగం — సంపద మరియు లాభాల అంశాలు.',
    ta: '2ம்-11ம் அதிபதி யோகம் — செல்வமும் லாபமும்.',
  },
  'Dhana Yoga (5-9)': {
    en: '5th and 9th lords combine — fortune through merit and dharma.',
    hi: 'पंचम-नवमेश योग — पुण्य और धर्म से भाग्य।',
    sa: 'पञ्चमनवमेशयोगः — पुण्यधर्मेभ्यो भाग्यम्।',
    te: '5వ-9వ స్వామి యోగం — పుణ్యం మరియు ధర్మం ద్వారా భాగ్యం.',
    ta: '5ம்-9ம் அதிபதி யோகம் — புண்ணியமும் தர்மமும் வழி அதிர்ஷ்டம்.',
  },
  'Vasumati Yoga': {
    en: 'Natural benefics in houses 3, 6, 11, and 12 — classical wealth-support pattern through effort, gains, and prudent outflow.',
    hi: '3, 6, 11, 12 में शुभ ग्रह — प्रयास, लाभ और संयमित व्यय से धन-सहायक शास्त्रीय योग।',
    sa: 'तृतीयषष्ठैकादशद्वादशभावेषु शुभग्रहाः — प्रयासलाभसंयमैः धनसहायकयोगः।',
    te: '3, 6, 11, 12 భావాలలో శుభ గ్రహాలు — ప్రయత్నం, లాభం, జాగ్రత్తతో సంపద సహాయక యోగం.',
    ta: '3, 6, 11, 12 பாவங்களில் நல்ல கிரகங்கள் — முயற்சி, லாபம், நிதான வெளிப்போக்குடன் செல்வம்.',
  },
  'Daridra Yoga': {
    en: 'Wealth lords weakened (11th in 12th or 2nd lord in dusthana) — classical caution about income flow; one factor only, not a verdict.',
    hi: 'धन स्वामी कमज़ोर (11वें का 12वें में या 2वें का दुष्ट भाव में) — आय पर शास्त्रीय सावधानी; एक कारक मात्र।',
    sa: 'धनस्वामिदुर्बलता — आयप्रवाहे शास्त्रीयसावधानी; एककारकमात्रम्।',
    te: 'ధన స్వాములు బలహీనం — ఆదాయ ప్రవాహంపై శాస్త్రీయ హెచ్చరిక; ఒకే కారకం.',
    ta: 'செல்வ அதிபதிகள் பலவீனம் — வருமான ஓட்டத்தில் சாஸ்திர எச்சரிக்கை; ஒரு காரணி மட்டும்.',
  },
  'Vipareeta Raja Yoga': {
    en: 'Dusthana lords in dusthana — adversity can transform into strength.',
    hi: 'दुष्ट भाव स्वामी योग — कठिनाई से शक्ति में परिवर्तन।',
    sa: 'दुष्टभावस्वामियोगः — कष्टात्शक्तिपरिवर्तनम्।',
    te: 'దుష్ట భావ స్వామి యోగం — కష్టం బలంగా మారవచ్చు.',
    ta: 'துஷ்ட பாவ அதிபதி யோகம் — சிரமம் வலிமையாக மாறலாம்.',
  },
  Yogakaraka: {
    en: 'A planet rules both a kendra and trikona — a key life-supporting graha.',
    hi: 'एक ग्रह kendra और trikona दोनों का स्वामी — जीवन का मुख्य सहायक।',
    sa: 'एकग्रहः केन्द्रत्रिकोणयोः स्वामी — जीवनस्य प्रधानसहायकः।',
    te: 'ఒక గ్రహం కేంద్ర మరియు త్రికోణ రెండింటికీ స్వామి — జీవితానికి ముఖ్య సహాయకుడు.',
    ta: 'ஒரு கிரகம் கேந்திரமும் திரிகோணமும் ஆளும் — வாழ்க்கைக்கு முக்கிய ஆதரவு.',
  },
  Vargottama: {
    en: 'Planet in same sign in D1 and D9 — strengthened expression of that graha.',
    hi: 'D1 और D9 में एक ही राशि — उस ग्रह की शक्ति बढ़ती है।',
    sa: 'D1D9 एकराशौ — तस्य ग्रहस्य शक्तिर्वर्धते।',
    te: 'D1 మరియు D9లో ఒకే రాశి — ఆ గ్రహం బలపడుతుంది.',
    ta: 'D1 மற்றும் D9 இல் ஒரே ராசி — அந்த கிரகம் வலுவடைகிறது.',
  },
  'Neecha Bhanga': {
    en: 'Debilitation cancelled — weakness can be transformed into resilience.',
    hi: 'नीच भंग — दुर्बलता को लचीलेपन में बदला जा सकता है।',
    sa: 'नीचभङ्गः — दुर्बलता लचीलत्वे परिवर्त्यते।',
    te: 'నీచ భంగ — బలహీనతను దృఢత్వంగా మార్చవచ్చు.',
    ta: 'நீச பங்க — பலவீனத்தை வலிமையாக மாற்றலாம்.',
  },
};

const DEFAULT_YOGA_DESCRIPTION: LocalizedText = {
  en: 'A classical combination noted in your birth chart.',
  hi: 'आपकी जन्म कुंडली में एक शास्त्रीय योग।',
  sa: 'जन्मकुण्डल्यां शास्त्रीययोगः।',
  te: 'మీ జన్మ కుండలిలో శాస్త్రీయ యోగం.',
  ta: 'உங்கள் ஜாதகத்தில் ஒரு சாஸ்திர யோகம்.',
};

const SADE_SATI_PHASES: Record<1 | 2 | 3, LocalizedText> = {
  1: {
    en: 'Phase 1 — Saturn transits the sign before your Moon. A period of preparation and letting go of old patterns.',
    hi: 'चरण 1 — शनि आपकी चन्द्र राशि से पहले की राशि में। तैयारी और पुराने पैटर्न छोड़ने का समय।',
    sa: 'प्रथमचरणः — शनिः जन्मचन्द्रात्पूर्वराशौ। सज्जीकरणपुराणपैटर्नत्यागकालः।',
    te: 'దశ 1 — శని మీ చంద్ర రాశికి ముందు రాశిలో. సిద్ధం మరియు పాత అలవాట్లను వదలడం.',
    ta: 'கட்டம் 1 — சனி உங்கள் சந்திர ராசிக்கு முன் ராசியில். தயாரிப்பும் பழைய பழக்கங்களை விட்டுவிடுதலும்.',
  },
  2: {
    en: 'Phase 2 — Saturn crosses your birth Moon sign. The most intense part of Sade Sati; focus on discipline and patience.',
    hi: 'चरण 2 — शनि आपकी जन्म चन्द्र राशि पर। साढ़े साती का सबसे गहरा चरण; अनुशासन और धैर्य पर ध्यान दें।',
    sa: 'द्वितीयचरणः — शनिः जन्मचन्द्रराशौ। साढ़ेसात्याः गहनतमः; अनुशासनधैर्ये ध्यानम्।',
    te: 'దశ 2 — శని మీ జన్మ చంద్ర రాశిపై. సాడే సాతిలో అత్యంత తీవ్రమైన భాగం; శిక్షణ మరియు సహనంపై దృష్టి.',
    ta: 'கட்டம் 2 — சனி உங்கள் பிறப்பு சந்திர ராசியில். சாடே சாதியின் தீவிரமான பகுதி; ஒழுக்கமும் பொறுமையும்.',
  },
  3: {
    en: 'Phase 3 — Saturn moves into the sign after your Moon. Integration and gradual relief as the cycle completes.',
    hi: 'चरण 3 — शनि आपकी चन्द्र राशि के बाद की राशि में। एकीकरण और चक्र पूर्ण होने पर धीरे-धीरे राहत।',
    sa: 'तृतीयचरणः — शनिः जन्मचन्द्रानन्तरराशौ। एकीकरणक्रमपूर्णतायां शनैः सुखम्।',
    te: 'దశ 3 — శని మీ చంద్ర రాశి తర్వాత రాశిలో. ఏకీకరణ మరియు చక్రం పూర్తయినప్పుడు క్రమేణా ఉపశమం.',
    ta: 'கட்டம் 3 — சனி உங்கள் சந்திர ராசிக்கு அடுத்த ராசியில். ஒருங்கிணைப்பும் சுழற்சி முடிவில் படிப்படியான நிவாரணமும்.',
  },
};

const GUIDANCE: Record<
  'strong' | 'weak',
  Record<'auspicious' | 'inauspicious', LocalizedText>
> = {
  strong: {
    auspicious: {
      en: 'A supportive day overall. Good for routine work, conversations, and steady progress. Favor starting tasks you have already planned.',
      hi: 'कुल मिलाकर अनुकूल दिन। दिनचर्या, संवाद और स्थिर प्रगति के लिए अच्छा। पहले से योजना बनाए काम शुरू करें।',
      sa: 'समग्रेणानुकूलदिनम्। दिनचर्यासंवादस्थिरप्रगतये शुभम्। पूर्वयोजितकार्यारम्भः शुभः।',
      te: 'మొత్తంగా అనుకూలమైన రోజు. రోజువారీ పనులు, సంభాషణలు మరియు స్థిర పురోగతికి మంచిది.',
      ta: 'ஒட்டுமொத்தமாக ஆதரவான நாள். வழக்கமான பணிகள், உரையாடல்கள் மற்றும் நிலையான முன்னேற்றத்திற்கு நல்லது.',
    },
    inauspicious: {
      en: 'Moon strength is good, but Tarabala suggests caution. Keep plans flexible and avoid rushing major decisions.',
      hi: 'चन्द्र बल अच्छा है, पर ताराबल सावधानी का संकेत देता है। योजनाएँ लचीली रखें, बड़े निर्णय जल्दबाजी में न लें।',
      sa: 'चन्द्रबलं शुभम्, ताराबलं सावधानीसूचकम्। योजनाः लचीलाः कुरुत; महानिर्णये त्वरां वर्जयेत्।',
      te: 'చంద్ర బలం మంచిది, కానీ తారాబలం జాగ్రత్త సూచిస్తుంది. ప్రణాళికలను అనువైనంగా ఉంచండి.',
      ta: 'சந்திர பலம் நல்லது, ஆனால் தாராபலம் கவனத்தைக் குறிக்கிறது. திட்டங்களை நெகிழ்வாக வைத்திருங்கள்.',
    },
  },
  weak: {
    auspicious: {
      en: 'Chandra Balam is cautious, but Tarabala helps. Favor rest, review, and gentle effort over bold new ventures.',
      hi: 'चन्द्र बल सावधानी देता है, पर ताराबल सहायक है। नई साहसिक शुरुआत से बढ़कर विश्राम और समीक्षा पर ध्यान दें।',
      sa: 'चन्द्रबलं सावधानीसूचकम्, ताराबलं सहायकम्। नूतसाहसिकारम्भात्परं विश्रामसमीक्षायां ध्यानम्।',
      te: 'చంద్ర బలం జాగ్రత్తగా ఉంది, కానీ తారాబలం సహాయపడుతుంది. కొత్త ప్రయత్నాల కంటే విశ్రాంతి మరియు సమీక్షకు ప్రాధాన్యత.',
      ta: 'சந்திர பலம் கவனமாக உள்ளது, ஆனால் தாராபலம் உதவுகிறது. புதிய முயற்சிகளை விட ஓய்வு மற்றும் மறுபரிசீலனை.',
    },
    inauspicious: {
      en: 'A day for patience and routine. Postpone major commitments if you can; focus on what is already in motion.',
      hi: 'धैर्य और दिनचर्या का दिन। यदि संभव हो तो बड़ी प्रतिबद्धताएँ टालें; चल रहे कार्यों पर ध्यान दें।',
      sa: 'धैर्यदिनचर्यादिनम्। महाप्रतिबद्धताः स्थगयेत्; चलमानकार्येषु ध्यानम्।',
      te: 'సహనం మరియు రోజువారీ పనుల రోజు. పెద్ద నిర్ణయాలను వాయిదా వేయండి; కొనసాగుతున్న పనులపై దృష్టి.',
      ta: 'பொறுமை மற்றும் வழக்கமான பணிகளின் நாள். பெரிய முடிவுகளைத் தள்ளிவைக்கவும்; நடந்து கொண்டிருப்பதில் கவனம்.',
    },
  },
};

const HORA_THEMES: Record<string, LocalizedText> = {
  Sun: {
    en: 'authority, visibility, and focused action',
    hi: 'अधिकार, दृश्यता और एकाग्र कर्म',
    sa: 'अधिकारदृश्यता एकाग्रकर्म च',
    te: 'అధికారం, కనిపించేతనం మరియు ఏకాగ్ర చర్య',
    ta: 'அதிகாரம், தெரிவுநிலை மற்றும் கவனமான செயல்',
  },
  Moon: {
    en: 'rest, emotions, and nurturing activities',
    hi: 'विश्राम, भावनाएँ और पोषण',
    sa: 'विश्रामभावनापोषणं च',
    te: 'విశ్రాంతి, భావాలు మరియు పోషణ',
    ta: 'ஓய்வு, உணர்வுகள் மற்றும் பராமரிப்பு',
  },
  Mars: {
    en: 'physical effort, courage, and decisive moves',
    hi: 'शारीरिक प्रयास, साहस और निर्णायक कदम',
    sa: 'शारीरिकप्रयाससाहसनिर्णयकक्रियाः',
    te: 'శారీరక ప్రయత్నం, ధైర్యం మరియు నిర్ణాయక చర్యలు',
    ta: 'உடல் முயற்சி, தைரியம் மற்றும் தீர்க்கமான நடவடிக்கைகள்',
  },
  Mercury: {
    en: 'study, writing, trade, and communication',
    hi: 'अध्ययन, लेखन, व्यापार और संवाद',
    sa: 'अध्ययनलेखनव्यापारसंवादाः',
    te: 'అధ్యయనం, రచన, వ్యాపారం మరియు సంభాషణ',
    ta: 'படிப்பு, எழுத்து, வணிகம் மற்றும் தொடர்பு',
  },
  Jupiter: {
    en: 'learning, teaching, and wise decisions',
    hi: 'शिक्षा, शिक्षण और बुद्धिमान निर्णय',
    sa: 'शिक्षाशिक्षणबुद्धिमान्निर्णयाः',
    te: 'అభ్యాసం, బోధన మరియు వివేకపూర్ణ నిర్ణయాలు',
    ta: 'கற்றல், கற்பித்தல் மற்றும் ஞானமான முடிவுகள்',
  },
  Venus: {
    en: 'relationships, art, comfort, and harmony',
    hi: 'संबंध, कला, सुख और सामंजस्य',
    sa: 'सम्बन्धकलासुखसामञ्जस्यं च',
    te: 'సంబంధాలు, కళ, సౌకర్యం మరియు సామరస్యం',
    ta: 'உறவுகள், கலை, வசதி மற்றும் இணக்கம்',
  },
  Saturn: {
    en: 'discipline, structure, and patient work',
    hi: 'अनुशासन, संरचना और धैर्यपूर्ण कर्म',
    sa: 'अनुशासनसंरचनाधैर्यकर्म च',
    te: 'శిక్షణ, నిర్మాణం మరియు సహనపూర్వక పని',
    ta: 'ஒழுக்கம், கட்டமைப்பு மற்றும் பொறுமையான பணி',
  },
};

const DISCLAIMER: LocalizedText = {
  en: 'For cultural reference only — not professional advice.',
  hi: 'केवल सांस्कृतिक संदर्भ — पेशेवर सलाह नहीं।',
  sa: 'सांस्कृतिकसन्दर्भाय — न विशेषज्ञोपदेशः।',
  te: 'సాంస్కృతిక సూచన మాత్రమే — వృత్తిపరమైన సలహా కాదు.',
  ta: 'கலாச்சார குறிப்புக்கு மட்டும் — தொழில்முறை ஆலோசனை அல்ல.',
};

export function getDashaLordTheme(lord: string, language: AppLanguage): string {
  return DASHA_LORD_THEMES[lord]?.[language] ?? lord;
}

export function getTaraDescription(
  taraIndex: number,
  language: AppLanguage,
): string {
  return TARA_DESCRIPTIONS[taraIndex]?.[language] ?? '';
}

export function getYogaDescription(name: string, language: AppLanguage): string {
  return YOGA_DESCRIPTIONS[name]?.[language] ?? DEFAULT_YOGA_DESCRIPTION[language];
}

export function getSadeSatiPhaseDescription(
  phase: 1 | 2 | 3,
  language: AppLanguage,
): string {
  return SADE_SATI_PHASES[phase][language];
}

export function getHoraTheme(planet: string, language: AppLanguage): string {
  return HORA_THEMES[planet]?.[language] ?? planet;
}

export function getHoraPeriodExplanation(
  planet: string,
  language: AppLanguage,
): string {
  const theme = getHoraTheme(planet, language);
  const templates: Record<AppLanguage, string> = {
    en: `The ${planet} hora favors ${theme}. Favor tasks that match this planet’s nature during this window.`,
    hi: `${planet} होरा ${theme} के लिए अनुकूल है। इस समय में इसी ग्रह के अनुरूप कार्य करें।`,
    sa: `${planet}होरा ${theme} अनुकूलति। अस्मिन् काले तद्ग्रहानुकूलकार्यं कुरुत।`,
    te: `${planet} హోర ${theme} కు అనుకూలం. ఈ సమయంలో ఈ గ్రహ స్వభావానికి సరిపడే పనులు చేయండి.`,
    ta: `${planet} ஹோரா ${theme} க்கு சாதகம். இந்த நேரத்தில் இந்த கிரகத்தின் தன்மைக்கு ஏற்ற பணிகளை செய்யுங்கள்.`,
  };
  return templates[language];
}

export function getAbhijitPeriodExplanation(language: AppLanguage): string {
  const templates: Record<AppLanguage, string> = {
    en: 'A brief midday window traditionally used to begin journeys, meetings, or important tasks. Especially favored when your daily Chandra Balam is cautious.',
    hi: 'मध्याह्न का यह संक्षिप्त समय यात्रा, बैठक या महत्वपूर्ण कार्य शुरू करने के लिए शुभ माना जाता है।',
    sa: 'मध्याह्नस्य क्षणः यात्रासभामहत्त्वपूर्णकार्यारम्भाय शुभः मन्यते।',
    te: 'ప్రయాణం, సమావేశం లేదా ముఖ్యమైన పనులు ప్రారంభించడానికి శుభమైన మధ్యాహ్న కాలం.',
    ta: 'பயணம், கூட்டம் அல்லது முக்கியமான பணிகளைத் தொடங்க பாரம்பரியமாக சுபமான மதிய நேரம்.',
  };
  return templates[language];
}

export function getExpandedGuidance(
  chandraQuality: 'strong' | 'weak',
  taraQuality: 'auspicious' | 'inauspicious',
  language: AppLanguage,
): string {
  return `${GUIDANCE[chandraQuality][taraQuality][language]} ${DISCLAIMER[language]}`;
}

export function getChandraBalamContext(
  house: number,
  birthMoonRashi: string,
  todayMoonRashi: string,
  language: AppLanguage,
): string {
  const templates: Record<AppLanguage, string> = {
    en: `Today's Moon is in ${todayMoonRashi}, ${house}th from your birth Moon (${birthMoonRashi}).`,
    hi: `आज का चन्द्र ${todayMoonRashi} में है, आपकी जन्म चन्द्र राशि (${birthMoonRashi}) से ${house}वें स्थान पर।`,
    sa: `अद्य चन्द्रः ${todayMoonRashi}राशौ, जन्मचन्द्रात् (${birthMoonRashi}) ${house}स्थाने।`,
    te: `ఈరోజు చంద్రుడు ${todayMoonRashi}లో, మీ జన్మ చంద్ర (${birthMoonRashi}) నుండి ${house}వ స్థానంలో.`,
    ta: `இன்றைய சந்திரன் ${todayMoonRashi} இல், உங்கள் பிறப்பு சந்திர (${birthMoonRashi}) இலிருந்து ${house}ம் இடத்தில்.`,
  };
  return templates[language];
}

export function getPlanetHouseInsight(
  planet: string,
  house: number,
  houseTheme: string,
  language: AppLanguage,
): string {
  const templates: Record<AppLanguage, string> = {
    en: `${planet} in the ${house}th house — themes of ${houseTheme.toLowerCase()}.`,
    hi: `${house}वें भाव में ${planet} — ${houseTheme} के विषय।`,
    sa: `${house}भावे ${planet} — ${houseTheme}विषयाः।`,
    te: `${house}వ భావంలో ${planet} — ${houseTheme} అంశాలు.`,
    ta: `${house}ம் பாவத்தில் ${planet} — ${houseTheme} தீம்கள்.`,
  };
  return templates[language];
}

const DASHA_LEVEL_MEANINGS: Record<
  'maha' | 'antar' | 'pratyantar',
  LocalizedText
> = {
  maha: {
    en: 'The main life chapter — shapes your overall direction for many years.',
    hi: 'मुख्य जीवन अध्याय — कई वर्षों तक आपकी दिशा तय करता है।',
    sa: 'प्रधानजीवनाध्यायः — बहुवर्षाणि जीवनदिशां निर्धारयति।',
    te: 'ప్రధాన జీవిత అధ్యాయం — అనేక సంవత్సరాలు మీ దిశను నిర్ణయిస్తుంది.',
    ta: 'முக்கிய வாழ்க்கை அத்தியாயம் — பல ஆண்டுகள் உங்கள் திசையை வடிவமைக்கிறது.',
  },
  antar: {
    en: 'The active sub-chapter inside your Mahadasha — what you feel in daily life now.',
    hi: 'महादशा के भीतर सक्रिय उप-अध्याय — जो आप अभी दैनिक जीवन में महसूस करते हैं।',
    sa: 'महादशायाम् सक्रियोपाध्यायः — यदद्य दैनिकजीवने अनुभव्यते।',
    te: 'మహాదశ లోపల సక్రియ ఉప-అధ్యాయం — ప్రస్తుతం రోజువారీ జీవితంలో అనుభవించేది.',
    ta: 'மகாதசைக்குள் செயலில் உள்ள துணை அத்தியாயம் — தற்போது தினசரி வாழ்க்கையில் உணர்வது.',
  },
  pratyantar: {
    en: 'The finest layer — colors your mood and pace over the coming weeks.',
    hi: 'सूक्ष्मतम परत — आने वाले हफ्तों में आपके मन और गति को रंग देती है।',
    sa: 'सूक्ष्मतमस्तरः — आगामिसप्ताहेषु मनोगतिं रञ्जयति।',
    te: 'సూక్ష్మ స్తరం — రాబోయే వారాల్లో మీ మనస్సు మరియు వేగాన్ని రూపొందిస్తుంది.',
    ta: 'நுட்பமான அடுக்கு — வரும் வாரங்களில் உங்கள் மனநிலையையும் வேகத்தையும் வடிவமைக்கிறது.',
  },
};

const DASHA_LORD_EFFECTS: Record<string, LocalizedText> = {
  Sun: {
    en: 'Brings focus to identity, confidence, father figures, authority, and public standing. Career visibility and leadership themes often rise.',
    hi: 'पहचान, आत्मविश्वास, पिता, अधिकार और सार्वजनिक स्थिति पर ध्यान केंद्रित करता है। करियर और नेतृत्व के विषय बढ़ते हैं।',
    sa: 'आत्मपरिचयआत्मविश्वासपितृअधिकारप्रतिष्ठासु ध्यानं केन्द्रीकरोति।',
    te: 'గుర్తింపు, ఆత్మవిశ్వాసం, తండ్రి, అధికారం మరియు ప్రజా స్థితిపై దృష్టి పెట్టిస్తుంది.',
    ta: 'அடையாளம், நம்பிக்கை, தந்தை, அதிகாரம் மற்றும் பொது நிலைமையில் கவனம் செலுத்துகிறது.',
  },
  Moon: {
    en: 'Highlights emotions, home, mother, mind, and inner peace. Life may revolve around family, comfort, and mental well-being.',
    hi: 'भावनाएँ, घर, माता, मन और आंतरिक शांति पर प्रकाश डालता है। परिवार और मानसिक कल्याण केंद्र में आ सकते हैं।',
    sa: 'भावनागृहमातृमनःशान्तिषु प्रकाशं वर्धयति।',
    te: 'భావాలు, ఇల్లు, తల్లి, మనస్సు మరియు అంతర్గత శాంతిపై దృష్టి పెట్టిస్తుంది.',
    ta: 'உணர்வுகள், வீடு, தாய், மனம் மற்றும் உள் அமைதியில் கவனம் அதிகரிக்கிறது.',
  },
  Mars: {
    en: 'Activates courage, competition, property, siblings, and physical energy. Action, conflict resolution, or bold moves may feature.',
    hi: 'साहस, प्रतिस्पर्धा, संपत्ति, भाई-बहन और शारीरिक ऊर्जा सक्रिय करता है। साहसिक कदम और कर्म पर जोर।',
    sa: 'साहसस्पर्धासम्पत्तिभ्रातृशारीरिकोर्जां सक्रियकरोति।',
    te: 'ధైర్యం, పోటీ, ఆస్తి, సోదరులు మరియు శారీరక శక్తిని కదిలిస్తుంది.',
    ta: 'தைரியம், போட்டி, சொத்து, உடன்பிறப்புகள் மற்றும் உடல் சக்தியை செயல்படுத்துகிறது.',
  },
  Mercury: {
    en: 'Emphasizes learning, speech, business, writing, and adaptability. Good for study, trade, networking, and skill-building.',
    hi: 'अध्ययन, वाणी, व्यापार, लेखन और अनुकूलन पर बल देता है। शिक्षा और कौशल विकास के लिए अनुकूल।',
    sa: 'अध्ययनवाणीव्यापारलेखनानुकूलनेषु बलं ददाति।',
    te: 'అభ్యాసం, మాట, వ్యాపారం, రచన మరియు అనుకూలతపై నొక్కి చెబుతుంది.',
    ta: 'கற்றல், பேச்சு, வணிகம், எழுத்து மற்றும் தகவமைப்பில் வலியுறுத்துகிறது.',
  },
  Jupiter: {
    en: 'Expands wisdom, faith, teachers, children, and good fortune. Growth through dharma, guidance, and optimistic opportunities.',
    hi: 'ज्ञान, आस्था, गुरु, संतान और सौभाग्य का विस्तार करता है। धर्म और मार्गदर्शन से विकास।',
    sa: 'ज्ञानश्रद्धागुरुसन्तानभाग्यविस्तारं करोति।',
    te: 'జ్ఞానం, విశ్వాసం, గురువులు, సంతానం మరియు భాగ్యాన్ని విస్తరిస్తుంది.',
    ta: 'ஞானம், நம்பிக்கை, குருக்கள், குழந்தைகள் மற்றும் அதிர்ஷ்டத்தை விரிவுபடுத்துகிறது.',
  },
  Venus: {
    en: 'Focuses on love, marriage, art, comfort, and harmony. Relationships, beauty, and pleasures of life come to the foreground.',
    hi: 'प्रेम, विवाह, कला, सुख और सामंजस्य पर ध्यान। संबंध और सौंदर्य जीवन के केंद्र में।',
    sa: 'प्रेमविवाहकलासुखसामञ्जस्येषु ध्यानं केन्द्रीकरोति।',
    te: 'ప్రేమ, వివాహం, కళ, సౌకర్యం మరియు సామరస్యంపై దృష్టి సారిస్తుంది.',
    ta: 'காதல், திருமணம், கலை, வசதி மற்றும் இணக்கத்தில் கவனம் செலுத்துகிறது.',
  },
  Saturn: {
    en: 'Teaches discipline, patience, responsibility, and karma. Hard work, delays, and long-term foundations are common themes.',
    hi: 'अनुशासन, धैर्य, जिम्मेदारी और कर्म सिखाता है। परिश्रम, विलंब और दीर्घकालिक नींव।',
    sa: 'अनुशासनधैर्योत्तरदायित्वकर्म शिक्षयति।',
    te: 'శిక్షణ, సహనం, బాధ్యత మరియు కర్మ నేర్పుతుంది. కష్టపడి పని చేయడం సాధారణం.',
    ta: 'ஒழுக்கம், பொறுமை, பொறுப்பு மற்றும் கர்மத்தை கற்பிக்கிறது. கடின உழைப்பு பொதுவானது.',
  },
  Rahu: {
    en: 'Drives ambition, unconventional choices, foreign influences, and worldly hunger. Sudden changes or obsessive focus may appear.',
    hi: 'महत्वाकांक्षा, अपरंपरागत विकल्प, विदेशी प्रभाव और भौतिक इच्छा बढ़ाता है। अचानक परिवर्तन संभव।',
    sa: 'महत्त्वाकाङ्क्षामपरम्परागतविकल्पविदेशप्रभावान् वर्धयति।',
    te: 'ఆశలు, అసాంప్రదాయిక ఎంపికలు మరియు భౌతిక కోరికలను పెంచుతుంది.',
    ta: 'ஆசைகள், மரபு வழியற்ற தேர்வுகள் மற்றும் உலக ஆசைகளை ஊக்குவிக்கிறது.',
  },
  Ketu: {
    en: 'Encourages detachment, spirituality, introspection, and letting go. Past karma, solitude, or inner seeking may surface.',
    hi: 'वैराग्य, आध्यात्म, आत्मनिरीक्षण और त्याग को प्रोत्साहित करता है। अतीत के कर्म और आंतरिक खोज।',
    sa: 'वैराग्यआध्यात्मआत्मनिरीक्षणत्यागं प्रोत्साहयति।',
    te: 'విరక్తి, ఆధ్యాత్మికత, ఆత్మపరిశీలన మరియు వదలడాన్ని ప్రోత్సహిస్తుంది.',
    ta: 'விடுபட்ட நிலை, ஆன்மீகம், உள்நோக்கு மற்றும் விட்டுவிடுதலை ஊக்குவிக்கிறது.',
  },
};

const DASHA_LEVEL_INTROS: Record<
  'maha' | 'antar' | 'pratyantar',
  Record<AppLanguage, (lord: string) => string>
> = {
  maha: {
    en: (lord) => `During ${lord} Mahadasha, `,
    hi: (lord) => `${lord} महादशा में, `,
    sa: (lord) => `${lord}महादशायां, `,
    te: (lord) => `${lord} మహాదశలో, `,
    ta: (lord) => `${lord} மகாதசையில், `,
  },
  antar: {
    en: (lord) => `In ${lord} Antardasha right now, `,
    hi: (lord) => `वर्तमान ${lord} अंतर्दशा में, `,
    sa: (lord) => `वर्तमाने ${lord}अन्तर्दशायां, `,
    te: (lord) => `ప్రస్తుత ${lord} అంతర్దశలో, `,
    ta: (lord) => `தற்போதைய ${lord} அந்தர்தசையில், `,
  },
  pratyantar: {
    en: (lord) => `This ${lord} Pratyantar period, `,
    hi: (lord) => `इस ${lord} प्रत्यंतर में, `,
    sa: (lord) => `अस्मिन् ${lord}प्रत्यन्तरे, `,
    te: (lord) => `ఈ ${lord} ప్రత్యంతర కాలంలో, `,
    ta: (lord) => `இந்த ${lord} பிரत्यந்தர் காலத்தில், `,
  },
};

export function getDashaLevelMeaning(
  level: 'maha' | 'antar' | 'pratyantar',
  language: AppLanguage,
): string {
  return DASHA_LEVEL_MEANINGS[level][language];
}

export function getDashaLordEffect(
  level: 'maha' | 'antar' | 'pratyantar',
  lord: string,
  language: AppLanguage,
): string {
  const intro = DASHA_LEVEL_INTROS[level][language](lord);
  const effect = DASHA_LORD_EFFECTS[lord]?.[language] ?? lord;
  if (language === 'en') {
    return `${intro}${effect.charAt(0).toLowerCase()}${effect.slice(1)}`;
  }
  return `${intro}${effect}`;
}

export function getDashaLordChartNote(
  lord: string,
  house: number,
  language: AppLanguage,
): string {
  const templates: Record<AppLanguage, string> = {
    en: `In your birth chart, ${lord} sits in the ${house}th house — so this period especially touches those life areas.`,
    hi: `आपकी कुंडली में ${lord} ${house}वें भाव में है — इसलिए यह काल विशेष रूप से उन क्षेत्रों को छूता है।`,
    sa: `जन्मकुण्डल्यां ${lord} ${house}भावे — अतः एतत्कालः तान्विषयान् विशेषतः स्पृशति।`,
    te: `మీ జన్మ కుండలిలో ${lord} ${house}వ భావంలో ఉంది — ఈ కాలం ఆ జీవిత అంశాలను ప్రత్యేకంగా తాకుతుంది.`,
    ta: `உங்கள் ஜாதகத்தில் ${lord} ${house}ம் பாவத்தில் உள்ளது — எனவே இந்த காலம் அந்த வாழ்க்கைத் துறைகளை குறிப்பாகத் தொடுகிறது.`,
  };
  return templates[language];
}

export function buildDashaPeriodInsight(
  level: 'maha' | 'antar' | 'pratyantar',
  lord: string,
  language: AppLanguage,
  options?: { endDate?: string; chartNote?: string },
): import('../types').DashaPeriodInsight {
  return {
    level,
    lord,
    endDate: options?.endDate,
    levelMeaning: getDashaLevelMeaning(level, language),
    planetEffect: getDashaLordEffect(level, lord, language),
    chartNote: options?.chartNote,
  };
}

const MAHA_DASHA_TITLES: Record<string, LocalizedText> = {
  Sun: {
    en: 'Sun Mahadasha — identity & authority chapter',
    hi: 'सूर्य महादशा — पहचान और अधिकार का अध्याय',
    sa: 'सूर्यमहादशा — आत्मप्रतिष्ठाध्यायः',
    te: 'సూర్య మహాదశ — గుర్తింపు మరియు అధికార అధ్యాయం',
    ta: 'சூரிய மகாதசை — அடையாளம் & அதிகார அத்தியாயம்',
  },
  Moon: {
    en: 'Moon Mahadasha — emotions & home chapter',
    hi: 'चन्द्र महादशा — भावनाएँ और घर का अध्याय',
    sa: 'चन्द्रमहादशा — भावगृहाध्यायः',
    te: 'చంద్ర మహాదశ — భావాలు మరియు ఇల్లు అధ్యాయం',
    ta: 'சந்திர மகாதசை — உணர்வுகள் & வீடு அத்தியாயம்',
  },
  Mars: {
    en: 'Mars Mahadasha — action & courage chapter',
    hi: 'मंगल महादशा — कर्म और साहस का अध्याय',
    sa: 'मङ्गलमहादशा — कर्मसाहसाध्यायः',
    te: 'మంగళ మహాదశ — చర్య మరియు ధైర్య అధ్యాయం',
    ta: 'செவ்வாய் மகாதசை — செயல் & தைரிய அத்தியாயம்',
  },
  Mercury: {
    en: 'Mercury Mahadasha — learning & communication chapter',
    hi: 'बुध महादशा — ज्ञान और संवाद का अध्याय',
    sa: 'बुधमहादशा — विद्यासंवादाध्यायः',
    te: 'బుధ మహాదశ — అభ్యాసం మరియు సంభాషణ అధ్యాయం',
    ta: 'புதன் மகாதசை — கற்றல் & தொடர்பு அத்தியாயம்',
  },
  Jupiter: {
    en: 'Jupiter Mahadasha — growth & wisdom chapter',
    hi: 'गुरु महादशा — विकास और ज्ञान का अध्याय',
    sa: 'गुरुमहादशा — वृद्धिज्ञानाध्यायः',
    te: 'గురు మహాదశ — వృద్ధి మరియు జ్ఞాన అధ్యాయం',
    ta: 'குரு மகாதசை — வளர்ச்சி & ஞான அத்தியாயம்',
  },
  Venus: {
    en: 'Venus Mahadasha — love & comfort chapter',
    hi: 'शुक्र महादशा — प्रेम और सुख का अध्याय',
    sa: 'शुक्रमहादशा — प्रेमसुखाध्यायः',
    te: 'శుక్ర మహాదశ — ప్రేమ మరియు సౌకర్య అధ్యాయం',
    ta: 'சுக்ரன் மகாதசை — காதல் & வசதி அத்தியாயம்',
  },
  Saturn: {
    en: 'Saturn Mahadasha — discipline & karma chapter',
    hi: 'शनि महादशा — अनुशासन और कर्म का अध्याय',
    sa: 'शनिमहादशा — अनुशासनकर्माध्यायः',
    te: 'శని మహాదశ — శిక్షణ మరియు కర్మ అధ్యాయం',
    ta: 'சனி மகாதசை — ஒழுக்கம் & கர்ம அத்தியாயம்',
  },
  Rahu: {
    en: 'Rahu Mahadasha — ambition & change chapter',
    hi: 'राहु महादशा — महत्वाकांक्षा और परिवर्तन का अध्याय',
    sa: 'राहुमहादशा — महत्त्वाकाङ्क्षापरिवर्तनाध्यायः',
    te: 'రాహు మహాదశ — ఆశలు మరియు మార్పు అధ్యాయం',
    ta: 'ராகு மகாதசை — ஆசை & மாற்ற அத்தியாயம்',
  },
  Ketu: {
    en: 'Ketu Mahadasha — spirituality & release chapter',
    hi: 'केतु महादशा — आध्यात्म और मोक्ष का अध्याय',
    sa: 'केतुमहादशा — आध्यात्ममोक्षाध्यायः',
    te: 'కేతు మహాదశ — ఆధ్యాత్మికత మరియు విముక్తి అధ్యాయం',
    ta: 'கேது மகாதசை — ஆன்மீகம் & விடுதலை அத்தியாயம்',
  },
};

const SADE_SATI_MILESTONE: LocalizedText = {
  en: 'Saturn passes near your birth Moon for about 7.5 years — a traditional period of testing, discipline, and inner growth.',
  hi: 'शनि लगभग 7.5 वर्ष तक आपकी जन्म चन्द्र राशि के निकट रहता है — परीक्षा, अनुशासन और आंतरिक विकास का काल।',
  sa: 'शनिः सप्तवर्षाणि जन्मचन्द्रसमीपे — परीक्षानुशासनान्तर्गतविकासकालः।',
  te: 'శని సుమారు 7.5 సంవత్సరాలు మీ జన్మ చంద్ర రాశి సమీపంలో ఉంటుంది — పరీక్ష, శిక్షణ మరియు అంతర్గత వృద్ధి కాలం.',
  ta: 'சனி சுமார் 7.5 ஆண்டுகள் உங்கள் பிறப்பு சந்திர ராசிக்கு அருகில் — சோதனை, ஒழுக்கம் மற்றும் உள் வளர்ச்சி காலம்.',
};

export function getMahaDashaLifeChapterTitle(
  lord: string,
  language: AppLanguage,
): string {
  return MAHA_DASHA_TITLES[lord]?.[language] ?? `${lord} Mahadasha`;
}

export function getSadeSatiMilestoneDescription(language: AppLanguage): string {
  return SADE_SATI_MILESTONE[language];
}
