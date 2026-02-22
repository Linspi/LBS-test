/**
 * ReservationExperience — Page de réservation d'excursions et événements.
 *
 * Wizard 2 étapes :
 * 1. Vos coordonnées (firstName, lastName, email, phone)
 * 2. Votre réservation (experience, date, time, departure, passengers, specialRequests + submit)
 *
 * Layout : formulaire à gauche (3/5), récapitulatif expérience à droite (2/5).
 * Écran de succès animé après soumission (comme QuoteForm).
 */

import { useMemo, useCallback, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  Check,
  CalendarDays,
  Sparkles,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Home,
} from "lucide-react";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/features/date-picker";
import { AddressInput } from "@/components/features/AddressInput";
import { FormStepper } from "@/components/features/FormStepper";
import { StepNavigation } from "@/components/features/StepNavigation";
import { useFormStepper } from "@/hooks/useFormStepper";
import type { StepConfig } from "@/hooks/useFormStepper";
import { experiences, getExperienceById } from "@/data/experiences";
import { formatPrice } from "@/lib/pricing";
import type { Experience } from "@/types";

// ---------------------------------------------------------------------------
// Créneaux horaires (30 min) de 06:00 à 22:00
// ---------------------------------------------------------------------------

const TIME_SLOTS = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const min = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${min}`;
});

// ---------------------------------------------------------------------------
// Schéma de validation Zod
// ---------------------------------------------------------------------------

const phoneRegex =
  /^(\+?\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;

const experienceFormSchema = z.object({
  firstName: z.string().min(1, "Ce champ est obligatoire"),
  lastName: z.string().min(1, "Ce champ est obligatoire"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().regex(phoneRegex, "Numéro de téléphone invalide"),
  experience: z.string().min(1, "Veuillez sélectionner une expérience"),
  date: z.date({ message: "Veuillez sélectionner une date" }),
  time: z.string().min(1, "Veuillez sélectionner une heure"),
  departure: z.string().min(3, "L'adresse doit contenir au moins 3 caractères"),
  passengers: z.string().min(1, "Veuillez sélectionner le nombre de passagers"),
  specialRequests: z.string().optional(),
});

type ExperienceFormData = z.infer<typeof experienceFormSchema>;

// ---------------------------------------------------------------------------
// Configuration des étapes
// ---------------------------------------------------------------------------

const STEPS: StepConfig<ExperienceFormData>[] = [
  {
    label: "Vos coordonnées",
    icon: User,
    fields: ["firstName", "lastName", "email", "phone"],
  },
  {
    label: "Votre réservation",
    icon: CalendarDays,
    fields: ["experience", "date", "time", "departure", "passengers"],
  },
];

// ---------------------------------------------------------------------------
// Animation slide horizontal
// ---------------------------------------------------------------------------

const STEP_EASE = [0.25, 0.1, 0.25, 1] as const;

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getSlideVariants(direction: 1 | -1) {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return {
    initial: { x: direction * 80, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: direction * -80, opacity: 0 },
  };
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function ReservationExperience() {
  const [searchParams] = useSearchParams();
  const experienceIdFromUrl = searchParams.get("experience");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceFormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      experience: experienceIdFromUrl ?? "",
      date: undefined,
      time: "",
      departure: "",
      passengers: "2",
      specialRequests: "",
    },
  });

  const stepper = useFormStepper<ExperienceFormData>({ steps: STEPS, trigger });

  const formValues = watch();
  const selectedExperienceId = formValues.experience;

  const selectedExperience: Experience | undefined = useMemo(
    () =>
      selectedExperienceId
        ? getExperienceById(selectedExperienceId)
        : undefined,
    [selectedExperienceId]
  );

  const onSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_formData: ExperienceFormData) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitted(true);
      } catch {
        toast.error("Une erreur est survenue. Veuillez réessayer.", {
          description: "Veuillez réessayer ou nous contacter directement.",
          duration: 5000,
          style: {
            background: "#1a1a1a",
            border: "1px solid rgba(180, 40, 40, 0.5)",
            color: "#f5f5f5",
          },
        });
      }
    },
    []
  );

  const fieldErrorClass = (fieldName: keyof ExperienceFormData) =>
    errors[fieldName] ? "border-red-500/50 focus-visible:ring-red-500/30" : "";

  const variants = getSlideVariants(stepper.direction);

  return (
    <>
      {/* Hero compact */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-[0.2em]">Réservation Premium</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
              Planifiez votre{" "}
              <span className="text-gradient-gold">expérience</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Excursion ou événement, nous créons un service sur mesure pour
              chaque occasion.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Contenu deux colonnes */}
      <section className="pb-24">
        <div className="container max-w-6xl">

          {/* ── Écran de succès animé ── */}
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-2xl mx-auto rounded-2xl border border-gold/20 bg-white/[0.02] backdrop-blur-sm p-10 text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto h-20 w-20 rounded-full bg-gold/[0.1] flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <CheckCircle2 className="h-10 w-10 text-gold" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <h3 className="font-display text-2xl font-semibold text-foreground tracking-tight">
                  Demande envoyée avec succès
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Notre équipe vous recontactera sous 24 heures. Un e-mail de confirmation vous a été envoyé.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/[0.06] border border-gold/10"
              >
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Référence</span>
                <span className="text-sm font-mono font-semibold text-gold">
                  BLS-{Date.now().toString(36).toUpperCase().slice(-6)}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
              >
                <Button asChild variant="gold" size="lg">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l&apos;accueil
                  </Link>
                </Button>
                <Button
                  variant="outline-gold"
                  size="lg"
                  onClick={() => {
                    setIsSubmitted(false);
                    stepper.resetStepper();
                    reset();
                  }}
                >
                  Nouvelle demande
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
            >
              {/* ── Colonne gauche : Formulaire (3/5) ─── */}
              <div className="lg:col-span-3 space-y-6">

                {/* Stepper */}
                <FormStepper
                  steps={STEPS}
                  currentStep={stepper.currentStep}
                  completedSteps={stepper.completedSteps}
                  onStepClick={stepper.goToStep}
                />

                {/* Contenu animé */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stepper.currentStep}
                    initial={variants.initial}
                    animate={variants.animate}
                    exit={variants.exit}
                    transition={{ duration: 0.3, ease: [...STEP_EASE] as [number, number, number, number] }}
                  >
                    {/* ── Étape 1 : Coordonnées ── */}
                    {stepper.currentStep === 0 && (
                      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-gold" />
                            Vos coordonnées
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          {/* Prénom & Nom */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Prénom *</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                <Input
                                  id="firstName"
                                  placeholder="Votre prénom"
                                  {...register("firstName")}
                                  className={`pl-10 ${fieldErrorClass("firstName")}`}
                                />
                              </div>
                              {errors.firstName && (
                                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Nom *</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                <Input
                                  id="lastName"
                                  placeholder="Votre nom"
                                  {...register("lastName")}
                                  className={`pl-10 ${fieldErrorClass("lastName")}`}
                                />
                              </div>
                              {errors.lastName && (
                                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                              )}
                            </div>
                          </div>

                          {/* Email & Téléphone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="votre@email.com"
                                  {...register("email")}
                                  className={`pl-10 ${fieldErrorClass("email")}`}
                                />
                              </div>
                              {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Téléphone *</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="01 23 45 67 89"
                                  {...register("phone")}
                                  className={`pl-10 ${fieldErrorClass("phone")}`}
                                />
                              </div>
                              {errors.phone && (
                                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* ── Étape 2 : Détails de la réservation ── */}
                    {stepper.currentStep === 1 && (
                      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-gold" />
                            Détails de votre réservation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          {/* Sélection de l'expérience */}
                          <div className="space-y-2">
                            <Label htmlFor="experience">Expérience souhaitée *</Label>
                            <Controller
                              name="experience"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger
                                    id="experience"
                                    className={errors.experience ? "border-red-500/50 focus:ring-red-500/30" : ""}
                                  >
                                    <SelectValue placeholder="Choisissez une excursion ou un événement" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-gold uppercase tracking-wider">
                                      Excursions
                                    </div>
                                    {experiences
                                      .filter((e) => e.category === "excursion")
                                      .map((exp) => (
                                        <SelectItem key={exp.id} value={exp.id}>
                                          {exp.title}
                                        </SelectItem>
                                      ))}
                                    <div className="px-2 py-1.5 mt-1 text-xs font-semibold text-gold uppercase tracking-wider">
                                      Événements
                                    </div>
                                    {experiences
                                      .filter((e) => e.category === "evenement")
                                      .map((exp) => (
                                        <SelectItem key={exp.id} value={exp.id}>
                                          {exp.title}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.experience && (
                              <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
                            )}
                          </div>

                          {/* Date & Heure */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Date de prise en charge *</Label>
                              <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                  <DatePicker
                                    date={field.value}
                                    onDateChange={(d) => field.onChange(d)}
                                    placeholder="Sélectionner une date"
                                  />
                                )}
                              />
                              {errors.date && (
                                <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="time">Heure de prise en charge *</Label>
                              <Controller
                                name="time"
                                control={control}
                                render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                      id="time"
                                      className={errors.time ? "border-red-500/50 focus:ring-red-500/30" : ""}
                                    >
                                      <SelectValue placeholder="Heure" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {TIME_SLOTS.map((slot) => (
                                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              {errors.time && (
                                <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
                              )}
                            </div>
                          </div>

                          {/* Adresse de départ */}
                          <div className="space-y-2">
                            <Label htmlFor="departure">Adresse de départ *</Label>
                            <Controller
                              name="departure"
                              control={control}
                              render={({ field }) => (
                                <AddressInput
                                  id="departure"
                                  placeholder="Hôtel, adresse parisienne..."
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  className={
                                    errors.departure
                                      ? "[&_input]:border-red-500/50 [&_input]:focus-visible:ring-red-500/30"
                                      : ""
                                  }
                                />
                              )}
                            />
                            {errors.departure && (
                              <p className="text-sm text-red-500 mt-1">{errors.departure.message}</p>
                            )}
                          </div>

                          {/* Nombre de passagers */}
                          <div className="space-y-2">
                            <Label htmlFor="passengers">Nombre de passagers *</Label>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                              <Controller
                                name="passengers"
                                control={control}
                                render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                      id="passengers"
                                      className={`pl-10 ${errors.passengers ? "border-red-500/50 focus:ring-red-500/30" : ""}`}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                        <SelectItem key={n} value={String(n)}>
                                          {n} passager{n > 1 ? "s" : ""}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            {errors.passengers && (
                              <p className="text-sm text-red-500 mt-1">{errors.passengers.message}</p>
                            )}
                          </div>

                          {/* Demandes spécifiques (optionnel) */}
                          <div className="space-y-2">
                            <Label htmlFor="special-requests">
                              Demandes spécifiques{" "}
                              <span className="text-muted-foreground font-normal">(optionnel)</span>
                            </Label>
                            <Textarea
                              id="special-requests"
                              placeholder="Guide bilingue, siège enfant, champagne, itinéraire personnalisé..."
                              {...register("specialRequests")}
                              className="min-h-28 bg-input border-border resize-none"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Précédent / Suivant / Soumettre */}
                <StepNavigation
                  isFirstStep={stepper.isFirstStep}
                  isLastStep={stepper.isLastStep}
                  isSubmitting={isSubmitting}
                  submitLabel="Demander un devis personnalisé"
                  onPrev={stepper.goToPrev}
                  onNext={stepper.goToNext}
                />
              </div>

              {/* ── Colonne droite : Récapitulatif Premium (2/5) ─── */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-28">
                  {selectedExperience ? (
                    <ExperienceSummaryCard experience={selectedExperience} />
                  ) : (
                    <EmptyStateSummary />
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

// ── Composant : Card récapitulatif premium ───────────────

function ExperienceSummaryCard({ experience }: { experience: Experience }) {
  return (
    <Card className="overflow-hidden border-gold/20 bg-gradient-to-b from-card via-card to-card/80">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Badge catégorie */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gold/90 text-xs font-semibold text-black uppercase tracking-wider">
          {experience.category === "excursion" ? "Excursion" : "Événement"}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-5">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {experience.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {experience.subtitle}
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {experience.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-foreground">
          <Clock className="h-4 w-4 text-gold" />
          {experience.duration}
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">
            Inclus dans la prestation
          </h4>
          <ul className="space-y-1.5">
            {experience.inclusions.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {experience.estimatedPrice !== null ? "Estimation tarifaire" : "Tarif"}
            </p>
            <p className="text-2xl font-bold text-gold">
              {experience.estimatedPrice !== null
                ? `À partir de ${formatPrice(experience.estimatedPrice)}`
                : "Devis sur demande"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Composant : État vide (aucune expérience sélectionnée) ──

function EmptyStateSummary() {
  return (
    <Card className="border-dashed border-gold/20 bg-card/50">
      <div className="p-8 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">
            Votre récapitulatif
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sélectionnez une excursion ou un événement dans le formulaire pour
            voir le détail de la prestation ici.
          </p>
        </div>
      </div>
    </Card>
  );
}
