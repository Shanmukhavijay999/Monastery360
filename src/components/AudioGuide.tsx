import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AudioLines, Download, Play, Pause, SkipBack, SkipForward, Languages, MapPin, Headphones, Wifi, Volume2, VolumeX, CheckCircle, Loader2, X } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

// ── Translations ────────────────────────────────────────────────────────────
const T = {
  English: {
    heading: "Smart Audio Guide",
    sub: "Intelligent audio guides that adapt to your location, preferences, and pace. Available in multiple languages with offline support.",
    features: [
      { title: "GPS Narration", desc: "Auto audio based on your location within monastery grounds", status: "Available" },
      { title: "Offline Mode", desc: "Download audio guides for remote locations without internet", status: "Premium" },
      { title: "Multi-Language", desc: "6 languages with native speaker narration and context", status: "Available" },
      { title: "3D Spatial Audio", desc: "Immersive soundscape with bells, chants, and ambient sounds", status: "Coming Soon" },
    ],
    playerTitle: "Smart Audio Experience", playerSub: "Location-aware spiritual journey",
    playerDesc: "Our intelligent audio guide uses GPS and Bluetooth beacons to deliver contextual information exactly when and where you need it.",
    locLabel: "Current Location", locVal: "Monastery Entrance",
    qualLabel: "Audio Quality", qualVal: "High (320kbps)",
    connLabel: "Connection", connVal: "Connected",
    startBtn: "Start Audio Tour", dlBtn: "Download Offline", savedBtn: "Saved Offline",
    chooseLang: "Choose Your Language", toursTitle: "Available Audio Tours",
    nowPlaying: "Now Playing", paused: "Paused", play: "Play", pause: "Pause",
    durLabel: "Duration", locTourLabel: "Locations", sizeLabel: "Size",
    trackOf: "Track", of: "of", downloading: "Downloading…",
    tracks: [
      { title: "Welcome to Rumtek Monastery", sub: "Introduction & History", desc: "Comprehensive tour covering history, architecture, and spiritual significance" },
      { title: "Meditation & Mindfulness", sub: "Sacred Spaces", desc: "Guided meditation sessions in sacred spaces with breathing exercises" },
      { title: "Artistic Heritage Tour", sub: "Thangka & Architecture", desc: "Deep dive into thangka paintings, sculptures, and architectural details" },
    ],
    toastStart: "▶ Audio tour started! Enjoy your journey.",
    toastLang: (l: string) => `🌐 Language set to ${l}`,
    toastDl: (t: string) => `⬇️ Downloading "${t}"…`,
    toastSaved: (t: string) => `✅ "${t}" saved for offline listening!`,
    toastErr: "⚠️ Could not load audio. Check your connection.",
    toastTap: "⚠️ Tap play to start — browser requires a user gesture first.",
  },
  Hindi: {
    heading: "स्मार्ट ऑडियो गाइड",
    sub: "बुद्धिमान ऑडियो गाइड जो आपके स्थान, प्राथमिकताओं और गति के अनुसार अनुकूलित होती है। ऑफ़लाइन समर्थन के साथ कई भाषाओं में उपलब्ध।",
    features: [
      { title: "GPS कथन", desc: "मठ परिसर में आपके स्थान के आधार पर स्वचालित ऑडियो", status: "उपलब्ध" },
      { title: "ऑफ़लाइन मोड", desc: "इंटरनेट के बिना दूरस्थ स्थानों के लिए ऑडियो गाइड डाउनलोड करें", status: "प्रीमियम" },
      { title: "बहु-भाषा", desc: "मूल वक्ता कथन के साथ 6 भाषाएँ", status: "उपलब्ध" },
      { title: "3D ऑडियो", desc: "घंटियों और मंत्रों के साथ इमर्सिव अनुभव", status: "शीघ्र आ रहा है" },
    ],
    playerTitle: "स्मार्ट ऑडियो अनुभव", playerSub: "स्थान-जागरूक आध्यात्मिक यात्रा",
    playerDesc: "हमारा बुद्धिमान ऑडियो गाइड GPS और ब्लूटूथ बीकन का उपयोग करके प्रासंगिक जानकारी ठीक उसी समय और स्थान पर देता है जहाँ आपको इसकी आवश्यकता है।",
    locLabel: "वर्तमान स्थान", locVal: "मठ प्रवेश द्वार",
    qualLabel: "ऑडियो गुणवत्ता", qualVal: "उच्च (320kbps)",
    connLabel: "कनेक्शन", connVal: "कनेक्टेड",
    startBtn: "ऑडियो टूर शुरू करें", dlBtn: "ऑफ़लाइन डाउनलोड", savedBtn: "ऑफ़लाइन सहेजा गया",
    chooseLang: "अपनी भाषा चुनें", toursTitle: "उपलब्ध ऑडियो टूर",
    nowPlaying: "अभी चल रहा है", paused: "रोका गया", play: "चलाएं", pause: "रोकें",
    durLabel: "अवधि", locTourLabel: "स्थान", sizeLabel: "आकार",
    trackOf: "ट्रैक", of: "का", downloading: "डाउनलोड हो रहा है…",
    tracks: [
      { title: "रुमटेक मठ में आपका स्वागत है", sub: "परिचय और इतिहास", desc: "इतिहास, वास्तुकला और आध्यात्मिक महत्व को कवर करने वाला व्यापक दौरा" },
      { title: "ध्यान और सचेतनता", sub: "पवित्र स्थान", desc: "श्वास अभ्यास के साथ पवित्र स्थानों में निर्देशित ध्यान सत्र" },
      { title: "कलात्मक विरासत यात्रा", sub: "थांगका और वास्तुकला", desc: "थांगका चित्रों, मूर्तियों और वास्तुकला विवरण में गहरी जानकारी" },
    ],
    toastStart: "▶ ऑडियो टूर शुरू हुआ! अपनी यात्रा का आनंद लें।",
    toastLang: (l: string) => `🌐 भाषा बदली गई: ${l}`,
    toastDl: (t: string) => `⬇️ डाउनलोड हो रहा है: "${t}"…`,
    toastSaved: (t: string) => `✅ "${t}" ऑफ़लाइन सुनने के लिए सहेजा गया!`,
    toastErr: "⚠️ ऑडियो लोड नहीं हो सका। अपना कनेक्शन जांचें।",
    toastTap: "⚠️ चलाने के लिए प्ले दबाएं।",
  },
  Tibetan: {
    heading: "གཏོར་ཤེས་སྒྲ་དཔེ་ཁྲིད",
    sub: "རང་གི་གནས་ས་དང་དགའ་ཚོར་ལ་མཐུན་པའི་སྒྲ་དཔེ་ཁྲིད། མི་ཐག་རྒྱབ་སྐྱོར་དང་བཅས་སྐད་ཡིག་མང་པོར་ཐོབ་སྲིད།",
    features: [
      { title: "GPS གཏམ་བཤད", desc: "དགོན་པའི་ས་ཆར་གནས་ས་ལ་གཞི་རྩར་བྱས་པའི་སྒྲ་རང་འགུལ", status: "ཐོབ་སྲིད" },
      { title: "མི་ཐག་ཐབས", desc: "དྲ་རྒྱ་མེད་པར་ཐག་རིང་དུ་སྒྲ་དཔེ་ཁྲིད་ལེན་པ", status: "ཆེས་མཐོ" },
      { title: "སྐད་ཡིག་མང་པོ", desc: "རང་ཉིད་སྐད་ཡིག་བཀོལ་མི་དང་སྐད་ཡིག་དྲུག", status: "ཐོབ་སྲིད" },
      { title: "3D སྒྲ་གདངས", desc: "དྲིལ་བུ་དང་གཞས་སྐད་ཀྱིས་ཡོངས་ཁྱབ་སྒྲ་གདངས", status: "ཤུལ་མར་འབྱུང" },
    ],
    playerTitle: "གཏོར་ཤེས་སྒྲ་ཉམས་མྱོང", playerSub: "གནས་ས་རིག་པའི་ལྷག་བསམ་འཕྲིན",
    playerDesc: "བདག་ཅག་གི་གཏོར་ཤེས་སྒྲ་དཔེ་ཁྲིད་ཀྱིས་GPS དང་Bluetooth beacon བཀོལ་ནས་གནས་ས་གང་དུ་ཡོད་པ་དེར་གལ་ཆེའི་ཤེས་རྟོགས་སྤྲད།",
    locLabel: "ད་ལྟའི་གནས་ས", locVal: "དགོན་པའི་འཇུག་སྒོ",
    qualLabel: "སྒྲའི་གཟུགས་བརྙན", qualVal: "མཐོ་རིམ (320kbps)",
    connLabel: "སྦྲེལ་མཐུད", connVal: "སྦྲེལ་མཐུད་ཟིན",
    startBtn: "སྒྲ་དཔེ་འཕྲིན་འགོ་འཛུགས", dlBtn: "མི་ཐག་ལེན་པ", savedBtn: "མི་ཐག་ཉར་ཟིན",
    chooseLang: "རང་གི་སྐད་ཡིག་འདེམས་རོགས", toursTitle: "ཐོབ་སྲིད་སྒྲ་དཔེ་འཕྲིན",
    nowPlaying: "ད་ལྟ་བཅར་བཞིན", paused: "བཀག་ཟིན", play: "བཅར", pause: "བཀག",
    durLabel: "དུས་ཚོད", locTourLabel: "གནས་ས", sizeLabel: "ཆེ་ཆུང",
    trackOf: "ཐབས", of: "ལས", downloading: "ལེན་བཞིན་པ…",
    tracks: [
      { title: "རུམ་ཐེག་དགོན་པར་ཕེབས་པར་གསོལ་བ་འདེབས", sub: "ངོ་སྤྲོད་དང་ལོ་རྒྱུས", desc: "ལོ་རྒྱུས་དང་བཟོ་རིག་དང་ལྷག་བསམ་གི་གལ་ཆེ་ཡོངས་རྫོགས" },
      { title: "སྒོམ་པ་དང་ཡིད་གཙང", sub: "གནས་མཆོག་ས་ཆ", desc: "དབུགས་རྒྱུག་སྦྱོང་བདར་དང་བཅས་གནས་མཆོག་ས་ཆར་སྒོམ་ཁྲིད" },
      { title: "རིག་གནས་རང་བཞིན་འཕྲིན", sub: "ཐང་ཀ་དང་བཟོ་རིག", desc: "ཐང་ཀ་དང་རི་མོ་ཆ་ཤས་ལ་ཞིབ་འཇུག" },
    ],
    toastStart: "▶ སྒྲ་དཔེ་འཕྲིན་འགོ་འཛུགས་ཟིན།",
    toastLang: (l: string) => `🌐 སྐད་ཡིག་བཟོ་ཟིན: ${l}`,
    toastDl: (t: string) => `⬇️ ལེན་བཞིན་པ: "${t}"…`,
    toastSaved: (t: string) => `✅ "${t}" མི་ཐག་ཉར་ཟིན།`,
    toastErr: "⚠️ སྒྲ་ལོད་ཐུབ་མ་སོང།",
    toastTap: "⚠️ བཅར་རྒྱུར་ play གདབ་རོགས།",
  },
  Nepali: {
    heading: "स्मार्ट अडियो गाइड",
    sub: "बुद्धिमान अडियो गाइड जो तपाईंको स्थान, प्राथमिकता र गतिमा अनुकूलित हुन्छ। अफलाइन समर्थनसहित धेरै भाषाहरूमा उपलब्ध।",
    features: [
      { title: "GPS वर्णन", desc: "मठ परिसरमा तपाईंको स्थानमा आधारित स्वचालित अडियो", status: "उपलब्ध" },
      { title: "अफलाइन मोड", desc: "इन्टरनेट बिना दूरस्थ ठाउँहरूका लागि अडियो गाइड डाउनलोड गर्नुहोस्", status: "प्रिमियम" },
      { title: "बहु-भाषा", desc: "मूल वक्ता वर्णनसहित ६ भाषाहरू", status: "उपलब्ध" },
      { title: "3D ध्वनि", desc: "घण्टी र जापसहित इमर्सिभ साउन्डस्केप", status: "शीघ्र आउँदै" },
    ],
    playerTitle: "स्मार्ट अडियो अनुभव", playerSub: "स्थान-जागरूक आध्यात्मिक यात्रा",
    playerDesc: "हाम्रो बुद्धिमान अडियो गाइडले GPS र ब्लुटुथ बिकनहरू प्रयोग गरेर ठीक जुन समयमा र जहाँ चाहिन्छ त्यहाँ प्रासंगिक जानकारी दिन्छ।",
    locLabel: "हालको स्थान", locVal: "मठ प्रवेशद्वार",
    qualLabel: "अडियो गुणस्तर", qualVal: "उच्च (320kbps)",
    connLabel: "जडान", connVal: "जडित",
    startBtn: "अडियो भ्रमण सुरु गर्नुहोस्", dlBtn: "अफलाइन डाउनलोड", savedBtn: "अफलाइन सुरक्षित",
    chooseLang: "आफ्नो भाषा छान्नुहोस्", toursTitle: "उपलब्ध अडियो भ्रमणहरू",
    nowPlaying: "अहिले बजिरहेको", paused: "रोकिएको", play: "बजाउनुहोस्", pause: "रोक्नुहोस्",
    durLabel: "अवधि", locTourLabel: "स्थानहरू", sizeLabel: "साइज",
    trackOf: "ट्र्याक", of: "मध्ये", downloading: "डाउनलोड हुँदैछ…",
    tracks: [
      { title: "रुम्तेक गुम्बामा स्वागत छ", sub: "परिचय र इतिहास", desc: "इतिहास, वास्तुकला र आध्यात्मिक महत्त्व समेट्ने व्यापक भ्रमण" },
      { title: "ध्यान र सचेतनता", sub: "पवित्र स्थानहरू", desc: "सास फेर्ने व्यायामसहित पवित्र ठाउँहरूमा निर्देशित ध्यान सत्रहरू" },
      { title: "कलात्मक सम्पदा भ्रमण", sub: "थाङ्का र वास्तुकला", desc: "थाङ्का चित्रहरू, मूर्तिहरू र वास्तुकला विवरणहरूमा गहिरो अन्वेषण" },
    ],
    toastStart: "▶ अडियो भ्रमण सुरु भयो! आफ्नो यात्राको आनन्द लिनुहोस्।",
    toastLang: (l: string) => `🌐 भाषा बदलियो: ${l}`,
    toastDl: (t: string) => `⬇️ डाउनलोड हुँदैछ: "${t}"…`,
    toastSaved: (t: string) => `✅ "${t}" अफलाइन सुन्नका लागि सुरक्षित!`,
    toastErr: "⚠️ अडियो लोड भएन। आफ्नो जडान जाँच गर्नुहोस्।",
    toastTap: "⚠️ सुरु गर्न प्ले थिच्नुहोस्।",
  },
  Chinese: {
    heading: "智能语音导览",
    sub: "根据您的位置、偏好和步伐自动调整的智能语音导览，支持多语言和离线模式。",
    features: [
      { title: "GPS 解说", desc: "根据您在寺院内的位置自动播放音频", status: "可用" },
      { title: "离线模式", desc: "为无网络的偏远地点下载语音导览", status: "高级" },
      { title: "多语言", desc: "6 种语言，配有母语解说与背景说明", status: "可用" },
      { title: "3D 立体声", desc: "融合钟声、颂经与环境音效的沉浸式音景", status: "即将推出" },
    ],
    playerTitle: "智能语音体验", playerSub: "位置感知的心灵之旅",
    playerDesc: "我们的智能语音导览利用 GPS 和蓝牙信标，在您需要的时间和地点精准提供相关信息。",
    locLabel: "当前位置", locVal: "寺院入口",
    qualLabel: "音质", qualVal: "高品质 (320kbps)",
    connLabel: "连接状态", connVal: "已连接",
    startBtn: "开始语音导览", dlBtn: "离线下载", savedBtn: "已离线保存",
    chooseLang: "选择您的语言", toursTitle: "可用语音导览",
    nowPlaying: "正在播放", paused: "已暂停", play: "播放", pause: "暂停",
    durLabel: "时长", locTourLabel: "地点", sizeLabel: "大小",
    trackOf: "第", of: "首共", downloading: "下载中…",
    tracks: [
      { title: "欢迎来到朗木赛寺", sub: "简介与历史", desc: "全面介绍寺院的历史、建筑与宗教意义" },
      { title: "冥想与正念", sub: "神圣空间", desc: "在神圣空间内进行引导冥想，配合呼吸练习" },
      { title: "艺术遗产之旅", sub: "唐卡与建筑", desc: "深入探索唐卡画作、雕塑与建筑细节" },
    ],
    toastStart: "▶ 语音导览已开始！祝您旅途愉快。",
    toastLang: (l: string) => `🌐 语言已切换为 ${l}`,
    toastDl: (t: string) => `⬇️ 正在下载"${t}"…`,
    toastSaved: (t: string) => `✅"${t}"已保存，可离线收听！`,
    toastErr: "⚠️ 无法加载音频，请检查网络连接。",
    toastTap: "⚠️ 请点击播放键开始。",
  },
  Japanese: {
    heading: "スマート音声ガイド",
    sub: "現在地・好み・ペースに合わせて自動調整するインテリジェント音声ガイド。オフラインサポートを含む多言語対応。",
    features: [
      { title: "GPS ナレーション", desc: "寺院内の位置に応じて自動再生される音声ガイド", status: "利用可能" },
      { title: "オフラインモード", desc: "インターネット不要の遠隔地向けに音声ダウンロード", status: "プレミアム" },
      { title: "多言語対応", desc: "ネイティブスピーカーによる6言語のナレーション", status: "利用可能" },
      { title: "3D 立体音響", desc: "鐘・読経・環境音による没入型サウンドスケープ", status: "近日公開" },
    ],
    playerTitle: "スマート音声体験", playerSub: "位置情報連動のスピリチュアルな旅",
    playerDesc: "インテリジェント音声ガイドはGPSとBluetoothビーコンを活用し、必要な時・場所で的確な情報をお届けします。",
    locLabel: "現在地", locVal: "寺院入口",
    qualLabel: "音質", qualVal: "高品質 (320kbps)",
    connLabel: "接続状態", connVal: "接続済み",
    startBtn: "音声ツアーを開始", dlBtn: "オフラインでダウンロード", savedBtn: "オフライン保存済み",
    chooseLang: "言語を選択", toursTitle: "利用可能な音声ツアー",
    nowPlaying: "再生中", paused: "一時停止", play: "再生", pause: "停止",
    durLabel: "収録時間", locTourLabel: "スポット数", sizeLabel: "サイズ",
    trackOf: "トラック", of: "/", downloading: "ダウンロード中…",
    tracks: [
      { title: "ルムテク寺院へようこそ", sub: "紹介と歴史", desc: "歴史・建築・宗教的意義を網羅する総合ツアー" },
      { title: "瞑想とマインドフルネス", sub: "聖なる空間", desc: "呼吸法を取り入れた神聖な場所での瞑想セッション" },
      { title: "芸術遺産ツアー", sub: "タンカと建築", desc: "タンカ絵画・彫刻・建築細部を深く探求" },
    ],
    toastStart: "▶ 音声ツアーを開始しました！旅をお楽しみください。",
    toastLang: (l: string) => `🌐 言語を変更しました: ${l}`,
    toastDl: (t: string) => `⬇️「${t}」をダウンロード中…`,
    toastSaved: (t: string) => `✅「${t}」をオフライン用に保存しました！`,
    toastErr: "⚠️ 音声を読み込めませんでした。接続を確認してください。",
    toastTap: "⚠️ 再生ボタンを押してください。",
  },
  Bengali: {
    heading: "স্মার্ট অডিও গাইড",
    sub: "আপনার অবস্থান, পছন্দ এবং গতির সাথে মানিয়ে নেওয়া বুদ্ধিমান অডিও গাইড। অফলাইন সমর্থনসহ একাধিক ভাষায় উপলব্ধ।",
    features: [
      { title: "GPS বর্ণনা", desc: "মঠ প্রাঙ্গণে আপনার অবস্থানের ভিত্তিতে স্বয়ংক্রিয় অডিও", status: "উপলব্ধ" },
      { title: "অফলাইন মোড", desc: "ইন্টারনেট ছাড়া দূরবর্তী স্থানের জন্য অডিও গাইড ডাউনলোড করুন", status: "প্রিমিয়াম" },
      { title: "বহু-ভাষা", desc: "মাতৃভাষী বর্ণনাসহ ৬টি ভাষা", status: "উপলব্ধ" },
      { title: "3D স্থানিক অডিও", desc: "ঘণ্টা, সংকীর্তন এবং পরিবেশগত শব্দসহ নিমজ্জিত সাউন্ডস্কেপ", status: "শীঘ্রই আসছে" },
    ],
    playerTitle: "স্মার্ট অডিও অভিজ্ঞতা", playerSub: "অবস্থান-সচেতন আধ্যাত্মিক যাত্রা",
    playerDesc: "আমাদের বুদ্ধিমান অডিও গাইড GPS ও ব্লুটুথ বিকন ব্যবহার করে ঠিক যখন ও যেখানে প্রয়োজন সেখানে প্রাসঙ্গিক তথ্য সরবরাহ করে।",
    locLabel: "বর্তমান অবস্থান", locVal: "মঠের প্রবেশদ্বার",
    qualLabel: "অডিও গুণমান", qualVal: "উচ্চ (320kbps)",
    connLabel: "সংযোগ", connVal: "সংযুক্ত",
    startBtn: "অডিও ট্যুর শুরু করুন", dlBtn: "অফলাইন ডাউনলোড", savedBtn: "অফলাইনে সংরক্ষিত",
    chooseLang: "আপনার ভাষা বেছে নিন", toursTitle: "উপলব্ধ অডিও ট্যুর",
    nowPlaying: "এখন বাজছে", paused: "বিরতি", play: "চালান", pause: "থামান",
    durLabel: "সময়কাল", locTourLabel: "স্থান", sizeLabel: "আকার",
    trackOf: "ট্র্যাক", of: "এর মধ্যে", downloading: "ডাউনলোড হচ্ছে…",
    tracks: [
      { title: "রুমটেক মঠে আপনাকে স্বাগতম", sub: "পরিচিতি ও ইতিহাস", desc: "ইতিহাস, স্থাপত্য ও আধ্যাত্মিক তাৎপর্য সম্বলিত ব্যাপক ট্যুর" },
      { title: "ধ্যান ও মননশীলতা", sub: "পবিত্র স্থান", desc: "শ্বাস-প্রশ্বাসের ব্যায়ামসহ পবিত্র স্থানে নির্দেশিত ধ্যান সেশন" },
      { title: "শিল্প ঐতিহ্য ট্যুর", sub: "থাংকা ও স্থাপত্য", desc: "থাংকা চিত্র, ভাস্কর্য ও স্থাপত্য বিবরণে গভীর অনুসন্ধান" },
    ],
    toastStart: "▶ অডিও ট্যুর শুরু হয়েছে! আপনার যাত্রা উপভোগ করুন।",
    toastLang: (l: string) => `🌐 ভাষা পরিবর্তিত হয়েছে: ${l}`,
    toastDl: (t: string) => `⬇️ ডাউনলোড হচ্ছে "${t}"…`,
    toastSaved: (t: string) => `✅ "${t}" অফলাইন শোনার জন্য সংরক্ষিত!`,
    toastErr: "⚠️ অডিও লোড করা যায়নি। সংযোগ পরীক্ষা করুন।",
    toastTap: "⚠️ শুরু করতে প্লে টিপুন।",
  },
} as const;

