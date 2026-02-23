import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeUpProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

/**
 * Détection mobile + reduced-motion évaluées une seule fois au chargement du module.
 * Safe en SPA Vite (pas de SSR).
 */
const IS_MOBILE =
    typeof window !== "undefined"
        ? window.matchMedia("(max-width: 767px)").matches
        : false;

const PREFERS_REDUCED_MOTION =
    typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

/**
 * FadeUp — composant d'animation au scroll optimisé iOS 60 FPS.
 *
 * Stratégie : `whileInView` + `viewport.margin` positif sur mobile.
 *
 * Pourquoi PAS `useInView` + `animate` :
 * Quand l'utilisateur scrolle vite, le `delay` stagger crée un gap
 * où l'élément est visible dans le viewport mais encore à opacity:0
 * → impression de "pop". Avec `whileInView`, Framer Motion gère
 * le timing correctement et l'animation démarre à la bonne frame.
 *
 * Sur mobile : le margin positif (+100px) déclenche l'animation
 * AVANT que l'élément entre dans le viewport visible, éliminant
 * totalement le "pop".
 *
 * Si l'utilisateur a activé "Réduire les animations" dans son OS,
 * le composant rend un div statique sans animation (zéro overhead JS).
 */
export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
    /* Accessibilité : pas d'animation si l'utilisateur le demande */
    if (PREFERS_REDUCED_MOTION) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: IS_MOBILE ? 14 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
                once: true,
                // amount: 0.1 = seulement 10% de l'élément doit être visible
                // pour déclencher l'animation (très tolérant).
                // margin top +100px = l'élément est considéré "vu" même s'il
                // est encore 100px au-dessus du viewport — corrige le bug où
                // les éléments juste sous le Hero ne se déclenchent pas.
                amount: 0.1,
                margin: IS_MOBILE ? "100px 0px 100px 0px" : "100px 0px -60px 0px",
            }}
            transition={{
                duration: IS_MOBILE ? 0.35 : 0.5,
                ease: [0.25, 0.1, 0.25, 1], // CSS ease standard — le plus léger pour le compositor
                // Mobile : on plafonne le delay à 0.06s pour éviter le "pop" sur scroll rapide
                delay: IS_MOBILE ? Math.min(delay, 0.06) : delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
