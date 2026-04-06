/**
 * ServicesCoverflow — Carousel 3D style coverflow pour la section Services
 *
 * Fonctionnalités :
 * - Défilement infini (circularDistance)
 * - Spring transitions différenciées par propriété (rotateY plus "flottant")
 * - Flèches glassmorphism (desktop)
 * - Clic sur carte adjacente → centre la carte
 * - Swipe mobile avec drag="x" + dragElastic
 * - Navigation clavier (ArrowLeft / ArrowRight)
 * - Auto-advance 4.5s, pause au hover/touch
 * - Mobile : vue single-card (cartes adjacentes masquées)
 * - CTA bouton doré arrondi sous les dots
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SERVICE_BLOCKS } from "@/data/navigation";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

interface CardTransform {
  x: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

/* ─────────────────────────────────────────────────────────────
   Transitions spring par propriété
   - rotateY : damping plus bas → effet 3D "flottant"
   - x / scale : damping standard
   - opacity : fade classique
───────────────────────────────────────────────────────────── */

const SPRING_XY_SCALE = { type: "spring", stiffness: 260, damping: 32 } as const;
const SPRING_ROTATE_Y = { type: "spring", stiffness: 240, damping: 28 } as const;
const FADE_OPACITY = { duration: 0.35, ease: "easeOut" } as const;

const CARD_TRANSITION = {
  x: SPRING_XY_SCALE,
  y: SPRING_XY_SCALE,
  scale: SPRING_XY_SCALE,
  rotateY: SPRING_ROTATE_Y,
  opacity: FADE_OPACITY,
};

/* ─────────────────────────────────────────────────────────────
   circularDistance
   Calcule la distance circulaire la plus courte entre une carte
   et la carte active, dans un carousel infini.

   Exemple avec 4 cartes, currentIndex = 3, i = 0 :
     raw = (0 - 3 + 4) % 4 = 1
     1 > 2 ? non → distance = +1  (la carte 0 arrive par la DROITE ✓)

   Sans ce wrapping, distance serait -3 et la carte sauterait
   visuellement de l'autre côté du carousel.
───────────────────────────────────────────────────────────── */

function circularDistance(i: number, current: number, count: number): number {
  const raw = ((i - current) % count + count) % count;
  return raw > count / 2 ? raw - count : raw;
}

/* ─────────────────────────────────────────────────────────────
   getTransform
   Calcule la position 3D d'une carte en fonction de sa distance
   à la carte active.
     0  → carte active (centre, pleine échelle)
    ±1  → cartes adjacentes (côtés, rotation 3D, semi-transparentes)
    ±2+ → cartes cachées (hors cadre)
───────────────────────────────────────────────────────────── */

function getTransform(distance: number): CardTransform {
  if (Math.abs(distance) >= 2) {
    return {
      x: distance > 0 ? 540 : -540,
      rotateY: 0,
      scale: 0.65,
      opacity: 0,
      zIndex: 0,
    };
  }

  if (distance === 0) {
    return { x: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 3 };
  }

  // ±1 : carte adjacente
  const sign = distance > 0 ? 1 : -1;
  return {
    x: sign * 260,
    rotateY: sign * -42,
    scale: 0.80,
    opacity: 0.52,
    zIndex: 2,
  };
}

/* ─────────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────────── */

export function ServicesCoverflow() {
  const { t } = useTranslation();
  const count = SERVICE_BLOCKS.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* ── Navigation ── */
  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % count);
  }, [count]);

  /* ── Auto-advance 4.5s, pause au hover/touch ── */
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [isPaused, next]);

  /* ── Navigation clavier (ArrowLeft / ArrowRight) ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };

    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  return (
    <div
      ref={sectionRef}
      tabIndex={0}
      outline-none
      className="focus:outline-none w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ─────── Scène perspective ─────── */}
      <motion.div
        className="relative w-full flex items-center justify-center h-[500px] sm:h-[540px] md:h-[520px]"
        style={{ perspective: 1200 }}
        /* Swipe mobile : drag sur l'ensemble du conteneur */
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -55) next();
          else if (info.offset.x > 55) prev();
        }}
      >
        {SERVICE_BLOCKS.map((block, i) => {
          const distance = circularDistance(i, currentIndex, count);
          const tf = getTransform(distance);

          /* Sur mobile, on masque les cartes adjacentes pour une vue single-card propre */
          const mobileVisible = distance === 0;

          return (
            <motion.div
              key={block.href}
              animate={{
                x: tf.x,
                rotateY: tf.rotateY,
                scale: tf.scale,
                opacity: tf.opacity,
              }}
              transition={CARD_TRANSITION}
              style={{
                zIndex: tf.zIndex,
                position: "absolute",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              className={`
                w-[88vw] max-w-[360px] sm:w-[400px] md:w-[420px]
                cursor-pointer select-none
                ${!mobileVisible ? "pointer-events-none md:pointer-events-auto max-md:opacity-0" : ""}
              `}
              onClick={() => {
                if (distance !== 0) {
                  /* Clic sur carte adjacente → la centre */
                  setCurrentIndex(i);
                } else {
                  /* Clic sur carte active → navigation */
                  window.location.href = block.href;
                }
              }}
            >
              {/* ── Carte ── */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] h-[440px] sm:h-[460px] group">
                <img
                  src={block.image}
                  alt={t(block.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                {/* Halo doré au hover sur la carte active */}
                {distance === 0 && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-gold/[0.08] via-transparent to-transparent" />
                )}

                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                  <h3 className="font-display text-xl font-semibold text-white tracking-wide mb-1">
                    {t(block.titleKey)}
                  </h3>
                  <p className="text-sm text-white/60">
                    {t(block.subtitleKey)}
                  </p>
                  {distance === 0 && (
                    <div className="flex items-center gap-2 mt-3 text-gold text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-300">
                      {t("home.services.discover")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─────── Contrôles ─────── */}
      <div className="flex flex-col items-center gap-5 mt-6">

        {/* Flèches (desktop uniquement) + Dots */}
        <div className="flex items-center gap-6">

          {/* Flèche gauche — glassmorphism */}
          <button
            type="button"
            aria-label={t("common.previous")}
            onClick={prev}
            className="hidden md:flex items-center justify-center h-10 w-10 rounded-full backdrop-blur-md bg-white/[0.06] border border-white/10 hover:border-gold/30 hover:bg-white/[0.10] transition-[background,border] duration-200"
          >
            <motion.span
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.90 }}
              className="flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4 text-white/70" />
            </motion.span>
          </button>

          {/* Dots */}
          <div className="flex gap-2 items-center">
            {SERVICE_BLOCKS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={t("home.services.goToService", { index: i + 1 })}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-5 h-1.5 bg-gold"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Flèche droite — glassmorphism */}
          <button
            type="button"
            aria-label={t("common.next")}
            onClick={next}
            className="hidden md:flex items-center justify-center h-10 w-10 rounded-full backdrop-blur-md bg-white/[0.06] border border-white/10 hover:border-gold/30 hover:bg-white/[0.10] transition-[background,border] duration-200"
          >
            <motion.span
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.90 }}
              className="flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 text-white/70" />
            </motion.span>
          </button>
        </div>

        {/* CTA doré — rounded-full avec shadow-gold premium */}
        <Button
          asChild
          variant="gold"
          size="lg"
          className="rounded-full shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_32px_rgba(212,175,55,0.40)] transition-shadow duration-300"
        >
          <Link to={SERVICE_BLOCKS[currentIndex]?.href ?? "/trajets"}>
            {t("home.services.discover")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
