import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    MessageCircle,
    X,
    Send,
    Sparkles,
    Bot,
    User,
    Loader2,
    Minimize2,
    Maximize2,
    RotateCcw,
    Volume2,
    VolumeX,
    ChevronDown,
} from "lucide-react";
import { sendMessageToGemini, type GeminiMessage } from "@/lib/gemini";

interface ChatMessage {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isOffline?: boolean;
}

const QUICK_PROMPTS = [
    "🏛️ Tell me about Rumtek Monastery",
    "🧘 Guide me in meditation",
    "🗺️ Best monasteries to visit",
    "📿 Explain Buddhist traditions",
    "🎭 Upcoming cultural events",
    "🏔️ Travel tips for Sikkim",
];

// Smart offline responses — used when AI API is unavailable
const OFFLINE_RESPONSES: Record<string, string> = {
    rumtek:
        "🏛️ **Rumtek Monastery** (also called Dharmachakra Centre) is one of the most significant monasteries in Sikkim!\n\n• **Founded:** 1740, rebuilt in 1960s by the 16th Karmapa\n• **Sect:** Kagyu (Black Hat) lineage\n• **Location:** 24 km from Gangtok\n• **Highlights:** The stunning Golden Stupa containing relics of the 16th Karmapa, the Nalanda Institute of Buddhist Studies, and the annual *Tse-Chu* masked dance festival\n• **Best time to visit:** March-May or October-November\n\n🙏 This is one of the most important seats of the Karma Kagyu lineage outside Tibet!",

    pemayangtse:
        "🏛️ **Pemayangtse Monastery** is one of Sikkim's oldest and most prestigious monasteries!\n\n• **Founded:** 1705 by Lhatsun Namkha Jigme\n• **Sect:** Nyingma (oldest Tibetan Buddhist tradition)\n• **Location:** Pelling, West Sikkim at 6,840 ft\n• **Highlights:** The incredible *Zangdok Palri* — a 7-tier painted wooden sculpture of Guru Rinpoche's celestial palace on the top floor, intricate murals, and panoramic views of Mt. Kanchenjunga\n• **Meaning:** 'Perfect Sublime Lotus' — only monks of pure Tibetan blood were originally admitted\n\n📸 The views of Kanchenjunga from here are absolutely breathtaking!",

    tashiding:
        "🏛️ **Tashiding Monastery** is considered one of the holiest monasteries in Sikkim!\n\n• **Founded:** 1717 by Ngadak Sempa Chenpo\n• **Sect:** Nyingma lineage\n• **Location:** On a hilltop between the Rathong and Rangit rivers, West Sikkim\n• **Highlights:** The sacred *Thong-Wa-Rang-Tho* chorten (stupa) — believed to absolve sins simply by looking at it! The annual *Bumchu Festival* (January/February) reveals holy water prophecies\n• **Spiritual significance:** Guru Padmasambhava consecrated this site in the 8th century\n\n🙏 It is said that merely gazing upon Tashiding's holy chorten washes away all sins!",

    meditation:
        "🧘 **Meditation Guide for Monastery Visitors**\n\nHere's a simple practice you can try:\n\n1. **Find stillness:** Sit comfortably in a prayer hall or garden\n2. **Breathing (Anapanasati):** Focus on natural breath — 5 minutes\n3. **Mantra:** Silently repeat *\"Om Mani Padme Hum\"* — the mantra of compassion\n4. **Loving-kindness (Metta):** Send wishes of peace to all beings\n5. **Gratitude:** Close with gratitude for the sacred space\n\n**Tips for monastery meditation:**\n• Remove shoes before entering prayer halls\n• Sit on the cushions provided, or on the floor\n• Dawn (5-6 AM) is the most powerful time\n• Many monasteries welcome silent participants in morning prayers\n\n🕉️ *\"Peace comes from within. Do not seek it without.\"* — Buddha",

    travel:
        "🏔️ **Travel Tips for Sikkim Monastery Tours**\n\n📅 **Best seasons:**\n• **March-May:** Spring flowers, clear Kanchenjunga views\n• **October-November:** Post-monsoon clarity, festival season\n\n🚗 **Getting around:**\n• Gangtok → Rumtek: 24 km (1 hr drive)\n• Gangtok → Pemayangtse: 130 km (5 hrs)\n• Gangtok → Tashiding: 110 km (4.5 hrs)\n• Shared jeeps are the most common transport\n\n👗 **Etiquette:**\n• Dress modestly — cover shoulders and knees\n• Remove shoes before entering prayer halls\n• Walk clockwise around stupas and prayer wheels\n• Ask permission before photographing monks\n• Maintain silence in meditation areas\n\n📄 **Permits:** Indian & foreign tourists need an Inner Line Permit (ILP) for certain areas\n\n🙏 Remember: monasteries are active places of worship, not just tourist sites!",

    buddhist:
        "📿 **Buddhist Traditions in Sikkim**\n\nSikkim follows **Vajrayana (Tantric) Buddhism** with four main schools:\n\n1. **Nyingma** (oldest) — Founded by Guru Padmasambhava. Monasteries: Pemayangtse, Tashiding\n2. **Kagyu** — Emphasis on meditation lineage. Main monastery: Rumtek\n3. **Gelug** — Dalai Lama's school. Represented at several smaller gompas\n4. **Sakya** — Scholarly tradition with select monasteries\n\n**Key practices:**\n• **Prayer wheels:** Spin clockwise to spread mantras\n• **Butter lamps:** Symbolize wisdom dispelling ignorance\n• **Thangka paintings:** Sacred Buddhist art depicting deities and mandalas\n• **Cham dances:** Sacred masked dances performed during festivals\n• **Losar:** Tibetan New Year — the biggest celebration\n\n🕉️ The mantra *Om Mani Padme Hum* is the most widely practiced in Sikkim!",

    events:
        "🎭 **Key Monastery Festivals & Events in Sikkim**\n\n🗓️ **Losar (Feb/Mar):** Tibetan New Year! Cham dances, feasts, and colorful celebrations at all major monasteries\n\n🗓️ **Bumchu Festival (Feb):** Tashiding Monastery opens a sacred vessel of holy water — the water level predicts the year's fortune!\n\n🗓️ **Saga Dawa (May/Jun):** Celebrates Buddha's birth, enlightenment, and passing. Grand processions and prayers throughout Gangtok\n\n🗓️ **Kagyed Dance (Dec):** Rumtek Monastery's spectacular masked dance festival — monks wearing elaborate costumes represent Buddhist deities\n\n🗓️ **Pang Lhabsol (Aug/Sep):** Unique to Sikkim! Celebrates Mt. Kanchenjunga as the guardian deity with warrior dances\n\n🗓️ **Drukpa Tseshi (Jul/Aug):** Commemorates Buddha's first teaching\n\n💡 **Tip:** Arrive early for festivals — they start at dawn and the best viewing spots fill up quickly!",

    default:
        "🙏 **Namaste! Welcome to Monastery360!**\n\nI'm your Dharma Guide — here's what I can help you with:\n\n🏛️ **Monastery information** — history, architecture, significance\n🗺️ **Travel planning** — routes, best times, permits\n🧘 **Meditation guidance** — practices, etiquette, tips\n📿 **Buddhist culture** — traditions, festivals, art\n🎭 **Events & festivals** — dates, locations, what to expect\n🏔️ **Sikkim travel tips** — transport, accommodation, food\n\nTry asking me about any specific monastery like Rumtek, Pemayangtse, or Tashiding! I have detailed knowledge about over 200 monasteries in Sikkim.\n\n*Currently running in offline mode — I'll try reconnecting to the AI service shortly.*",
};

