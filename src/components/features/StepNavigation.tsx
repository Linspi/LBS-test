/**
 * StepNavigation — Boutons Précédent / Suivant / Soumettre.
 *
 * Affiche "Précédent" (outline-gold) + "Suivant" ou "Soumettre" (gold).
 * Le bouton Soumettre apparaît uniquement à la dernière étape.
 */

import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onPrev: () => void;
  onNext: () => Promise<boolean>;
}

export function StepNavigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  submitLabel,
  onPrev,
  onNext,
}: StepNavigationProps) {
  return (
    <div className="flex gap-3 pt-2">
      {/* Bouton Précédent */}
      {!isFirstStep && (
        <Button
          type="button"
          variant="outline-gold"
          size="lg"
          onClick={onPrev}
          className="flex-1 sm:flex-none"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Précédent
        </Button>
      )}

      {/* Bouton Suivant ou Soumettre */}
      {isLastStep ? (
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={isSubmitting}
          className="flex-1 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          variant="gold"
          size="lg"
          onClick={onNext}
          className="flex-1 text-base"
        >
          Suivant
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
