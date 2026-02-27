import { useEffect, useRef, useState } from "react";

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
            <div className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3 transition-transform duration-300 group-hover:scale-110">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wider">
                {label}
            </div>
        </div>
    );
};

const StatsCounter = () => {
    return (
        <section className="py-16 bg-gradient-to-r from-amber-50 via-white to-orange-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(251,191,36,0.03)_25%,rgba(251,191,36,0.03)_50%,transparent_50%,transparent_75%,rgba(251,191,36,0.03)_75%)] bg-[length:40px_40px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    <AnimatedCounter target={200} suffix="+" label="Monasteries" />
                    <AnimatedCounter target={1000} suffix="+" label="Artifacts Preserved" />
                    <AnimatedCounter target={50000} suffix="+" label="Virtual Visitors" />
                    <AnimatedCounter target={6} label="Languages Supported" />
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
