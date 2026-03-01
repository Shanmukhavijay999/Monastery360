import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
    X,
    ChevronLeft,
    ChevronRight,
    Info,
    Volume2,
    VolumeX,
    MapPin,
    Clock,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Maximize2,
    Minimize2,
    Camera,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import virtualTourImage from "@/assets/virtual-tour.jpg";
import monasteryHero from "@/assets/monastery-hero.jpg";
import digitalArchives from "@/assets/digital-archives.jpg";
import culturalEvents from "@/assets/cultural-events.jpg";
import eastSikkim from "@/assets/east_sikkim.jpg";

interface Hotspot {
    id: string;
    x: number; // percentage from left
    y: number; // percentage from top
    label: string;
    description: string;
    icon: string;
}

interface TourScene {
    id: number;
    title: string;
    location: string;
    image: string;
    description: string;
    narration: string;
    duration: string;
    hotspots: Hotspot[];
    facts: string[];
}

const tourScenes: TourScene[] = [
    {
        id: 1,
        title: "Main Prayer Hall Entrance",
        location: "Rumtek Monastery, East Sikkim",
        image: virtualTourImage,
        description:
            "The grand entrance to Rumtek Monastery's main prayer hall, adorned with traditional Tibetan Buddhist motifs and sacred symbols.",
        narration:
            "Welcome to Rumtek Monastery, the largest monastery in Sikkim and the seat of the Kagyu lineage. Built in the 1960s by the 16th Gyalwa Karmapa, this monastery is a masterpiece of Tibetan Buddhist architecture. Notice the intricate woodwork and the prayer wheels lining the entrance — each spin is believed to release prayers into the universe.",
        duration: "3 min",
        hotspots: [
            {
                id: "h1",
                x: 25,
                y: 40,
                label: "Prayer Wheels",
                description:
                    "These golden prayer wheels contain scrolls with sacred mantras. Devotees spin them clockwise to accumulate wisdom and good karma. Each wheel contains thousands of copies of the mantra 'Om Mani Padme Hum'.",
                icon: "🪷",
            },
            {
                id: "h2",
                x: 55,
                y: 30,
                label: "Golden Buddha Statue",
                description:
                    "The central Buddha statue stands 4 meters tall and is plated with pure gold. It was consecrated by the 16th Karmapa himself and represents the Buddha in the earth-touching gesture (Bhumisparsha Mudra).",
                icon: "🙏",
            },
            {
                id: "h3",
                x: 80,
                y: 50,
                label: "Sacred Murals",
                description:
                    "These ancient wall paintings depict the life of Buddha, the Wheel of Life, and various bodhisattvas. They were painted by master artists from Tibet using natural mineral pigments that have retained their vibrancy for decades.",
                icon: "🎨",
            },
        ],
        facts: [
            "Rumtek houses a golden stupa containing the relics of the 16th Karmapa",
            "The monastery was built as a replica of the original Tsurphu Monastery in Tibet",
            "Over 200 monks reside and study here year-round",
        ],
    },
    {
        id: 2,
        title: "Ancient Manuscript Library",
        location: "Pemayangtse Monastery, West Sikkim",
        image: digitalArchives,
        description:
            "The sacred library of Pemayangtse houses centuries-old Buddhist manuscripts, thangka paintings, and religious texts preserved for future generations.",
        narration:
            "Pemayangtse, meaning 'Perfect Sublime Lotus', was founded in 1705 by Lhatsun Chempo, one of the three lamas who consecrated the first Chogyal of Sikkim. This library contains rare manuscripts written in gold and silver ink on handmade paper. The oldest texts here date back over 300 years and contain teachings of the Nyingma tradition.",
        duration: "4 min",
        hotspots: [
            {
                id: "h4",
                x: 30,
                y: 35,
                label: "Ancient Manuscripts",
                description:
                    "These palm-leaf manuscripts contain Buddhist sutras written in classical Tibetan script. Some pages are illuminated with gold ink and feature intricate miniature paintings of deities and mandalas.",
                icon: "📜",
            },
            {
                id: "h5",
                x: 65,
                y: 45,
                label: "Thangka Paintings",
                description:
                    "Thangka paintings are traditional Tibetan Buddhist scroll paintings on cotton or silk. These masterpieces depict Buddhist deities, mandalas, and scenes from the life of Buddha, using natural mineral and organic pigments.",
                icon: "🖼️",
            },
            {
                id: "h6",
                x: 50,
                y: 70,
                label: "Butter Lamp Offerings",
                description:
                    "Butter lamps symbolize the dispelling of darkness (ignorance) with light (wisdom). Devotees light these lamps as offerings, and they burn continuously in the prayer halls.",
                icon: "🕯️",
            },
        ],
        facts: [
            "Pemayangtse is one of the oldest monasteries in Sikkim, founded in 1705",
            "Only 'Pure monks' (ta-sang) of the Nyingma order are admitted here",
            "The 3rd floor houses a stunning 7-tiered painted wooden model of heaven",
        ],
    },
    {
        id: 3,
        title: "Festival Grounds & Cham Dance",
        location: "Tashiding Monastery, West Sikkim",
        image: culturalEvents,
        description:
            "The sacred festival grounds of Tashiding where the famous Bumchu festival and Cham dances take place, surrounded by breathtaking Himalayan landscapes.",
        narration:
            "Tashiding Monastery, built in 1717 by Ngadak Sempa Chenpo, sits atop a heart-shaped hill between the Rathong and Rangit rivers. It is considered the most sacred monastery in Sikkim. The annual Bumchu festival, held on the 15th day of the first Tibetan month, involves opening a sacred vessel of 'Bumchu' water — the water level predicts the future year's fortunes.",
        duration: "5 min",
        hotspots: [
            {
                id: "h7",
                x: 35,
                y: 55,
                label: "Cham Dance Stage",
                description:
                    "Cham dances are sacred masked dances performed by monks during festivals. Each dance tells stories of Buddhist deities triumphing over evil, and the elaborate costumes and masks are considered sacred objects.",
                icon: "🎭",
            },
            {
                id: "h8",
                x: 70,
                y: 35,
                label: "Sacred Bumchu Vessel",
                description:
                    "The legendary Bumchu vessel contains sacred water that has been sealed since the monastery's founding. Once a year, it is opened — if the water level is high, it predicts prosperity; if low, it foretells difficulties.",
                icon: "🏺",
            },
            {
                id: "h9",
                x: 20,
                y: 30,
                label: "Prayer Flags",
                description:
                    "Colorful prayer flags strung across the monastery ground carry printed prayers and mantras. Wind carries these prayers to spread goodwill and compassion. The five colors represent the five elements: blue (sky), white (air), red (fire), green (water), yellow (earth).",
                icon: "🏳️",
            },
        ],
        facts: [
            "Tashiding means 'Devoted Central Glory'",
            "The Bumchu festival attracts thousands of pilgrims from across the Himalayas",
            "It contains sacred relics of Guru Padmasambhava, also known as Guru Rinpoche",
        ],
    },
    {
        id: 4,
        title: "Meditation Garden & Stupa",
        location: "Enchey Monastery, Gangtok",
        image: monasteryHero,
        description:
            "The serene meditation gardens of Enchey Monastery, featuring ancient stupas, meditation caves, and panoramic views of the Kanchenjunga range.",
        narration:
            "Enchey Monastery, meaning 'Solitary Temple', was built in 1909 on a site blessed by Lama Druptob Karpo in the 1840s. Perched on a hilltop overlooking Gangtok, this Nyingma monastery offers stunning views of Mount Kanchenjunga, the world's third highest peak. The monastery is famous for its annual Cham dance performed during the Pang Lhabsol festival, celebrating the warrior deity Kanchenjunga.",
        duration: "4 min",
        hotspots: [
            {
                id: "h10",
                x: 45,
                y: 25,
                label: "Kanchenjunga View",
                description:
                    "From here you can see Mount Kanchenjunga (8,586m), the third highest mountain in the world. The Sikkimese people consider it sacred — the guardian deity of Sikkim is believed to reside on its summit.",
                icon: "🏔️",
            },
            {
                id: "h11",
                x: 60,
                y: 60,
                label: "Ancient Stupa",
                description:
                    "This stupa (chorten) contains sacred relics and represents the enlightened mind of Buddha. Walking clockwise around it is a meditative practice that generates merit and brings peace.",
                icon: "🛕",
            },
            {
                id: "h12",
                x: 25,
                y: 55,
                label: "Meditation Spot",
                description:
                    "This tranquil meditation area has been used by monks for over a century. The combination of mountain air, silence, and sacred surroundings creates an ideal environment for contemplation and inner peace.",
                icon: "🧘",
            },
        ],
        facts: [
            "Enchey offers some of the best sunrise views of Kanchenjunga in all of Sikkim",
            "The Pang Lhabsol festival features the famous warrior dance honoring Mount Kanchenjunga",
            "The monastery houses rare Buddhist scriptures in its inner sanctum",
        ],
    },
    {
        id: 5,
        title: "Panoramic Valley View",
        location: "East Sikkim Viewpoint",
        image: eastSikkim,
        description:
            "A breathtaking panoramic view of the monastery-dotted valley of East Sikkim, with snow-capped Himalayan peaks forming a majestic backdrop.",
        narration:
            "From this viewpoint, you can see how monasteries are woven into the fabric of Sikkim's landscape. Each monastery was strategically placed on hilltops and ridges — not just for spiritual reasons, but also to serve as beacons of learning, culture, and community. The entire valley is a living museum of Buddhist heritage, with over 200 monasteries preserving centuries of wisdom. This concludes our virtual tour — we hope this journey has inspired you to explore Sikkim's sacred heritage in person.",
        duration: "3 min",
        hotspots: [
            {
                id: "h13",
                x: 40,
                y: 40,
                label: "Valley Monasteries",
                description:
                    "Scattered across this valley are dozens of small monasteries and retreat centers, each with its own history and traditions. Many are centuries old and still serve as active centers of Buddhist learning.",
                icon: "🏯",
            },
            {
                id: "h14",
                x: 75,
                y: 25,
                label: "Himalayan Peaks",
                description:
                    "The snow-capped peaks in the distance include some of the world's highest mountains. The Sikkimese believe these mountains are home to protective deities who watch over the land and its people.",
                icon: "⛰️",
            },
        ],
        facts: [
            "Sikkim has over 200 monasteries — the highest density of any Indian state",
            "The state was an independent Buddhist kingdom until it merged with India in 1975",
            "Sikkim's monasteries attract over 50,000 cultural pilgrims annually",
        ],
    },
];

