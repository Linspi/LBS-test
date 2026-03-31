/**
 * StepNavigation — Boutons Précédent / Suivant / Soumettre.
 *
 * Affiche "Précédent" (outline-gold) + "Suivant" ou "Soumettre" (gold).
 * Le bouton Soumettre apparaît uniquement à la dernière étape.
 *
 * Le bouton de soumission utilise `type="button"` + `onClick` au lieu de
 * `type="submit"` pour éviter toute soumission implicite du formulaire
 * (Enter, focus résiduel lors de la transition d'étape, etc.).
 */

import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onPrev: () => void;
  onNext: () => Promise<boolean>;
  /** Callback appelé au clic sur le bouton de soumission (dernière étape) */
  onSubmit?: () => void;
}

export function StepNavigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  submitLabel,
  onPrev,
  onNext,
  onSubmit,
}: StepNavigationProps) {
  const { t } = useTranslation();
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
          {t("form.submit.previous")}
        </Button>
      )}

      {/* Bouton Suivant ou Soumettre */}
      {isLastStep ? (
        <Button
          type="button"
          variant="gold"
          size="lg"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="flex-1 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("form.submit.sending")}
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
          {t("form.submit.next")}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
