import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

type LanguageProviderProps = {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar & Footer
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.audit': 'Book Free Website Audit',
    'footer.description': 'Empowering local businesses in Raigarh, Chhattisgarh with premium digital solutions.',
    'footer.quickLinks': 'Quick Links',
    'footer.contactUs': 'Contact Us',
    'footer.rights': 'All rights reserved.',
    
    // Hero
    'hero.badge': 'MBA Marketer & Professional Web Designer',
    'hero.title.line1': 'Stop Posting.',
    'hero.title.line2': 'Start Building Your Local Brand.',
    'hero.subtitle': 'I help business owners in Raigarh, Tamnar, and Kharsia double their customer bookings with premium website designs, local Google Maps ranking, and high-impact search strategies. Zero agency bloat. Pure results.',
    'hero.cta.bookCall': 'Book Free Strategy Call',
    'hero.cta.exploreDemos': 'Explore Demo Designs',
    
    // Section Headings
    'section.demos.title': 'Ready-To-Deploy Demo Designs',
    'section.demos.subtitle': 'Exquisite, lightning-fast designs built specifically for your business niche. Ready to launch instantly.',
    'section.whyChoose.title': 'Why Choose Harsh Digital Studios?',
    'section.whyChoose.subtitle': 'We don\'t just design websites—we build high-performance business assets that get you customers.',
    'section.stats.title': 'Our Impact in Numbers',
    'section.stats.subtitle': 'Proven growth metrics for local brands in Chhattisgarh.',
    'section.howWeWork.title': 'Our Seamless Process',
    'section.howWeWork.subtitle': 'How we take you from an idea to a high-converting online presence in 4 simple steps.',
    
    // Services
    'services.hero.title': 'High-Performance Digital Services',
    'services.hero.subtitle': 'We offer comprehensive digital solutions to help businesses in Chhattisgarh establish a professional web presence and attract more customers.',
    
    // Portfolio
    'portfolio.hero.title': 'Demo Designs & Success Stories',
    'portfolio.hero.subtitle': 'Explore our ready-to-deploy, high-converting demo designs customized for local businesses in Raigarh.',
    'portfolio.requestSimilar': 'Request Similar Website',
    'portfolio.whatsappInquiry': 'WhatsApp Inquiry',
    'portfolio.liveDemo': 'Live Demo',
    'portfolio.sidebar.title': 'Start Your Project',
    'portfolio.sidebar.subtitle': 'Ready to build something amazing? Reach out to us directly.',
    'portfolio.sidebar.whatsapp': 'WhatsApp Us',
    'portfolio.sidebar.call': 'Call Us Now',
    'portfolio.sidebar.email': 'Send Email',
    
    // Contact
    'contact.hero.title': 'Let\'s Grow Your Business',
    'contact.hero.subtitle': 'Have a project in mind or want to explore our ready-to-use demo designs? Get in touch with Harsh Patel today.',
    'contact.form.title': 'Send Us a Message',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number (preferably WhatsApp)',
    'contact.form.service': 'Interested Service',
    'contact.form.message': 'Project Details / Message',
    'contact.form.submit': 'Send Inquiry',
    'contact.form.submitting': 'Sending your inquiry...',
    'contact.form.success': 'Thank you! Your message has been sent successfully.',
    'contact.form.error': 'Something went wrong. Please try again or WhatsApp us directly.',
    'contact.info.title': 'Direct Contact Info',
    'contact.info.location': 'Raigarh, Chhattisgarh, India',
    'contact.info.chat': 'Chat on WhatsApp',
    
    // About
    'about.hero.title': 'About Harsh Patel',
    'about.hero.subtitle': 'Building high-conversion digital experiences for local entrepreneurs in Raigarh & Chhattisgarh.',
    
    // Testimonials
    'testimonials.hero.title': 'Work in Progress',
    'testimonials.hero.subtitle': 'I\'m currently helping local businesses build their online presence. As I complete more client projects, genuine testimonials and case studies will be added here.',
    'testimonials.cta': 'Be My First Success Story',
    'testimonials.honest': '100% Honest & Transparent • No Fake Social Proof',
  },
  hi: {
    // Navbar & Footer
    'nav.home': 'मुख्य पृष्ठ',
    'nav.about': 'हमारे बारे में',
    'nav.services': 'सेवाएं',
    'nav.pricing': 'कीमतें',
    'nav.portfolio': 'पोर्टफोलियो',
    'nav.blog': 'ब्लॉग',
    'nav.faq': 'सवाल-जवाब',
    'nav.contact': 'संपर्क करें',
    'nav.audit': 'फ्री वेबसाइट ऑडिट बुक करें',
    'footer.description': 'रायगढ़, छत्तीसगढ़ में स्थानीय व्यवसायों को प्रीमियम डिजिटल समाधानों के साथ सशक्त बनाना।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.contactUs': 'संपर्क करें',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
    
    // Hero
    'hero.badge': 'MBA मार्केटर और प्रोफेशनल वेब डिजाइनर',
    'hero.title.line1': 'फ्लायर्स पोस्ट करना बंद करें।',
    'hero.title.line2': 'अपना लोकल ब्रांड बनाना शुरू करें।',
    'hero.subtitle': 'मैं रायगढ़, तमनार और खरसिया के व्यवसायों को प्रीमियम वेबसाइट डिज़ाइन्स, लोकल गूगल मैप्स रैंकिंग और सर्च स्ट्रेटेजी के साथ ग्राहकों की बुकिंग को दोगुना करने में मदद करता हूँ। बिल्कुल सीधा काम, शानदार परिणाम।',
    'hero.cta.bookCall': 'फ्री स्ट्रेटेजी कॉल बुक करें',
    'hero.cta.exploreDemos': 'डेमो डिज़ाइन देखें',
    
    // Section Headings
    'section.demos.title': 'तैयार डेमो डिज़ाइन्स',
    'section.demos.subtitle': 'आपके व्यवसाय के लिए विशेष रूप से बनाई गई बेहद तेज़ डिज़ाइन्स। तुरंत लाइव करने के लिए तैयार।',
    'section.whyChoose.title': 'हर्ष डिजिटल स्टूडियो ही क्यों चुनें?',
    'section.whyChoose.subtitle': 'हम केवल वेबसाइट नहीं बनाते—हम उच्च प्रदर्शन वाले व्यावसायिक एसेट्स बनाते हैं जो आपको नए ग्राहक दिलाते हैं।',
    'section.stats.title': 'संख्याओं में हमारा प्रभाव',
    'section.stats.subtitle': 'छत्तीसगढ़ में स्थानीय ब्रांडों के लिए प्रमाणित विकास मेट्रिक्स।',
    'section.howWeWork.title': 'हमारी आसान प्रक्रिया',
    'section.howWeWork.subtitle': 'कैसे हम आपको 4 आसान चरणों में एक विचार से उच्च-परिवर्तित ऑनलाइन उपस्थिति तक ले जाते हैं।',
    
    // Services
    'services.hero.title': 'उच्च प्रदर्शन वाली डिजिटल सेवाएं',
    'services.hero.subtitle': 'हम छत्तीसगढ़ में व्यवसायों को एक पेशेवर वेब उपस्थिति स्थापित करने और अधिक ग्राहकों को आकर्षित करने में मदद करने के लिए व्यापक डिजिटल समाधान प्रदान करते हैं।',
    
    // Portfolio
    'portfolio.hero.title': 'डेमो डिज़ाइन्स और सफलता की कहानियाँ',
    'portfolio.hero.subtitle': 'रायगढ़ में स्थानीय व्यवसायों के लिए कस्टमाइज्ड और उच्च-रूपांतरण वाले तैयार डेमो डिज़ाइन्स देखें।',
    'portfolio.requestSimilar': 'समान वेबसाइट का अनुरोध करें',
    'portfolio.whatsappInquiry': 'व्हाट्सएप पूछताछ',
    'portfolio.liveDemo': 'लाइव डेमो',
    'portfolio.sidebar.title': 'अपना प्रोजेक्ट शुरू करें',
    'portfolio.sidebar.subtitle': 'कुछ अद्भुत बनाने के लिए तैयार हैं? सीधे हमसे संपर्क करें।',
    'portfolio.sidebar.whatsapp': 'व्हाट्सएप करें',
    'portfolio.sidebar.call': 'अभी कॉल करें',
    'portfolio.sidebar.email': 'ईमेल भेजें',
    
    // Contact
    'contact.hero.title': 'आइए आपके व्यवसाय को बढ़ाएं',
    'contact.hero.subtitle': 'क्या आपके पास कोई प्रोजेक्ट है या आप हमारे तैयार डेमो डिज़ाइन्स देखना चाहते हैं? आज ही हर्ष पटेल से संपर्क करें।',
    'contact.form.title': 'हमें संदेश भेजें',
    'contact.form.name': 'आपका नाम',
    'contact.form.email': 'ईमेल पता',
    'contact.form.phone': 'फ़ोन नंबर (अधिमानतः व्हाट्सएप)',
    'contact.form.service': 'रुचि की सेवा',
    'contact.form.message': 'प्रोजेक्ट का विवरण / संदेश',
    'contact.form.submit': 'पूछताछ भेजें',
    'contact.form.submitting': 'आपकी पूछताछ भेजी जा रही है...',
    'contact.form.success': 'धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है।',
    'contact.form.error': 'कुछ गलत हो गया। कृपया पुन: प्रयास करें या सीधे हमें व्हाट्सएप करें।',
    'contact.info.title': 'सीधा संपर्क विवरण',
    'contact.info.location': 'रायगढ़, छत्तीसगढ़, भारत',
    'contact.info.chat': 'व्हाट्सएप पर चैट करें',
    
    // About
    'about.hero.title': 'हर्ष पटेल के बारे में',
    'about.hero.subtitle': 'रायगढ़ और छत्तीसगढ़ में स्थानीय उद्यमियों के लिए उच्च-रूपांतरण वाले डिजिटल अनुभव बनाना।',
    
    // Testimonials
    'testimonials.hero.title': 'प्रगति पर है',
    'testimonials.hero.subtitle': 'मैं वर्तमान में स्थानीय व्यवसायों को उनकी ऑनलाइन उपस्थिति बनाने में मदद कर रहा हूँ। जैसे-जैसे मैं अधिक क्लाइंट प्रोजेक्ट्स पूरे करूँगा, वास्तविक प्रशंसापत्र यहाँ जोड़े जाएंगे।',
    'testimonials.cta': 'मेरी पहली सफलता की कहानी बनें',
    'testimonials.honest': '100% ईमानदार और पारदर्शी • कोई फर्जी रिव्यू नहीं',
  }
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'vite-ui-language',
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  const setLanguage = (lang: Language) => {
    localStorage.setItem(storageKey, lang);
    setLanguageState(lang);
  };

  const t = (key: string, defaultValue?: string): string => {
    return translations[language]?.[key] || defaultValue || translations['en']?.[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
