import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Calendar,
  Compass,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { SERVICE_BLOCKS } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Layout constants ────────────────────────────────────────────────────────

/**
 * Détecté une seule fois au chargement du module.
 * Suffisant en SPA Vite (pas de SSR, pas de resize à gérer en temps réel).
 */
const IS_MOBILE =
  typeof window !== "undefined" ? window.innerWidth < 768 : false;

const CARD_W = IS_MOBILE ? 288 : 400;
const CARD_H = IS_MOBILE ? 400 : 520;

/** Icônes — même ordre que SERVICE_BLOCKS dans navigation.ts */
const SERVICE_ICONS: LucideIcon[] = [MapPin, Calendar, Compass, PartyPopper];

// ─── Transform calculator ────────────────────────────────────────────────────

interface CardTransform {
  x: number;
  y: number;
  scale: number;
  rotateY: number;
  opacity: number;
  zIndex: number;
}

/**
 * Calcule la distance circulaire la plus courte entre une carte et
 * la carte active, dans un carousel infini.
 *
 * Exemple avec 4 cartes, currentIndex = 3, i = 0 :
 *   raw = (0 - 3 + 4) % 4 = 1
 *   1 > 2 ? non → distance = +1  (la carte 0 arrive par la DROITE ✓)
 *
 * Sans ce wrapping, distance serait -3 et la carte sauterait
 * visuellement de l'autre côté du carousel.
 */
function circularDistance(i: number, current: number, count: number): number {
  const raw = ((i - current) % count + count) % count;
  return raw > count / 2 ? raw - count : raw;
}

/**
 * Calcule la position 3D d'une carte dans le coverflow.
 *
 * `distance` = distance circulaire (cf. circularDistance)
 *   0  → carte active (centre, pleine échelle)
 *  ±1  → cartes adjacentes (côtés, rotation 3D, semi-transparentes)
 *  ±2+ → cartes cachées (hors cadre)
 *
 * Le x inclut -halfWidth car CSS `left: 50%` positionne le bord gauche
 * au centre du conteneur. Le translateX(-half) recentre la carte.
 *
 * Mobile : on masque les adjacentes (opacity 0) pour une vue single-card.
 */
function getTransform(distance: number): CardTransform {
  const hw = CARD_W / 2;
  const abs = Math.abs(distance);
  const dir = distance > 0 ? 1 : -1;

  // ── Centre ──
  if (distance === 0) {
    return { x: -hw, y: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 50 };
  }

  // ── Adjacentes ──
  if (abs === 1) {
    return {
      x: IS_MOBILE ? -hw + dir * 320 : -hw + dir * 440,
      y: IS_MOBILE ? 0 : 24,
      scale: IS_MOBILE ? 0.9 : 0.8,
      rotateY: IS_MOBILE ? 0 : -dir * 38,
      opacity: IS_MOBILE ? 0 : 0.7,
      zIndex: 30,
    };
  }

  // ── Cachées ──
  return {
    x: -hw + dir * 820,
    y: 48,
    scale: 0.6,
    rotateY: -dir * 48,
    opacity: 0,
    zIndex: 10,
  };
}

// ─── Spring transitions — par propriété ──────────────────────────────────────

const SPRING = { type: "spring" as const, stiffness: 260, damping: 32 };

const CARD_TRANSITION = {
  x: SPRING,
  y: SPRING,
  scale: SPRING,
  rotateY: { type: "spring" as const, stiffness: 240, damping: 28 },
  opacity: { duration: 0.35, ease: "easeOut" as const },
};

// ─── Bouton flèche glassmorphism ─────────────────────────────────────────────

function ArrowButton({
  direction,
  onClick,
  className,
  ariaLabel,
}: {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
  ariaLabel: string;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "h-12 w-12 rounded-full flex items-center justify-center",
        "bg-white/[0.06] border border-white/[0.14] backdrop-blur-md",
        "text-foreground/80 hover:text-foreground",
        "hover:bg-white/[0.12] hover:border-gold/30",
        "shadow-[0_4px_24px_rgba(0,0,0,0.45)]",
        "transition-colors duration-200 cursor-pointer",
        className,
      )}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}

// ─── Carte 3D ────────────────────────────────────────────────────────────────

