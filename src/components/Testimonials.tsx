import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
    {
        name: "Dr. Priya Sharma",
        role: "Cultural Historian",
        location: "Delhi, India",
        avatar: "👩‍🎓",
        rating: 5,
        text: "Monastery360 is a groundbreaking platform! The virtual tours gave me access to monasteries I've only read about in texts. The AI guide is remarkably knowledgeable about Buddhist heritage.",
    },
    {
        name: "Tenzin Dorje",
        role: "Buddhist Scholar",
        location: "Dharamsala, India",
        avatar: "🧑‍🦲",
        rating: 5,
        text: "As a Buddhist monk, I'm deeply moved by how respectfully and accurately this platform presents our traditions. The digital archives are a treasure for preservation.",
    },
    {
        name: "Sarah Mitchell",
        role: "Travel Blogger",
        location: "London, UK",
        avatar: "👩‍💻",
        rating: 5,
        text: "The AI trip planner created the perfect 5-day pilgrimage for me. I visited monasteries I never would have discovered on my own. Truly life-changing!",
    },
    {
        name: "Kenji Tanaka",
        role: "Photography Enthusiast",
        location: "Tokyo, Japan",
        avatar: "📷",
        rating: 4,
        text: "The 360° virtual tours are stunning! As a photographer, I was amazed by the detail in the digital archives. The thangka paintings collection is breathtaking.",
    },
    {
        name: "Amita Rai",
        role: "Local Guide",
        location: "Gangtok, Sikkim",
        avatar: "🏔️",
        rating: 5,
        text: "Being from Sikkim, I'm proud of this platform. It brings our heritage to the world while preserving it for future generations. The audio guides in Nepali are wonderful!",
    },
    {
        name: "Prof. Robert Chen",
        role: "Anthropologist",
        location: "San Francisco, USA",
        avatar: "🎓",
        rating: 5,
        text: "I use Monastery360 extensively in my research. The AI-powered search through the manuscript archives has saved me months of work. Truly innovative!",
    },
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goTo = (index: number) => {
        setCurrent(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length);
    const next = () => goTo((current + 1) % testimonials.length);

    return (
        <section className="py-20 bg-gradient-to-b from-amber-50 via-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-amber-100">
                <Quote className="w-40 h-40 rotate-180" />
            </div>
            <div className="absolute bottom-10 right-10 text-amber-100">
                <Quote className="w-40 h-40" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
                        What Visitors Say
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hear from travelers, scholars, and cultural enthusiasts who have experienced
                        Sikkim's monastery heritage through our platform.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Navigation Arrows */}
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-orange-50 transition-colors border border-orange-100"
                    >
                        <ChevronLeft className="w-5 h-5 text-deep-earth" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-orange-50 transition-colors border border-orange-100"
                    >
                        <ChevronRight className="w-5 h-5 text-deep-earth" />
                    </button>

                    {/* Testimonial Card */}
                    <Card className="shadow-2xl border-orange-100 overflow-hidden">
                        <CardContent className="p-12 text-center">
                            <div className="text-6xl mb-6" key={current}>
                                {testimonials[current].avatar}
                            </div>

                            {/* Stars */}
                            <div className="flex justify-center gap-1 mb-6">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < testimonials[current].rating
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>

                            <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic max-w-3xl mx-auto">
                                "{testimonials[current].text}"
                            </blockquote>

                            <div>
                                <div className="font-bold text-deep-earth text-lg">
                                    {testimonials[current].name}
                                </div>
                                <div className="text-saffron text-sm font-medium">
                                    {testimonials[current].role}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {testimonials[current].location}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dots Navigation */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                className={`transition-all duration-300 rounded-full ${index === current
                                        ? "w-8 h-3 bg-gradient-to-r from-amber-500 to-orange-500"
                                        : "w-3 h-3 bg-gray-300 hover:bg-orange-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
