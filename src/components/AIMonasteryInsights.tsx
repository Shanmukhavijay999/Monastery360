import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sparkles,
    Loader2,
    MapPin,
    History,
    Mountain,
    BookOpen,
} from "lucide-react";
import { getMonasteryInsight } from "@/lib/gemini";

const MONASTERIES = [
    {
        name: "Rumtek Monastery",
        location: "East Sikkim",
        image: "🏛️",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        name: "Pemayangtse Monastery",
        location: "West Sikkim",
        image: "⛩️",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        name: "Tashiding Monastery",
        location: "West Sikkim",
        image: "🏯",
        gradient: "from-purple-500 to-indigo-500",
    },
    {
        name: "Enchey Monastery",
        location: "Gangtok",
        image: "🕌",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        name: "Ralang Monastery",
        location: "South Sikkim",
        image: "🛕",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        name: "Do Drul Chorten",
        location: "Gangtok",
        image: "☸️",
        gradient: "from-yellow-500 to-amber-500",
    },
];

const AIMonasteryInsights = () => {
    const [selectedMonastery, setSelectedMonastery] = useState<string | null>(null);
    const [insight, setInsight] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGetInsight = async (name: string) => {
        setSelectedMonastery(name);
        setIsLoading(true);
        setInsight("");

        try {
            const result = await getMonasteryInsight(name);
            setInsight(result);
        } catch {
            setInsight("Unable to load insights at this time. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatInsight = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-deep-earth">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <section className="section-padding bg-secondary/30 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Insights
                    </div>
                    <h2 className="section-heading text-foreground">
                        Discover Monastery Secrets
                    </h2>
                    <p className="section-subheading">
                        Click on any monastery to unlock AI-generated insights, hidden stories,
                        and fascinating facts curated just for you.
                    </p>
                </div>

                {/* Monastery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
                    {MONASTERIES.map((monastery) => (
                        <button
                            key={monastery.name}
                            onClick={() => handleGetInsight(monastery.name)}
                            className={`group relative p-5 rounded-2xl transition-all duration-500 ${selectedMonastery === monastery.name
                                ? "bg-foreground text-background shadow-premium scale-[1.03]"
                                : "bg-card border border-border/60 hover:border-border hover:shadow-monastery"
                                }`}
                        >
                            <div className="text-3xl mb-2.5 group-hover:scale-110 transition-transform duration-300">
                                {monastery.image}
                            </div>
                            <h4
                                className={`text-xs font-semibold mb-1 ${selectedMonastery === monastery.name ? "text-background" : "text-foreground"
                                    }`}
                            >
                                {monastery.name}
                            </h4>
                            <p
                                className={`text-[10px] flex items-center gap-1 ${selectedMonastery === monastery.name ? "text-background/60" : "text-muted-foreground"
                                    }`}
                            >
                                <MapPin className="w-2.5 h-2.5" />
                                {monastery.location}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Insight Display */}
                {selectedMonastery && (
                    <div className="max-w-4xl mx-auto bg-card rounded-3xl border border-border/60 shadow-premium animate-fade-in-up overflow-hidden">
                        <div className="bg-foreground p-6 text-background">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-background/10 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{selectedMonastery}</h3>
                                    <p className="text-background/50 text-xs flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" />
                                        AI-Generated Insights
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            {isLoading ? (
                                <div className="flex flex-col items-center py-12 gap-4">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-muted-foreground text-sm">Uncovering secrets of {selectedMonastery}...</p>
                                </div>
                            ) : (
                                <div
                                    className="prose max-w-none text-foreground/80 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: formatInsight(insight) }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AIMonasteryInsights;
