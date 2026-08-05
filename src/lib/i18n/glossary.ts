import type { AppLanguage } from '../types';
import { getExpandedGuidance } from './jyotish-themes';

export type GlossaryTermId =
  | 'chandraBalam'
  | 'tarabala'
  | 'mahaDasha'
  | 'antarDasha'
  | 'pratyantarDasha'
  | 'sadeSati'
  | 'hora'
  | 'abhijitMuhurta'
  | 'lagna'
  | 'moonRashi'
  | 'nakshatra'
  | 'house1'
  | 'house2'
  | 'house3'
  | 'house4'
  | 'house5'
  | 'house6'
  | 'house7'
  | 'house8'
  | 'house9'
  | 'house10'
  | 'house11'
  | 'house12'
  | 'transit'
  | 'navamsa'
  | 'dignity'
  | 'choghadiya'
  | 'mangalDosha'
  | 'gochara'
  | 'varshaphala'
  | 'kaalSarp'
  | 'pitruDosha'
  | 'rahuKalam'
  | 'ashtakoot'
  | 'nadiDosha'
  | 'bhakootDosha';

const GLOSSARY: Record<GlossaryTermId, Record<AppLanguage, string>> = {
  chandraBalam: {
    en: 'Chandra Balam shows whether today’s Moon sign is traditionally favorable from your birth Moon sign. Shubha supports routine work; Ashubha suggests caution.',
    hi: 'चन्द्र बलम् बताता है कि आज का चन्द्र राशि आपकी जन्म चन्द्र राशि से शुभ है या अशुभ।',
    sa: 'चन्द्रबलं दर्शयति अद्य चन्द्रराशिः जन्मचन्द्रराशेः सापेक्षं शुभा वा अशुभा वा।',
    te: 'చంద్ర బలం ఈరోజు చంద్ర రాశి మీ జన్మ చంద్ర రాశికి శుభమా అశుభమా అని చూపిస్తుంది.',
    ta: 'சந்திர பலம் இன்றைய சந்திர ராசி உங்கள் பிறப்பு சந்திர ராசிக்கு எவ்வாறு உகந்தது என்பதைக் காட்டுகிறது.',
  },
  tarabala: {
    en: 'Tarabala compares today’s nakshatra to your birth nakshatra in a 9-step cycle. Some taras are auspicious, others suggest moving carefully.',
    hi: 'ताराबल आज की नक्षत्र की तुलना आपकी जन्म नक्षत्र से करता है।',
    sa: 'ताराबलम् अद्यनक्षत्रं जन्मनक्षत्रेण सह नवधा चक्रे तुलयति।',
    te: 'తారాబలం ఈరోజు నక్షత్రాన్ని మీ జన్మ నక్షత్రంతో 9-దశల చక్రంలో పోలుస్తుంది.',
    ta: 'தாராபலம் இன்றைய நட்சத்திரத்தை உங்கள் பிறப்பு நட்சத்திரத்துடன் 9-படி சுழற்சியில் ஒப்பிடுகிறது.',
  },
  mahaDasha: {
    en: 'Mahadasha is the main planetary period in the 120-year Vimshottari cycle. It colors long phases of life.',
    hi: 'महादशा विंशोत्तरी चक्र की मुख्य ग्रह अवधि है।',
    sa: 'महादशा विंशोत्तरीचक्रस्य प्रधानग्रहकालः।',
    te: 'మహాదశ వింశోత్తరి చక్రంలోని ప్రధాన గ్రహ కాలం.',
    ta: 'மகாதசை விம்சோத்தரி சுழற்சியின் முக்கிய கிரக காலம்.',
  },
  antarDasha: {
    en: 'Antardasha is the sub-period inside your current Mahadasha — a shorter influence within the main period.',
    hi: 'अंतर्दशा वर्तमान महादशा के भीतर की उप-अवधि है।',
    sa: 'अन्तर्दशा वर्तमानमहादशायाः अन्तर्गत उपकालः।',
    te: 'అంతర్దశ ప్రస్తుత మహాదశ లోపల ఉన్న ఉప-కాలం.',
    ta: 'அந்தர்தசை உங்கள் தற்போதைய மகாதசைக்குள் உள்ள துணைக் காலம்.',
  },
  pratyantarDasha: {
    en: 'Pratyantar dasha is the sub-sub-period inside your Antardasha — the finest layer, often felt over weeks.',
    hi: 'प्रत्यंतर दशा आपकी अंतर्दशा के भीतर की सूक्ष्मतम उप-अवधि है — अक्सर हफ्तों तक महसूस होती है।',
    sa: 'प्रत्यन्तरदशा अन्तर्दशायाः अन्तर्गत सूक्ष्मतमोपकालः — सप्ताहेषु अनुभव्यते।',
    te: 'ప్రత్యంతర దశ మీ అంతర్దశ లోపల సూక్ష్మ ఉప-కాలం — వారాల పాటు అనుభవించబడుతుంది.',
    ta: 'பிரत्यந்தர் தசை உங்கள் அந்தர்தசைக்குள் நுட்பமான துணைக் காலம் — வாரங்களாக உணரப்படும்.',
  },
  sadeSati: {
    en: 'Sade Sati is the ~7.5 year period when transit Saturn passes near your birth Moon sign. Traditions treat it as a time of discipline and testing.',
    hi: 'साढ़े साती वह काल है जब शनि आपकी जन्म चन्द्र राशि के निकट गोचर करता है।',
    sa: 'साढ़ेसाती शनेः गोचरः जन्मचन्द्रराशिसमीपे सप्तवर्षाणि।',
    te: 'సాడే సాతి శని మీ జన్మ చంద్ర రాశి సమీపంలో గోచరించే సుమారు 7.5 సంవత్సరాల కాలం.',
    ta: 'சாடே சாதி சனி உங்கள் பிறப்பு சந்திர ராசிக்கு அருகில் செல்லும் சுமார் 7.5 ஆண்டு காலம்.',
  },
  hora: {
    en: 'Hora divides day and night into planetary hours in Chaldean order (Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars). Each ~1-hour slot is ruled by a planet — favor activities that match that graha.',
    hi: 'होरा दिन और रात को ग्रह क्रम में विभाजित करती है (सूर्य, शुक्र, बुध, चन्द्र, शनि, गुरु, मंगल)। प्रत्येक होरा एक ग्रह की होती है — उसी ग्रह के अनुरूप कार्य करें।',
    sa: 'होरा दिनरात्रौ ग्रहक्रमेण विभज्यते। प्रत्येक होरा ग्रहाधीना — तदनुकूलकार्यं कुरुत।',
    te: 'హోర రోజు మరియు రాత్రిని గ్రహ క్రమంలో విభజిస్తుంది. ప్రతి స్లాట్ ఒక గ్రహానికి చెందినది — ఆ గ్రహానికి అనుగుణ పనులు చేయండి.',
    ta: 'ஹோரா பகல் மற்றும் இரவை கிரக வரிசையில் பிரிக்கிறது. ஒவ்வொரு நேரமும் ஒரு கிரகத்திற்கு உரியது — அந்த கிரகத்திற்கு ஏற்ற செயல்களை செய்யுங்கள்.',
  },
  abhijitMuhurta: {
    en: 'Abhijit Muhurta is the 8th of 15 daytime muhurtas, centered on solar noon. Traditionally auspicious for starting important work. Not observed on Wednesdays.',
    hi: 'अभिजित मुहूर्त 15 दिन मुहूर्तों में 8वाँ है, मध्याह्न के आसपास। महत्वपूर्ण कार्य के लिए शुभ। बुधवार को नहीं माना जाता।',
    sa: 'अभिजित्मुहूर्तः पञ्चदशदिनमुहूर्तेषु अष्टमः, मध्याह्नकेन्द्रितः। महत्त्वपूर्णकार्येभ्यः शुभः। बुधवासरे न।',
    te: 'అభిజిత్ ముహూర్తం 15 పగటి ముహూర్తాలలో 8వది, మధ్యాహ్నం చుట్టూ. ముఖ్యమైన పనులకు శుభం. బుధవారం లేదు.',
    ta: 'அபிஜித் முகூர்த்தம் 15 பகல் முகூர்த்தங்களில் 8வது, மதிய நேரத்தில். முக்கியமான பணிகளுக்கு சுபம். புதன்கிழமை இல்லை.',
  },
  lagna: {
    en: 'Lagna (ascendant) is the rising sign at your exact birth moment. It anchors the 12 houses of your chart.',
    hi: 'लग्न जन्म समय पर उदय होने वाली राशि है। यह कुंडली के 12 भावों का आधार है।',
    sa: 'लग्नं जन्मक्षणे उदयमाना राशिः, द्वादशभावानां आधारः।',
    te: 'లగ్నం మీ జన్మ క్షణంలో ఉదయించే రాశి. ఇది కుండలి 12 భావాలకు ఆధారం.',
    ta: 'லக்னம் உங்கள் பிறந்த தருணத்தில் உதயமாகும் ராசி. இது ஜாதகத்தின் 12 பாவங்களுக்கு அடிப்படை.',
  },
  moonRashi: {
    en: 'Your birth Moon sign (Chandra rashi) reflects mind, emotions, and habits in classical Jyotish.',
    hi: 'जन्म चन्द्र राशि मन और भावनाओं से जुड़ी मानी जाती है।',
    sa: 'जन्मचन्द्रराशिः मनः भावनाश्च।',
    te: 'జన్మ చంద్ర రాశి మనస్సు, భావాలు మరియు అలవాట్లను సూచిస్తుంది.',
    ta: 'பிறப்பு சந்திர ராசி மனம், உணர்வுகள் மற்றும் பழக்கங்களை பிரதிபலிக்கிறது.',
  },
  nakshatra: {
    en: 'Nakshatra is the lunar mansion of the Moon — 27 divisions used for timing and temperament.',
    hi: 'नक्षत्र चंद्रमा की 27 खंडों में से एक है।',
    sa: 'नक्षत्रं चन्द्रस्य सप्तविंशधा विभागः।',
    te: 'నక్షత్రం చంద్రుని 27 విభాగాలలో ఒకటి.',
    ta: 'நட்சத்திரம் சந்திரனின் 27 பிரிவுகளில் ஒன்று.',
  },
  house1: {
    en: '1st house: self, body, personality, and how you meet the world.',
    hi: 'प्रथम भाव: स्वयं, शरीर, व्यक्तित्व।',
    sa: 'प्रथमभावः आत्मा, शरीरं, व्यक्तित्वम्।',
    te: '1వ భావం: స్వయం, శరీరం, వ్యక్తిత్వం.',
    ta: '1ம் பாவம்: தன்மை, உடல், ஆளுமை.',
  },
  house2: {
    en: '2nd house: wealth, speech, family values, and sustenance.',
    hi: 'द्वितीय भाव: धन, वाणी, परिवार।',
    sa: 'द्वितीयभावः धनं, वाणी, कुटुम्बम्।',
    te: '2వ భావం: ధనం, వాణి, కుటుంబం.',
    ta: '2ம் பாவம்: செல்வம், பேச்சு, குடும்பம்.',
  },
  house3: {
    en: '3rd house: courage, siblings, skills, and short journeys.',
    hi: 'तृतीय भाव: साहस, भाई-बहन, कौशल।',
    sa: 'तृतीयभावः साहसं, भ्रातृ, कौशलम्।',
    te: '3వ భావం: ధైర్యం, సోదరులు, నైపుణ్యం.',
    ta: '3ம் பாவம்: தைரியம், உடன்பிறப்புகள், திறன்கள்.',
  },
  house4: {
    en: '4th house: home, mother, inner peace, and property.',
    hi: 'चतुर्थ भाव: घर, माता, सुख।',
    sa: 'चतुर्थभावः गृहं, माता, सुखम्।',
    te: '4వ భావం: ఇల్లు, తల్లి, సుఖం.',
    ta: '4ம் பாவம்: வீடு, தாய், அமைதி.',
  },
  house5: {
    en: '5th house: creativity, children, learning, and devotion.',
    hi: 'पंचम भाव: सृजन, संतान, ज्ञान।',
    sa: 'पञ्चमभावः सन्तानं, विद्या, भक्तिः।',
    te: '5వ భావం: సృజనాత్మకత, సంతానం, విద్య.',
    ta: '5ம் பாவம்: படைப்பாற்றல், குழந்தைகள், கல்வி.',
  },
  house6: {
    en: '6th house: service, health challenges, debts, and daily work.',
    hi: 'षष्ठ भाव: सेवा, स्वास्थ्य, ऋण।',
    sa: 'षष्ठभावः सेवा, रोगः, ऋणम्।',
    te: '6వ భావం: సేవ, ఆరోగ్యం, అప్పులు.',
    ta: '6ம் பாவம்: சேவை, உடல்நலம், கடன்.',
  },
  house7: {
    en: '7th house: marriage, partnerships, and public agreements.',
    hi: 'सप्तम भाव: विवाह, साझेदारी।',
    sa: 'सप्तमभावः विवाहः, साझेदारी।',
    te: '7వ భావం: వివాహం, భాగస్వామ్యం.',
    ta: '7ம் பாவம்: திருமணம், கூட்டாண்மை.',
  },
  house8: {
    en: '8th house: transformation, longevity, inheritance, and mysteries.',
    hi: 'अष्टम भाव: परिवर्तन, आयु, रहस्य।',
    sa: 'अष्टमभावः परिवर्तनं, आयुः, रहस्यम्।',
    te: '8వ భావం: పరివర్తన, ఆయుష్యం, రహస్యాలు.',
    ta: '8ம் பாவம்: மாற்றம், ஆயுள், மர்மங்கள்.',
  },
  house9: {
    en: '9th house: dharma, teachers, fortune, and long journeys.',
    hi: 'नवम भाव: धर्म, गुरु, भाग्य।',
    sa: 'नवमभावः धर्मः, गुरुः, भाग्यम्।',
    te: '9వ భావం: ధర్మం, గురువు, భాగ్యం.',
    ta: '9ம் பாவம்: தர்மம், குரு, பாக்கியம்.',
  },
  house10: {
    en: '10th house: career, reputation, authority, and public life.',
    hi: 'दशम भाव: करियर, प्रतिष्ठा।',
    sa: 'दशमभावः कार्यं, कीर्तिः।',
    te: '10వ భావం: వృత్తి, ప్రతిష్ఠ.',
    ta: '10ம் பாவம்: தொழில், புகழ்.',
  },
  house11: {
    en: '11th house: gains, friends, aspirations, and networks.',
    hi: 'एकादश भाव: लाभ, मित्र, आकांक्षा।',
    sa: 'एकादशभावः लाभः, मित्राणि, आशाः।',
    te: '11వ భావం: లాభం, మిత్రులు, ఆకాంక్షలు.',
    ta: '11ம் பாவம்: லாபம், நண்பர்கள், ஆசைகள்.',
  },
  house12: {
    en: '12th house: spirituality, expenses, solitude, and release.',
    hi: 'द्वादश भाव: आध्यात्म, खर्च, विराम।',
    sa: 'द्वादशभावः आध्यात्मं, व्ययः, मोक्षः।',
    te: '12వ భావం: ఆధ్యాత్మికత, ఖర్చు, విరామం.',
    ta: '12ம் பாவம்: ஆன்மீகம், செலவு, விடுதலை.',
  },
  transit: {
    en: 'A transit (gochara) is where a planet is today compared to your birth chart. Slow planets stay in a sign for months or years.',
    hi: 'गोचर = आज ग्रह की स्थिति बनाम जन्म कुंडली।',
    sa: 'गोचरः अद्यग्रहस्थितिः जन्मकुण्डल्याः सापेक्षम्।',
    te: 'గోచరం = ఈరోజు గ్రహ స్థితి జన్మ కుండలితో పోల్చడం.',
    ta: 'கோசாரம் = இன்று கிரக நிலை பிறப்பு ஜாதகத்துடன் ஒப்பிடுதல்.',
  },
  navamsa: {
    en: 'Navamsa (D9) divides each sign into 9 parts. Used for deeper themes like dharma and relationships.',
    hi: 'नवांश (D9) प्रत्येक राशि को 9 भागों में विभाजित करता है।',
    sa: 'नवांशः नवधाविभाजनम् — धर्मविवाहविषयाः।',
    te: 'నవాంశం (D9) ప్రతి రాశిని 9 భాగాలుగా విభజిస్తుంది.',
    ta: 'நவாம்சம் (D9) ஒவ்வொரு ராசியையும் 9 பாகங்களாகப் பிரிக்கிறது.',
  },
  dignity: {
    en: 'Planetary dignity shows how comfortably a graha expresses in a sign — exalted, own, debilitated, etc.',
    hi: 'ग्रह बल बताता है कि ग्रह राशि में कितनी सहजता से व्यक्त होता है।',
    sa: 'ग्रहबलं राशौ सहजताम् दर्शयति।',
    te: 'గ్రహ బలం రాశిలో సౌకర్యాన్ని సూచిస్తుంది.',
    ta: 'கிரக பலம் ராசியில் வசதியைக் குறிக்கிறது.',
  },
  choghadiya: {
    en: 'Choghadiya divides day and night into 8 slots each, rated auspicious, inauspicious, or neutral. Rotates by weekday.',
    hi: 'चौघड़िया दिन-रात को 8-8 भागों में बाँटती है — शुभ/अशुभ।',
    sa: 'चौघड़िया अष्टभागविभाजनम्।',
    te: 'చోఘడియ రోజు-రాత్రిని 8 భాగాలుగా విభజిస్తుంది.',
    ta: 'சோகடியா பகல்-இரவை 8 பிரிவுகளாகப் பிரிக்கிறது.',
  },
  mangalDosha: {
    en: 'Mangal Dosha flags Mars in houses 1,2,4,7,8,12 from Lagna, Moon, or Venus. Traditionally noted for marriage matching; many cancellations exist.',
    hi: 'मंगल दोष — मंगल लग्न/चन्द्र/शुक्र से विशेष भावों में। विवाह मिलान में देखा जाता है।',
    sa: 'मङ्गलदोषः — विवाहमिलनार्थम्।',
    te: 'మంగళ దోషం — వివాహ పోలికలో చూస్తారు.',
    ta: 'மங்கல தோஷம் — திருமண பொருத்தத்தில் பார்க்கப்படுகிறது.',
  },
  gochara: {
    en: 'Gochara is the Sanskrit term for planetary transits — current sky positions relative to your birth chart.',
    hi: 'गोचर = ग्रहों की वर्तमान स्थिति जन्म कुंडली से तुलना।',
    sa: 'गोचरः ग्रहगतिः जन्मकुण्डल्याः सापेक्षम्।',
    te: 'గోచరం — జన్మ కుండలికి సంబంధించి ప్రస్తుత గ్రహ స్థితులు.',
    ta: 'கோசாரம் — பிறப்பு ஜாதகத்துடன் தொடர்புடைய தற்போதைய கிரக நிலைகள்.',
  },
  varshaphala: {
    en: 'Varshaphala / Tithi Pravesha is the annual chart cast when Sun-Moon separation matches your birth tithi.',
    hi: 'वर्षफल / तिथि प्रवेश — जन्म तिथि से मेल खाता वार्षिक चार्ट।',
    sa: 'वर्षफलम् — तिथिप्रवेशचक्रम्।',
    te: 'వర్షఫలం — జన్మ తిథికి సరిపోయే వార్షిక చార్ట్.',
    ta: 'வர்ஷபலம் — பிறப்பு திதிக்கு பொருந்தும் வார்ஷிக சார்ட்.',
  },
  kaalSarp: {
    en: 'Kaal Sarp Dosha occurs when all seven visible planets lie within 180° of the Rahu–Ketu axis.',
    hi: 'काल सर्प — सात ग्रह राहु-केतु अक्ष के एक ओर।',
    sa: 'कालसर्पदोषः — सप्तग्रहाः एकपार्श्वे।',
    te: 'కాల సర్ప — ఏడు గ్రహాలు రాహు-కేతు అక్షం ఒక వైపు.',
    ta: 'கால சர்ப்பம் — ஏழு கிரகங்கள் ராகு-கேது அச்சின் ஒரு பக்கம்.',
  },
  pitruDosha: {
    en: 'Pitru Dosha flags ancestral-theme indicators like Sun+Rahu or Rahu in the 9th house.',
    hi: 'पितृ दोष — पैतृक विषयों के शास्त्रीय संकेत।',
    sa: 'पितृदोषः — पैतृकसङ्केताः।',
    te: 'పితృ దోషం — పూర్వీక విషయ సంకేతాలు.',
    ta: 'பித்ரு தோஷம் — மூதாதையர் தீம் குறிகாட்டிகள்.',
  },
  rahuKalam: {
    en: 'Rahu Kalam is a daily inauspicious window — the 8th of 8 day-segments from sunrise, rotating by weekday.',
    hi: 'राहु काल — दिन का 8वाँ अशुभ खंड, वार के अनुसार बदलता है।',
    sa: 'राहुकालः — अष्टमदिवसखण्डः।',
    te: 'రాహు కాలం — రోజు 8వ అశుభ విండో.',
    ta: 'ராகு காலம் — பகலின் 8வது அசுப நேரம்.',
  },
  ashtakoot: {
    en: 'Ashtakoot (Gun Milan) scores eight gunas from Moon rashi and nakshatra — max 36 points in North Indian matching.',
    hi: 'अष्टकूट — आठ गुण, अधिकतम 36 अंक।',
    sa: 'अष्टकूटम् — अष्टगुणाः, 36 अङ्काः।',
    te: 'అష్టకూట్ — ఎనిమిది గుణాలు, 36 పాయింట్లు.',
    ta: 'அஷ்டகூட் — எட்டு குணங்கள், 36 புள்ளிகள்.',
  },
  nadiDosha: {
    en: 'Nadi dosha occurs when both charts share the same nakshatra nadi (Adi/Madhya/Antya) — traditionally reviewed in matching.',
    hi: 'नाड़ी दोष — समान नाड़ी।',
    sa: 'नाडीदोषः — समाननाडी।',
    te: 'నాడి దోషం — ఒకే నాడి.',
    ta: 'நாடி தோஷம் — ஒரே நாடி.',
  },
  bhakootDosha: {
    en: 'Bhakoot dosha flags unfavorable Moon sign distances (e.g. 2/12, 5/9, 6/8) between charts.',
    hi: 'भकूट दोष — चन्द्र राशि दूरी।',
    sa: 'भकूटदोषः — चन्द्रराशिदूरता।',
    te: 'భకూట్ దోషం — చంద్ర రాశి దూరం.',
    ta: 'பகூட் தோஷம் — சந்திர ராசி தூரம்.',
  },
};

export function getGlossaryTerm(
  id: GlossaryTermId,
  language: AppLanguage,
): string {
  return GLOSSARY[id][language];
}

export function getGuidanceForToday(
  chandraQuality: 'strong' | 'weak',
  taraQuality: 'auspicious' | 'inauspicious',
  _taraEnglishName: string,
  language: AppLanguage,
): string {
  return getExpandedGuidance(chandraQuality, taraQuality, language);
}
