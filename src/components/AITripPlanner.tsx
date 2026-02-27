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
        <section className="py-20 bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-orange-200">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
                        Plan Your Monastery Pilgrimage
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Let our AI create a personalized pilgrimage itinerary based on your interests,
                        pace, and available time. Experience Sikkim's monasteries like never before.
                    </p>
                </div>

                {!showPlan ? (
                    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
                        {/* Days Selector */}
                        <Card className="shadow-lg border-orange-100 overflow-hidden">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold text-deep-earth mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-saffron" />
                                    How many days?
                                </h3>
                                <div className="flex items-center gap-4 justify-center">
                                    {[1, 2, 3, 5, 7].map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDays(d)}
                                            className={`w-16 h-16 rounded-2xl text-xl font-bold transition-all duration-300 ${days === d
                                                    ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200 scale-110"
                                                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-muted-foreground mt-3">
                                    {days} {days === 1 ? "Day" : "Days"} Trip
                                </p>
                            </CardContent>
                        </Card>

                        {/* Interests Selection */}
                        <Card className="shadow-lg border-orange-100">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold text-deep-earth mb-6 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-saffron" />
                                    What interests you? <span className="text-sm font-normal text-gray-400">(Select at least one)</span>
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {INTERESTS.map(({ icon: Icon, label, value }) => (
                                        <button
                                            key={value}
                                            onClick={() => toggleInterest(value)}
                                            className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 text-left ${interests.includes(value)
                                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200"
                                                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm font-medium">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pace Selection */}
                        <Card className="shadow-lg border-orange-100">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold text-deep-earth mb-6 flex items-center gap-2">
                                    <Footprints className="w-5 h-5 text-saffron" />
                                    Your preferred pace
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {PACE_OPTIONS.map(({ icon: Icon, label, value, desc }) => (
                                        <button
                                            key={value}
                                            onClick={() => setPace(value)}
                                            className={`flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 ${pace === value
                                                    ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200"
                                                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300"
                                                }`}
                                        >
                                            <Icon className="w-8 h-8" />
                                            <span className="font-bold">{label}</span>
                                            <span className={`text-xs ${pace === value ? "text-white/80" : "text-gray-400"}`}>
                                                {desc}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Generate Button */}
                        <div className="text-center">
                            <Button
                                onClick={handleGenerate}
                                disabled={interests.length === 0}
                                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-12 py-6 text-lg rounded-2xl shadow-xl shadow-orange-300/30 disabled:opacity-50 transition-all duration-300 hover:scale-105 gap-3"
                            >
                                <Sparkles className="w-5 h-5" />
                                Generate My Pilgrimage Plan
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto animate-fade-in-up">
                        <Card className="shadow-2xl border-orange-100 overflow-hidden">
                            {/* Plan Header */}
                            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white relative">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Map className="w-8 h-8" />
                                        <h3 className="text-2xl font-bold">Your Personalized Pilgrimage</h3>
                                    </div>
                                    <p className="text-white/80">
                                        {days}-Day {pace} journey • {interests.length} interests selected
                                    </p>
                                </div>
                            </div>

                            {/* Plan Content */}
                            <CardContent className="p-8">
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

                                <div className="mt-8 flex gap-4 justify-center">
                                    <Button
                                        onClick={() => {
                                            setShowPlan(false);
                                            setPlan("");
                                        }}
                                        variant="outline"
                                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                                    >
                                        ← Modify Plan
                                    </Button>
                                    <Button
                                        onClick={handleGenerate}
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Regenerate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AITripPlanner;
