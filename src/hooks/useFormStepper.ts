/**
 * useFormStepper — Hook gérant la navigation multi-étapes d'un formulaire.
 *
 * Fonctionne avec React Hook Form : valide uniquement les champs
 * de l'étape courante via `form.trigger(fields[])` avant de passer
 * à l'étape suivante. Pas besoin de splitter le schéma Zod.
 */

import { useState, useCallback } from "react";
import type { UseFormTrigger, FieldValues, Path } from "react-hook-form";

export interface StepConfig<T extends FieldValues> {
  /** Label affiché dans le stepper */
  label: string;
  /** Icône Lucide à afficher */
  icon: React.ComponentType<{ className?: string }>;
  /** Champs à valider pour cette étape (vide = pas de validation) */
  fields: Path<T>[];
}

interface UseFormStepperOptions<T extends FieldValues> {
  steps: StepConfig<T>[];
  trigger: UseFormTrigger<T>;
}

export function useFormStepper<T extends FieldValues>({
  steps,
  trigger,
}: UseFormStepperOptions<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  /** Valide l'étape courante et passe à la suivante */
  const goToNext = useCallback(async () => {
    const currentFields = steps[currentStep].fields;

    // Si l'étape a des champs à valider, on les valide
    if (currentFields.length > 0) {
      const isValid = await trigger(currentFields);
      if (!isValid) return false;
    }

    // Marquer l'étape comme complétée
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    return true;
  }, [currentStep, steps, trigger, totalSteps]);

  /** Retour à l'étape précédente (sans validation) */
  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  /** Aller directement à une étape (uniquement si déjà complétée) */
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= totalSteps) return;
      // On peut revenir à une étape complétée ou à l'étape courante
      if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
        setDirection(stepIndex > currentStep ? 1 : -1);
        setCurrentStep(stepIndex);
      }
    },
    [currentStep, completedSteps, totalSteps]
  );

  /** Réinitialise le stepper (après soumission par exemple) */
  const resetStepper = useCallback(() => {
    setCurrentStep(0);
    setDirection(1);
    setCompletedSteps(new Set());
  }, []);

  return {
    currentStep,
    direction,
    completedSteps,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrev,
    goToStep,
    resetStepper,
  };
}