function CoverCard({
  block,
  icon: CardIcon,
  isActive,
}: {
  block: (typeof SERVICE_BLOCKS)[number];
  icon: LucideIcon;
  isActive: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Link
      to={block.href}
      className={cn(
        "block w-full h-full rounded-3xl overflow-hidden relative group",
        !isActive && "pointer-events-none", // seule la carte active est cliquable (Link)
      )}
      tabIndex={isActive ? 0 : -1}
      style={{
        boxShadow: isActive
          ? "0 32px 80px -12px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,168,67,0.18)"
          : "0 16px 40px -8px rgba(0,0,0,0.55)",
      }}
    >
      {/* Image de fond */}
      <img
        src={block.image}
        alt={t(block.titleKey)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
          isActive && "group-hover:scale-105",
        )}
        loading="lazy"
      />

      {/* Overlay sombre — plus opaque sur les inactives */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isActive
            ? "bg-gradient-to-t from-black/90 via-black/30 to-black/5"
            : "bg-gradient-to-t from-black/95 via-black/60 to-black/20",
        )}
      />

      {/* Bordure dorée sur la carte active */}
      {isActive && (
        <motion.div
          layoutId="coverflow-ring"
          className="absolute inset-0 rounded-3xl ring-1 ring-gold/25 pointer-events-none"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}

      {/* Contenu bas de carte */}
      <div className="absolute inset-0 p-7 md:p-8 flex flex-col justify-end z-10">
        {/* Icône dans un cercle glass */}
        <div className="h-10 w-10 rounded-full bg-white/[0.07] border border-white/[0.14] backdrop-blur-sm flex items-center justify-center mb-5">
          <CardIcon className="h-4 w-4 text-gold" />
        </div>

        <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider text-white mb-2 leading-tight">
          {t(block.titleKey)}
        </h3>

        <p className="text-sm text-white/55 leading-relaxed">
          {t(block.subtitleKey)}
        </p>

        {/* CTA visible uniquement sur la carte active */}
        <motion.div
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center gap-2 mt-5 text-gold text-sm font-medium"
        >
          {t("home.services.discover")}
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.div>
      </div>
    </Link>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function ServicesCoverflow() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = SERVICE_BLOCKS.length;

  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + count) % count),
    [count],
  );
  const next = useCallback(
    () => setCurrentIndex((i) => (i + 1) % count),
    [count],
  );

  // Auto-advance toutes les 4.5 s — suspendu au hover / touch
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [isPaused, next]);

  // Keyboard nav (gauche/droite) quand la section a le focus
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    },
    [prev, next],
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      role="region"
      aria-label={t("home.services.label")}
    >
      {/* ── Carrousel 3D ─────────────────────────────────────────────── */}
      <div className="relative" style={{ height: CARD_H + 32 }}>

        {/* Bouton gauche */}
        <ArrowButton
          direction="left"
          onClick={prev}
          ariaLabel={t("home.services.prev", { defaultValue: "Service précédent" })}
          className="absolute left-2 md:left-4 lg:-left-4 top-1/2 -translate-y-1/2 z-[60]"
        />

        {/*
         * Conteneur perspective — appliquée au parent direct des
         * motion.div qui portent rotateY. Les cartes utilisent
         * `left: 50%` + translateX négatif via Framer Motion pour
         * se centrer, puis l'offset coverflow s'ajoute à x.
         */}
        <motion.div
          className="absolute inset-0 touch-pan-y"
          style={{ perspective: "1200px" }}
          /* Drag mobile — élastique pour feedback visuel, snap à 0 au release */
          drag={IS_MOBILE ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) next();
            else if (info.offset.x > 50) prev();
          }}
        >
          {SERVICE_BLOCKS.map((block, i) => {
            const distance = circularDistance(i, currentIndex, count);
            const tf = getTransform(distance);

            return (
              <motion.div
                key={block.href}
                className="absolute top-0 select-none"
                style={{
                  left: "50%",
                  width: CARD_W,
                  height: CARD_H,
                  zIndex: tf.zIndex,
                }}
                animate={{
                  x: tf.x,
                  y: tf.y,
                  scale: tf.scale,
                  rotateY: tf.rotateY,
                  opacity: tf.opacity,
                }}
                transition={CARD_TRANSITION}
                /* Clic sur une carte adjacente → la centre */
                onClick={
                  distance !== 0
                    ? () => setCurrentIndex(i)
                    : undefined
                }
              >
                <CoverCard
                  block={block}
                  icon={SERVICE_ICONS[i]}
                  isActive={distance === 0}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bouton droit */}
        <ArrowButton
          direction="right"
          onClick={next}
          ariaLabel={t("home.services.next", { defaultValue: "Service suivant" })}
          className="absolute right-2 md:right-4 lg:-right-4 top-1/2 -translate-y-1/2 z-[60]"
        />
      </div>

      {/* ── Indicateurs dots ── */}
      <div className="flex justify-center gap-0.5 mt-8">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            aria-label={t("home.services.goTo", { defaultValue: `Service ${i + 1}`, index: i + 1 })}
            className="relative flex items-center justify-center min-w-[44px] min-h-[44px]"
          >
            <span className={cn(
              "block rounded-full transition-all duration-300",
              i === currentIndex
                ? "w-7 h-2 bg-gold shadow-[0_0_8px_rgba(212,168,67,0.4)]"
                : "w-2 h-2 bg-white/20 hover:bg-white/40",
            )} />
          </button>
        ))}
      </div>

      {/* ── Grand CTA arrondi ── */}
      <div className="flex justify-center mt-8 md:mt-10">
        <Button
          asChild
          variant="gold"
          size="lg"
          className="rounded-full px-8 md:px-14 shadow-[0_6px_28px_rgba(212,168,67,0.22)]"
        >
          <Link to="/reservation">
            {t("home.services.cta", { defaultValue: "Découvrir tous nos services" })}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
