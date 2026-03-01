import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    duration?: number;
    once?: boolean;
    amount?: number;
}

const directionVariants = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
};

const ScrollReveal = ({
    children,
    className = "",
    delay = 0,
    direction = "up",
    duration = 0.7,
    once = true,
    amount = 0.2,
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount });

    const offset = directionVariants[direction];

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, ...offset }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1], // Apple-style easing
            }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
