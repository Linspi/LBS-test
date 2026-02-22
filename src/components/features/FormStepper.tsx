/**
 * FormStepper — Barre de navigation visuelle pour formulaire multi-étapes.
 *
 * Cercles numérotés connectés par des lignes :
 * - Actif = rempli gold
 * - Complété = check gold
 * - Futur = muted
 *
 * Labels affichés sur desktop, cachés sur mobile pour un rendu compact.
 * Cliquable pour revenir aux étapes complétées.
 */

import { Check } from "lucide-react";
import type { StepConfig } from "@/hooks/useFormStepper";
import type { FieldValues } from "react-hook-form";

interface FormStepperProps<T extends FieldValues> {
  steps: StepConfig<T>[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (index: number) => void;
}

export function FormStepper<T extends FieldValues>({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: FormStepperProps<T>) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const isClickable = index <= currentStep || isCompleted;
          const isLast = index === steps.length - 1;
          const Icon = step.icon;

          return (
            <div
              key={step.label}
              className={`flex items-center ${isLast ? "" : "flex-1"}`}
            >
              {/* Cercle + label */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center
                    h-10 w-10 sm:h-11 sm:w-11 rounded-full
                    border-2 transition-all duration-300
                    ${isActive
                      ? "border-gold bg-gold/20 text-gold shadow-[0_0_16px_rgba(200,168,78,0.2)]"
                      : isCompleted
                        ? "border-gold bg-gold text-black"
                        : "border-white/10 bg-white/[0.03] text-muted-foreground"
                    }
                    ${isClickable ? "cursor-pointer hover:border-gold/60" : "cursor-default"}
                  `}
                  aria-label={`Étape ${index + 1} : ${step.label}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted && !isActive ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>

                {/* Label — visible uniquement sur desktop */}
                <span
                  className={`
                    hidden sm:block text-xs font-medium text-center max-w-[90px] leading-tight
                    ${isActive ? "text-gold" : isCompleted ? "text-foreground/80" : "text-muted-foreground/60"}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Ligne de connexion */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-3">
                  <div className="h-px relative overflow-hidden bg-white/[0.06]">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold/60 transition-all duration-500 ease-out"
                      style={{
                        width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
