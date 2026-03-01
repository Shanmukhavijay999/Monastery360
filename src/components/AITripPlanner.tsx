import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Map,
    Compass,
    Sun,
    Moon,
    Mountain,
    Sparkles,
    Loader2,
    Calendar,
    Footprints,
    Heart,
    Camera,
    BookOpen,
} from "lucide-react";
import { generateTripPlan } from "@/lib/gemini";

const INTERESTS = [
    { icon: BookOpen, label: "History & Heritage", value: "history" },
    { icon: Camera, label: "Photography", value: "photography" },
    { icon: Heart, label: "Meditation & Wellness", value: "meditation" },
    { icon: Mountain, label: "Trekking & Nature", value: "trekking" },
    { icon: Compass, label: "Architecture", value: "architecture" },
    { icon: Sparkles, label: "Festivals & Culture", value: "festivals" },
];

const PACE_OPTIONS = [
    { icon: Sun, label: "Relaxed", value: "relaxed", desc: "2-3 sites per day" },
    { icon: Compass, label: "Moderate", value: "moderate", desc: "3-5 sites per day" },
    { icon: Footprints, label: "Adventurous", value: "adventurous", desc: "5+ sites per day" },
];

const AITripPlanner = () => {
    const [days, setDays] = useState(3);
    const [interests, setInterests] = useState<string[]>([]);
    const [pace, setPace] = useState("moderate");
    const [plan, setPlan] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPlan, setShowPlan] = useState(false);

    const toggleInterest = (value: string) => {
        setInterests((prev) =>
            prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
        );
    };

    const handleGenerate = async () => {
        if (interests.length === 0) return;
        setIsLoading(true);
        setShowPlan(true);
        try {
            const result = await generateTripPlan({ days, interests, pace });
            setPlan(result);
        } catch {
            setPlan("Unable to generate trip plan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatPlan = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-deep-earth">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/###\s?(.*)/g, '<h3 class="text-xl font-bold text-saffron mt-6 mb-3">$1</h3>')
            .replace(/##\s?(.*)/g, '<h2 class="text-2xl font-bold text-deep-earth mt-8 mb-4">$1</h2>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <section className="section-padding bg-secondary/30 relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI-Powered
                    </div>
                    <h2 className="section-heading text-foreground">
                        Plan Your Monastery Pilgrimage
                    </h2>
                    <p className="section-subheading">
                        Let our AI create a personalized pilgrimage itinerary based on your interests,
                        pace, and available time.
                    </p>
                </div>

                {!showPlan ? (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Days Selector */}
                        <div className="bg-card rounded-3xl border border-border/60 overflow-hidden p-8">
                            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                How many days?
                            </h3>
                            <div className="flex items-center gap-4 justify-center">
                                {[1, 2, 3, 5, 7].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDays(d)}
                                        className={`w-14 h-14 rounded-xl text-lg font-bold transition-all duration-300 ${days === d
                                            ? "bg-foreground text-background shadow-lg scale-110"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-muted-foreground mt-3">
                                {days} {days === 1 ? "Day" : "Days"} Trip
                            </p>
                        </div>

                        {/* Interests Selection */}
                        <div className="bg-card rounded-3xl border border-border/60 p-8">
                            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-primary" />
                                What interests you? <span className="text-sm font-normal text-muted-foreground">(Select at least one)</span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {INTERESTS.map(({ icon: Icon, label, value }) => (
                                    <button
                                        key={value}
                                        onClick={() => toggleInterest(value)}
                                        className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 text-left ${interests.includes(value)
                                            ? "bg-foreground text-background shadow-lg"
                                            : "bg-card border border-border/60 text-foreground hover:border-border"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm font-medium">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pace Selection */}
                        <div className="bg-card rounded-3xl border border-border/60 p-8">
                            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Footprints className="w-5 h-5 text-primary" />
                                Your preferred pace
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {PACE_OPTIONS.map(({ icon: Icon, label, value, desc }) => (
                                    <button
                                        key={value}
                                        onClick={() => setPace(value)}
                                        className={`flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-300 ${pace === value
                                            ? "bg-foreground text-background shadow-lg"
                                            : "bg-card border border-border/60 text-foreground hover:border-border"
                                            }`}
                                    >
                                        <Icon className="w-7 h-7" />
                                        <span className="font-semibold text-sm">{label}</span>
                                        <span className={`text-xs ${pace === value ? "text-background/60" : "text-muted-foreground"}`}>
                                            {desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="text-center">
                            <Button
                                onClick={handleGenerate}
                                disabled={interests.length === 0}
                                className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-base rounded-full disabled:opacity-50 transition-all duration-300 hover:scale-105 gap-2 font-semibold"
                            >
                                <Sparkles className="w-5 h-5" />
                                Generate My Pilgrimage Plan
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-card rounded-3xl border border-border/60 shadow-premium overflow-hidden">
                            {/* Plan Header */}
                            <div className="bg-foreground p-8 text-background">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Map className="w-7 h-7" />
                                        <h3 className="text-xl font-bold">Your Personalized Pilgrimage</h3>
                                    </div>
                                    <p className="text-background/50 text-sm">
                                        {days}-Day {pace} journey • {interests.length} interests selected
                                    </p>
                                </div>
                            </div>

                            {/* Plan Content */}
                            <div className="p-8">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <div className="relative">
                                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                                            <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                                        </div>
                                        <p className="text-lg text-gray-500 font-medium">Crafting your perfect journey...</p>
                                        <p className="text-sm text-gray-400">Our AI is researching the best monasteries for you</p>
                                    </div>
                                ) : (
                                    <div
                                        className="prose prose-orange max-w-none text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: formatPlan(plan) }}
                                    />
                                )}

                                <div className="mt-8 flex gap-3 justify-center">
                                    <Button
                                        onClick={() => {
                                            setShowPlan(false);
                                            setPlan("");
                                        }}
                                        variant="outline"
                                        className="border-border rounded-xl hover:bg-secondary"
                                    >
                                        ← Modify Plan
                                    </Button>
                                    <Button
                                        onClick={handleGenerate}
                                        className="bg-foreground text-background hover:bg-foreground/90 gap-2 rounded-xl font-medium"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Regenerate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AITripPlanner;
