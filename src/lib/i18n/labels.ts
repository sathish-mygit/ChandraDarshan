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
  | 'locationApproxHint'
  | 'masaSystem'
  | 'masaSystemAuto'
  | 'masaSystemAutoUsing'
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
  | 'tabMatch'
  | 'tabSettings'
  | 'jyotishTitle'
  | 'forYouToday'
  | 'birthChart'
  | 'birthProfile'
  | 'birthDate'
  | 'birthTime'
  | 'timeUnknown'
  | 'timeNotSpecified'
  | 'addBirthTime'
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
  | 'tithiTimings'
  | 'previousTithiEnded'
  | 'currentTithi'
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
  | 'pauseToday'
  | 'userName'
  | 'greeting'
  | 'greetingPrefix'
  | 'dailyReminder'
  | 'dailyReminderDescription'
  | 'dailyReminderTime'
  | 'dailyReminderNeedsProfile'
  | 'dailyReminderPermissionDenied'
  | 'dailyReminderEnabled'
  | 'dailyReminderDisabled'
  | 'dailyReminderNotifTitle'
  | 'dailyReminderNotifBody'
  | 'moonPhaseWaxing'
  | 'moonPhaseWaning'
  | 'jyotishTabToday'
  | 'jyotishTabChart'
  | 'jyotishTabTimeline'
  | 'jyotishTabLearn'
  | 'explainedInsights'
  | 'transitInsights'
  | 'skyWindows'
  | 'currentChoghadiya'
  | 'nextChoghadiya'
  | 'rahuKalam'
  | 'weeklyTone'
  | 'chartDepthLocked'
  | 'chartDepthLockedHint'
  | 'navamsaSummary'
  | 'planetDignities'
  | 'chartDoshas'
  | 'annualOutlook'
  | 'annualOutlookSubtitle'
  | 'learnGlossary'
  | 'learnArticles'
  | 'searchGlossary'
  | 'yogaReasons'
  | 'yogaEffect'
  | 'yogaTechnical'
  | 'showDetails'
  | 'matchTitle'
  | 'matchSubtitle'
  | 'matchEmptySelf'
  | 'matchEmptyPartner'
  | 'partnerProfile'
  | 'partnerName'
  | 'savePartnerProfile'
  | 'clearPartnerProfile'
  | 'editPartnerDetails'
  | 'matchScoreTitle'
  | 'matchGunaBreakdown'
  | 'matchMangalPairing'
  | 'matchSynastry'
  | 'matchSynastryLocked'
  | 'matchNadiDosha'
  | 'matchBhakootDosha'
  | 'matchSelfMoon'
  | 'matchPartnerMoon'
  | 'matchConventionNote';

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
  locationApproxHint: {
    en: 'Detected automatically (approximate)',
    hi: 'स्वचालित रूप से पता लगाया गया (अनुमानित)',
    sa: 'स्वयं ज्ञातम् (सामान्यम्)',
    te: 'స్వయంచాలకంగా గుర్తించబడింది (సామాన్యం)',
    ta: 'தானாகக் கண்டறியப்பட்டது (தோராயமானது)',
  },
  masaSystem: {
    en: 'Lunar month system',
    hi: 'चंद्र मास प्रणाली',
    sa: 'चन्द्रमासप्रणाली',
    te: 'చంద్ర మాస వ్యవస్థ',
    ta: 'சந்திர மாத முறை',
  },
  masaSystemAuto: {
    en: 'Automatic (based on location)',
    hi: 'स्वचालित (स्थान के अनुसार)',
    sa: 'स्वयम् (स्थानानुसारम्)',
    te: 'స్వయంచాలక (స్థానం ఆధారంగా)',
    ta: 'தானியங்கி (இடத்தின் அடிப்படையில்)',
  },
  masaSystemAutoUsing: {
    en: 'Using',
    hi: 'प्रयोग में',
    sa: 'प्रयुज्यते',
    te: 'ఉపయోగిస్తోంది',
    ta: 'பயன்படுத்தப்படுகிறது',
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
    en: 'Astro',
    hi: 'ज्योतिष',
    sa: 'ज्योतिषम्',
    te: 'జ్యోతిషం',
    ta: 'ஜோதிடம்',
  },
  tabMatch: {
    en: 'Match',
    hi: 'मिलान',
    sa: 'मिलनम्',
    te: 'పోలిక',
    ta: 'பொருத்தம்',
  },
  tabSettings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    sa: 'विन्यासाः',
    te: 'సెట్టింగ్‌లు',
    ta: 'அமைப்புகள்',
  },
  jyotishTitle: {
    en: 'Astro',
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
    en: "I don't know my birth time",
    hi: 'जन्म समय नहीं पता',
    sa: 'जन्मसमयं न जानामि',
    te: 'జన్మ సమయం తెలియదు',
    ta: 'பிறந்த நேரம் தெரியவில்லை',
  },
  timeNotSpecified: {
    en: 'Time not specified',
    hi: 'समय निर्दिष्ट नहीं',
    sa: 'समयः निर्दिष्टः न',
    te: 'సమయం పేర్కొనలేదు',
    ta: 'நேரம் குறிப்பிடப்படவில்லை',
  },
  addBirthTime: {
    en: 'Add birth time',
    hi: 'जन्म समय जोड़ें',
    sa: 'जन्मसमयं योजयतु',
    te: 'జన్మ సమయం జోడించండి',
    ta: 'பிறந்த நேரத்தைச் சேர்',
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
  tithiTimings: {
    en: 'Tithi timings',
    hi: 'तिथि का समय',
    sa: 'तिथिकालाः',
    te: 'తిథి సమయాలు',
    ta: 'திதி நேரங்கள்',
  },
  previousTithiEnded: {
    en: 'Previous tithi ended',
    hi: 'पिछली तिथि समाप्त',
    sa: 'पूर्वतिथिः समाप्ता',
    te: 'మునుపటి తిథి ముగిసింది',
    ta: 'முந்தைய திதி முடிந்தது',
  },
  currentTithi: {
    en: 'Current tithi',
    hi: 'वर्तमान तिथि',
    sa: 'वर्तमानतिथिः',
    te: 'ప్రస్తుత తిథి',
    ta: 'தற்போதைய திதி',
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
  userName: {
    en: 'Name (optional)',
    hi: 'नाम (वैकल्पिक)',
    sa: 'नाम (वैकल्पिकम्)',
    te: 'పేరు (ఐచ్ఛికం)',
    ta: 'பெயர் (விருப்பம்)',
  },
  greeting: {
    en: 'Namaste, {name}',
    hi: 'नमस्ते, {name}',
    sa: 'नमस्ते, {name}',
    te: 'నమస్కారం, {name}',
    ta: 'வணக்கம், {name}',
  },
  greetingPrefix: {
    en: 'Namaste,',
    hi: 'नमस्ते,',
    sa: 'नमस्ते,',
    te: 'నమస్కారం,',
    ta: 'வணக்கம்,',
  },
  dailyReminder: {
    en: 'Daily reading reminder',
    hi: 'दैनिक संदेश अनुस्मारक',
    sa: 'दैनिकवाचनस्मारकम्',
    te: 'రోజువారీ సందేశం గుర్తు',
    ta: 'தினசரி வாசிப்பு நினைவூட்டல்',
  },
  dailyReminderDescription: {
    en: 'Remind me to check today’s personal reading',
    hi: 'आज का व्यक्तिगत संदेश देखने की याद दिलाएँ',
    sa: 'अद्यव्यक्तिगतवाचनं पश्यितुं स्मारयतु',
    te: 'ఈరోజు వ్యక్తిగత సందేశం చూడమని గుర్తు చేయండి',
    ta: 'இன்றைய தனிப்பட்ட வாசிப்பைப் பார்க்க நினைவூட்டு',
  },
  dailyReminderTime: {
    en: 'Reminder time',
    hi: 'अनुस्मारक समय',
    sa: 'स्मारकसमयः',
    te: 'గుర్తు సమయం',
    ta: 'நினைவூட்டல் நேரம்',
  },
  dailyReminderNeedsProfile: {
    en: 'Add a birth profile to enable daily reminders.',
    hi: 'दैनिक अनुस्मारक के लिए जन्म विवरण जोड़ें।',
    sa: 'दैनिकस्मारकाय जन्मविवरणं योजयतु।',
    te: 'రోజువారీ గుర్తుల కోసం జన్మ వివరాలు జోడించండి.',
    ta: 'தினசரி நினைவூட்டல்களுக்கு பிறப்பு விவரங்களைச் சேர்க்கவும்.',
  },
  dailyReminderPermissionDenied: {
    en: 'Notification permission was denied. Enable it in system settings to use reminders.',
    hi: 'सूचना अनुमति अस्वीकृत। अनुस्मारक के लिए सिस्टम सेटिंग में सक्षम करें।',
    sa: 'सूचनानुमतिः निराकृता। स्मारकाय प्रणालीसेटिङ्गेषु सक्षमं कुरुत।',
    te: 'నోటిఫికేషన్ అనుమతి నిరాకరించబడింది. గుర్తుల కోసం సిస్టమ్ సెట్టింగ్‌లలో ప్రారంభించండి.',
    ta: 'அறிவிப்பு அனுமதி மறுக்கப்பட்டது. நினைவூட்டல்களுக்கு கணினி அமைப்புகளில் இயக்கவும்.',
  },
  dailyReminderEnabled: {
    en: 'Daily reminders enabled.',
    hi: 'दैनिक अनुस्मारक सक्षम।',
    sa: 'दैनिकस्मारकं सक्षमम्।',
    te: 'రోజువారీ గుర్తులు ప్రారంభించబడ్డాయి.',
    ta: 'தினசரி நினைவூட்டல்கள் இயக்கப்பட்டன.',
  },
  dailyReminderDisabled: {
    en: 'Daily reminders disabled.',
    hi: 'दैनिक अनुस्मारक अक्षम।',
    sa: 'दैनिकस्मारकं निष्क्रियम्।',
    te: 'రోజువారీ గుర్తులు నిలిపివేయబడ్డాయి.',
    ta: 'தினசரி நினைவூட்டல்கள் முடக்கப்பட்டன.',
  },
  dailyReminderNotifTitle: {
    en: 'Your reading for today',
    hi: 'आज का संदेश',
    sa: 'अद्यवाचनम्',
    te: 'ఈరోజు మీ సందేశం',
    ta: 'இன்றைய உங்கள் வாசிப்பு',
  },
  dailyReminderNotifBody: {
    en: 'Open Chandra Darshan to see your personal reading for today.',
    hi: 'आज का व्यक्तिगत संदेश देखने के लिए चन्द्र दर्शन खोलें।',
    sa: 'अद्यव्यक्तिगतवाचनं द्रष्टुं चन्द्रदर्शनं उद्घाटयतु।',
    te: 'ఈరోజు వ్యక్తిగత సందేశం చూడటానికి చంద్ర దర్శన్ తెరవండి.',
    ta: 'இன்றைய தனிப்பட்ட வாசிப்பைப் பார்க்க சந்திர தரிசனத்தைத் திறக்கவும்.',
  },
  moonPhaseWaxing: {
    en: 'Shukla paksha — waxing moon',
    hi: 'शुक्ल पक्ष — बढ़ता चन्द्र',
    sa: 'शुक्लपक्षः — वर्धमानचन्द्रः',
    te: 'శుక్ల పక్షం — పెరుగుతున్న చంద్రుడు',
    ta: 'சுக்கில பக்ஷம் — வளரும் சந்திரன்',
  },
  moonPhaseWaning: {
    en: 'Krishna paksha — waning moon',
    hi: 'कृष्ण पक्ष — घटता चन्द्र',
    sa: 'कृष्णपक्षः — क्षीयमाणचन्द्रः',
    te: 'కృష్ణ పక్షం — తగ్గుతున్న చంద్రుడు',
    ta: 'கிருஷ்ண பக்ஷம் — குறையும் சந்திரன்',
  },
  jyotishTabToday: {
    en: 'Today',
    hi: 'आज',
    sa: 'अद्य',
    te: 'ఈరోజు',
    ta: 'இன்று',
  },
  jyotishTabChart: {
    en: 'Chart',
    hi: 'कुंडली',
    sa: 'कुण्डली',
    te: 'కుండలి',
    ta: 'ஜாதகம்',
  },
  jyotishTabTimeline: {
    en: 'Timeline',
    hi: 'समयरेखा',
    sa: 'कालरेखा',
    te: 'కాలరేఖ',
    ta: 'காலவரிசை',
  },
  jyotishTabLearn: {
    en: 'Learn',
    hi: 'जानें',
    sa: 'ज्ञानम्',
    te: 'తెలుసుకోండి',
    ta: 'கற்றல்',
  },
  explainedInsights: {
    en: 'How we read today',
    hi: 'आज कैसे पढ़ें',
    sa: 'अद्य कथं पठामः',
    te: 'ఈరోజు ఎలా చదవాలి',
    ta: 'இன்று எப்படி படிப்பது',
  },
  transitInsights: {
    en: 'Active transits',
    hi: 'सक्रिय गोचर',
    sa: 'सक्रियगोचराः',
    te: 'సక్రియ గోచరాలు',
    ta: 'செயலில் கோசாரங்கள்',
  },
  skyWindows: {
    en: "Today's sky windows",
    hi: 'आज की समय खिड़कियाँ',
    sa: 'अद्यकालखण्डाः',
    te: 'ఈరోజు ఆకాశ విండోలు',
    ta: 'இன்றைய வான நேரங்கள்',
  },
  currentChoghadiya: {
    en: 'Current Choghadiya',
    hi: 'वर्तमान चौघड़िया',
    sa: 'वर्तमानचौघड़िया',
    te: 'ప్రస్తుత చోఘడియ',
    ta: 'தற்போதைய சோகடியா',
  },
  nextChoghadiya: {
    en: 'Next Choghadiya',
    hi: 'अगली चौघड़िया',
    sa: 'अग्रिमचौघड़िया',
    te: 'తదుపరి చోఘడియ',
    ta: 'அடுத்த சோகடியா',
  },
  rahuKalam: {
    en: 'Rahu Kalam',
    hi: 'राहु काल',
    sa: 'राहुकालः',
    te: 'రాహు కాలం',
    ta: 'ராகு காலம்',
  },
  weeklyTone: {
    en: "This week's tone",
    hi: 'इस सप्ताह की लय',
    sa: 'अस्य सप्ताहस्य लयः',
    te: 'ఈ వార స్వరం',
    ta: 'இந்த வார நயம்',
  },
  chartDepthLocked: {
    en: 'Add birth time to unlock',
    hi: 'अनलॉक के लिए जन्म समय जोड़ें',
    sa: 'जन्मसमयं योजयतु',
    te: 'అన్‌లాక్ చేయడానికి జన్మ సమయం జోడించండి',
    ta: 'திறக்க பிறப்பு நேரத்தைச் சேர்க்கவும்',
  },
  chartDepthLockedHint: {
    en: 'With birth time you get lagna, houses, Navamsa, yogas, dignities, and dosha checks.',
    hi: 'जन्म समय से लग्न, भाव, नवांश, योग और दोष मिलते हैं।',
    sa: 'जन्मसमयेन लग्नभावनवांशयोगदोषाः।',
    te: 'జన్మ సమయంతో లగ్నం, భావాలు, నవాంశం, యోగాలు, దోషాలు.',
    ta: 'பிறப்பு நேரத்துடன் லக்னம், பாவங்கள், நவாம்சம், யோகங்கள், தோஷங்கள்.',
  },
  navamsaSummary: {
    en: 'Navamsa (D9)',
    hi: 'नवांश (D9)',
    sa: 'नवांशः',
    te: 'నవాంశం (D9)',
    ta: 'நவாம்சம் (D9)',
  },
  planetDignities: {
    en: 'Planetary dignities',
    hi: 'ग्रह बल',
    sa: 'ग्रहबलानि',
    te: 'గ్రహ బలాలు',
    ta: 'கிரக பலங்கள்',
  },
  chartDoshas: {
    en: 'Dosha checks',
    hi: 'दोष जाँच',
    sa: 'दोषपरीक्षा',
    te: 'దోష తనిఖీలు',
    ta: 'தோஷ சோதனைகள்',
  },
  annualOutlook: {
    en: 'Annual outlook',
    hi: 'वार्षिक दृष्टि',
    sa: 'वार्षिकदृष्टिः',
    te: 'వార్షిక దృష్టి',
    ta: 'வார்ஷிக கண்ணோட்டம்',
  },
  annualOutlookSubtitle: {
    en: 'Tithi Pravesha chart near your birthday',
    hi: 'जन्मदिन के पास तिथि प्रवेश चार्ट',
    sa: 'जन्मदिनसमीपे तिथिप्रवेशचक्रम्',
    te: 'పుట్టినరోజు సమీపంలో తిథి ప్రవేశ చార్ట్',
    ta: 'பிறந்தநாள் அருகில் திதி பிரவேச சார்ட்',
  },
  learnGlossary: {
    en: 'Glossary',
    hi: 'शब्दकोश',
    sa: 'शब्दकोशः',
    te: 'పదకోశం',
    ta: 'அகராதி',
  },
  learnArticles: {
    en: 'How it works',
    hi: 'यह कैसे काम करता है',
    sa: 'कथं कार्यति',
    te: 'ఎలా పనిచేస్తుంది',
    ta: 'எப்படி வேலை செய்கிறது',
  },
  searchGlossary: {
    en: 'Search terms…',
    hi: 'शब्द खोजें…',
    sa: 'पदानि अन्विष्यताम्…',
    te: 'పదాలు వెతకండి…',
    ta: 'சொற்களைத் தேடுங்கள்…',
  },
  yogaReasons: {
    en: 'Why this yoga',
    hi: 'यह योग क्यों',
    sa: 'किमर्थं योगः',
    te: 'ఈ యోగం ఎందుకు',
    ta: 'ஏன் இந்த யோகம்',
  },
  yogaEffect: {
    en: 'What it tends to mean',
    hi: 'इसका प्रभाव',
    sa: 'प्रभावः',
    te: 'ప్రభావం',
    ta: 'விளைவு',
  },
  yogaTechnical: {
    en: 'How we detected this',
    hi: 'कैसे पहचाना',
    sa: 'कथं ज्ञातम्',
    te: 'ఎలా గుర్తించాం',
    ta: 'எப்படி கண்டறிந்தோம்',
  },
  showDetails: {
    en: 'Show details',
    hi: 'विवरण देखें',
    sa: 'विवरणं दर्शयतु',
    te: 'వివరాలు చూడండి',
    ta: 'விவரங்களைக் காட்டு',
  },
  matchTitle: {
    en: 'Kundali match',
    hi: 'कुंडली मिलान',
    sa: 'कुण्डलीमिलनम्',
    te: 'కుండలి పోలిక',
    ta: 'குண்டலி பொருத்தம்',
  },
  matchSubtitle: {
    en: 'North Indian Ashtakoot (36 points) — offline, educational.',
    hi: 'उत्तर भारतीय अष्टकूट (36) — शैक्षिक।',
    sa: 'अष्टकूटम् — 36 अङ्काः।',
    te: 'నార్త్ ఇండియన్ అష్టకూట్ (36) — విద్యాపరమైనది.',
    ta: 'வட இந்திய அஷ்டகூட் (36) — கல்வி நோக்கில்.',
  },
  matchEmptySelf: {
    en: 'Add your birth details to check compatibility.',
    hi: 'मिलान के लिए अपना जन्म विवरण जोड़ें।',
    sa: 'मिलनार्थं जन्मविवरणं योजयतु।',
    te: 'పోలిక కోసం మీ జన్మ వివరాలు జోడించండి.',
    ta: 'பொருத்தத்திற்கு உங்கள் பிறப்பு விவரங்களைச் சேர்க்கவும்.',
  },
  matchEmptyPartner: {
    en: 'Add partner birth details to see Ashtakoot score.',
    hi: 'अष्टकूट के लिए साथी का जन्म विवरण जोड़ें।',
    sa: 'सहचरस्य जन्मविवरणं योजयतु।',
    te: 'భాగస్వామి జన్మ వివరాలు జోడించండి.',
    ta: 'துணை பிறப்பு விவரங்களைச் சேர்க்கவும்.',
  },
  partnerProfile: {
    en: 'Partner profile',
    hi: 'साथी का विवरण',
    sa: 'सहचरविवरणम्',
    te: 'భాగస్వామి ప్రొఫైల్',
    ta: 'துணை சுயவிவரம்',
  },
  partnerName: {
    en: 'Partner name',
    hi: 'साथी का नाम',
    sa: 'सहचरनाम',
    te: 'భాగస్వామి పేరు',
    ta: 'துணை பெயர்',
  },
  savePartnerProfile: {
    en: 'Save partner profile',
    hi: 'साथी का विवरण सहेजें',
    sa: 'सहचरं संरक्षतु',
    te: 'భాగస్వామి ప్రొఫైల్ సేవ్',
    ta: 'துணை சுயவிவரத்தைச் சேமிக்கவும்',
  },
  clearPartnerProfile: {
    en: 'Clear partner profile',
    hi: 'साथी का विवरण हटाएँ',
    sa: 'सहचरं अपाकरोतु',
    te: 'భాగస్వామి ప్రొఫైల్ క్లియర్',
    ta: 'துணை சுயவிவரத்தை அழிக்கவும்',
  },
  editPartnerDetails: {
    en: 'Edit partner details',
    hi: 'साथी का विवरण संपादित करें',
    sa: 'सहचरविवरणं सम्पादयतु',
    te: 'భాగస్వామి వివరాలు సవరించండి',
    ta: 'துணை விவரங்களைத் திருத்தவும்',
  },
  matchScoreTitle: {
    en: 'Ashtakoot score',
    hi: 'अष्टकूट अंक',
    sa: 'अष्टकूटाङ्कः',
    te: 'అష్టకూట్ స్కోర్',
    ta: 'அஷ்டகூட் மதிப்பெண்',
  },
  matchGunaBreakdown: {
    en: 'Guna breakdown',
    hi: 'गुण विवरण',
    sa: 'गुणविभागः',
    te: 'గుణ వివరాలు',
    ta: 'குண விவரம்',
  },
  matchMangalPairing: {
    en: 'Mangal pairing',
    hi: 'मंगल मिलान',
    sa: 'मङ्गलमिलनम्',
    te: 'మంగళ పోలిక',
    ta: 'மங்கல பொருத்தம்',
  },
  matchSynastry: {
    en: 'Chart synastry',
    hi: 'कुंडली समन्वय',
    sa: 'चक्रसामञ्जस्यम्',
    te: 'చార్ట్ సినాస్ట్రీ',
    ta: 'சார்ட் சினாஸ்ட்ரி',
  },
  matchSynastryLocked: {
    en: 'Birth time needed for both profiles',
    hi: 'दोनों के जन्म समय चाहिए',
    sa: 'उभयजन्मकालः आवश्यकः',
    te: 'రెండు ప్రొఫైల్‌లకు జన్మ సమయం అవసరం',
    ta: 'இரண்டு சுயவிவரங்களுக்கும் பிறப்பு நேரம் தேவை',
  },
  matchNadiDosha: {
    en: 'Nadi dosha',
    hi: 'नाड़ी दोष',
    sa: 'नाडीदोषः',
    te: 'నాడి దోషం',
    ta: 'நாடி தோஷம்',
  },
  matchBhakootDosha: {
    en: 'Bhakoot dosha',
    hi: 'भकूट दोष',
    sa: 'भकूटदोषः',
    te: 'భకూట్ దోషం',
    ta: 'பகூட் தோஷம்',
  },
  matchSelfMoon: {
    en: 'Your Moon',
    hi: 'आपका चन्द्र',
    sa: 'भवतः चन्द्रः',
    te: 'మీ చంద్రుడు',
    ta: 'உங்கள் சந்திரன்',
  },
  matchPartnerMoon: {
    en: 'Partner Moon',
    hi: 'साथी का चन्द्र',
    sa: 'सहचरचन्द्रः',
    te: 'భాగస్వామి చంద్రుడు',
    ta: 'துணை சந்திரன்',
  },
  matchConventionNote: {
    en: 'Scores use classical groom-bride tables: your profile first, partner second.',
    hi: 'क्लासिकल नियम: आप पहले, साथी दूसरे।',
    sa: 'शास्त्रीयनियमाः — भवतः प्रथमम्।',
    te: 'మీ ప్రొఫైల్ మొదట, భాగస్వామి రెండవ.',
    ta: 'உங்கள் சுயவிவரம் முதலில், துணை இரண்டாவது.',
  },
};

export function t(key: LabelKey, language: AppLanguage): string {
  const entry = LABELS[key];
  if (!entry) {
    return key;
  }
  return entry[language] ?? entry.en ?? key;
}

export function greeting(name: string, language: AppLanguage): string {
  return t('greeting', language).replace('{name}', name);
}

export type { LabelKey };
