/**
 * QuoteForm — Formulaire de devis multi-étapes (Stepper/Wizard).
 *
 * 3 étapes :
 * 1. Vos coordonnées (companyName, firstName, lastName, email, phone)
 * 2. Votre trajet / Mise à disposition (adresses, date, heure, passagers, bagages)
 * 3. Finalisation (flightOrTrainNumber, volume, message + bouton submit)
 *
 * Types de service :
 * - "transfer"  : Transfert classique (aéroport, gare, point-à-point)
 * - "location"  : Mise à disposition (chauffeur + véhicule pour une durée)
 * - "corporate" : Service entreprise (transfert + volume mensuel estimé)
 */

import { useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Plane,
  Clock,
  Users,
  FileText,
  MapPin,
  CheckCircle2,
  Home,
} from "lucide-react";
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
import { Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// Types publics
// ---------------------------------------------------------------------------

export type ServiceType = "transfer" | "location" | "corporate";

interface QuoteFormProps {
  serviceType: ServiceType;
  defaultDeparture?: string;
  defaultDestination?: string;
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const DURATION_OPTIONS = [
  { value: "4h", label: "4 heures" },
  { value: "8h", label: "8 heures" },
  { value: "12h", label: "12 heures" },
  { value: "multi-jours", label: "Plusieurs jours" },
] as const;

const VOLUME_OPTIONS = [
  { value: "1-10", label: "1 à 10 courses" },
  { value: "11-50", label: "11 à 50 courses" },
  { value: "50+", label: "Plus de 50 courses" },
] as const;

// ---------------------------------------------------------------------------
// Schéma Zod dynamique
// ---------------------------------------------------------------------------

function createQuoteSchema(serviceType: ServiceType) {
  const phoneRegex =
    /^(\+?\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;

  const baseFields = {
    firstName: z.string().min(1, "Ce champ est obligatoire"),
    lastName: z.string().min(1, "Ce champ est obligatoire"),
    email: z.string().email("Format d'email invalide"),
    phone: z.string().regex(phoneRegex, "Numéro de téléphone invalide"),
    date: z.date({ message: "Veuillez sélectionner une date" }),
    time: z.string().min(1, "Veuillez sélectionner une heure"),
    passengers: z.string().min(1, "Veuillez sélectionner le nombre de passagers"),
    luggage: z.string().min(1, "Veuillez sélectionner le nombre de bagages"),
    companyName: z.string().optional(),
    message: z.string().optional(),
  };

  if (serviceType === "location") {
    return z.object({
      ...baseFields,
      pickupLocation: z.string().min(1, "Ce champ est obligatoire"),
      duration: z.string().min(1, "Veuillez sélectionner une durée"),
      departure: z.string().optional(),
      arrival: z.string().optional(),
      flightOrTrainNumber: z.string().optional(),
      volume: z.string().optional(),
    });
  }

  if (serviceType === "corporate") {
    return z.object({
      ...baseFields,
      departure: z.string().min(1, "Ce champ est obligatoire"),
      arrival: z.string().min(1, "Ce champ est obligatoire"),
      flightOrTrainNumber: z.string().optional(),
      volume: z.string().optional(),
      pickupLocation: z.string().optional(),
      duration: z.string().optional(),
    });
  }

  return z.object({
    ...baseFields,
    departure: z.string().min(1, "Ce champ est obligatoire"),
    arrival: z.string().min(1, "Ce champ est obligatoire"),
    flightOrTrainNumber: z.string().optional(),
    pickupLocation: z.string().optional(),
    duration: z.string().optional(),
    volume: z.string().optional(),
  });
}

type QuoteFormData = z.infer<ReturnType<typeof createQuoteSchema>>;

// ---------------------------------------------------------------------------
// Labels submit dynamiques
// ---------------------------------------------------------------------------

const SUBMIT_LABELS: Record<ServiceType, string> = {
  transfer: "Demander un devis transfert",
  location: "Demander un devis mise à disposition",
  corporate: "Envoyer ma demande de devis",
};

// ---------------------------------------------------------------------------
// Styles partagés pour les Cards
// ---------------------------------------------------------------------------

const CARD_CLASS =
  "border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-gold/[0.15] transition-colors duration-300";

// ---------------------------------------------------------------------------
// Configuration des étapes par serviceType
// ---------------------------------------------------------------------------

function getStepsConfig(serviceType: ServiceType): StepConfig<QuoteFormData>[] {
  // Étape 1 — Coordonnées (identique pour tous)
  const step1: StepConfig<QuoteFormData> = {
    label: "Vos coordonnées",
    icon: User,
    fields: ["firstName", "lastName", "email", "phone"],
  };

  // Étape 2 — Trajet / Mise à disposition
  const step2Transfer: StepConfig<QuoteFormData> = {
    label: "Votre trajet",
    icon: Briefcase,
    fields: ["departure", "arrival", "date", "time", "passengers", "luggage"],
  };

  const step2Location: StepConfig<QuoteFormData> = {
    label: "Mise à disposition",
    icon: Briefcase,
    fields: ["pickupLocation", "duration", "date", "time", "passengers", "luggage"],
  };

  // Étape 3 — Finalisation (tous les champs optionnels)
  const step3: StepConfig<QuoteFormData> = {
    label: "Finalisation",
    icon: FileText,
    fields: [], // Pas de validation — tous les champs sont optionnels
  };

  return [
    step1,
    serviceType === "location" ? step2Location : step2Transfer,
    step3,
  ];
}

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

export function QuoteForm({ serviceType, defaultDeparture, defaultDestination }: QuoteFormProps) {
  const schema = createQuoteSchema(serviceType);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      departure: defaultDeparture ?? "",
      arrival: defaultDestination ?? "",
      date: undefined,
      time: "",
      passengers: "",
      luggage: "",
      flightOrTrainNumber: "",
      pickupLocation: "",
      duration: "",
      volume: "",
      message: "",
    },
  });

  const showAddressFields = serviceType !== "location";
  const showDispositionFields = serviceType === "location";
  const showVolumeField = serviceType === "corporate";
  const showFlightField = serviceType !== "location";

  const steps = useMemo(() => getStepsConfig(serviceType), [serviceType]);

  const stepper = useFormStepper<QuoteFormData>({ steps, trigger });

  const onSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_formData: QuoteFormData) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitted(true);
      } catch {
        toast.error("Une erreur est survenue lors de l'envoi", {
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

  const fieldErrorClass = (fieldName: keyof QuoteFormData) =>
    errors[fieldName] ? "border-red-500/50 focus-visible:ring-red-500/30" : "";

  // ── Écran de succès animé ──
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-2xl border border-gold/20 bg-white/[0.02] backdrop-blur-sm p-10 text-center space-y-6"
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
    );
  }

  const variants = getSlideVariants(stepper.direction);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Barre de navigation stepper ── */}
      <FormStepper
        steps={steps}
        currentStep={stepper.currentStep}
        completedSteps={stepper.completedSteps}
        onStepClick={stepper.goToStep}
      />

      {/* ── Contenu de l'étape courante (avec animation) ── */}
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
            <Card className={CARD_CLASS}>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-3 tracking-tight">
                  <div className="h-8 w-8 rounded-lg bg-gold/[0.08] flex items-center justify-center">
                    <User className="h-4 w-4 text-gold" />
                  </div>
                  Vos coordonnées
                </CardTitle>
                <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-3" />
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Nom de l'entreprise (optionnel) */}
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Nom de l&apos;entreprise{" "}
                    <span className="text-muted-foreground font-normal">(optionnel)</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                    <Input
                      id="company"
                      placeholder="Votre société"
                      {...register("companyName")}
                      className={`pl-10 ${fieldErrorClass("companyName")}`}
                    />
                  </div>
                </div>

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
                    <Label htmlFor="email">
                      {serviceType === "corporate" ? "Email professionnel *" : "Email *"}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={serviceType === "corporate" ? "contact@entreprise.com" : "votre@email.com"}
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

          {/* ── Étape 2 : Trajet / Mise à disposition ── */}
          {stepper.currentStep === 1 && (
            <Card className={CARD_CLASS}>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-3 tracking-tight">
                  <div className="h-8 w-8 rounded-lg bg-gold/[0.08] flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-gold" />
                  </div>
                  {showDispositionFields ? "Détails de la mise à disposition" : "Détails du trajet"}
                </CardTitle>
                <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-3" />
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Champs TRANSFER / CORPORATE : adresses */}
                {showAddressFields && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="departure">Adresse de départ *</Label>
                      <Controller
                        name="departure"
                        control={control}
                        render={({ field }) => (
                          <AddressInput
                            id="departure"
                            placeholder="Ex : 1 Avenue des Champs-Élysées, Paris"
                            value={field.value ?? ""}
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

                    <div className="space-y-2">
                      <Label htmlFor="arrival">Adresse d&apos;arrivée *</Label>
                      <Controller
                        name="arrival"
                        control={control}
                        render={({ field }) => (
                          <AddressInput
                            id="arrival"
                            placeholder="Ex : Aéroport CDG Terminal 2"
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(value)}
                            className={
                              errors.arrival
                                ? "[&_input]:border-red-500/50 [&_input]:focus-visible:ring-red-500/30"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors.arrival && (
                        <p className="text-sm text-red-500 mt-1">{errors.arrival.message}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Champs LOCATION : lieu + durée */}
                {showDispositionFields && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Lieu de prise en charge *</Label>
                      <Controller
                        name="pickupLocation"
                        control={control}
                        render={({ field }) => (
                          <AddressInput
                            id="pickupLocation"
                            placeholder="Ex : Hôtel Le Bristol, Paris"
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(value)}
                            className={
                              errors.pickupLocation
                                ? "[&_input]:border-red-500/50 [&_input]:focus-visible:ring-red-500/30"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors.pickupLocation && (
                        <p className="text-sm text-red-500 mt-1">{errors.pickupLocation.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">
                        <Clock className="inline h-3.5 w-3.5 mr-1 text-gold" />
                        Durée de mise à disposition *
                      </Label>
                      <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value ?? ""} onValueChange={field.onChange}>
                            <SelectTrigger id="duration" className={errors.duration ? "border-red-500/50 focus:ring-red-500/30" : ""}>
                              <SelectValue placeholder="Sélectionner la durée" />
                            </SelectTrigger>
                            <SelectContent>
                              {DURATION_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.duration && (
                        <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                      )}
                    </div>
                  </>
                )}

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
                    <Label htmlFor="time">
                      <Clock className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      Heure *
                    </Label>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="time" className={errors.time ? "border-red-500/50 focus:ring-red-500/30" : ""}>
                            <SelectValue placeholder="Sélectionner l'heure" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
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

                {/* Passagers & Bagages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passengers">
                      <Users className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      Nombre de passagers *
                    </Label>
                    <Controller
                      name="passengers"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="passengers" className={errors.passengers ? "border-red-500/50 focus:ring-red-500/30" : ""}>
                            <SelectValue placeholder="Passagers" />
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
                    {errors.passengers && (
                      <p className="text-sm text-red-500 mt-1">{errors.passengers.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="luggage">
                      <Briefcase className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      Nombre de bagages *
                    </Label>
                    <Controller
                      name="luggage"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="luggage" className={errors.luggage ? "border-red-500/50 focus:ring-red-500/30" : ""}>
                            <SelectValue placeholder="Bagages" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} bagage{n > 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.luggage && (
                      <p className="text-sm text-red-500 mt-1">{errors.luggage.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Étape 3 : Finalisation ── */}
          {stepper.currentStep === 2 && (
            <Card className={CARD_CLASS}>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-3 tracking-tight">
                  <div className="h-8 w-8 rounded-lg bg-gold/[0.08] flex items-center justify-center">
                    <FileText className="h-4 w-4 text-gold" />
                  </div>
                  Finalisation
                </CardTitle>
                <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-3" />
              </CardHeader>

              <CardContent className="space-y-5">
                {/* N° de vol/train — transfer/corporate uniquement */}
                {showFlightField && (
                  <div className="space-y-2">
                    <Label htmlFor="flightTrain">
                      <Plane className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      Numéro de vol ou de train{" "}
                      <span className="text-muted-foreground font-normal">(optionnel)</span>
                    </Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="flightTrain"
                        placeholder="Ex : AF1234 ou TGV 6231"
                        {...register("flightOrTrainNumber")}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Nous suivrons votre vol/train en temps réel pour adapter l&apos;heure
                      de prise en charge en cas de retard.
                    </p>
                  </div>
                )}

                {/* Volume — corporate uniquement */}
                {showVolumeField && (
                  <div className="space-y-2">
                    <Label htmlFor="volume">
                      <MapPin className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      Estimation de courses par mois
                    </Label>
                    <Controller
                      name="volume"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger id="volume">
                            <SelectValue placeholder="Sélectionnez une estimation" />
                          </SelectTrigger>
                          <SelectContent>
                            {VOLUME_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}

                {/* Message libre */}
                <div className="space-y-2">
                  <Label htmlFor="message">
                    Besoins spécifiques{" "}
                    <span className="text-muted-foreground font-normal">(optionnel)</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={
                      serviceType === "corporate"
                        ? "Décrivez vos besoins : événements réguliers, chauffeurs dédiés, zones géographiques spécifiques..."
                        : "Informations supplémentaires, demandes particulières..."
                    }
                    {...register("message")}
                    className="min-h-32 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation Précédent / Suivant / Soumettre ── */}
      <StepNavigation
        isFirstStep={stepper.isFirstStep}
        isLastStep={stepper.isLastStep}
        isSubmitting={isSubmitting}
        submitLabel={SUBMIT_LABELS[serviceType]}
        onPrev={stepper.goToPrev}
        onNext={stepper.goToNext}
      />
    </form>
  );
}
