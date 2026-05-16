/**
 * EstimationSheet — Bottom-sheet d'estimation de trajet (mobile only)
 *
 * - Slide depuis le bas (translateY(100%) → 0)
 * - Backdrop blur avec fermeture au clic
 * - Champs départ / arrivée
 * - Suggestions rapides (CDG, Orly, Gare du Nord, Disneyland)
 * - CTA → /reservation avec params pré-remplis
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { X, MapPin, Navigation, ArrowRight } from "lucide-react";

interface EstimationSheetProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_DESTINATIONS = ["CDG", "Orly", "Gare du Nord", "Disneyland"];

export function EstimationSheet({ open, onClose }: EstimationSheetProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const reservationHref = (() => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return `/reservation${qs ? `?${qs}` : ""}`;
  })();

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[210] bg-black/50"
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      {/* Feuille */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Estimer mon trajet"
        className="fixed left-0 right-0 bottom-0 z-[215] bg-card/[0.97] border-t border-x border-white/[0.08]"
        style={{
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Poignée */}
        <div className="w-9 h-1 rounded-full bg-white/25 mx-auto mt-2.5 mb-1" />

        <div className="px-6 pb-10 pt-3">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-2xl font-semibold">
              Estimer mon{" "}
              <span className="text-gradient-gold italic font-medium">trajet</span>
            </h3>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fermer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Champ départ */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-3">
            <MapPin className="h-4 w-4 text-gold shrink-0" />
            <div className="flex-1">
              <div className="text-[8px] uppercase tracking-[0.2em] text-gold font-semibold mb-1">
                Départ
              </div>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Adresse de prise en charge"
                className="w-full bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
            </div>
          </div>

          {/* Champ arrivée */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
            <Navigation className="h-4 w-4 text-gold shrink-0" />
            <div className="flex-1">
              <div className="text-[8px] uppercase tracking-[0.2em] text-gold font-semibold mb-1">
                Arrivée
              </div>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Destination souhaitée"
                className="w-full bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
            </div>
          </div>

          {/* Suggestions rapides */}
          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK_DESTINATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setTo(d)}
                className="px-3 py-1.5 rounded-full text-[10.5px] font-medium text-gold border border-gold/20 bg-gold/[0.06] hover:bg-gold/[0.1] transition-colors active:scale-95"
              >
                {d}
              </button>
            ))}
          </div>

          {/* Bouton CTA */}
          <Link
            to={reservationHref}
            onClick={onClose}
            className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-gold-champagne via-gold to-[#3d5f7e] no-underline hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Voir l'estimation <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
