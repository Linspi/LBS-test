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

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
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
  Route,
  Loader2,
  Car,
} from "lucide-react";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { calculatePriceFromDistance, formatPrice } from "@/lib/pricing";
import type { VehicleClass } from "@/types";
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
  /** Véhicule pré-sélectionné depuis la page MAD (modifiable par l'utilisateur) */
  defaultVehicleType?: string;
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
  { value: "4h", i18nKey: "form.options.duration4h" },
  { value: "8h", i18nKey: "form.options.duration8h" },
  { value: "12h", i18nKey: "form.options.duration12h" },
  { value: "multi-jours", i18nKey: "form.options.durationMulti" },
] as const;

const VOLUME_OPTIONS = [
  { value: "1-10", i18nKey: "form.options.volume1_10" },
  { value: "11-50", i18nKey: "form.options.volume11_50" },
  { value: "50+", i18nKey: "form.options.volume50plus" },
] as const;

/**
 * Tarifs horaires MAD — cohérents avec les prix affichés sur la page Mise à Disposition.
 * Clés = valeurs du Select vehicleType.
 */
const MAD_HOURLY_RATES: Record<string, number> = {
  "Classe E": 60,
  "Classe V": 75,
  "Classe S": 95,
};

const MAD_VEHICLE_OPTIONS = [
  { value: "Classe E", i18nKey: "form.options.vehicleClasseE" },
  { value: "Classe V", i18nKey: "form.options.vehicleClasseV" },
  { value: "Classe S", i18nKey: "form.options.vehicleClasseS" },
] as const;

/** Véhicules disponibles pour le mode Trajet (cartes cliquables) */
const TRANSFER_VEHICLES: {
  id: VehicleClass;
  name: string;
  subtitleKey: string;
  maxPassengers: number;
  maxLuggage: number;
}[] = [
  { id: "classe-e", name: "Classe E", subtitleKey: "form.vehicles.sedan", maxPassengers: 3, maxLuggage: 3 },
  { id: "classe-s", name: "Classe S", subtitleKey: "form.vehicles.prestige", maxPassengers: 3, maxLuggage: 3 },
  { id: "classe-v", name: "Classe V", subtitleKey: "form.vehicles.van", maxPassengers: 7, maxLuggage: 7 },
];

/** Labels pour l'email de confirmation et le récapitulatif */
const VEHICLE_LABELS: Record<VehicleClass, string> = {
  "classe-e": "Mercedes Classe E — Berline",
  "classe-s": "Mercedes Classe S — Prestige",
  "classe-v": "Mercedes Classe V — Van",
};

/** Convertit "4h" / "8h" / "12h" en nombre d'heures. Retourne null pour "multi-jours". */
function parseDurationHours(duration: string): number | null {
  if (duration === "multi-jours") return null;
  const h = parseInt(duration, 10);
  return isNaN(h) ? null : h;
}

// ---------------------------------------------------------------------------
// Schéma Zod dynamique
// ---------------------------------------------------------------------------

