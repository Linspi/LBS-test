/**
 * ReservationFAB — Bouton flottant "Réserver" mobile uniquement
 *
 * - Visible uniquement sous lg (hidden lg:hidden déjà géré par le parent)
 * - Gradient bleu acier BLS
 * - Pulse animé
 * - Déclenche l'EstimationSheet
 */

import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReservationFABProps {
  onClick: () => void;
  className?: string;
}

export function ReservationFAB({ onClick, className }: ReservationFABProps) {
  return (
    <>
      <style>{`
        @keyframes bls-fab-pulse {
          0%, 100% {
            box-shadow: 0 12px 28px rgba(90,122,156,0.4),
                        0 0 0 0 rgba(90,122,156,0.35);
          }
          50% {
            box-shadow: 0 12px 28px rgba(90,122,156,0.4),
                        0 0 0 10px rgba(90,122,156,0);
          }
        }
      `}</style>
      <button
        onClick={onClick}
        aria-label="Réserver"
        className={cn(
          "fixed bottom-8 right-4 z-[175] lg:hidden",
          "flex items-center gap-2 px-5 py-3.5 rounded-full",
          "bg-gradient-to-r from-gold-champagne via-gold to-[#3d5f7e]",
          "text-white font-semibold text-sm",
          "border border-gold/20",
          "active:scale-95 transition-transform",
          className
        )}
        style={{ animation: "bls-fab-pulse 2.2s ease-out infinite" }}
      >
        <Car className="h-4 w-4" strokeWidth={2} />
        Réserver
      </button>
    </>
  );
}
