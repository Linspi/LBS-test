import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface FadeUpProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

/* Variants définis en dehors du composant : l'objet n'est pas recréé à chaque render */
const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
    return (
        <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
