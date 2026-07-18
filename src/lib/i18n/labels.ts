import type { AppLanguage } from '../types';

type LabelKey =
  | 'appTitle'
  | 'dailyMoon'
  | 'tithi'
  | 'paksha'
  | 'maasa'
  | 'samvatsara'
  | 'sunrise'
  | 'location'
  | 'settings'
  | 'backToToday'
  | 'language'
  | 'city'
  | 'useGps'
  | 'gpsLoading'
  | 'masaSystem'
  | 'amanta'
  | 'purnimanta'
  | 'adhika'
  | 'loading'
  | 'error'
  | 'retry'
  | 'settingsSubtitle'
  | 'calendarPrefs'
  | 'tabToday'
  | 'tabJyotish'
  | 'jyotishTitle'
  | 'forYouToday'
  | 'birthChart'
  | 'birthProfile'
  | 'birthDate'
  | 'birthTime'
  | 'timeUnknown'
  | 'birthPlace'
  | 'saveProfile'
  | 'editBirthDetails'
  | 'addBirthProfile'
  | 'jyotishEmpty'
  | 'jyotishTeaser'
  | 'disclaimer'
  | 'loadingJyotish'
  | 'addTimeForChart'
  | 'clearProfile'
  | 'sunset'
  | 'moonrise'
  | 'moonset'
  | 'vara'
  | 'nakshatra'
  | 'tithiUntil'
  | 'timings'
  | 'festivals'
  | 'notToday'
  | 'shakaSamvat'
  | 'forYouTodaySubtitle'
  | 'todayMoon'
  | 'birthMoon'
  | 'currentHora'
  | 'abhijitMuhurta'
  | 'abhijitHint'
  | 'lifeDirection'
  | 'lifeDirectionSubtitle'
  | 'dashaTimeline'
  | 'antarDashaUntil'
  | 'pratyantarUntil'
  | 'sadeSatiUntil'
  | 'sadeSatiNext'
  | 'chartYogas'
  | 'planetThemes'
  | 'yourDashaPeriods'
  | 'dashaLayersIntro'
  | 'dashaLevelMaha'
  | 'dashaLevelAntar'
  | 'dashaLevelPratyantar'
  | 'until'
  | 'lifeMilestones'
  | 'lifeMilestonesIntro'
  | 'lifeMilestoneCurrent'
  | 'dashaTimelineIntro'
  | 'dailyReading'
  | 'favorToday'
  | 'pauseToday';

