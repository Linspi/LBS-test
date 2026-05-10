/**
 * SectionReveal — Sticky stack avec fondu de sortie (GSAP ScrollTrigger)
 *
 * Technique inspirée du CinematicFooter prompt :
 * - CSS `sticky top-0` gère le stacking (aucun pin GSAP → zéro bug navigation)
 * - GSAP ScrollTrigger anime le FONDU de la section sortante pendant
 *   que la suivante monte par dessous
 *
 * Séquence visuelle :
 *   1. Section A visible, section B en dessous
 *   2. On scrolle → le bas de la section A sort du viewport
 *   3. GSAP scrub : Section A passe de opacity 1 → 0 + scale 1 → 0.94
 *   4. Section B (z-index supérieur) est déjà là, elle prend toute la place
 *
 * Pas de `pin: true` → pas de `position:fixed` → pas de page vide
 * lors de la navigation React Router.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function SectionReveal({ children, className, index = 0 }: SectionRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 0,
        scale: 0.82,
        ease: "power3.in", // accélère fortement vers la fin — disparition rapide
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // "center top" = section disparaît complètement dès que son centre
          // sort du viewport — 2× plus rapide que "bottom top"
          end: "center top",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn("sticky top-0 bg-background", className)}
      style={{ zIndex: index + 1 }}
    >
      {children}
    </div>
  );
}
