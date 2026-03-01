import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    X,
    Volume2,
    VolumeX,
    Timer,
    Wind,
    Moon,
    Sparkles,
    ChevronDown,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const MEDITATION_SESSIONS = [
    { id: "breathing", name: "Mindful Breathing", duration: 300, description: "Focus on the rhythm of your breath", icon: Wind },
    { id: "loving-kindness", name: "Loving Kindness", duration: 600, description: "Cultivate compassion and love", icon: Sparkles },
    { id: "body-scan", name: "Body Scan", duration: 900, description: "Release tension from head to toe", icon: Moon },
    { id: "mantra", name: "Om Mani Padme Hum", duration: 600, description: "Recite the sacred mantra", icon: Sparkles },
];

const AMBIENT_COLORS = [
    "from-indigo-900 via-purple-900 to-slate-900",
    "from-slate-900 via-emerald-900 to-slate-900",
    "from-slate-900 via-amber-900 to-slate-900",
    "from-blue-900 via-cyan-900 to-slate-900",
];

const AIMeditationMode = () => {
    const [isActive, setIsActive] = useState(false);
    const [selectedSession, setSelectedSession] = useState(MEDITATION_SESSIONS[0]);
    const [timeRemaining, setTimeRemaining] = useState(300);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [breathCount, setBreathCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const breathRef = useRef<NodeJS.Timeout | null>(null);

    // Timer logic
    useEffect(() => {
        if (isPlaying && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, timeRemaining]);

    // Breathing guide: 4-7-8 pattern
    useEffect(() => {
        if (!isPlaying) return;

        const breathCycle = () => {
            setBreathPhase("inhale");
            const inhaleTimeout = setTimeout(() => {
                setBreathPhase("hold");
                const holdTimeout = setTimeout(() => {
                    setBreathPhase("exhale");
                    setBreathCount((c) => c + 1);
                    const exhaleTimeout = setTimeout(breathCycle, 8000);
                    breathRef.current = exhaleTimeout;
                }, 7000);
                breathRef.current = holdTimeout;
            }, 4000);
            breathRef.current = inhaleTimeout;
        };

        breathCycle();

        return () => {
            if (breathRef.current) clearTimeout(breathRef.current);
        };
    }, [isPlaying]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const startSession = (session: typeof MEDITATION_SESSIONS[0]) => {
        setSelectedSession(session);
        setTimeRemaining(session.duration);
        setIsActive(true);
        setIsPlaying(false);
        setBreathCount(0);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const endSession = () => {
        setIsActive(false);
        setIsPlaying(false);
        setBreathCount(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (breathRef.current) clearTimeout(breathRef.current);
    };

    const progress = selectedSession
        ? ((selectedSession.duration - timeRemaining) / selectedSession.duration) * 100
        : 0;

    return (
        <section className="py-24 relative overflow-hidden" id="meditation">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-500/5 to-background pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground border border-border/60 mb-6">
                            <Moon className="w-4 h-4 text-primary" />
                            AI Meditation
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Find Inner Peace
                        </h2>
                        <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
                            Guided meditation sessions inspired by ancient Buddhist practices. Breathe, relax, and connect with your inner self.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Session Selector (shown when not active) */}
                <AnimatePresence mode="wait">
                    {!isActive ? (
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {MEDITATION_SESSIONS.map((session, i) => (
                                <ScrollReveal key={session.id} delay={i * 0.1}>
                                    <button
                                        onClick={() => startSession(session)}
                                        className="w-full bg-card rounded-2xl p-6 border border-border/60 text-left hover:border-primary/40 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <session.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground">{session.name}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Timer className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {session.duration / 60} minutes
                                                    </span>
                                                </div>
                                            </div>
                                            <Play className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </button>
                                </ScrollReveal>
                            ))}
                        </motion.div>
                    ) : (
                        /* Active Meditation Session */
                        <motion.div
                            key="session"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative"
                        >
                            <div className={`rounded-3xl overflow-hidden bg-gradient-to-br ${AMBIENT_COLORS[MEDITATION_SESSIONS.indexOf(selectedSession) % AMBIENT_COLORS.length]} p-8 md:p-12 text-white relative min-h-[500px] flex flex-col items-center justify-center`}>
                                {/* Close button */}
                                <button
                                    onClick={endSession}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Animated breath circle */}
                                <div className="relative mb-10">
                                    <motion.div
                                        animate={{
                                            scale: breathPhase === "inhale" ? 1.4 : breathPhase === "hold" ? 1.4 : 1,
                                            opacity: breathPhase === "hold" ? 0.6 : 0.3,
                                        }}
                                        transition={{
                                            duration:
                                                breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.5 : 8,
                                            ease: "easeInOut",
                                        }}
                                        className="w-48 h-48 rounded-full bg-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-xl"
                                    />
                                    <motion.div
                                        animate={{
                                            scale: breathPhase === "inhale" ? 1.3 : breathPhase === "hold" ? 1.3 : 1,
                                        }}
                                        transition={{
                                            duration:
                                                breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.5 : 8,
                                            ease: "easeInOut",
                                        }}
                                        className="w-40 h-40 rounded-full border-2 border-white/30 flex items-center justify-center relative"
                                    >
                                        <div className="text-center">
                                            <p className="text-3xl font-black tabular-nums">{formatTime(timeRemaining)}</p>
                                            {isPlaying && (
                                                <motion.p
                                                    key={breathPhase}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-white/70 mt-1 capitalize"
                                                >
                                                    {breathPhase === "inhale"
                                                        ? "Breathe In..."
                                                        : breathPhase === "hold"
                                                            ? "Hold..."
                                                            : "Breathe Out..."}
                                                </motion.p>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Session info */}
                                <h3 className="text-xl font-bold mb-1">{selectedSession.name}</h3>
                                <p className="text-sm text-white/60 mb-6">{selectedSession.description}</p>

                                {/* Progress bar */}
                                <div className="w-full max-w-xs h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white/50 rounded-full"
                                        style={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-7 h-7" />
                                        ) : (
                                            <Play className="w-7 h-7 ml-1" />
                                        )}
                                    </button>

                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold">{breathCount}</span>
                                    </div>
                                </div>

                                {/* Completion message */}
                                {timeRemaining === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 text-center"
                                    >
                                        <Sparkles className="w-8 h-8 mx-auto mb-3 text-amber-300" />
                                        <p className="text-lg font-bold">Session Complete 🙏</p>
                                        <p className="text-sm text-white/60 mt-1">
                                            {breathCount} breath cycles · Namaste
                                        </p>
                                        <button
                                            onClick={endSession}
                                            className="mt-4 px-6 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
                                        >
                                            Back to Sessions
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default AIMeditationMode;