type LangKey = keyof typeof T;

/** Map i18n context language codes → AudioGuide T keys */
const LANG_MAP: Record<Language, LangKey> = {
  en: "English",
  hi: "Hindi",
  ne: "Nepali",
  bo: "Tibetan",
  bn: "Bengali",
};

// ── Audio tracks ─────────────────────────────────────────────────────────────
const AUDIO_SRCS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
];
const TOUR_META = [
  { duration: "3:18", locations: "8 stops", size: "156 MB" },
  { duration: "2:44", locations: "4 stops", size: "89 MB" },
  { duration: "3:55", locations: "6 stops", size: "112 MB" },
];

const AUDIO_LANG_LIST: { key: LangKey; flag: string; code: string; i18n: Language }[] = [
  { key: "English", flag: "🇬🇧", code: "EN", i18n: "en" },
  { key: "Hindi", flag: "🇮🇳", code: "HI", i18n: "hi" },
  { key: "Tibetan", flag: "🏔️", code: "BO", i18n: "bo" },
  { key: "Nepali", flag: "🇳🇵", code: "NE", i18n: "ne" },
  { key: "Bengali", flag: "🇧🇩", code: "BN", i18n: "bn" },
];

const FEAT_ICONS = [MapPin, Download, Languages, Headphones];

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