interface TourViewerProps {
    isOpen: boolean;
    onClose: () => void;
    initialScene?: number;
}

const TourViewer = ({ isOpen, onClose, initialScene = 0 }: TourViewerProps) => {
    const [currentScene, setCurrentScene] = useState(initialScene);
    const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showFacts, setShowFacts] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const scene = tourScenes[currentScene];
    const totalScenes = tourScenes.length;
    const progress = ((currentScene + 1) / totalScenes) * 100;

    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // Handle Browser Back Button integration
    useEffect(() => {
        if (!isOpen) return;

        window.history.pushState({ tourViewerOpen: true }, "", window.location.href);

        const handlePopState = () => {
            onCloseRef.current();
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (window.history.state?.tourViewerOpen) {
            window.history.back();
        } else {
            onClose();
        }
    }, [onClose]);

    // Reset state when scene changes
    useEffect(() => {
        setActiveHotspot(null);
        setShowInfo(false);
        setShowFacts(false);
        setZoom(1);
        setImageLoaded(false);
    }, [currentScene]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "i") setShowInfo((p) => !p);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, currentScene]);

    const goNext = useCallback(() => {
        if (currentScene < totalScenes - 1) {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentScene((p) => p + 1);
                setTransitioning(false);
            }, 400);
        }
    }, [currentScene, totalScenes]);

    const goPrev = useCallback(() => {
        if (currentScene > 0) {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentScene((p) => p - 1);
                setTransitioning(false);
            }, 400);
        }
    }, [currentScene]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    if (!isOpen) return null;

    const viewerContent = (
        <div className="fixed inset-0 z-[100] bg-black">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                {/* Progress Bar */}
                <div className="h-1 bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between px-4 py-3 md:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div>
                            <h3 className="text-white font-bold text-sm md:text-base">{scene.title}</h3>
                            <div className="flex items-center gap-2 text-white/60 text-xs">
                                <MapPin className="w-3 h-3" />
                                <span>{scene.location}</span>
                                <span className="mx-1">•</span>
                                <Clock className="w-3 h-3" />
                                <span>{scene.duration}</span>
                                <span className="mx-1">•</span>
                                <span>
                                    {currentScene + 1}/{totalScenes}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className={`p-2 rounded-xl transition-all backdrop-blur-sm ${showInfo ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                                }`}
                            title="About this location (I)"
                        >
                            <Info className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={() => setShowFacts(!showFacts)}
                            className={`p-2 rounded-xl transition-all backdrop-blur-sm ${showFacts ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                                }`}
                            title="Fun facts"
                        >
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm text-white"
                        >
                            {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm text-white hidden md:block"
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Image Area */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-400 ${transitioning ? "opacity-0" : "opacity-100"
                    }`}
            >
                <img
                    src={scene.image}
                    alt={scene.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: `scale(${zoom})` }}
                    onLoad={() => setImageLoaded(true)}
                    draggable={false}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Hotspots */}
                {imageLoaded &&
                    scene.hotspots.map((hotspot) => (
                        <button
                            key={hotspot.id}
                            className={`absolute group transition-all duration-300 ${activeHotspot?.id === hotspot.id ? "z-20 scale-125" : "z-10 hover:scale-110"
                                }`}
                            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: "translate(-50%, -50%)" }}
                            onClick={() => setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot)}
                        >
                            {/* Pulse ring */}
                            <div className="absolute inset-0 w-12 h-12 -m-1 rounded-full bg-amber-400/30 animate-ping" />
                            <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/40 cursor-pointer border-2 border-white/80">
                                <span className="text-lg">{hotspot.icon}</span>
                            </div>
                            {/* Label tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                                    {hotspot.label}
                                </div>
                            </div>
                        </button>
                    ))}
            </div>

            {/* Hotspot Detail Panel */}
            {activeHotspot && (
                <div className="absolute bottom-24 md:bottom-28 left-4 right-4 md:left-auto md:right-6 md:w-96 z-30 animate-fade-in-up">
                    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{activeHotspot.icon}</span>
                                <h4 className="text-white font-bold text-sm">{activeHotspot.label}</h4>
                            </div>
                            <button
                                onClick={() => setActiveHotspot(null)}
                                className="text-white/50 hover:text-white p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">{activeHotspot.description}</p>
                    </div>
                </div>
            )}

            {/* Info Panel (Narration) */}
            {showInfo && (
                <div className="absolute top-20 left-4 md:left-6 z-30 w-80 md:w-96 animate-fade-in-up">
                    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl max-h-[60vh] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-5 h-5 text-amber-400" />
                            <h4 className="text-white font-bold">About This Location</h4>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed mb-4">{scene.narration}</p>
                        <div className="pt-3 border-t border-white/10">
                            <p className="text-white/50 text-xs italic">{scene.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Facts Panel */}
            {showFacts && (
                <div className="absolute top-20 right-4 md:right-6 z-30 w-80 animate-fade-in-up">
                    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <h4 className="text-white font-bold text-sm">Did You Know?</h4>
                        </div>
                        <div className="space-y-3">
                            {scene.facts.map((fact, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-amber-400 text-xs font-bold">{i + 1}</span>
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed">{fact}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Zoom Controls */}
            <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
                <button
                    onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm text-white transition-all"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setZoom(1)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm text-white transition-all"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm text-white transition-all"
                >
                    <ZoomOut className="w-5 h-5" />
                </button>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-10 pb-4 px-4 md:px-6">
                {/* Scene Thumbnails */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                    {tourScenes.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setTransitioning(true);
                                setTimeout(() => {
                                    setCurrentScene(i);
                                    setTransitioning(false);
                                }, 400);
                            }}
                            className={`flex-shrink-0 w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === currentScene
                                ? "border-amber-400 shadow-lg shadow-amber-500/30 scale-110"
                                : i < currentScene
                                    ? "border-white/30 opacity-80"
                                    : "border-white/10 opacity-50 hover:opacity-80"
                                }`}
                        >
                            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                    <Button
                        onClick={goPrev}
                        disabled={currentScene === 0}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30 rounded-xl gap-2 backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="text-white/60 text-xs flex items-center gap-2">
                        <Camera className="w-3 h-3" />
                        Click hotspots to explore • Arrow keys to navigate
                    </div>

                    <Button
                        onClick={currentScene === totalScenes - 1 ? handleClose : goNext}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl gap-2 shadow-lg shadow-orange-500/30"
                    >
                        <span className="hidden sm:inline">
                            {currentScene === totalScenes - 1 ? "Finish Tour" : "Next Scene"}
                        </span>
                        <span className="sm:hidden">
                            {currentScene === totalScenes - 1 ? "Finish" : "Next"}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return createPortal(viewerContent, document.body);
};

export default TourViewer;
