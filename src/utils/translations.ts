import { LanguageCode } from '../types/sentra';

export const translations: Record<LanguageCode, {
  appName: string;
  tagline: string;
  secureLoginTitle: string;
  mobilePrompt: string;
  sendOtp: string;
  enterOtp: string;
  verifyOtp: string;
  loginSuccess: string;
  privacyNotice: string;
  howFeelingToday: string;
  startCheckIn: string;
  requestSupport: string;
  viewCase: string;
  myAppointments: string;
  wellbeingOverview: string;
  emotionalWellbeing: string;
  stress: string;
  sleep: string;
  support: string;
  safety: string;
  routineStatusText: string;
  changeStatusText: string;
  saveAndContinue: string;
  skipOptional: string;
  submitCheckIn: string;
  voicePrompt: string;
  voiceConsentNotice: string;
  recordedSuccess: string;
  caseTimelineTitle: string;
  currentStage: string;
  nextHearing: string;
  officialUpdates: string;
  emergencyTitle: string;
  emergencyDesc: string;
  emergencyDisclaimer: string;
  mySupportServices: string;
  counsellingDesc: string;
  legalAidDesc: string;
  protectionDesc: string;
  rehabilitationDesc: string;
  contactSupport: string;
  confirmAppointment: string;
  requestReschedule: string;
  privacyControlsTitle: string;
  consentTitle: string;
  withdrawConsent: string;
  savePreferences: string;
}> = {
  en: {
    appName: "SENTRA",
    tagline: "Early insight. Human support. Safer outcomes.",
    secureLoginTitle: "Secure access to your support portal",
    mobilePrompt: "Mobile Number",
    sendOtp: "Send Secure OTP",
    enterOtp: "Enter 6-digit OTP (demo: 123456)",
    verifyOtp: "Verify & Continue",
    loginSuccess: "Identity verified securely.",
    privacyNotice: "SENTRA protects your privacy. Your data is encrypted, protected by role-based access control, and used solely for your well-being support.",
    howFeelingToday: "How are you feeling today?",
    startCheckIn: "Start Well-Being Check-In",
    requestSupport: "Request Support",
    viewCase: "View My Case",
    myAppointments: "My Appointments",
    wellbeingOverview: "Well-Being Overview",
    emotionalWellbeing: "Emotional Well-Being",
    stress: "Stress & Anxiety",
    sleep: "Sleep Restfulness",
    support: "Social & Professional Support",
    safety: "Personal Safety",
    routineStatusText: "Your recent check-in is logged. Authorized support staff are available if you need them.",
    changeStatusText: "Your recent check-ins show some changes. Would you like to speak with a counsellor?",
    saveAndContinue: "Save & Continue",
    skipOptional: "Skip Optional",
    submitCheckIn: "Complete Check-In",
    voicePrompt: "Would you like to record a short voice reflection? (Optional)",
    voiceConsentNotice: "Notice: Voice audio is analyzed for acoustic features (cadence, energy) and transcribed to text to help your counsellor understand your state. Recording is strictly optional and stored with end-to-end encryption.",
    recordedSuccess: "Voice note captured securely (0:14s)",
    caseTimelineTitle: "Your Case Journey",
    currentStage: "Current Stage",
    nextHearing: "Next Scheduled Proceeding",
    officialUpdates: "Official Case Updates",
    emergencyTitle: "I Need Help",
    emergencyDesc: "If you feel immediate danger, fear for your physical safety, or need urgent support, connect directly with designated authorities.",
    emergencyDisclaimer: "Please note: SENTRA provides AI-assisted decision support for caseworkers and does NOT independently dispatch emergency response teams.",
    mySupportServices: "Approved Support Services",
    counsellingDesc: "Confidential emotional well-being and trauma-informed counselling with certified professionals.",
    legalAidDesc: "Free, authorized legal counsel and assistance through the District Legal Services Authority.",
    protectionDesc: "Courtroom accompaniment, witness safety reviews, and local protective measures.",
    rehabilitationDesc: "Guidance on statutory victim compensation funds, welfare schemes, and medical aid.",
    contactSupport: "Request Consultation",
    confirmAppointment: "Confirm Attendance",
    requestReschedule: "Request Reschedule",
    privacyControlsTitle: "Privacy & Data Rights",
    consentTitle: "Consent & Processing Preferences",
    withdrawConsent: "Request Data Retention Review / Withdraw Consent",
    savePreferences: "Save Privacy Preferences"
  },
  ta: {
    appName: "SENTRA",
    tagline: "முன்கூட்டியே அறிதல். மனித ஆதரவு. பாதுகாப்பான தீர்வு.",
    secureLoginTitle: "உங்கள் ஆதரவு தளத்திற்கான பாதுகாப்பான உள்நுழைவு",
    mobilePrompt: "மொபைல் எண்",
    sendOtp: "OTP அனுப்புக",
    enterOtp: "6-இலக்க OTP-ஐ உள்ளிடவும் (மாதிரி: 123456)",
    verifyOtp: "சரிபார்த்து தொடரவும்",
    loginSuccess: "அடையாளம் பாதுகாப்பாக சரிபார்க்கப்பட்டது.",
    privacyNotice: "SENTRA உங்கள் தனியுரிமையைப் பாதுகாக்கிறது. உங்கள் தகவல்கள் குறியாக்கம் செய்யப்பட்டுள்ளன மற்றும் உங்கள் நலனுக்காக மட்டுமே பயன்படுத்தப்படும்.",
    howFeelingToday: "இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?",
    startCheckIn: "நலன் பரிசோதனையைத் தொடங்கவும்",
    requestSupport: "ஆதரவு கோருக",
    viewCase: "வழக்கு விவரம் பார்க்க",
    myAppointments: "எனது சந்திப்புகள்",
    wellbeingOverview: "நலன் மேலோட்டம்",
    emotionalWellbeing: "மன நலன்",
    stress: "மன அழுத்தம்",
    sleep: "தூக்கத்தின் தரம்",
    support: "ஆதரவு",
    safety: "தனிநபர் பாதுகாப்பு",
    routineStatusText: "உங்கள் சமீபத்திய பதிவு சேமிக்கப்பட்டது. தேவைப்பட்டால் ஆதரவாளர்கள் கிடைக்கின்றனர்.",
    changeStatusText: "உங்கள் சமீபத்திய பதிவுகளில் சில மாற்றங்கள் தெரிகின்றன. நீங்கள் ஆலோசகருடன் பேச விரும்புகிறீர்களா?",
    saveAndContinue: "சேமித்து தொடரவும்",
    skipOptional: "தவிர்க்கவும்",
    submitCheckIn: "பரிசோதனையை முடிக்கவும்",
    voicePrompt: "குரல் வழி பதிவு செய்ய விரும்புகிறீர்களா? (விருப்பத்திற்குரியது)",
    voiceConsentNotice: "அறிவிப்பு: குரல் பதிவு மனநிலையை புரிந்துகொள்ள மட்டுமே பயன்படுத்தப்படும். இது கட்டாயமற்றது.",
    recordedSuccess: "குரல் பதிவு பாதுகாப்பாக பதிவு செய்யப்பட்டது.",
    caseTimelineTitle: "உங்கள் வழக்கு பயணம்",
    currentStage: "தற்போதைய நிலை",
    nextHearing: "அடுத்த விசாரணை",
    officialUpdates: "அதிகாரப்பூர்வ புதுப்பிப்புகள்",
    emergencyTitle: "எனக்கு உதவி தேவை",
    emergencyDesc: "உடனடி ஆபத்து அல்லது அவசர உதவிக்கு நியமிக்கப்பட்ட அதிகாரிகளை நேரடியாக தொடர்பு கொள்ளவும்.",
    emergencyDisclaimer: "குறிப்பு: SENTRA முடிவெடுக்கும் ஆதரவு அமைப்பாகும், தானாகவே அவசர உதவியை அனுப்பாது.",
    mySupportServices: "அங்கீகரிக்கப்பட்ட ஆதரவு சேவைகள்",
    counsellingDesc: "சான்றளிக்கப்பட்ட நிபுணர்களுடன் இரகசியமான உளவியல் ஆலோசனை.",
    legalAidDesc: "சட்ட சேவைகள் ஆணையத்தின் மூலம் இலவச சட்ட உதவி.",
    protectionDesc: "பாதுகாப்பு மற்றும் சாட்சி ஆதரவு நடவடிக்கைகள்.",
    rehabilitationDesc: "பாதிக்கப்பட்டோருக்கான இழப்பீட்டு நிதி மற்றும் நலத்திட்ட உதவிகள்.",
    contactSupport: "ஆலோசனை கோருக",
    confirmAppointment: "உறுதிப்படுத்துக",
    requestReschedule: "நேரம் மாற்ற கோருக",
    privacyControlsTitle: "தனியுரிமை மற்றும் தரவு உரிமைகள்",
    consentTitle: "ஒப்புதல் அமைப்புகள்",
    withdrawConsent: "ஒப்புதலைத் திரும்பப் பெறுக",
    savePreferences: "விருப்பங்களைச் சேமிக்கவும்"
  },
  hi: {
    appName: "SENTRA",
    tagline: "शीघ्र समझ। मानवीय संबल। सुरक्षित परिणाम।",
    secureLoginTitle: "आपके सहायता पोर्टल पर सुरक्षित लॉगिन",
    mobilePrompt: "मोबाइल नंबर",
    sendOtp: "सुरक्षित OTP भेजें",
    enterOtp: "6-अंकों का OTP दर्ज करें (डेमो: 123456)",
    verifyOtp: "सत्यापित करें और आगे बढ़ें",
    loginSuccess: "पहचान सुरक्षित रूप से सत्यापित हुई।",
    privacyNotice: "SENTRA आपकी गोपनीयता की रक्षा करता है। आपका डेटा एन्क्रिप्टेड है और केवल आपकी भलाई व सहायता के लिए उपयोग किया जाता है।",
    howFeelingToday: "आज आप कैसा महसूस कर रहे हैं?",
    startCheckIn: "कल्याण जाँच (Check-In) शुरू करें",
    requestSupport: "सहायता का अनुरोध करें",
    viewCase: "मेरा केस देखें",
    myAppointments: "मेरी नियुक्तियाँ",
    wellbeingOverview: "कल्याण अवलोकन",
    emotionalWellbeing: "भावनात्मक कल्याण",
    stress: "तनाव और चिंता",
    sleep: "नींद की गुणवत्ता",
    support: "सामाजिक व परामर्श सहायता",
    safety: "व्यक्तिगत सुरक्षा",
    routineStatusText: "आपकी हालिया जाँच दर्ज है। आवश्यकता होने पर अधिकृत परामर्शदाता उपलब्ध हैं।",
    changeStatusText: "आपकी हालिया जाँच में कुछ बदलाव देखे गए हैं। क्या आप परामर्शदाता से बात करना चाहेंगे?",
    saveAndContinue: "सुरक्षित करें और जारी रखें",
    skipOptional: "छोड़ें (वैकल्पिक)",
    submitCheckIn: "जाँच पूरी करें",
    voicePrompt: "क्या आप एक संक्षिप्त आवाज़ संदेश रिकॉर्ड करना चाहेंगे? (वैकल्पिक)",
    voiceConsentNotice: "सूचना: आपकी आवाज़ केवल परामर्शदाता के समझने के लिए सुरक्षित रूप से संसाधित होती है। यह पूर्णतः वैकल्पिक है।",
    recordedSuccess: "आवाज़ संदेश सुरक्षित रूप से दर्ज हुआ।",
    caseTimelineTitle: "आपकी केस यात्रा",
    currentStage: "वर्तमान चरण",
    nextHearing: "अगली अदालती कार्यवाही",
    officialUpdates: "आधिकारिक अपडेट",
    emergencyTitle: "मुझे मदद चाहिए",
    emergencyDesc: "यदि आपको तत्काल खतरा है या आपातकालीन सहायता चाहिए, तो कृपया नामित अधिकारियों से संपर्क करें।",
    emergencyDisclaimer: "कृपया ध्यान दें: SENTRA निर्णय-सपोर्ट प्रणाली है और यह सीधे आपातकालीन वाहन नहीं भेजती है।",
    mySupportServices: "स्वीकृत सहायता सेवाएँ",
    counsellingDesc: "प्रमाणित विशेषज्ञों द्वारा गोपनीय भावनात्मक एवं मानसिक स्वास्थ्य परामर्श।",
    legalAidDesc: "जिला विधिक सेवा प्राधिकरण के माध्यम से निःशुल्क कानूनी सहायता।",
    protectionDesc: "अदालत में उपस्थिति सहयोग, गवाह सुरक्षा समीक्षा और स्थानीय सुरक्षा व्यवस्था।",
    rehabilitationDesc: "पीड़ित मुआवजा कोष, कल्याण योजनाओं और चिकित्सा सहायता के लिए मार्गदर्शन।",
    contactSupport: "परामर्श का अनुरोध करें",
    confirmAppointment: "उपस्थिति की पुष्टि करें",
    requestReschedule: "समय बदलने का अनुरोध करें",
    privacyControlsTitle: "गोपनीयता और डेटा अधिकार",
    consentTitle: "सहमति और डेटा प्राथमिकताएं",
    withdrawConsent: "सहमति वापस लेने का अनुरोध करें",
    savePreferences: "प्राथमिकताएं सहेजें"
  }
};