interface Toast { id: number; msg: string; type: "success" | "error" | "info" }
let _tid = 0;

// ── Component ─────────────────────────────────────────────────────────────────
export default function AudioGuide() {
  const audioRef = useRef<HTMLAudioElement>(null);
  // ── Global language from Header dropdown ──
  const { language: i18nLang, setLanguage: setI18nLang } = useTranslation();
  const lang: LangKey = useMemo(() => LANG_MAP[i18nLang] ?? "English", [i18nLang]);

  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState<Record<string, number>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const t = T[lang];

  const toast = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = ++_tid;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4000);
  }, []);

  useEffect(() => {
    const el = audioRef.current; if (!el) return;
    el.volume = vol; el.muted = muted;
    const onTime = () => setCur(el.currentTime);
    const onMeta = () => setDur(el.duration);
    const onWait = () => setLoading(true);
    const onCan = () => setLoading(false);
    const onEnd = () => { setPlaying(false); if (trackIdx < 2) setTrackIdx(i => i + 1); };
    el.addEventListener("timeupdate", onTime); el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta); el.addEventListener("waiting", onWait);
    el.addEventListener("canplay", onCan); el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime); el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta); el.removeEventListener("waiting", onWait);
      el.removeEventListener("canplay", onCan); el.removeEventListener("ended", onEnd);
    };
  }, [trackIdx, vol, muted]);

  useEffect(() => {
    const el = audioRef.current; if (!el) return;
    setCur(0); setDur(0); setLoading(true); el.load();
    if (playing) el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  const togglePlay = () => {
    const el = audioRef.current; if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { setLoading(true); el.play().then(() => { setPlaying(true); setLoading(false); }).catch(() => { setPlaying(false); setLoading(false); toast(t.toastErr, "error"); }); }
  };

  const startTour = () => {
    setTrackIdx(0);
    const el = audioRef.current; if (!el) return;
    el.load();
    el.play().then(() => { setPlaying(true); toast(t.toastStart); })
      .catch(() => toast(t.toastTap, "info"));
  };

  const dlOffline = (idx: number) => {
    const title = t.tracks[idx].title;
    if (downloads[title] !== undefined) return;
    toast(t.toastDl(title), "info");
    setDownloads(p => ({ ...p, [title]: 0 }));
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 5;
      if (p >= 100) { p = 101; clearInterval(iv); toast(t.toastSaved(title)); }
      setDownloads(prev => ({ ...prev, [title]: Math.min(Math.round(p), 101) }));
    }, 350);
  };

  const playTrack = (idx: number) => {
    const el = audioRef.current; if (!el) return;
    if (trackIdx === idx) { togglePlay(); return; }
    setTrackIdx(idx); setPlaying(true);
    setTimeout(() => el.play().then(() => setPlaying(true)).catch(() => setPlaying(false)), 120);
  };

  const changeLang = (l: LangKey) => {
    setLang(l);
    toast(T[l].toastLang(l));
  };

  const pct = dur > 0 ? (cur / dur) * 100 : 0;
  const track = t.tracks[trackIdx];
  const dlKey = track.title;
  const dl0 = downloads[t.tracks[0].title];

  return (
    <section id="audio" className="section-padding bg-secondary/30">
      <audio ref={audioRef} preload="metadata"><source src={AUDIO_SRCS[trackIdx]} type="audio/mpeg" /></audio>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t2 => (
            <motion.div key={t2.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }} transition={{ duration: 0.35 }}
              className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm text-sm font-medium backdrop-blur-xl
                ${t2.type === "success" ? "bg-emerald-950/90 border-emerald-700/60 text-emerald-200"
                  : t2.type === "error" ? "bg-red-950/90 border-red-700/60 text-red-200"
                    : "bg-card/95 border-border text-foreground"}`}>
              <span className="flex-1">{t2.msg}</span>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t2.id))} className="opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="section-heading text-foreground">{t.heading}</h2>
            <p className="section-subheading">{t.sub}</p>
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {t.features.map((f, i) => {
            const Icon = FEAT_ICONS[i];
            const statusColor = f.status === t.features[0].status ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : f.status === t.features[1].status ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground";
            return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.4 }}
                  className="bg-card rounded-2xl border border-border/60 p-6 text-center hover:shadow-premium hover:border-border transition-all duration-500">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"><Icon className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
                  <p className="text-muted-foreground text-xs mb-3 leading-relaxed">{f.desc}</p>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${statusColor}`}>{f.status}</span>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Main Player */}
        <ScrollReveal className="mb-16">
          <div className="bg-card rounded-3xl border border-border/60 overflow-hidden hover:shadow-premium transition-all duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left */}
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center"><AudioLines className="w-5 h-5 text-primary-foreground" /></div>
                  <div><h3 className="text-xl font-bold text-foreground">{t.playerTitle}</h3><p className="text-sm text-muted-foreground">{t.playerSub}</p></div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t.playerDesc}</p>
                <div className="space-y-3 mb-8 text-sm">
                  {[
                    { label: t.locLabel, value: t.locVal },
                    { label: t.qualLabel, value: t.qualVal },
                    { label: t.connLabel, value: t.connVal, icon: Wifi, color: "text-emerald-500" },
                  ].map(({ label, value, icon: Ic, color }: any) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{label}</span>
                      <div className="flex items-center gap-1.5">{Ic && <Ic className={`w-3.5 h-3.5 ${color}`} />}<span className={`font-medium ${color || "text-foreground"}`}>{value}</span></div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={startTour} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl gap-2 font-medium">
                    <Play className="w-4 h-4" /> {t.startBtn}
                  </Button>
                  <Button variant="outline" onClick={() => dlOffline(0)} disabled={dl0 !== undefined} className="rounded-xl gap-2 font-medium border-border hover:bg-secondary disabled:opacity-70">
                    {dl0 === 101 ? <><CheckCircle className="w-4 h-4 text-emerald-500" /> {t.savedBtn}</>
                      : dl0 !== undefined ? <><Loader2 className="w-4 h-4 animate-spin" /> {dl0}%</>
                        : <><Download className="w-4 h-4" /> {t.dlBtn}</>}
                  </Button>
                </div>
              </div>

              {/* Right – Player */}
              <div className="bg-foreground p-8 md:p-10 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 bg-background/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${playing ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-foreground" : ""}`}>
                    {loading ? <Loader2 className="w-8 h-8 text-background/60 animate-spin" /> : <AudioLines className={`w-8 h-8 text-background/80 ${playing ? "animate-pulse" : ""}`} />}
                  </div>
                  <h4 className="font-bold text-background text-lg mb-1">{track.title}</h4>
                  <p className="text-sm text-background/50">{track.sub}</p>
                </div>
                {/* Controls */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => { if (trackIdx > 0) setTrackIdx(i => i - 1); else if (audioRef.current) audioRef.current.currentTime = 0; }} className="w-8 h-8 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"><SkipBack className="w-4 h-4 text-background" /></button>
                    <button onClick={togglePlay} className="w-12 h-12 bg-background/10 hover:bg-background/25 rounded-full flex items-center justify-center transition-colors">
                      {loading ? <Loader2 className="w-5 h-5 text-background animate-spin" /> : playing ? <Pause className="w-5 h-5 text-background" /> : <Play className="w-5 h-5 text-background ml-0.5" />}
                    </button>
                    <button onClick={() => { if (trackIdx < 2) setTrackIdx(i => i + 1); }} disabled={trackIdx === 2} className="w-8 h-8 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"><SkipForward className="w-4 h-4 text-background" /></button>
                    <div className="flex-1">
                      <input type="range" min={0} max={dur || 1} step={0.5} value={cur}
                        onChange={e => { const v = Number(e.target.value); setCur(v); if (audioRef.current) audioRef.current.currentTime = v; }}
                        className="w-full h-1 cursor-pointer accent-primary"
                        style={{ background: `linear-gradient(to right,var(--primary) ${pct}%,rgba(255,255,255,0.2) ${pct}%)` }} />
                    </div>
                    <span className="text-xs text-background/50 tabular-nums whitespace-nowrap">{fmt(cur)} / {dur > 0 ? fmt(dur) : TOUR_META[trackIdx].duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setMuted(m => !m); if (audioRef.current) audioRef.current.muted = !muted; }} className="text-background/50 hover:text-background transition-colors">
                      {muted || vol === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : vol}
                      onChange={e => { const v = Number(e.target.value); setVol(v); if (audioRef.current) audioRef.current.volume = v; if (v > 0) setMuted(false); }}
                      className="w-24 h-1 cursor-pointer accent-primary"
                      style={{ background: `linear-gradient(to right,var(--primary) ${(muted ? 0 : vol) * 100}%,rgba(255,255,255,0.2) ${(muted ? 0 : vol) * 100}%)` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-background/40">
                  <span>{t.trackOf} {trackIdx + 1} {t.of} 3</span>
                  <div className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /><span>{lang}</span></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Language Selector */}
        <ScrollReveal className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">{t.chooseLang}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {AUDIO_LANG_LIST.map(l => (
              <motion.button key={l.key}
                onClick={() => {
                  setI18nLang(l.i18n);
                  // Toast in the new language
                  const tNew = T[l.key];
                  toast(tNew.toastLang(tNew.heading.split(" ").slice(-2).join(" ")));
                }}
                whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.3 }}
                className={`rounded-2xl border p-4 text-center transition-all duration-300 ${lang === l.key ? "border-primary bg-primary/10 shadow-monastery" : "bg-card border-border/60 hover:shadow-monastery hover:border-border"}`}>
                <div className="text-2xl mb-1">{l.flag}</div>
                <div className={`font-bold text-sm ${lang === l.key ? "text-primary" : "text-foreground"}`}>{l.code}</div>
                <div className={`text-sm font-medium mt-0.5 ${lang === l.key ? "text-primary" : "text-foreground"}`}>{l.key}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{T[l.key].tracks[0].sub}</div>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Tour Cards */}
        <ScrollReveal>
          <h3 className="text-2xl font-bold text-foreground mb-8">{t.toursTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.tracks.map((tour, idx) => {
              const meta = TOUR_META[idx];
              const isActive = trackIdx === idx;
              const dlVal = downloads[tour.title];
              return (
                <motion.div key={idx} whileHover={{ y: -4 }} transition={{ duration: 0.4 }}
                  className={`bg-card rounded-2xl border p-6 hover:shadow-premium transition-all duration-500 flex flex-col ${isActive ? "border-primary/50" : "border-border/60 hover:border-border"}`}>
                  {isActive && (
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-3">
                      <span className="relative flex h-2 w-2">{playing && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />}<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
                      {playing ? t.nowPlaying : t.paused}
                    </div>
                  )}
                  <h4 className="font-semibold text-foreground mb-2">{tour.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">{tour.desc}</p>
                  <div className="space-y-2 mb-4 text-sm">
                    {[{ l: t.durLabel, v: meta.duration }, { l: t.locTourLabel, v: meta.locations }, { l: t.sizeLabel, v: meta.size }].map(({ l: lb, v }) => (
                      <div key={lb} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{lb}</span><span className="font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                  {dlVal !== undefined && dlVal < 101 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{t.downloading}</span><span>{dlVal}%</span></div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden"><motion.div className="h-full bg-primary rounded-full" animate={{ width: `${dlVal}%` }} transition={{ duration: 0.3 }} /></div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => playTrack(idx)} className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-xl gap-1.5 text-sm font-medium">
                      {isActive && playing ? <><Pause className="w-3.5 h-3.5" /> {t.pause}</> : <><Play className="w-3.5 h-3.5" /> {t.play}</>}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => dlOffline(idx)} disabled={dlVal !== undefined} className="rounded-xl border-border hover:bg-secondary disabled:opacity-70" title={t.dlBtn}>
                      {dlVal === 101 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : dlVal !== undefined ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}