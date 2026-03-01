import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 8,
        filter: "blur(4px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    },
    exit: {
        opacity: 0,
        y: -8,
        filter: "blur(4px)",
    },
};

const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