function createQuoteSchema(serviceType: ServiceType, t: (key: string) => string) {
  const phoneRegex =
    /^(\+?\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;

  const baseFields = {
    firstName: z.string().min(1, t("form.validation.required")),
    lastName: z.string().min(1, t("form.validation.required")),
    email: z.string().email(t("form.validation.emailInvalid")),
    phone: z.string().regex(phoneRegex, t("form.validation.phoneInvalid")),
    date: z.date({ message: t("form.validation.selectDate") }),
    time: z.string().min(1, t("form.validation.selectTime")),
    passengers: z.string().min(1, t("form.validation.selectPassengers")),
    luggage: z.string().min(1, t("form.validation.selectLuggage")),
    companyName: z.string().optional(),
    message: z.string().optional(),
  };

  if (serviceType === "location") {
    return z.object({
      ...baseFields,
      pickupLocation: z.string().min(1, t("form.validation.required")),
      vehicleType: z.string().min(1, t("form.validation.selectVehicle")),
      duration: z.string().min(1, t("form.validation.selectDuration")),
      departure: z.string().optional(),
      arrival: z.string().optional(),
      flightOrTrainNumber: z.string().optional(),
      volume: z.string().optional(),
    });
  }

  if (serviceType === "corporate") {
    return z.object({
      ...baseFields,
      departure: z.string().min(1, t("form.validation.required")),
      arrival: z.string().min(1, t("form.validation.required")),
      flightOrTrainNumber: z.string().optional(),
      volume: z.string().optional(),
      vehicleType: z.string().optional(),
      pickupLocation: z.string().optional(),
      duration: z.string().optional(),
    });
  }

  return z.object({
    ...baseFields,
    departure: z.string().min(1, t("form.validation.required")),
    arrival: z.string().min(1, t("form.validation.required")),
    flightOrTrainNumber: z.string().optional(),
    vehicleType: z.string().min(1, t("form.validation.selectVehicle")),
    pickupLocation: z.string().optional(),
    duration: z.string().optional(),
    volume: z.string().optional(),
  });
}

type QuoteFormData = z.infer<ReturnType<typeof createQuoteSchema>>;

// ---------------------------------------------------------------------------
// Clés i18n pour les labels submit
// ---------------------------------------------------------------------------

const SUBMIT_KEYS: Record<ServiceType, string> = {
  transfer: "form.submit.transfer",
  location: "form.submit.location",
  corporate: "form.submit.corporate",
};

// ---------------------------------------------------------------------------
// Styles partagés pour les Cards
// ---------------------------------------------------------------------------

const CARD_CLASS =
  "border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-gold/[0.15] transition-colors duration-300";

// ---------------------------------------------------------------------------
// Configuration des étapes par serviceType
// ---------------------------------------------------------------------------

function getStepsConfig(serviceType: ServiceType, t: (key: string) => string): StepConfig<QuoteFormData>[] {
  const step1: StepConfig<QuoteFormData> = {
    label: t("form.steps.coordinates"),
    icon: User,
    fields: ["firstName", "lastName", "email", "phone"],
  };

  const step2Transfer: StepConfig<QuoteFormData> = {
    label: t("form.steps.trip"),
    icon: Briefcase,
    fields: ["departure", "arrival", "date", "time", "passengers", "luggage", "vehicleType"],
  };

  const step2Location: StepConfig<QuoteFormData> = {
    label: t("form.steps.chauffeur"),
    icon: Briefcase,
    fields: ["pickupLocation", "vehicleType", "duration", "date", "time", "passengers", "luggage"],
  };

  const step3: StepConfig<QuoteFormData> = {
    label: t("form.steps.finalization"),
    icon: FileText,
    fields: [],
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

export function QuoteForm({ serviceType, defaultDeparture, defaultDestination, defaultVehicleType }: QuoteFormProps) {
  const { t } = useTranslation();
  const schema = createQuoteSchema(serviceType, t);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    watch,
    setValue,
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
      vehicleType: defaultVehicleType ?? "",
      duration: "",
      volume: "",
      message: "",
    },
  });

  const showAddressFields = serviceType !== "location";
  const showDispositionFields = serviceType === "location";
  const showVolumeField = serviceType === "corporate";
  const showFlightField = serviceType !== "location";

  // Watch passagers/bagages pour contraindre le choix de véhicule
  const watchedPassengers = parseInt(watch("passengers") || "0", 10);
  const watchedLuggage = parseInt(watch("luggage") || "0", 10);

  const steps = useMemo(() => getStepsConfig(serviceType, t), [serviceType, t]);

  const stepper = useFormStepper<QuoteFormData>({ steps, trigger });

  // ── Google Maps Distance Matrix ──
  const { isLoaded: isGoogleLoaded } = useGoogleMaps();

  /** Infos de trajet renvoyées par Distance Matrix */
  interface RouteInfo {
    distanceKm: number;
    durationMin: number;
    estimatedPrice: number;
    isAirportTransfer: boolean;
    airportName?: string;
  }

  /** Données brutes Distance Matrix (indépendantes du véhicule) */
  const [rawRoute, setRawRoute] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  /** Véhicule sélectionné pour le mode Trajet */
  const [selectedTransferVehicle, setSelectedTransferVehicle] = useState<VehicleClass | null>(null);

  /**
   * Adresses formellement VALIDÉES par Google Autocomplete.
   * Ces states ne se mettent à jour QUE quand l'utilisateur clique une suggestion
   * dans la dropdown — jamais sur une simple frappe clavier.
   */
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(
    defaultDeparture ?? null,
  );
  const [selectedArrival, setSelectedArrival] = useState<string | null>(
    defaultDestination ?? null,
  );

  /**
   * Prix recalculé à la volée dès que le véhicule OU la route change.
   * Pas d'appel API supplémentaire : seul le multiplicateur véhicule change.
   */
  const routeInfo = useMemo<RouteInfo | null>(() => {
    if (!rawRoute || !selectedDeparture || !selectedArrival) return null;
    const vehicleForPricing = selectedTransferVehicle ?? "classe-e";
    const priceResult = calculatePriceFromDistance(
      selectedDeparture,
      selectedArrival,
      rawRoute.distanceKm,
      vehicleForPricing,
    );
    return {
      distanceKm: rawRoute.distanceKm,
      durationMin: rawRoute.durationMin,
      estimatedPrice: priceResult.total,
      isAirportTransfer: priceResult.isAirportTransfer,
      airportName: priceResult.airportName,
    };
  }, [rawRoute, selectedTransferVehicle, selectedDeparture, selectedArrival]);

  /**
   * Appelle Google Distance Matrix uniquement quand les DEUX adresses
   * ont été formellement sélectionnées via Google Autocomplete.
   * Stocke les données brutes (distance/durée) — le prix est calculé par le useMemo ci-dessus.
   */
  useEffect(() => {
    if (serviceType === "location") return;
    if (!isGoogleLoaded) return;
    if (!selectedDeparture || !selectedArrival) {
      setRawRoute(null);
      return;
    }

    setIsCalculating(true);

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [selectedDeparture],
        destinations: [selectedArrival],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        setIsCalculating(false);

        if (
          status !== "OK" ||
          !response?.rows?.[0]?.elements?.[0] ||
          response.rows[0].elements[0].status !== "OK"
        ) {
          toast.error(t("form.toast.routeError"), {
            description: t("form.toast.routeErrorDesc"),
            duration: 5000,
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(180, 40, 40, 0.5)",
              color: "#f5f5f5",
            },
          });
          setRawRoute(null);
          return;
        }

        const element = response.rows[0].elements[0];
        setRawRoute({
          distanceKm: Math.round(element.distance.value / 1000),
          durationMin: Math.round(element.duration.value / 60),
        });
      },
    );
  }, [selectedDeparture, selectedArrival, isGoogleLoaded, serviceType]);

  /**
   * Si passagers/bagages changent et dépassent la capacité du véhicule sélectionné,
   * on invalide automatiquement la sélection pour forcer un nouveau choix.
   */
  useEffect(() => {
    if (serviceType === "location" || !selectedTransferVehicle) return;
    const vehicle = TRANSFER_VEHICLES.find((v) => v.id === selectedTransferVehicle);
    if (vehicle && (watchedPassengers > vehicle.maxPassengers || watchedLuggage > vehicle.maxLuggage)) {
      setSelectedTransferVehicle(null);
      setValue("vehicleType", "");
    }
  }, [watchedPassengers, watchedLuggage, selectedTransferVehicle, serviceType, setValue]);

  // ── Mise à disposition — calcul de prix instantané ──

  interface MadPriceInfo {
    vehicleType: string;
    durationLabel: string;
    /** Prix calculé en €. null = tarif multi-jours (sur devis). */
    price: number | null;
  }

  const [madPriceInfo, setMadPriceInfo] = useState<MadPriceInfo | null>(null);

  /** States locaux : valeurs sélectionnées dans les Selects (déclenche le calcul MAD) */
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState(defaultVehicleType ?? "");

  /**
   * Recalcule le prix MAD dès que la durée ET le type de véhicule sont choisis.
   * Cas particulier "multi-jours" : affiche "Sur devis" (price = null).
   */
  useEffect(() => {
    if (serviceType !== "location") return;
    if (!selectedDuration || !selectedVehicleType) {
      setMadPriceInfo(null);
      return;
    }

    const durationOpt = DURATION_OPTIONS.find((o) => o.value === selectedDuration);
    const durationLabel = durationOpt ? t(durationOpt.i18nKey) : selectedDuration;
    const hours = parseDurationHours(selectedDuration);

    if (hours === null) {
      // "Plusieurs jours" → prix sur devis
      setMadPriceInfo({ vehicleType: selectedVehicleType, durationLabel, price: null });
      return;
    }

    const rate = MAD_HOURLY_RATES[selectedVehicleType] ?? 0;
    setMadPriceInfo({ vehicleType: selectedVehicleType, durationLabel, price: hours * rate });
  }, [selectedDuration, selectedVehicleType, serviceType]);

  const onSubmit = useCallback(
    async (formData: QuoteFormData) => {
      try {
        // Construire user_name avec entreprise si renseignée
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const userName = formData.companyName
          ? `${fullName} (${formData.companyName})`
          : fullName;

        // Agréger les infos complémentaires dans message
        const extraParts: string[] = [];
        if (routeInfo) {
          if (selectedTransferVehicle) {
            extraParts.push(`Véhicule : ${VEHICLE_LABELS[selectedTransferVehicle]}`);
          }
          extraParts.push(`Distance : ${routeInfo.distanceKm} km`);
          extraParts.push(`Durée estimée : ${routeInfo.durationMin} min`);
          extraParts.push(`Prix estimé : ${formatPrice(routeInfo.estimatedPrice)}`);
        }
        if (madPriceInfo) {
          extraParts.push(`Véhicule : ${madPriceInfo.vehicleType}`);
          extraParts.push(`Durée : ${madPriceInfo.durationLabel}`);
          extraParts.push(
            madPriceInfo.price !== null
              ? `Prix estimé : ${formatPrice(madPriceInfo.price)}`
              : "Prix : Sur devis (multi-jours)"
          );
        }
        if (formData.duration && serviceType !== "location") extraParts.push(`Durée : ${formData.duration}`);
        if (formData.volume) extraParts.push(`Volume mensuel : ${formData.volume}`);
        const userMessage = formData.message || "";
        const message = extraParts.length > 0
          ? `${extraParts.join(" | ")}\n\n${userMessage}`.trim()
          : userMessage || "—";

        const templateParams = {
          service_type: serviceType === "transfer"
            ? "Transfert"
            : serviceType === "location"
              ? "Mise à disposition"
              : "Corporate",
          user_name: userName,
          user_email: formData.email,
          user_phone: formData.phone,
          date: formData.date
            ? formData.date.toLocaleDateString("fr-FR", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })
            : "—",
          time: formData.time || "—",
          passengers: formData.passengers || "—",
          luggage: formData.luggage || "—",
          pickup: formData.departure || formData.pickupLocation || "—",
          dropoff: formData.arrival || "—",
          flight_number: formData.flightOrTrainNumber || "—",
          vehicle_type: selectedTransferVehicle
            ? VEHICLE_LABELS[selectedTransferVehicle]
            : formData.vehicleType || "Non spécifié",
          message,
        };

        // Guard clause : bloquer l'envoi si l'email est vide (évite erreur 422 EmailJS)
        if (!templateParams.user_email) {
          console.error("Erreur critique: l'adresse e-mail du client est vide. Données reçues :", formData);
          toast.error(t("form.validation.emailEmpty"));
          return;
        }

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        );

        setIsSubmitted(true);
      } catch {
        toast.error(t("form.toast.sendError"), {
          description: t("form.toast.sendErrorDesc"),
          duration: 5000,
          style: {
            background: "#1a1a1a",
            border: "1px solid rgba(180, 40, 40, 0.5)",
            color: "#f5f5f5",
          },
        });
      }
    },
    [serviceType, routeInfo, madPriceInfo, selectedTransferVehicle]
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
            {t("form.success.title")}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("form.success.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/[0.06] border border-gold/10"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("form.success.reference")}</span>
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
              {t("form.success.backHome")}
            </Link>
          </Button>
          <Button
            variant="outline-gold"
            size="lg"
            onClick={() => {
              setIsSubmitted(false);
              stepper.resetStepper();
              reset();
              setRawRoute(null);
              setSelectedTransferVehicle(null);
              setSelectedDeparture(null);
              setSelectedArrival(null);
              setMadPriceInfo(null);
              setSelectedDuration("");
              setSelectedVehicleType("");
            }}
          >
            {t("form.success.newRequest")}
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const variants = getSlideVariants(stepper.direction);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
    >

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
                  {t("form.stepTitle.coordinates")}
                </CardTitle>
                <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-3" />
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Nom de l'entreprise (optionnel) */}
                <div className="space-y-2">
                  <Label htmlFor="company">
                    {t("form.labels.company")}{" "}
                    <span className="text-muted-foreground font-normal">{t("form.labels.optional")}</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                    <Input
                      id="company"
                      placeholder={t("form.placeholders.company")}
                      {...register("companyName")}
                      className={`pl-10 ${fieldErrorClass("companyName")}`}
                    />
                  </div>
                </div>

                {/* Prénom & Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("form.labels.firstName")} {t("form.labels.required")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="firstName"
                        placeholder={t("form.placeholders.firstName")}
                        {...register("firstName")}
                        className={`pl-10 ${fieldErrorClass("firstName")}`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("form.labels.lastName")} {t("form.labels.required")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="lastName"
                        placeholder={t("form.placeholders.lastName")}
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
                      {serviceType === "corporate" ? t("form.labels.emailCorporate") : t("form.labels.email")} {t("form.labels.required")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={serviceType === "corporate" ? t("form.placeholders.emailCorporate") : t("form.placeholders.email")}
                        {...register("email")}
                        className={`pl-10 ${fieldErrorClass("email")}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("form.labels.phone")} {t("form.labels.required")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t("form.placeholders.phone")}
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
                  {showDispositionFields ? t("form.stepTitle.madDetails") : t("form.stepTitle.tripDetails")}
                </CardTitle>
                <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-3" />
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Champs TRANSFER / CORPORATE : adresses */}
                {showAddressFields && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="departure">{t("form.labels.departure")} {t("form.labels.required")}</Label>
                      <Controller
                        name="departure"
                        control={control}
                        render={({ field }) => (
                          <AddressInput
                            id="departure"
                            placeholder={t("form.placeholders.departure")}
                            value={field.value ?? ""}
                            onChange={(value) => {
                              field.onChange(value);
                              setSelectedDeparture(null);
                              setRawRoute(null);
                            }}
                            onPlaceSelected={(addr) => setSelectedDeparture(addr)}
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
                      <Label htmlFor="arrival">{t("form.labels.arrival")} {t("form.labels.required")}</Label>
                      <Controller
                        name="arrival"
                        control={control}
                        render={({ field }) => (
                          <AddressInput
                            id="arrival"
                            placeholder={t("form.placeholders.arrival")}
                            value={field.value ?? ""}
                            onChange={(value) => {
                              field.onChange(value);
                              setSelectedArrival(null);
                              setRawRoute(null);
                            }}
                            onPlaceSelected={(addr) => setSelectedArrival(addr)}
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

                {/* Champs LOCATION : lieu + véhicule + durée + encart prix */}
                {showDispositionFields && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">{t("form.labels.pickupLocation")} {t("form.labels.required")}</Label>
                      <Controller
                        name="pickupLocation"
                        control={control}
                        render={({ field }) => (
                          <AddressInput
                            id="pickupLocation"
                            placeholder={t("form.placeholders.pickupLocation")}
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

                    {/* Véhicule */}
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">
                        <Car className="inline h-3.5 w-3.5 mr-1 text-gold" />
                        {t("form.labels.vehicleWanted")} {t("form.labels.required")}
                      </Label>
                      <Controller
                        name="vehicleType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(val) => {
                              field.onChange(val);
                              setSelectedVehicleType(val);
                            }}
                          >
                            <SelectTrigger
                              id="vehicleType"
                              className={errors.vehicleType ? "border-red-500/50 focus:ring-red-500/30" : ""}
                            >
                              <SelectValue placeholder={t("form.placeholders.selectVehicle")} />
                            </SelectTrigger>
                            <SelectContent>
                              {MAD_VEHICLE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {t(opt.i18nKey)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.vehicleType && (
                        <p className="text-sm text-red-500 mt-1">{errors.vehicleType.message}</p>
                      )}
                    </div>

                    {/* Durée */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">
                        <Clock className="inline h-3.5 w-3.5 mr-1 text-gold" />
                        {t("form.labels.duration")} {t("form.labels.required")}
                      </Label>
                      <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(val) => {
                              field.onChange(val);
                              setSelectedDuration(val);
                            }}
                          >
                            <SelectTrigger
                              id="duration"
                              className={errors.duration ? "border-red-500/50 focus:ring-red-500/30" : ""}
                            >
                              <SelectValue placeholder={t("form.placeholders.selectDuration")} />
                            </SelectTrigger>
                            <SelectContent>
                              {DURATION_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{t(opt.i18nKey)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.duration && (
                        <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                      )}
                    </div>

                    {/* ── Encart estimation prix MAD ── */}
                    {madPriceInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl border border-gold/20 bg-gold/[0.04] p-5 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-gold">
                          <Car className="h-4 w-4" />
                          {t("form.estimate.madTitle")}
                        </div>

                        <div className={`grid gap-3 ${madPriceInfo.price !== null ? "grid-cols-2" : "grid-cols-1"}`}>
                          <div className="text-center space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("form.estimate.duration")}</p>
                            <p className="text-lg font-semibold text-foreground">{madPriceInfo.durationLabel}</p>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("form.estimate.estimation")}</p>
                            {madPriceInfo.price !== null ? (
                              <p className="text-lg font-semibold text-gold">{formatPrice(madPriceInfo.price)}</p>
                            ) : (
                              <p className="text-lg font-semibold text-gold">{t("form.estimate.onQuote")}</p>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-center text-muted-foreground/60">
                          {t("form.estimate.vehicleLabel", { vehicle: madPriceInfo.vehicleType })} — {t("form.estimate.quoteDisclaimer")}
                        </p>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Date & Heure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("form.labels.date")} {t("form.labels.required")}</Label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          date={field.value}
                          onDateChange={(d) => field.onChange(d)}
                          placeholder={t("form.placeholders.selectDate")}
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
                      {t("form.labels.time")} {t("form.labels.required")}
                    </Label>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="time" className={errors.time ? "border-red-500/50 focus:ring-red-500/30" : ""}>
                            <SelectValue placeholder={t("form.placeholders.selectTime")} />
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

                {/* Passagers & Bagages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passengers">
                      <Users className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      {t("form.labels.passengers")} {t("form.labels.required")}
                    </Label>
                    <Controller
                      name="passengers"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="passengers" className={errors.passengers ? "border-red-500/50 focus:ring-red-500/30" : ""}>
                            <SelectValue placeholder={t("form.placeholders.passengers")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {t("form.options.passenger", { count: n })}
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
                      {t("form.labels.luggage")} {t("form.labels.required")}
                    </Label>
                    <Controller
                      name="luggage"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="luggage" className={errors.luggage ? "border-red-500/50 focus:ring-red-500/30" : ""}>
                            <SelectValue placeholder={t("form.placeholders.luggage")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {t("form.options.luggage", { count: n })}
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

                {/* ── Sélection du véhicule (mode Trajet uniquement) ── */}
                {showAddressFields && (
                  <div className="space-y-3">
                    <Label>
                      <Car className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      {t("form.labels.chooseVehicle")} {t("form.labels.required")}
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {TRANSFER_VEHICLES.map((vehicle) => {
                        const isDisabled =
                          watchedPassengers > vehicle.maxPassengers ||
                          watchedLuggage > vehicle.maxLuggage;
                        const isSelected = selectedTransferVehicle === vehicle.id;

                        return (
                          <button
                            key={vehicle.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              setSelectedTransferVehicle(vehicle.id);
                              setValue("vehicleType", vehicle.id, { shouldValidate: true });
                            }}
                            className={[
                              "relative rounded-xl border p-4 text-left transition-all duration-200",
                              isSelected
                                ? "border-gold/40 bg-gold/[0.06] ring-1 ring-gold/20"
                                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]",
                              isDisabled && "opacity-40 cursor-not-allowed hover:border-white/[0.06]",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-display font-semibold text-sm text-foreground">
                                  {vehicle.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {t(vehicle.subtitleKey)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {vehicle.maxPassengers} max
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3" />
                                  {vehicle.maxLuggage} max
                                </span>
                              </div>
                            </div>

                            {isDisabled && (
                              <p className="text-[10px] text-red-400/80 mt-2">
                                {t("form.vehicles.capacityExceeded")}
                              </p>
                            )}

                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5">
                                <CheckCircle2 className="h-4 w-4 text-gold" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {errors.vehicleType && (
                      <p className="text-sm text-red-500 mt-1">{errors.vehicleType.message}</p>
                    )}
                  </div>
                )}

                {/* ── Encart estimation trajet (visible après calcul Distance Matrix) ── */}
                {showAddressFields && isCalculating && (
                  <div className="flex items-center gap-3 rounded-xl border border-gold/10 bg-gold/[0.03] p-4">
                    <Loader2 className="h-5 w-5 text-gold animate-spin" />
                    <span className="text-sm text-muted-foreground">{t("form.estimate.calculating")}</span>
                  </div>
                )}

                {showAddressFields && routeInfo && !isCalculating && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-gold/20 bg-gold/[0.04] p-5 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gold">
                      <Route className="h-4 w-4" />
                      {t("form.estimate.tripTitle")}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("form.estimate.distance")}</p>
                        <p className="text-lg font-semibold text-foreground">{routeInfo.distanceKm} km</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("form.estimate.duration")}</p>
                        <p className="text-lg font-semibold text-foreground">
                          {routeInfo.durationMin >= 60
                            ? `${Math.floor(routeInfo.durationMin / 60)}h${String(routeInfo.durationMin % 60).padStart(2, "0")}`
                            : `${routeInfo.durationMin} min`}
                        </p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {selectedTransferVehicle ? t("form.estimate.estimatedPrice") : t("form.estimate.startingFrom")}
                        </p>
                        <p className="text-lg font-semibold text-gold">{formatPrice(routeInfo.estimatedPrice)}</p>
                      </div>
                    </div>

                    {routeInfo.isAirportTransfer && routeInfo.airportName && (
                      <p className="text-xs text-center text-muted-foreground">
                        {t("form.estimate.airportForfait", { airport: routeInfo.airportName })}
                      </p>
                    )}

                    <p className="text-[11px] text-center text-muted-foreground/60">
                      {selectedTransferVehicle
                        ? t("form.estimate.vehicleTariff", { vehicle: VEHICLE_LABELS[selectedTransferVehicle] })
                        : t("form.estimate.defaultTariff")}
                      {" "}— {t("form.estimate.quoteDisclaimer")}
                    </p>
                  </motion.div>
                )}
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
                  {t("form.stepTitle.finalization")}
                </CardTitle>
                <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-3" />
              </CardHeader>

              <CardContent className="space-y-5">
                {/* N° de vol/train — transfer/corporate uniquement */}
                {showFlightField && (
                  <div className="space-y-2">
                    <Label htmlFor="flightTrain">
                      <Plane className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      {t("form.labels.flightTrain")}{" "}
                      <span className="text-muted-foreground font-normal">{t("form.labels.optional")}</span>
                    </Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="flightTrain"
                        placeholder={t("form.placeholders.flightTrain")}
                        {...register("flightOrTrainNumber")}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("form.helpers.flightTracking")}
                    </p>
                  </div>
                )}

                {/* Volume — corporate uniquement */}
                {showVolumeField && (
                  <div className="space-y-2">
                    <Label htmlFor="volume">
                      <MapPin className="inline h-3.5 w-3.5 mr-1 text-gold" />
                      {t("form.labels.volume")}
                    </Label>
                    <Controller
                      name="volume"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger id="volume">
                            <SelectValue placeholder={t("form.placeholders.selectVolume")} />
                          </SelectTrigger>
                          <SelectContent>
                            {VOLUME_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{t(opt.i18nKey)}</SelectItem>
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
                    {t("form.labels.message")}{" "}
                    <span className="text-muted-foreground font-normal">{t("form.labels.optional")}</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={
                      serviceType === "corporate"
                        ? t("form.placeholders.messageCorporate")
                        : t("form.placeholders.message")
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
        submitLabel={t(SUBMIT_KEYS[serviceType])}
        onPrev={stepper.goToPrev}
        onNext={stepper.goToNext}
        onSubmit={handleSubmit(onSubmit)}
      />
    </form>
  );
}