const LABELS: Record<LabelKey, Record<AppLanguage, string>> = {
  appTitle: {
    en: 'Chandra Darshan',
    hi: 'चन्द्र दर्शन',
    sa: 'चन्द्रदर्शनम्',
    te: 'చంద్ర దర్శన్',
    ta: 'சந்திர தரிசனம்',
  },
  dailyMoon: {
    en: 'Daily lunar calendar',
    hi: 'दैनिक चन्द्र पंचांग',
    sa: 'दैनिकचन्द्रपञ्चाङ्गम्',
    te: 'దైనిక చంద్ర పంచాంగం',
    ta: 'தினசரி சந்திர பஞ்சாங்கம்',
  },
  tithi: {
    en: 'Tithi',
    hi: 'तिथि',
    sa: 'तिथिः',
    te: 'తిథి',
    ta: 'திதி',
  },
  paksha: {
    en: 'Paksha',
    hi: 'पक्ष',
    sa: 'पक्षः',
    te: 'పక్షం',
    ta: 'பக்ஷம்',
  },
  maasa: {
    en: 'Maasa',
    hi: 'मास',
    sa: 'मासः',
    te: 'మాసం',
    ta: 'மாதம்',
  },
  samvatsara: {
    en: 'Samvatsara',
    hi: 'संवत्सर',
    sa: 'संवत्सरः',
    te: 'సంవత్సరం',
    ta: 'சம்வத்ஸரம்',
  },
  sunrise: {
    en: 'Sunrise',
    hi: 'सूर्योदय',
    sa: 'सूर्योदयः',
    te: 'సూర్యోదయం',
    ta: 'சூரிய உதயம்',
  },
  location: {
    en: 'Location',
    hi: 'स्थान',
    sa: 'स्थानम्',
    te: 'స్థానం',
    ta: 'இடம்',
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    sa: 'विन्यासः',
    te: 'అమరికలు',
    ta: 'அமைப்புகள்',
  },
  backToToday: {
    en: 'Back to today',
    hi: 'आज पर वापस',
    sa: 'अद्य प्रति',
    te: 'ఈరోజుకి తిరిగి',
    ta: 'இன்றுக்குத் திரும்பு',
  },
  language: {
    en: 'Language',
    hi: 'भाषा',
    sa: 'भाषा',
    te: 'భాష',
    ta: 'மொழி',
  },
  city: {
    en: 'City',
    hi: 'शहर',
    sa: 'नगरम्',
    te: 'నగరం',
    ta: 'நகரம்',
  },
  useGps: {
    en: 'Use current location',
    hi: 'वर्तमान स्थान का उपयोग करें',
    sa: 'वर्तमानस्थानं प्रयुज्यताम्',
    te: 'ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
    ta: 'தற்போதைய இடத்தைப் பயன்படுத்து',
  },
  gpsLoading: {
    en: 'Getting location…',
    hi: 'स्थान प्राप्त हो रहा है…',
    sa: 'स्थानं प्राप्यते…',
    te: 'స్థానం పొందుతోంది…',
    ta: 'இடம் பெறப்படுகிறது…',
  },
  masaSystem: {
    en: 'Lunar month system',
    hi: 'चंद्र मास प्रणाली',
    sa: 'चन्द्रमासप्रणाली',
    te: 'చంద్ర మాస వ్యవస్థ',
    ta: 'சந்திர மாத முறை',
  },
  amanta: {
    en: 'Amanta (South Indian)',
    hi: 'अमान्त (दक्षिण भारतीय)',
    sa: 'अमान्तः',
    te: 'అమాంత (దక్షిణ భారతీయ)',
    ta: 'அமாந்த (தென்னிந்திய)',
  },
  purnimanta: {
    en: 'Purnimanta (North Indian)',
    hi: 'पूर्णिमान्त (उत्तर भारतीय)',
    sa: 'पूर्णिमान्तः',
    te: 'పూర్ణిమాంత (ఉత్తర భారతీయ)',
    ta: 'பூர்ணிமாந்த (வடஇந்திய)',
  },
  adhika: {
    en: 'Adhika',
    hi: 'अधिक',
    sa: 'अधिकः',
    te: 'అధిక',
    ta: 'அதிக',
  },
  loading: {
    en: 'Loading panchang…',
    hi: 'पंचांग लोड हो रहा है…',
    sa: 'पञ्चाङ्गं लोड्यते…',
    te: 'పంచాంగం లోడ్ అవుతోంది…',
    ta: 'பஞ்சாங்கம் ஏற்றப்படுகிறது…',
  },
  error: {
    en: 'Could not load panchang',
    hi: 'पंचांग लोड नहीं हो सका',
    sa: 'पञ्चाङ्गं लोड् न शक्यते',
    te: 'పంచాంగం లోడ్ కాలేదు',
    ta: 'பஞ்சாங்கம் ஏற்ற முடியவில்லை',
  },
  retry: {
    en: 'Try again',
    hi: 'पुनः प्रयास करें',
    sa: 'पुनः प्रयतताम्',
    te: 'మళ్లీ ప్రయత్నించండి',
    ta: 'மீண்டும் முயற்சி',
  },
  settingsSubtitle: {
    en: 'Language, location, and calendar preferences.',
    hi: 'भाषा, स्थान और कैलेंडर प्राथमिकताएँ।',
    sa: 'भाषा, स्थानं, पञ्चाङ्गविन्यासश्च।',
    te: 'భాష, స్థానం మరియు క్యాలెండర్ అభిరుచులు.',
    ta: 'மொழி, இடம் மற்றும் காலண்டர் விருப்பங்கள்.',
  },
  calendarPrefs: {
    en: 'Calendar preferences',
    hi: 'कैलेंडर प्राथमिकताएँ',
    sa: 'पञ्चाङ्गविन्यासः',
    te: 'క్యాలెండర్ అభిరుచులు',
    ta: 'காலண்டர் விருப்பங்கள்',
  },
  tabToday: {
    en: 'Today',
    hi: 'आज',
    sa: 'अद्य',
    te: 'ఈరోజు',
    ta: 'இன்று',
  },
  tabJyotish: {
    en: 'Jyotish',
    hi: 'ज्योतिष',
    sa: 'ज्योतिषम्',
    te: 'జ్యోతిషం',
    ta: 'ஜோதிடம்',
  },
  jyotishTitle: {
    en: 'Personal Jyotish',
    hi: 'व्यक्तिगत ज्योतिष',
    sa: 'व्यक्तिगतज्योतिषम्',
    te: 'వ్యక్తిగత జ్యోతిషం',
    ta: 'தனிப்பட்ட ஜோதிடம்',
  },
  forYouToday: {
    en: 'For you today',
    hi: 'आपके लिए आज',
    sa: 'अद्य भवतः कृते',
    te: 'మీ కోసం ఈరోజు',
    ta: 'உங்களுக்கு இன்று',
  },
  birthChart: {
    en: 'Your birth chart',
    hi: 'आपकी जन्म कुंडली',
    sa: 'जन्मकुण्डली',
    te: 'మీ జన్మ కుండలి',
    ta: 'உங்கள் ஜாதகம்',
  },
  birthProfile: {
    en: 'Birth profile',
    hi: 'जन्म विवरण',
    sa: 'जन्मविवरणम्',
    te: 'జన్మ వివరాలు',
    ta: 'பிறப்பு விவரங்கள்',
  },
  birthDate: {
    en: 'Date of birth',
    hi: 'जन्म तिथि',
    sa: 'जन्मतिथिः',
    te: 'జన్మ తేదీ',
    ta: 'பிறந்த தேதி',
  },
  birthTime: {
    en: 'Time of birth',
    hi: 'जन्म समय',
    sa: 'जन्मसमयः',
    te: 'జన్మ సమయం',
    ta: 'பிறந்த நேரம்',
  },
  timeUnknown: {
    en: "I don't know the exact time",
    hi: 'सटीक समय नहीं पता',
    sa: 'समयं न जानामि',
    te: 'ఖచ్చితమైన సమయం తెలియదు',
    ta: 'சரியான நேரம் தெரியவில்லை',
  },
  birthPlace: {
    en: 'Place of birth',
    hi: 'जन्म स्थान',
    sa: 'जन्मस्थानम्',
    te: 'జన్మ స్థలం',
    ta: 'பிறந்த இடம்',
  },
  saveProfile: {
    en: 'Save birth details',
    hi: 'जन्म विवरण सहेजें',
    sa: 'जन्मविवरणं रक्षतु',
    te: 'జన్మ వివరాలు సేవ్ చేయండి',
    ta: 'பிறப்பு விவரங்களைச் சேமி',
  },
  editBirthDetails: {
    en: 'Edit birth details',
    hi: 'जन्म विवरण संपादित करें',
    sa: 'जन्मविवरणं सम्पादयतु',
    te: 'జన్మ వివరాలు సవరించండి',
    ta: 'பிறப்பு விவரங்களைத் திருத்து',
  },
  addBirthProfile: {
    en: 'Add your birth details',
    hi: 'अपना जन्म विवरण जोड़ें',
    sa: 'जन्मविवरणं योजयतु',
    te: 'మీ జన్మ వివరాలు జోడించండి',
    ta: 'உங்கள் பிறப்பு விவரங்களைச் சேர்',
  },
  jyotishEmpty: {
    en: 'Enter your birth details to see how today’s sky relates to you.',
    hi: 'आज का आकाश आप पर कैसे प्रभाव डालता है, यह देखने के लिए जन्म विवरण दर्ज करें।',
    sa: 'अद्याकाशस्य प्रभावं द्रष्टुं जन्मविवरणं ददातु।',
    te: 'ఈరోజు ఆకాశం మీపై ఎలా ప్రభావం చూపుతుందో చూడటానికి జన్మ వివరాలు నమోదు చేయండి.',
    ta: 'இன்றைய வானம் உங்களை எப்படி பாதிக்கிறது என்பதைப் பார்க்க பிறப்பு விவரங்களை உள்ளிடவும்.',
  },
  jyotishTeaser: {
    en: 'See how today affects you',
    hi: 'देखें आज आप पर क्या प्रभाव है',
    sa: 'अद्य भवतः प्रति प्रभावं पश्यतु',
    te: 'ఈరోజు మీపై ప్రభావం చూడండి',
    ta: 'இன்று உங்களை எப்படி பாதிக்கிறது பாருங்கள்',
  },
  disclaimer: {
    en: 'For cultural and astrological reference only. Not professional advice.',
    hi: 'केवल सांस्कृतिक संदर्भ — पेशेवर सलाह नहीं।',
    sa: 'सांस्कृतिकसन्दर्भाय — न विशेषज्ञोपदेशः।',
    te: 'సాంస్కృతిక సూచన మాత్రమే — వృత్తిపరమైన సలహా కాదు.',
    ta: 'கலாச்சார குறிப்புக்கு மட்டும் — தொழில்முறை ஆலோசனை அல்ல.',
  },
  loadingJyotish: {
    en: 'Loading personal insights…',
    hi: 'व्यक्तिगत जानकारी लोड हो रही है…',
    sa: 'व्यक्तिगतज्ञानं लोड्यते…',
    te: 'వ్యక్తిగత సమాచారం లోడ్ అవుతోంది…',
    ta: 'தனிப்பட்ட தகவல் ஏற்றப்படுகிறது…',
  },
  addTimeForChart: {
    en: 'Add your birth time to see lagna and the 12 houses.',
    hi: 'लग्न और 12 भाव देखने के लिए जन्म समय जोड़ें।',
    sa: 'लग्नं द्वादशभावान् च द्रष्टुं जन्मसमयं ददातु।',
    te: 'లగ్నం మరియు 12 భావాలు చూడటానికి జన్మ సమయం జోడించండి.',
    ta: 'லக்னம் மற்றும் 12 பாவங்களைப் பார்க்க பிறந்த நேரத்தைச் சேர்க்கவும்.',
  },
  clearProfile: {
    en: 'Clear birth profile',
    hi: 'जन्म विवरण हटाएं',
    sa: 'जन्मविवरणं अपाकरोतु',
    te: 'జన్మ వివరాలు తొలగించండి',
    ta: 'பிறப்பு விவரங்களை நீக்கு',
  },
  sunset: {
    en: 'Sunset',
    hi: 'सूर्यास्त',
    sa: 'सूर्यास्तः',
    te: 'సూర్యాస్తమయం',
    ta: 'சூரிய அஸ்தமனம்',
  },
  moonrise: {
    en: 'Moonrise',
    hi: 'चन्द्रोदय',
    sa: 'चन्द्रोदयः',
    te: 'చంద్రోదయం',
    ta: 'சந்திர உதயம்',
  },
  moonset: {
    en: 'Moonset',
    hi: 'चन्द्रास्त',
    sa: 'चन्द्रास्तः',
    te: 'చంద్రాస్తమయం',
    ta: 'சந்திர அஸ்தமனம்',
  },
  vara: {
    en: 'Vara (weekday)',
    hi: 'वार',
    sa: 'वारः',
    te: 'వారం',
    ta: 'வாரம்',
  },
  nakshatra: {
    en: 'Nakshatra',
    hi: 'नक्षत्र',
    sa: 'नक्षत्रम्',
    te: 'నక్షత్రం',
    ta: 'நட்சத்திரம்',
  },
  tithiUntil: {
    en: 'Tithi until',
    hi: 'तिथि समाप्त',
    sa: 'तिथिः यावत्',
    te: 'తిథి వరకు',
    ta: 'திதி முடியும் நேரம்',
  },
  timings: {
    en: "Today's timings",
    hi: 'आज का समय',
    sa: 'अद्यकालाः',
    te: 'ఈరోజు సమయాలు',
    ta: 'இன்றைய நேரங்கள்',
  },
  festivals: {
    en: 'Festivals today',
    hi: 'आज के त्योहार',
    sa: 'अद्योत्सवाः',
    te: 'ఈరోజు పండుగలు',
    ta: 'இன்றைய விழாக்கள்',
  },
  notToday: {
    en: 'Not today',
    hi: 'आज नहीं',
    sa: 'अद्य नास्ति',
    te: 'ఈరోజు లేదు',
    ta: 'இன்று இல்லை',
  },
  shakaSamvat: {
    en: 'Shaka Samvat',
    hi: 'शक संवत',
    sa: 'शकसंवत्',
    te: 'శక సంవత్సరం',
    ta: 'சக சம்வத்ஸரம்',
  },
  forYouTodaySubtitle: {
    en: 'How today’s sky relates to your birth Moon and nakshatra.',
    hi: 'आज का आकाश आपकी जन्म चन्द्र राशि और नक्षत्र से कैसे जुड़ा है।',
    sa: 'अद्याकाशं जन्मचन्द्रनक्षत्राभ्यां कथं सम्बद्धम्।',
    te: 'ఈరోజు ఆకాశం మీ జన్మ చంద్ర రాశి మరియు నక్షత్రంతో ఎలా సంబంధం కలిగి ఉంది.',
    ta: 'இன்றைய வானம் உங்கள் பிறப்பு சந்திர ராசி மற்றும் நட்சத்திரத்துடன் எவ்வாறு தொடர்புடையது.',
  },
  todayMoon: {
    en: 'Today’s Moon',
    hi: 'आज का चन्द्र',
    sa: 'अद्यचन्द्रः',
    te: 'ఈరోజు చంద్రుడు',
    ta: 'இன்றைய சந்திரன்',
  },
  birthMoon: {
    en: 'Your birth Moon',
    hi: 'आपकी जन्म चन्द्र राशि',
    sa: 'जन्मचन्द्रः',
    te: 'మీ జన్మ చంద్రుడు',
    ta: 'உங்கள் பிறப்பு சந்திரன்',
  },
  currentHora: {
    en: 'Current Hora',
    hi: 'वर्तमान होरा',
    sa: 'वर्तमानहोरा',
    te: 'ప్రస్తుత హోర',
    ta: 'தற்போதைய ஹோரா',
  },
  abhijitMuhurta: {
    en: 'Abhijit Muhurta',
    hi: 'अभिजित मुहूर्त',
    sa: 'अभिजित्मुहूर्तः',
    te: 'అభిజిత్ ముహూర్తం',
    ta: 'அபிஜித் முகூர்த்தம்',
  },
  abhijitHint: {
    en: 'A traditionally auspicious midday window for important work.',
    hi: 'महत्वपूर्ण कार्य के लिए शुभ मध्याह्न समय।',
    sa: 'महत्त्वपूर्णकार्याय शुभमध्याह्नसमयः।',
    te: 'ముఖ్యమైన పనులకు శుభ మధ్యాహ్న సమయం.',
    ta: 'முக்கியமான பணிகளுக்கு சுப மதிய நேரம்.',
  },
  lifeDirection: {
    en: 'Life direction',
    hi: 'जीवन दिशा',
    sa: 'जीवनदिशा',
    te: 'జీవిత దిశ',
    ta: 'வாழ்க்கை திசை',
  },
  lifeDirectionSubtitle: {
    en: 'Long-term themes from your dasha cycles and birth chart.',
    hi: 'आपकी दशा और जन्म कुंडली से दीर्घकालिक विषय।',
    sa: 'दशाजन्मकुण्डल्योर्दीर्घकालिकविषयाः।',
    te: 'మీ దశ చక్రాలు మరియు జన్మ కుండలి నుండి దీర్ఘకాలిక అంశాలు.',
    ta: 'உங்கள் தசை சுழற்சிகள் மற்றும் ஜாதகத்திலிருந்து நீண்டகால தீம்கள்.',
  },
  dashaTimeline: {
    en: 'Dasha timeline',
    hi: 'दशा समयरेखा',
    sa: 'दशाकालरेखा',
    te: 'దశ కాలరేఖ',
    ta: 'தசை காலவரிசை',
  },
  antarDashaUntil: {
    en: 'Antardasha until',
    hi: 'अंतर्दशा तक',
    sa: 'अन्तर्दशायावत्',
    te: 'అంతర్దశ వరకు',
    ta: 'அந்தர்தசை வரை',
  },
  pratyantarUntil: {
    en: 'Pratyantar until',
    hi: 'प्रत्यंतर तक',
    sa: 'प्रत्यन्तरयावत्',
    te: 'ప్రత్యంతర వరకు',
    ta: 'பிரत्यந்தர் வரை',
  },
  sadeSatiUntil: {
    en: 'Current arc until',
    hi: 'वर्तमान चक्र समाप्त',
    sa: 'वर्तमानचक्रसमाप्तिः',
    te: 'ప్రస్తుత చక్రం ముగిసేది',
    ta: 'தற்போதைய சுழற்சி முடிவு',
  },
  sadeSatiNext: {
    en: 'Next Sade Sati begins',
    hi: 'अगली साढ़े साती शुरू',
    sa: 'अग्रिमसाढ़ेसातीआरम्भः',
    te: 'తదుపరి సాడే సాతి ప్రారంభం',
    ta: 'அடுத்த சாடே சாதி தொடக்கம்',
  },
  chartYogas: {
    en: 'Strengths in your chart',
    hi: 'आपकी कुंडली के योग',
    sa: 'जन्मकुण्डल्याः योगाः',
    te: 'మీ కుండలిలోని యోగాలు',
    ta: 'உங்கள் ஜாதகத்தின் யோகங்கள்',
  },
  planetThemes: {
    en: 'Planet themes',
    hi: 'ग्रह विषय',
    sa: 'ग्रहविषयाः',
    te: 'గ్రహ అంశాలు',
    ta: 'கிரக தீம்கள்',
  },
  yourDashaPeriods: {
    en: 'Your dasha periods',
    hi: 'आपकी दशा अवधि',
    sa: 'भवतः दशाकालाः',
    te: 'మీ దశ కాలాలు',
    ta: 'உங்கள் தசை காலங்கள்',
  },
  dashaLayersIntro: {
    en: 'Dasha works in three layers: Mahadasha sets the long chapter, Antardasha is what you feel now, and Pratyantar colors the coming weeks.',
    hi: 'दशा तीन परतों में काम करती है: महादशा लंबा अध्याय, अंतर्दशा वर्तमान अनुभव, प्रत्यंतर आने वाले हफ्तों की लय।',
    sa: 'दशा त्रिस्तरेषु कार्यति: महादशा दीर्घाध्यायः, अन्तर्दशा वर्तमानानुभवः, प्रत्यन्तर आगामिसप्ताहलयः।',
    te: 'దశ మూడు స్తరాలలో పనిచేస్తుంది: మహాదశ దీర్ఘ అధ్యాయం, అంతర్దశ ప్రస్తుత అనుభవం, ప్రత్యంతర రాబోయే వారాల స్వరం.',
    ta: 'தசை மூன்று அடுக்குகளில் செயல்படுகிறது: மகாதசை நீண்ட அத்தியாயம், அந்தர்தசை தற்போதைய அனுபவம், பிரत्यந்தர் வரும் வாரங்களின் நயம்.',
  },
  dashaLevelMaha: {
    en: 'Mahadasha',
    hi: 'महादशा',
    sa: 'महादशा',
    te: 'మహాదశ',
    ta: 'மகாதசை',
  },
  dashaLevelAntar: {
    en: 'Antardasha',
    hi: 'अंतर्दशा',
    sa: 'अन्तर्दशा',
    te: 'అంతర్దశ',
    ta: 'அந்தர்தசை',
  },
  dashaLevelPratyantar: {
    en: 'Pratyantar',
    hi: 'प्रत्यंतर',
    sa: 'प्रत्यन्तर',
    te: 'ప్రత్యంతర',
    ta: 'பிரत्यந்தர்',
  },
  until: {
    en: 'until',
    hi: 'तक',
    sa: 'यावत्',
    te: 'వరకు',
    ta: 'வரை',
  },
  lifeMilestones: {
    en: 'Major life phases',
    hi: 'प्रमुख जीवन अवधि',
    sa: 'प्रमुखजीवनावधयः',
    te: 'ప్రధాన జీవిత దశలు',
    ta: 'முக்கிய வாழ்க்கை கட்டங்கள்',
  },
  lifeMilestonesIntro: {
    en: 'Key Mahadasha chapters and Sade Sati periods across your life, with ages and dates.',
    hi: 'आपके जीवन की प्रमुख महादशा और साढ़े साती अवधि, आयु और तिथियों सहित।',
    sa: 'जीवनस्य प्रमुखमहादशासाढ़ेसातीकालाः वयोतिथिभिः सह।',
    te: 'మీ జీవితంలోని ముఖ్య మహాదశ అధ్యాయాలు మరియు సాడే సాతి కాలాలు, వయస్సు మరియు తేదీలతో.',
    ta: 'உங்கள் வாழ்க்கையின் முக்கிய மகாதசை அத்தியாயங்கள் மற்றும் சாடே சாதி காலங்கள், வயது மற்றும் தேதிகளுடன்.',
  },
  lifeMilestoneCurrent: {
    en: 'You are here',
    hi: 'आप यहाँ हैं',
    sa: 'अत्र वर्तमानः',
    te: 'మీరు ఇక్కడ ఉన్నారు',
    ta: 'நீங்கள் இங்கே',
  },
  dashaTimelineIntro: {
    en: 'The full 120-year Vimshottari cycle — nine planetary chapters from birth.',
    hi: 'पूर्ण 120 वर्ष विंशोत्तरी चक्र — जन्म से नौ ग्रह अध्याय।',
    sa: 'पूर्णशतविंशतिवर्षविंशोत्तरिचक्रम् — जन्मतः नवग्रहाध्यायाः।',
    te: 'పూర్తి 120-సంవత్సర వింశోత్తరి చక్రం — జన్మం నుండి తొమ్మిది గ్రహ అధ్యాయాలు.',
    ta: 'முழு 120 ஆண்டு விம்சோத்தரி சுழற்சி — பிறப்பிலிருந்து ஒன்பது கிரக அத்தியாயங்கள்.',
  },
  dailyReading: {
    en: "Today's reading",
    hi: 'आज का संदेश',
    sa: 'अद्यवाचनम्',
    te: 'ఈరోజు సందేశం',
    ta: 'இன்றைய வாசிப்பு',
  },
  favorToday: {
    en: 'Favor today',
    hi: 'आज के लिए अनुकूल',
    sa: 'अद्यानुकूलम्',
    te: 'ఈరోజు అనుకూలం',
    ta: 'இன்று சாதகம்',
  },
  pauseToday: {
    en: 'Pause or avoid',
    hi: 'रोकें या बचें',
    sa: 'विरामं वा परिहरतु',
    te: 'ఆగండి లేదా నివారించండి',
    ta: 'நிறுத்து அல்லது தவிர்',
  },
};

export function t(key: LabelKey, language: AppLanguage): string {
  return LABELS[key][language];
}

export type { LabelKey };