// Match user input to offline responses
function getOfflineResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("rumtek")) return OFFLINE_RESPONSES.rumtek;
    if (lower.includes("pemayangtse") || lower.includes("pelling"))
        return OFFLINE_RESPONSES.pemayangtse;
    if (lower.includes("tashiding")) return OFFLINE_RESPONSES.tashiding;
    if (lower.includes("meditat") || lower.includes("mindful") || lower.includes("peace"))
        return OFFLINE_RESPONSES.meditation;
    if (
        lower.includes("travel") ||
        lower.includes("visit") ||
        lower.includes("trip") ||
        lower.includes("best") ||
        lower.includes("plan") ||
        lower.includes("monastery") ||
        lower.includes("tour")
    )
        return OFFLINE_RESPONSES.travel;
    if (
        lower.includes("buddhis") ||
        lower.includes("tradition") ||
        lower.includes("prayer") ||
        lower.includes("mantra") ||
        lower.includes("culture") ||
        lower.includes("explain")
    )
        return OFFLINE_RESPONSES.buddhist;
    if (
        lower.includes("event") ||
        lower.includes("festival") ||
        lower.includes("dance") ||
        lower.includes("losar") ||
        lower.includes("celebration")
    )
        return OFFLINE_RESPONSES.events;
    return OFFLINE_RESPONSES.default;
}

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 0,
            role: "assistant",
            content:
                "Namaste! 🙏 I am **Dharma Guide**, your AI companion for exploring Sikkim's sacred monasteries. Ask me anything about history, Buddhist traditions, travel planning, or meditation! ✨",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([]);
    const [isOnline, setIsOnline] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPulse, setShowPulse] = useState(true);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setShowPulse(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Scroll detection for "scroll to bottom" button
    const handleScroll = useCallback(() => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Simple notification sound
    const playNotificationSound = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            osc.type = "sine";
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } catch {
            // Audio not available
        }
    }, [soundEnabled]);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now(),
            role: "user",
            content: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await sendMessageToGemini(messageText, conversationHistory);

            // Check if response is an error message from our API wrapper
            const isErrorResponse =
                response.startsWith("⚠️") ||
                response.startsWith("⏳") ||
                response.startsWith("🌐") ||
                response.startsWith("❌") ||
                response.includes("having trouble connecting");

            if (isErrorResponse) {
                // API failed — use smart offline fallback
                console.log("🤖 AI API unavailable, using offline response");
                setIsOnline(false);
                const offlineReply = getOfflineResponse(messageText);

                const assistantMsg: ChatMessage = {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: offlineReply,
                    timestamp: new Date(),
                    isOffline: true,
                };

                setMessages((prev) => [...prev, assistantMsg]);
            } else {
                // AI responded successfully
                setIsOnline(true);
                const assistantMsg: ChatMessage = {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: response,
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, assistantMsg]);
                setConversationHistory((prev) => [
                    ...prev,
                    { role: "user", parts: [{ text: messageText }] },
                    { role: "model", parts: [{ text: response }] },
                ]);
            }

            playNotificationSound();
        } catch {
            // Complete failure — use offline fallback
            setIsOnline(false);
            const offlineReply = getOfflineResponse(messageText);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: offlineReply,
                    timestamp: new Date(),
                    isOffline: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: Date.now(),
                role: "assistant",
                content:
                    "🔄 Chat cleared! Ask me anything about Sikkim's monasteries — I'm here to help! 🙏",
                timestamp: new Date(),
            },
        ]);
        setConversationHistory([]);
    };

    const formatMessage = (content: string) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/\n/g, "<br/>");
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const chatContent = (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 group"
                    aria-label="Open AI Chatbot"
                    id="chatbot-toggle"
                >
                    <div className="relative">
                        {showPulse && (
                            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                        )}
                        <div className="relative w-14 h-14 bg-foreground rounded-full flex items-center justify-center shadow-premium group-hover:scale-110 transition-all duration-500">
                            <Sparkles className="w-5 h-5 text-background" />
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-background" />
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`fixed z-50 transition-all duration-500 ease-out ${isExpanded
                        ? "inset-4 md:inset-8"
                        : "bottom-6 right-6 w-[400px] h-[600px] max-h-[85vh]"
                        }`}
                >
                    <div className="w-full h-full flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-border glass-strong bg-card/95">
                        {/* Header */}
                        <div className="bg-foreground p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-background" />
                                </div>
                                <div>
                                    <h3 className="text-background font-semibold text-sm">Dharma Guide AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-amber-400"}`}
                                        />
                                        <span className="text-background/50 text-[10px]">
                                            {isOnline ? "Powered by Gemini" : "Offline Mode"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className="p-2 text-background/50 hover:text-background/80 hover:bg-background/10 rounded-lg transition-colors"
                                >
                                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    onClick={handleClearChat}
                                    className="p-2 text-background/50 hover:text-background/80 hover:bg-background/10 rounded-lg transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-2 text-background/50 hover:text-background/80 hover:bg-background/10 rounded-lg transition-colors"
                                >
                                    {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-background/50 hover:text-background/80 hover:bg-background/10 rounded-lg transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Offline banner */}
                        {!isOnline && (
                            <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center gap-2 text-xs text-primary">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                Offline mode — built-in knowledge base
                                <button
                                    onClick={() => setIsOnline(true)}
                                    className="ml-auto text-primary/80 hover:text-primary underline"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Messages Area */}
                        <div
                            ref={chatContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 relative"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-3.5 h-3.5 text-background" />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 max-w-[80%]">
                                        <div
                                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                                ? "bg-foreground text-background rounded-br-md"
                                                : "bg-card text-foreground rounded-bl-md border border-border/60"
                                                }`}
                                            dangerouslySetInnerHTML={{
                                                __html: formatMessage(msg.content),
                                            }}
                                        />
                                        <div
                                            className={`flex items-center gap-1.5 text-[10px] text-muted-foreground ${msg.role === "user" ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            <span>{formatTime(msg.timestamp)}</span>
                                            {msg.isOffline && (
                                                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px]">
                                                    offline
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                            <User className="w-3.5 h-3.5 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <div className="flex gap-2.5 justify-start">
                                    <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-background" />
                                    </div>
                                    <div className="bg-card px-4 py-3 rounded-2xl rounded-bl-md border border-border/60">
                                        <div className="flex gap-1.5 items-center">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            <span className="text-[10px] text-muted-foreground ml-2">
                                                {isOnline ? "Thinking..." : "Searching..."}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        {showScrollDown && (
                            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
                                <button
                                    onClick={scrollToBottom}
                                    className="bg-card shadow-lg border border-border rounded-full p-2 hover:bg-secondary transition-colors"
                                >
                                    <ChevronDown className="w-4 h-4 text-foreground" />
                                </button>
                            </div>
                        )}

                        {/* Quick Prompts */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2">
                                <p className="text-[10px] text-muted-foreground mb-2 font-medium">
                                    Quick questions:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {QUICK_PROMPTS.map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() => handleSend(prompt)}
                                            className="text-[10px] px-2.5 py-1.5 bg-secondary text-secondary-foreground rounded-full border border-border/60 hover:border-border hover:bg-secondary/80 transition-all duration-200"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-3 border-t border-border bg-card">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask about monasteries, culture, travel..."
                                    className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground transition-all text-foreground"
                                    disabled={isLoading}
                                    id="chatbot-input"
                                />
                                <Button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-4 disabled:opacity-50 transition-all"
                                    id="chatbot-send"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-[9px] text-muted-foreground text-center mt-1.5">
                                {isOnline
                                    ? "Powered by Gemini AI • Monastery360"
                                    : "Offline mode • Monastery360"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    return createPortal(chatContent, document.body);
};

export default AIChatbot;
