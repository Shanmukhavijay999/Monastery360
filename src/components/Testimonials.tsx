import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
    { name: "Dr. Priya Sharma", role: "Cultural Historian", location: "Delhi, India", avatar: "👩‍🎓", rating: 5, text: "Monastery360 is a groundbreaking platform! The virtual tours gave me access to monasteries I've only read about. The AI guide is remarkably knowledgeable." },
    { name: "Tenzin Dorje", role: "Buddhist Scholar", location: "Dharamsala, India", avatar: "🧑‍🦲", rating: 5, text: "As a Buddhist monk, I'm deeply moved by how respectfully and accurately this platform presents our traditions. The digital archives are a treasure." },
    { name: "Sarah Mitchell", role: "Travel Blogger", location: "London, UK", avatar: "👩‍💻", rating: 5, text: "The AI trip planner created the perfect 5-day pilgrimage for me. I visited monasteries I never would have discovered on my own. Life-changing!" },
    { name: "Kenji Tanaka", role: "Photography Enthusiast", location: "Tokyo, Japan", avatar: "📷", rating: 4, text: "The 360° virtual tours are stunning! As a photographer, I was amazed by the detail in the digital archives. The thangka collection is breathtaking." },
    { name: "Amita Rai", role: "Local Guide", location: "Gangtok, Sikkim", avatar: "🏔️", rating: 5, text: "Being from Sikkim, I'm proud of this platform. It brings our heritage to the world while preserving it for future generations." },
    { name: "Prof. Robert Chen", role: "Anthropologist", location: "San Francisco, USA", avatar: "🎓", rating: 5, text: "I use Monastery360 extensively in my research. The AI-powered search through manuscripts has saved me months of work. Truly innovative!" },
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
        <section className="section-padding bg-secondary/30 relative overflow-hidden">
            {/* Decorative Quotes */}
            <div className="absolute top-16 left-8 opacity-[0.03]">
                <Quote className="w-48 h-48 rotate-180 text-foreground" />
            </div>
            <div className="absolute bottom-16 right-8 opacity-[0.03]">
                <Quote className="w-48 h-48 text-foreground" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="section-heading text-foreground">
                            What Visitors Say
                        </h2>
                        <p className="section-subheading">
                            Hear from travelers, scholars, and cultural enthusiasts worldwide.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="max-w-3xl mx-auto relative">
                    {/* Navigation */}
                    <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-16 z-10 w-10 h-10 bg-card rounded-full shadow-soft border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                        <ChevronLeft className="w-4 h-4 text-foreground" />
                    </button>
                    <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-16 z-10 w-10 h-10 bg-card rounded-full shadow-soft border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                        <ChevronRight className="w-4 h-4 text-foreground" />
                    </button>

                    {/* Testimonial */}
                    <div className="bg-card rounded-3xl border border-border/60 shadow-premium overflow-hidden">
                        <div className="p-10 md:p-14 text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <div className="text-5xl mb-6">{testimonials[current].avatar}</div>

                                    <div className="flex justify-center gap-1 mb-6">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonials[current].rating ? "text-primary fill-primary" : "text-border"}`}
                                            />
                                        ))}
                                    </div>

                                    <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 font-light max-w-2xl mx-auto">
                                        "{testimonials[current].text}"
                                    </blockquote>

                                    <div>
                                        <div className="font-semibold text-foreground">{testimonials[current].name}</div>
                                        <div className="text-sm text-primary font-medium">{testimonials[current].role}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{testimonials[current].location}</div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                className={`transition-all duration-300 rounded-full ${index === current
                                        ? "w-8 h-2.5 bg-primary"
                                        : "w-2.5 h-2.5 bg-border hover:bg-muted-foreground/30"
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
