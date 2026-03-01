import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface CounterProps {
    target: number;
    suffix?: string;
    label: string;
    duration?: number;
}

const AnimatedCounter = ({ target, suffix = "", label, duration = 2000 }: CounterProps) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isVisible, target, duration]);

    return (
        <div ref={ref} className="text-center group">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 transition-transform duration-500 ease-apple group-hover:scale-105 tabular-nums">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-[0.15em]">
                {label}
            </div>
        </div>
    );
};

const StatsCounter = () => {
    return (
        <section className="py-20 md:py-28 border-y border-border/50 bg-background relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_var(--tw-gradient-stops))] from-foreground bg-[length:32px_32px]" />

            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                        <AnimatedCounter target={200} suffix="+" label="Monasteries" />
                        <AnimatedCounter target={1000} suffix="+" label="Artifacts Preserved" />
                        <AnimatedCounter target={50000} suffix="+" label="Virtual Visitors" />
                        <AnimatedCounter target={6} label="Languages Supported" />
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default StatsCounter;
