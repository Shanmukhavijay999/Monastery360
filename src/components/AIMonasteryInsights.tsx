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
        <section className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-emerald-200">
                        <Sparkles className="w-4 h-4" />
                        AI Insights
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
                        Discover Monastery Secrets
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Click on any monastery to unlock AI-generated insights, hidden stories,
                        and fascinating facts curated just for you.
                    </p>
                </div>

                {/* Monastery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {MONASTERIES.map((monastery) => (
                        <button
                            key={monastery.name}
                            onClick={() => handleGetInsight(monastery.name)}
                            className={`group relative p-6 rounded-2xl transition-all duration-500 ${selectedMonastery === monastery.name
                                    ? `bg-gradient-to-br ${monastery.gradient} text-white shadow-xl scale-105`
                                    : "bg-white border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg"
                                }`}
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {monastery.image}
                            </div>
                            <h4
                                className={`text-sm font-bold mb-1 ${selectedMonastery === monastery.name ? "text-white" : "text-deep-earth"
                                    }`}
                            >
                                {monastery.name}
                            </h4>
                            <p
                                className={`text-xs flex items-center gap-1 ${selectedMonastery === monastery.name ? "text-white/80" : "text-gray-400"
                                    }`}
                            >
                                <MapPin className="w-3 h-3" />
                                {monastery.location}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Insight Display */}
                {selectedMonastery && (
                    <Card className="max-w-4xl mx-auto shadow-2xl border-orange-100 animate-fade-in-up overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <BookOpen className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedMonastery}</h3>
                                    <p className="text-white/80 text-sm flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        AI-Generated Insights
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-8">
                            {isLoading ? (
                                <div className="flex flex-col items-center py-12 gap-4">
                                    <div className="relative">
                                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                                        <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                                    </div>
                                    <p className="text-gray-500">Uncovering secrets of {selectedMonastery}...</p>
                                </div>
                            ) : (
                                <div
                                    className="prose prose-orange max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: formatInsight(insight) }}
                                />
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
};

export default AIMonasteryInsights;
