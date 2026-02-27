import { createContext, useContext, useState, ReactNode } from "react";

// Supported languages
export type Language = "en" | "hi" | "ne" | "bo" | "bn";

export const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
    { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
    { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
    { code: "ne", label: "Nepali", nativeLabel: "नेपाली", flag: "🇳🇵" },
    { code: "bo", label: "Tibetan", nativeLabel: "བོད་སྐད", flag: "🏔️" },
    { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇧🇩" },
];

// Translation keys
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Header
        "nav.home": "Home",
        "nav.virtualTours": "Virtual Tours",
        "nav.archives": "Archives",
        "nav.events": "Events",
        "nav.audioGuide": "Audio Guide",
        "nav.aiQuiz": "AI Quiz",
        "nav.reviews": "Reviews",
        "nav.explore": "Explore",
        "nav.login": "Login",
        "nav.signup": "Sign Up",
        "nav.logout": "Logout",
        "nav.signedIn": "Signed in",
        "header.tagline": "Sacred Heritage Platform",

        // Hero
        "hero.discover": "Discover the Sacred",
        "hero.monasteries": "Monasteries of Sikkim",
        "hero.subtitle": "Embark on a digital pilgrimage through 200+ ancient Buddhist monasteries nestled in the Himalayas. Experience sacred heritage through immersive technology.",
        "hero.exploreTours": "Explore Virtual Tours",
        "hero.learnMore": "Learn More",
        "hero.aiBadge": "AI-Powered Heritage Platform",
        "hero.monasteryCount": "200+ Monasteries",
        "hero.virtualTours": "Virtual Tours",
        "hero.yearsHistory": "300+ Years of History",

        // Virtual Tours
        "tours.title": "Immersive Virtual Tours",
        "tours.subtitle": "Step inside Sikkim's most sacred monasteries from anywhere in the world. Experience 360° panoramic views with guided narratives and cultural insights.",
        "tours.featured": "Featured",
        "tours.ready360": "360° Ready",
        "tours.startFeatured": "Start Featured Tour",
        "tours.completeExp": "Complete Monastery Experience",
        "tours.completeDesc": "A comprehensive tour covering main prayer halls, monks' quarters, and sacred artifacts across multiple monasteries.",
        "tours.duration": "Duration",
        "tours.startTour": "Start Tour",
        "tours.views": "views",

        // Stats
        "stats.monasteries": "Monasteries",
        "stats.visitors": "Annual Visitors",
        "stats.years": "Years of History",
        "stats.tours": "Virtual Tours",

        // AI Features
        "ai.chatbotTitle": "Dharma Guide AI",
        "ai.chatbotOnline": "Powered by Gemini",
        "ai.chatbotPlaceholder": "Ask about monasteries, culture, travel...",
        "ai.tripTitle": "AI Trip Planner",
        "ai.tripSubtitle": "Let our AI create a personalized monastery pilgrimage itinerary for you",
        "ai.quizTitle": "Test Your Knowledge",
        "ai.quizSubtitle": "Challenge yourself with AI-generated questions about Sikkim's monasteries",
        "ai.insightsTitle": "AI Monastery Insights",
        "ai.insightsSubtitle": "Click on a monastery to discover fascinating AI-generated insights",
        "ai.generatePlan": "Generate My Itinerary",
        "ai.startQuiz": "Start Quiz",

        // Weather
        "weather.title": "Monastery Weather",
        "weather.subtitle": "Current conditions at key monastery locations",

        // Testimonials
        "testimonials.title": "Visitor Experiences",
        "testimonials.subtitle": "Hear from travelers who explored Sikkim's sacred monasteries",

        // Reviews
        "reviews.title": "Share Your Experience",
        "reviews.signInPrompt": "Sign in to your Monastery360 account to write reviews, earn heritage coins, and contribute to our sacred community.",
        "reviews.submitReview": "Submit Review",
        "reviews.yourReviews": "Your Reviews",
        "reviews.empty": "No reviews yet. Be the first to share your experience!",
        "reviews.rating": "Your Rating",

        // Login
        "login.welcome": "Welcome Back",
        "login.subtitle": "Sign in to continue your sacred journey",
        "login.username": "Username",
        "login.password": "Password",
        "login.rememberMe": "Remember me",
        "login.forgotPassword": "Forgot password?",
        "login.signIn": "Sign In",
        "login.noAccount": "Don't have an account?",
        "login.createAccount": "Create Account",

        // Signup
        "signup.title": "Create Account",
        "signup.subtitle": "Start your sacred journey today",
        "signup.fullName": "Full Name",
        "signup.email": "Email",
        "signup.username": "Username",
        "signup.password": "Password",
        "signup.confirmPassword": "Confirm Password",
        "signup.agreeTerms": "I agree to the Terms of Service and Privacy Policy",
        "signup.create": "Create Account",
        "signup.haveAccount": "Already have an account?",
        "signup.signIn": "Sign In",

        // Tour Viewer
        "tourViewer.title": "Virtual Monastery Tour",
        "tourViewer.exit": "Exit Tour",
        "tourViewer.next": "Next Scene",
        "tourViewer.prev": "Previous",
        "tourViewer.info": "About This Location",
        "tourViewer.clickHotspot": "Click hotspots to learn more",

        // Footer
        "footer.tagline": "Preserving Sacred Heritage Through Technology",
        "footer.quickLinks": "Quick Links",
        "footer.contact": "Contact Us",
        "footer.rights": "All rights reserved",

        // General
        "general.loading": "Loading...",
        "general.error": "Something went wrong",
        "general.close": "Close",
        "general.back": "Back",
    },
    hi: {
        "nav.home": "होम",
        "nav.virtualTours": "वर्चुअल टूर",
        "nav.archives": "अभिलेखागार",
        "nav.events": "कार्यक्रम",
        "nav.audioGuide": "ऑडियो गाइड",
        "nav.aiQuiz": "AI प्रश्नोत्तरी",
        "nav.reviews": "समीक्षाएं",
        "nav.explore": "खोजें",
        "nav.login": "लॉग इन",
        "nav.signup": "साइन अप",
        "nav.logout": "लॉग आउट",
        "nav.signedIn": "साइन इन किया",
        "header.tagline": "पवित्र विरासत मंच",

        "hero.discover": "पवित्र खोजें",
        "hero.monasteries": "सिक्किम के मठ",
        "hero.subtitle": "हिमालय में बसे 200+ प्राचीन बौद्ध मठों की डिजिटल तीर्थयात्रा पर निकलें। इमर्सिव तकनीक से पवित्र विरासत का अनुभव करें।",
        "hero.exploreTours": "वर्चुअल टूर देखें",
        "hero.learnMore": "और जानें",
        "hero.aiBadge": "AI-संचालित विरासत मंच",
        "hero.monasteryCount": "200+ मठ",
        "hero.virtualTours": "वर्चुअल टूर",
        "hero.yearsHistory": "300+ वर्षों का इतिहास",

        "tours.title": "इमर्सिव वर्चुअल टूर",
        "tours.subtitle": "दुनिया में कहीं से भी सिक्किम के सबसे पवित्र मठों के अंदर कदम रखें। 360° पैनोरमिक दृश्य और सांस्कृतिक जानकारी का अनुभव करें।",
        "tours.featured": "विशेष",
        "tours.ready360": "360° तैयार",
        "tours.startFeatured": "टूर शुरू करें",
        "tours.completeExp": "संपूर्ण मठ अनुभव",
        "tours.completeDesc": "मुख्य प्रार्थना कक्ष, भिक्षुओं के कक्ष और पवित्र कलाकृतियों का एक व्यापक दौरा।",
        "tours.duration": "अवधि",
        "tours.startTour": "टूर शुरू करें",
        "tours.views": "दृश्य",

        "stats.monasteries": "मठ",
        "stats.visitors": "वार्षिक आगंतुक",
        "stats.years": "इतिहास के वर्ष",
        "stats.tours": "वर्चुअल टूर",

        "ai.chatbotTitle": "धर्म गाइड AI",
        "ai.chatbotOnline": "Gemini द्वारा संचालित",
        "ai.chatbotPlaceholder": "मठों, संस्कृति, यात्रा के बारे में पूछें...",
        "ai.tripTitle": "AI यात्रा योजनाकार",
        "ai.tripSubtitle": "हमारे AI को आपके लिए एक व्यक्तिगत मठ तीर्थयात्रा कार्यक्रम बनाने दें",
        "ai.quizTitle": "अपना ज्ञान परखें",
        "ai.quizSubtitle": "सिक्किम के मठों के बारे में AI-जनित प्रश्नों से चुनौती लें",
        "ai.insightsTitle": "AI मठ अंतर्दृष्टि",
        "ai.insightsSubtitle": "आकर्षक AI-जनित जानकारी जानने के लिए किसी मठ पर क्लिक करें",
        "ai.generatePlan": "मेरा कार्यक्रम बनाएं",
        "ai.startQuiz": "प्रश्नोत्तरी शुरू करें",

        "weather.title": "मठ का मौसम",
        "weather.subtitle": "प्रमुख मठ स्थानों पर वर्तमान स्थिति",

        "testimonials.title": "आगंतुक अनुभव",
        "testimonials.subtitle": "उन यात्रियों से सुनें जिन्होंने सिक्किम के पवित्र मठों की खोज की",

        "reviews.title": "अपना अनुभव साझा करें",
        "reviews.signInPrompt": "समीक्षाएं लिखने, विरासत सिक्के कमाने के लिए अपने Monastery360 खाते में साइन इन करें।",
        "reviews.submitReview": "समीक्षा जमा करें",
        "reviews.yourReviews": "आपकी समीक्षाएं",
        "reviews.empty": "अभी तक कोई समीक्षा नहीं। पहले अपना अनुभव साझा करें!",
        "reviews.rating": "आपकी रेटिंग",

        "login.welcome": "वापस स्वागत है",
        "login.subtitle": "अपनी पवित्र यात्रा जारी रखने के लिए साइन इन करें",
        "login.username": "उपयोगकर्ता नाम",
        "login.password": "पासवर्ड",
        "login.rememberMe": "मुझे याद रखें",
        "login.forgotPassword": "पासवर्ड भूल गए?",
        "login.signIn": "साइन इन",
        "login.noAccount": "खाता नहीं है?",
        "login.createAccount": "खाता बनाएं",

        "signup.title": "खाता बनाएं",
        "signup.subtitle": "आज ही अपनी पवित्र यात्रा शुरू करें",
        "signup.fullName": "पूरा नाम",
        "signup.email": "ईमेल",
        "signup.username": "उपयोगकर्ता नाम",
        "signup.password": "पासवर्ड",
        "signup.confirmPassword": "पासवर्ड की पुष्टि",
        "signup.agreeTerms": "मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं",
        "signup.create": "खाता बनाएं",
        "signup.haveAccount": "पहले से खाता है?",
        "signup.signIn": "साइन इन",

        "tourViewer.title": "वर्चुअल मठ टूर",
        "tourViewer.exit": "टूर से बाहर निकलें",
        "tourViewer.next": "अगला दृश्य",
        "tourViewer.prev": "पिछला",
        "tourViewer.info": "इस स्थान के बारे में",
        "tourViewer.clickHotspot": "अधिक जानने के लिए हॉटस्पॉट पर क्लिक करें",

        "footer.tagline": "प्रौद्योगिकी के माध्यम से पवित्र विरासत का संरक्षण",
        "footer.quickLinks": "त्वरित लिंक",
        "footer.contact": "संपर्क करें",
        "footer.rights": "सर्वाधिकार सुरक्षित",

        "general.loading": "लोड हो रहा है...",
        "general.error": "कुछ गलत हुआ",
        "general.close": "बंद करें",
        "general.back": "वापस",
    },
    ne: {
        "nav.home": "गृहपृष्ठ",
        "nav.virtualTours": "भर्चुअल टूर",
        "nav.archives": "अभिलेखालय",
        "nav.events": "कार्यक्रमहरू",
        "nav.audioGuide": "अडियो गाइड",
        "nav.aiQuiz": "AI क्विज",
        "nav.reviews": "समीक्षाहरू",
        "nav.explore": "अन्वेषण",
        "nav.login": "लग इन",
        "nav.signup": "साइन अप",
        "nav.logout": "लग आउट",
        "nav.signedIn": "साइन इन गरेको",
        "header.tagline": "पवित्र सम्पदा मञ्च",

        "hero.discover": "पवित्र खोज्नुहोस्",
        "hero.monasteries": "सिक्किमका गुम्बाहरू",
        "hero.subtitle": "हिमालयमा बसेका 200+ प्राचीन बौद्ध गुम्बाहरूको डिजिटल तीर्थयात्रामा निस्कनुहोस्।",
        "hero.exploreTours": "भर्चुअल टूर हेर्नुहोस्",
        "hero.learnMore": "थप जान्नुहोस्",
        "hero.aiBadge": "AI-संचालित सम्पदा मञ्च",
        "hero.monasteryCount": "200+ गुम्बाहरू",
        "hero.virtualTours": "भर्चुअल टूर",
        "hero.yearsHistory": "300+ वर्षको इतिहास",

        "tours.title": "इमर्सिभ भर्चुअल टूर",
        "tours.subtitle": "संसारको जुनसुकै ठाउँबाट सिक्किमका सबैभन्दा पवित्र गुम्बाहरू भित्र पस्नुहोस्।",
        "tours.featured": "विशेष",
        "tours.ready360": "360° तयार",
        "tours.startFeatured": "टूर सुरु गर्नुहोस्",
        "tours.completeExp": "सम्पूर्ण गुम्बा अनुभव",
        "tours.completeDesc": "मुख्य प्रार्थना कक्ष, भिक्षुहरूको कोठा र पवित्र कलाकृतिहरूको व्यापक भ्रमण।",
        "tours.duration": "अवधि",
        "tours.startTour": "टूर सुरु गर्नुहोस्",
        "tours.views": "दृश्यहरू",

        "stats.monasteries": "गुम्बाहरू",
        "stats.visitors": "वार्षिक आगन्तुकहरू",
        "stats.years": "इतिहासका वर्षहरू",
        "stats.tours": "भर्चुअल टूर",

        "ai.chatbotTitle": "धर्म गाइड AI",
        "ai.chatbotOnline": "Gemini द्वारा संचालित",
        "ai.chatbotPlaceholder": "गुम्बा, संस्कृति, यात्राबारे सोध्नुहोस्...",
        "ai.tripTitle": "AI यात्रा योजनाकार",
        "ai.tripSubtitle": "हाम्रो AI लाई तपाइँको लागि व्यक्तिगत तीर्थयात्रा कार्यक्रम बनाउन दिनुहोस्",
        "ai.quizTitle": "आफ्नो ज्ञान जाँच्नुहोस्",
        "ai.quizSubtitle": "सिक्किमका गुम्बाहरूबारे AI-उत्पन्न प्रश्नहरूसँग चुनौती लिनुहोस्",
        "ai.insightsTitle": "AI गुम्बा अन्तर्दृष्टि",
        "ai.insightsSubtitle": "रोचक AI-उत्पन्न जानकारी पत्ता लगाउन गुम्बामा क्लिक गर्नुहोस्",
        "ai.generatePlan": "मेरो कार्यक्रम बनाउनुहोस्",
        "ai.startQuiz": "क्विज सुरु गर्नुहोस्",

        "weather.title": "गुम्बाको मौसम",
        "weather.subtitle": "प्रमुख गुम्बा स्थानहरूमा वर्तमान अवस्था",

        "testimonials.title": "आगन्तुक अनुभवहरू",
        "testimonials.subtitle": "सिक्किमका पवित्र गुम्बाहरू अन्वेषण गर्ने यात्रीहरूबाट सुन्नुहोस्",

        "reviews.title": "आफ्नो अनुभव साझा गर्नुहोस्",
        "reviews.signInPrompt": "समीक्षा लेख्न र सम्पदा सिक्का कमाउन Monastery360 मा साइन इन गर्नुहोस्।",
        "reviews.submitReview": "समीक्षा पेश गर्नुहोस्",
        "reviews.yourReviews": "तपाईंका समीक्षाहरू",
        "reviews.empty": "अहिलेसम्म कुनै समीक्षा छैन।",
        "reviews.rating": "तपाईंको रेटिंग",

        "login.welcome": "फेरि स्वागत छ",
        "login.subtitle": "आफ्नो पवित्र यात्रा जारी राख्न साइन इन गर्नुहोस्",
        "login.username": "प्रयोगकर्ता नाम",
        "login.password": "पासवर्ड",
        "login.rememberMe": "मलाई सम्झनुहोस्",
        "login.forgotPassword": "पासवर्ड बिर्सनुभयो?",
        "login.signIn": "साइन इन",
        "login.noAccount": "खाता छैन?",
        "login.createAccount": "खाता बनाउनुहोस्",

        "signup.title": "खाता बनाउनुहोस्",
        "signup.subtitle": "आज नै आफ्नो पवित्र यात्रा सुरु गर्नुहोस्",
        "signup.fullName": "पूरा नाम",
        "signup.email": "ईमेल",
        "signup.username": "प्रयोगकर्ता नाम",
        "signup.password": "पासवर्ड",
        "signup.confirmPassword": "पासवर्ड पुष्टि",
        "signup.agreeTerms": "म सेवा शर्तहरू र गोपनीयता नीतिमा सहमत छु",
        "signup.create": "खाता बनाउनुहोस्",
        "signup.haveAccount": "पहिलेदेखि खाता छ?",
        "signup.signIn": "साइन इन",

        "tourViewer.title": "भर्चुअल गुम्बा टूर",
        "tourViewer.exit": "टूरबाट बाहिर निस्कनुहोस्",
        "tourViewer.next": "अर्को दृश्य",
        "tourViewer.prev": "अघिल्लो",
        "tourViewer.info": "यस स्थानको बारेमा",
        "tourViewer.clickHotspot": "थप जान्न हटस्पटमा क्लिक गर्नुहोस्",

        "footer.tagline": "प्रविधिको माध्यमबाट पवित्र सम्पदाको संरक्षण",
        "footer.quickLinks": "द्रुत लिंकहरू",
        "footer.contact": "सम्पर्क गर्नुहोस्",
        "footer.rights": "सर्वाधिकार सुरक्षित",

        "general.loading": "लोड हुँदैछ...",
        "general.error": "केही गलत भयो",
        "general.close": "बन्द गर्नुहोस्",
        "general.back": "पछाडि",
    },
    bo: {
        "nav.home": "གཙོ་ངོས།",
        "nav.virtualTours": "བརྙན་འཆར།",
        "nav.archives": "ཡིག་ཚགས།",
        "nav.events": "ལས་རིམ།",
        "nav.audioGuide": "སྒྲ་ལམ།",
        "nav.aiQuiz": "AI རིག་རྩལ།",
        "nav.reviews": "བསམ་ཚུལ།",
        "nav.explore": "འཚོལ།",
        "nav.login": "ནང་འཛུལ།",
        "nav.signup": "ཐོ་འགོད།",
        "nav.logout": "ཕྱིར་འདོན།",
        "nav.signedIn": "ནང་འཛུལ་ཟིན།",
        "header.tagline": "དམ་པའི་ཤུལ་བཞག",

        "hero.discover": "དམ་པའི་ཁ་འབྱེད།",
        "hero.monasteries": "སིག་ཀིམ་གྱི་དགོན་པ།",
        "hero.subtitle": "ཧི་མ་ལ་ཡའི་ནང་གི་བོད་བརྒྱུད་ནང་བསྟན་གྱི་དགོན་པ་200 ལྷག་གི་ཨང་ཀིའི་གནས་བསྐོར།",
        "hero.exploreTours": "བརྙན་འཆར་ལྟ།",
        "hero.learnMore": "ཆེས་མང་ཤེས།",
        "hero.aiBadge": "AI-དགོན་པའི་ཤུལ་བཞག",
        "hero.monasteryCount": "200+ དགོན་པ།",
        "hero.virtualTours": "བརྙན་འཆར།",
        "hero.yearsHistory": "300+ ལོའི་ལོ་རྒྱུས།",

        "tours.title": "བརྙན་འཆར་ཚང་མ།",
        "tours.subtitle": "འཛམ་གླིང་གང་སར་ནས་སིག་ཀིམ་གྱི་དགོན་པ་ནང་ཞུགས།",
        "tours.featured": "དམིགས་བསལ།",
        "tours.ready360": "360° གྲ་སྒྲིག",
        "tours.startFeatured": "འཆར་སྒོ་ཕྱེ།",
        "tours.completeExp": "ཚང་མའི་དགོན་པའི་ཉམས་མྱོང།",
        "tours.completeDesc": "དགོན་པའི་གཙོ་བའི་ཁང་པ་དང་གྲྭ་ཤག་དང་དམ་རྫས་ཀྱི་བརྙན་འཆར།",
        "tours.duration": "དུས་ཡུན།",
        "tours.startTour": "བརྙན་འཆར་འགོ་འཛུགས།",
        "tours.views": "མཐོང་ཐེངས།",

        "stats.monasteries": "དགོན་པ།",
        "stats.visitors": "ལོ་རེའི་གནས་སྐོར་བ།",
        "stats.years": "ལོ་རྒྱུས་ཀྱི་ལོ།",
        "stats.tours": "བརྙན་འཆར།",

        "ai.chatbotTitle": "ཆོས་ཀྱི་ལམ་སྟོན་AI",
        "ai.chatbotOnline": "Gemini ས་བཀོལ།",
        "ai.chatbotPlaceholder": "དགོན་པ་རིག་གནས་སྐོར་དྲིས།",
        "ai.tripTitle": "AI འགྲུལ་བཞུད།",
        "ai.tripSubtitle": "AI ས་ཁྱེད་ཀྱི་གནས་བསྐོར་ལས་རིམ་བཟོས།",
        "ai.quizTitle": "ཤེས་བྱ་ཚད་ལྟ།",
        "ai.quizSubtitle": "སིག་ཀིམ་དགོན་པའི་AI དྲི་བས་རྩོད།",
        "ai.insightsTitle": "AI དགོན་པའི་གོ་རྟོགས།",
        "ai.insightsSubtitle": "AI གོ་རྟོགས་ཤེས་ཕྱིར་དགོན་པར་ཨེབ།",
        "ai.generatePlan": "ལས་རིམ་བཟོས།",
        "ai.startQuiz": "རིག་རྩལ་འགོ་འཛུགས།",

        "weather.title": "དགོན་པའི་གནམ་གཤིས།",
        "weather.subtitle": "དགོན་པ་གནས་ཀྱི་གནམ་གཤིས།",

        "testimonials.title": "གནས་སྐོར་བའི་ཉམས་མྱོང།",
        "testimonials.subtitle": "སིག་ཀིམ་གནས་སྐོར་བྱས་པའི་མི་ལས་ཉོན།",

        "reviews.title": "ཉམས་མྱོང་བརྗོད།",
        "reviews.signInPrompt": "བསམ་ཚུལ་བྲི་ཕྱིར་ Monastery360 ནང་འཛུལ་རོགས།",
        "reviews.submitReview": "བསམ་ཚུལ་འབུལ།",
        "reviews.yourReviews": "ཁྱེད་ཀྱི་བསམ་ཚུལ།",
        "reviews.empty": "ད་ལྟ་བསམ་ཚུལ་མེད།",
        "reviews.rating": "ཁྱེད་ཀྱི་ཐོབ་ཨང།",

        "login.welcome": "བསུ་བ་ཞུ།",
        "login.subtitle": "གནས་བསྐོར་མུ་མཐུད་ཕྱིར་ནང་འཛུལ།",
        "login.username": "མིང།",
        "login.password": "གསང་ཨང།",
        "login.rememberMe": "ངའི་མིང་གསོག",
        "login.forgotPassword": "གསང་ཨང་བརྗེད་སོང་?",
        "login.signIn": "ནང་འཛུལ།",
        "login.noAccount": "ཐོ་མེད་དམ?",
        "login.createAccount": "ཐོ་འགོད།",

        "signup.title": "ཐོ་འགོད།",
        "signup.subtitle": "གནས་བསྐོར་དེ་རིང་འགོ་བརྩམ།",
        "signup.fullName": "མིང་ཚང་མ།",
        "signup.email": "གློག་འཕྲིན།",
        "signup.username": "མིང།",
        "signup.password": "གསང་ཨང།",
        "signup.confirmPassword": "གསང་ཨང་བསྐྱར།",
        "signup.agreeTerms": "ང་ཆ་རྐྱེན་ལ་མོས།",
        "signup.create": "ཐོ་འགོད།",
        "signup.haveAccount": "ཐོ་ཡོད་དམ?",
        "signup.signIn": "ནང་འཛུལ།",

        "tourViewer.title": "བརྙན་དགོན་པ་བསྐོར།",
        "tourViewer.exit": "བསྐོར་ནས་ཕྱིར་འདོན།",
        "tourViewer.next": "རྗེས་མའི་ས་ཆ།",
        "tourViewer.prev": "སྔ་མ།",
        "tourViewer.info": "ས་ཆ་འདིའི་སྐོར།",
        "tourViewer.clickHotspot": "ཆེས་མང་ཤེས་ཕྱིར་ཨེབ།",

        "footer.tagline": "ཐབས་རྩལ་ཞུགས་དམ་པའི་ཤུལ་བཞག་སྲུང།",
        "footer.quickLinks": "མྱུར་སྦྲེལ།",
        "footer.contact": "འབྲེལ་གཏུགས།",
        "footer.rights": "ཐོབ་ཐང་སྲུང།",

        "general.loading": "འཇུག་བཞིན་པ...",
        "general.error": "ནོར་འཁྲུལ་བྱུང།",
        "general.close": "སྒོ་རྒྱག",
        "general.back": "ཕྱིར་ལོག",
    },
    bn: {
        "nav.home": "হোম",
        "nav.virtualTours": "ভার্চুয়াল ট্যুর",
        "nav.archives": "আর্কাইভ",
        "nav.events": "ইভেন্ট",
        "nav.audioGuide": "অডিও গাইড",
        "nav.aiQuiz": "AI কুইজ",
        "nav.reviews": "পর্যালোচনা",
        "nav.explore": "অন্বেষণ",
        "nav.login": "লগ ইন",
        "nav.signup": "সাইন আপ",
        "nav.logout": "লগ আউট",
        "nav.signedIn": "সাইন ইন করা হয়েছে",
        "header.tagline": "পবিত্র ঐতিহ্য প্ল্যাটফর্ম",

        "hero.discover": "পবিত্র আবিষ্কার করুন",
        "hero.monasteries": "সিকিমের মঠ",
        "hero.subtitle": "হিমালয়ে অবস্থিত ২০০+ প্রাচীন বৌদ্ধ মঠের ডিজিটাল তীর্থযাত্রায় বেরিয়ে পড়ুন।",
        "hero.exploreTours": "ভার্চুয়াল ট্যুর দেখুন",
        "hero.learnMore": "আরও জানুন",
        "hero.aiBadge": "AI-চালিত ঐতিহ্য প্ল্যাটফর্ম",
        "hero.monasteryCount": "২০০+ মঠ",
        "hero.virtualTours": "ভার্চুয়াল ট্যুর",
        "hero.yearsHistory": "৩০০+ বছরের ইতিহাস",

        "tours.title": "ইমার্সিভ ভার্চুয়াল ট্যুর",
        "tours.subtitle": "বিশ্বের যেকোনো জায়গা থেকে সিকিমের পবিত্র মঠগুলিতে প্রবেশ করুন।",
        "tours.featured": "বিশেষ",
        "tours.ready360": "৩৬০° প্রস্তুত",
        "tours.startFeatured": "ট্যুর শুরু করুন",
        "tours.completeExp": "সম্পূর্ণ মঠ অভিজ্ঞতা",
        "tours.completeDesc": "প্রধান প্রার্থনা কক্ষ, সন্ন্যাসীদের কক্ষ এবং পবিত্র নিদর্শনগুলির বিস্তৃত ট্যুর।",
        "tours.duration": "সময়কাল",
        "tours.startTour": "ট্যুর শুরু করুন",
        "tours.views": "দর্শন",

        "stats.monasteries": "মঠ",
        "stats.visitors": "বার্ষিক দর্শনার্থী",
        "stats.years": "ইতিহাসের বছর",
        "stats.tours": "ভার্চুয়াল ট্যুর",

        "ai.chatbotTitle": "ধর্ম গাইড AI",
        "ai.chatbotOnline": "Gemini দ্বারা চালিত",
        "ai.chatbotPlaceholder": "মঠ, সংস্কৃতি, ভ্রমণ সম্পর্কে জিজ্ঞাসা করুন...",
        "ai.tripTitle": "AI ভ্রমণ পরিকল্পনাকারী",
        "ai.tripSubtitle": "আমাদের AI আপনার জন্য ব্যক্তিগত তীর্থযাত্রা পরিকল্পনা তৈরি করুক",
        "ai.quizTitle": "আপনার জ্ঞান পরীক্ষা করুন",
        "ai.quizSubtitle": "সিকিমের মঠ সম্পর্কে AI-উত্পন্ন প্রশ্নে চ্যালেঞ্জ নিন",
        "ai.insightsTitle": "AI মঠ অন্তর্দৃষ্টি",
        "ai.insightsSubtitle": "মনোমুগ্ধকর তথ্য জানতে একটি মঠে ক্লিক করুন",
        "ai.generatePlan": "আমার পরিকল্পনা তৈরি করুন",
        "ai.startQuiz": "কুইজ শুরু করুন",

        "weather.title": "মঠের আবহাওয়া",
        "weather.subtitle": "প্রধান মঠ স্থানগুলিতে বর্তমান অবস্থা",

        "testimonials.title": "দর্শনার্থীদের অভিজ্ঞতা",
        "testimonials.subtitle": "সিকিমের পবিত্র মঠ অন্বেষণকারী ভ্রমণকারীদের কাছ থেকে শুনুন",

        "reviews.title": "আপনার অভিজ্ঞতা শেয়ার করুন",
        "reviews.signInPrompt": "পর্যালোচনা লিখতে Monastery360-এ সাইন ইন করুন।",
        "reviews.submitReview": "পর্যালোচনা জমা দিন",
        "reviews.yourReviews": "আপনার পর্যালোচনা",
        "reviews.empty": "এখনও কোনো পর্যালোচনা নেই।",
        "reviews.rating": "আপনার রেটিং",

        "login.welcome": "স্বাগত",
        "login.subtitle": "আপনার পবিত্র যাত্রা চালিয়ে যেতে সাইন ইন করুন",
        "login.username": "ইউজারনেম",
        "login.password": "পাসওয়ার্ড",
        "login.rememberMe": "আমাকে মনে রাখুন",
        "login.forgotPassword": "পাসওয়ার্ড ভুলেছেন?",
        "login.signIn": "সাইন ইন",
        "login.noAccount": "অ্যাকাউন্ট নেই?",
        "login.createAccount": "অ্যাকাউন্ট তৈরি করুন",

        "signup.title": "অ্যাকাউন্ট তৈরি করুন",
        "signup.subtitle": "আজই আপনার পবিত্র যাত্রা শুরু করুন",
        "signup.fullName": "পুরো নাম",
        "signup.email": "ইমেইল",
        "signup.username": "ইউজারনেম",
        "signup.password": "পাসওয়ার্ড",
        "signup.confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
        "signup.agreeTerms": "আমি পরিষেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত",
        "signup.create": "অ্যাকাউন্ট তৈরি করুন",
        "signup.haveAccount": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
        "signup.signIn": "সাইন ইন",

        "tourViewer.title": "ভার্চুয়াল মঠ ট্যুর",
        "tourViewer.exit": "ট্যুর থেকে প্রস্থান",
        "tourViewer.next": "পরবর্তী দৃশ্য",
        "tourViewer.prev": "পূর্ববর্তী",
        "tourViewer.info": "এই স্থান সম্পর্কে",
        "tourViewer.clickHotspot": "আরও জানতে হটস্পটে ক্লিক করুন",

        "footer.tagline": "প্রযুক্তির মাধ্যমে পবিত্র ঐতিহ্য সংরক্ষণ",
        "footer.quickLinks": "দ্রুত লিঙ্ক",
        "footer.contact": "যোগাযোগ করুন",
        "footer.rights": "সর্বস্বত্ব সংরক্ষিত",

        "general.loading": "লোড হচ্ছে...",
        "general.error": "কিছু ভুল হয়েছে",
        "general.close": "বন্ধ করুন",
        "general.back": "পিছনে",
    },
};

// Context
interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
    language: "en",
    setLanguage: () => { },
    t: (key) => key,
});

// Provider
export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem("monastery360_lang");
        return (saved as Language) || "en";
    });

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("monastery360_lang", lang);
    };

    const t = (key: string): string => {
        return translations[language]?.[key] || translations["en"]?.[key] || key;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

// Hook
export const useTranslation = () => useContext(I18nContext);
