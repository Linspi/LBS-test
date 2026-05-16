/**
 * PricingCard — Carte tarifaire premium BLS
 *
 * Inspiré du composant pricing-page (21st.dev), adapté à la charte BLS :
 * - Fond sombre avec halos dorés/champagne (au lieu de violet/rose)
 * - Bordure animée en rotation avec gradient or
 * - Badge "Le plus populaire" en gold
 * - Icônes Lucide React
 * - CTA vers la page de réservation
 */

import { type ReactNode } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  /** Nom du véhicule ou du forfait */
  planName: string;
  /** Sous-titre court */
  description: string;
  /** Prix affiché (ex: "60 €") */
  price: string;
  /** Unité / description du prix (ex: "/ heure") */
  priceDescription: string;
  /** Note sous le prix */
  priceNote?: string;
  /** Liste des avantages */
  features: string[];
  /** Icône Lucide passée comme ReactNode */
  icon: ReactNode;
  /** Classes Tailwind pour le dégradé de fond de l'icône */
  iconBgClass: string;
  /** Indique si c'est l'offre mise en avant */
  isPopular?: boolean;
  /** Texte du bouton CTA */
  buttonText: string;
  /** URL de destination du bouton */
  buttonHref: string;
  className?: string;
}

export function PricingCard({
  planName,
  description,
  price,
  priceDescription,
  priceNote,
  features,
  icon,
  iconBgClass,
  isPopular = false,
  buttonText,
  buttonHref,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn("relative flex flex-col rounded-2xl p-6 transition-all duration-300 group", className)}
      style={{
        /* Fond sombre avec halos or/champagne au lieu de violet */
        background: [
          "radial-gradient(at 88% 40%, hsla(222, 47%, 7%, 1) 0px, transparent 85%)",
          "radial-gradient(at 49% 30%, hsla(222, 47%, 7%, 1) 0px, transparent 85%)",
          "radial-gradient(at 14% 26%, hsla(222, 47%, 7%, 1) 0px, transparent 85%)",
          "radial-gradient(at 0%  64%, hsla(211, 27%, 25%, 0.9) 0px, transparent 85%)",
          "radial-gradient(at 41% 94%, hsla(211, 37%, 42%, 0.6) 0px, transparent 85%)",
          "radial-gradient(at 100% 99%, hsla(211, 30%, 35%, 0.8) 0px, transparent 85%)",
        ].join(", "),
        boxShadow: "0px -16px 24px 0px rgba(90, 122, 156, 0.08) inset",
      }}
    >
      {/* ── Bordure animée en rotation ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
        style={{ width: "calc(100% + 2px)", height: "calc(100% + 2px)" }}
      >
        <div
          className="absolute top-1/2 left-1/2 h-40 w-[200%]"
          style={{
            backgroundImage:
              "linear-gradient(0deg, hsla(0,0%,100%,0) 0%, hsl(211, 30%, 48%) 40%, hsl(211, 30%, 48%) 60%, hsla(0,0%,40%,0) 100%)",
            animation: "bls-pricing-rotate 8s linear infinite",
            transformOrigin: "left center",
          }}
        />
      </div>

      <style>{`
        @keyframes bls-pricing-rotate {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      {/* ── Badge populaire ── */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="bg-gradient-to-r from-gold to-gold-light text-background text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
            Le plus populaire
          </span>
        </div>
      )}

      {/* ── En-tête : icône + nom ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-11 w-11 rounded-xl border border-white/15 flex items-center justify-center bg-gradient-to-br",
              iconBgClass
            )}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">{planName}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {/* Indicateur sélection (décoratif) */}
        <div className="h-5 w-5 rounded-full border-2 border-white/20 group-hover:border-gold/40 transition-colors duration-300" />
      </div>

      {/* ── Prix ── */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl font-semibold text-gradient-gold tracking-tight">
            {price}
          </span>
          <span className="text-sm text-muted-foreground">{priceDescription}</span>
        </div>
        {priceNote && (
          <p className="text-xs text-muted-foreground/70 mt-1">{priceNote}</p>
        )}
      </div>

      {/* ── Features ── */}
      <ul className="space-y-3 text-sm text-muted-foreground flex-1 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-gold/80 mt-0.5">
              <Check className="h-2.5 w-2.5 text-background stroke-[3]" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* ── CTA ── */}
      <Link
        to={buttonHref}
        className={cn(
          "w-full h-11 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300",
          isPopular
            ? "bg-gradient-to-r from-gold to-gold-light text-background hover:brightness-110"
            : "bg-white/[0.06] border border-white/[0.12] text-foreground hover:bg-white/[0.10] hover:border-gold/30"
        )}
      >
        {buttonText}
      </Link>
    </div>
  );
}
