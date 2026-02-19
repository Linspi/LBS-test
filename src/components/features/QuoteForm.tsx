/**
 * QuoteForm — Composant de formulaire de devis réutilisable.
 *
 * Ce composant est conçu pour être utilisé sur 3 types de pages :
 * - "transfer"  : Transfert classique (aéroport, gare, point-à-point)
 * - "location"  : Mise à disposition (chauffeur + véhicule pour une durée)
 * - "corporate" : Service entreprise (transfert + volume mensuel estimé)
 *
 * La validation est gérée par Zod + React Hook Form (mode onBlur).
 * Les champs s'adaptent dynamiquement selon le serviceType.
 */

import { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
  Send,
  Loader2,
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
  CardDescription,
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

// ---------------------------------------------------------------------------
// Types publics
// ---------------------------------------------------------------------------

/** Les 3 types de service supportés par le formulaire */
export type ServiceType = "transfer" | "location" | "corporate";

interface QuoteFormProps {
  /** Type de service — conditionne les champs affichés et la validation */
  serviceType: ServiceType;
  /** Destination pré-remplie (ex: depuis la page Trajets) */
  defaultDestination?: string;
}

// ---------------------------------------------------------------------------
// Créneaux horaires (de 00:00 à 23:30 par tranche de 30 minutes)
// ---------------------------------------------------------------------------

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

// ---------------------------------------------------------------------------
// Options de durée pour la mise à disposition
// ---------------------------------------------------------------------------

const DURATION_OPTIONS = [
  { value: "4h", label: "4 heures" },
  { value: "8h", label: "8 heures" },
  { value: "12h", label: "12 heures" },
  { value: "multi-jours", label: "Plusieurs jours" },
] as const;

// ---------------------------------------------------------------------------
// Options du volume de courses mensuel (corporate uniquement)
// ---------------------------------------------------------------------------

const VOLUME_OPTIONS = [
  { value: "1-10", label: "1 à 10 courses" },
  { value: "11-50", label: "11 à 50 courses" },
  { value: "50+", label: "Plus de 50 courses" },
] as const;

// ---------------------------------------------------------------------------
// Schéma Zod dynamique — adapté selon le serviceType
// ---------------------------------------------------------------------------

/**
 * Construit le schéma de validation Zod en fonction du type de service.
 *
 * - Les champs communs (prénom, nom, email, téléphone, date, heure,
 *   passagers, bagages) sont toujours requis.
 * - Les champs d'adresse (départ/arrivée) et vol/train sont requis
 *   pour "transfer" et "corporate", mais pas pour "location".
 * - Le lieu de prise en charge et la durée sont requis pour "location".
 * - L'entreprise, le volume et le message sont toujours optionnels.
 */
function createQuoteSchema(serviceType: ServiceType) {
  // Regex pour téléphone (format international ou local)
  const phoneRegex =
    /^(\+?\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;

  // Champs de base — toujours présents et requis
  const baseFields = {
    firstName: z.string().min(1, "Ce champ est obligatoire"),
    lastName: z.string().min(1, "Ce champ est obligatoire"),
    email: z.string().email("Format d'email invalide"),
    phone: z
      .string()
      .regex(phoneRegex, "Numéro de téléphone invalide"),
    date: z.date({ message: "Veuillez sélectionner une date" }),
    time: z.string().min(1, "Veuillez sélectionner une heure"),
    passengers: z.string().min(1, "Veuillez sélectionner le nombre de passagers"),
    luggage: z.string().min(1, "Veuillez sélectionner le nombre de bagages"),
    // Champs toujours optionnels
    companyName: z.string().optional(),
    message: z.string().optional(),
  };

  // Champs spécifiques selon le type de service
  if (serviceType === "location") {
    // Mise à disposition : lieu + durée requis, pas d'adresses
    return z.object({
      ...baseFields,
      pickupLocation: z.string().min(1, "Ce champ est obligatoire"),
      duration: z.string().min(1, "Veuillez sélectionner une durée"),
      // Champs non affichés mais présents dans le type pour cohérence
      departure: z.string().optional(),
      arrival: z.string().optional(),
      flightOrTrainNumber: z.string().optional(),
      volume: z.string().optional(),
    });
  }

  if (serviceType === "corporate") {
    // Corporate : adresses requises + champ volume optionnel
    return z.object({
      ...baseFields,
      departure: z.string().min(1, "Ce champ est obligatoire"),
      arrival: z.string().min(1, "Ce champ est obligatoire"),
      flightOrTrainNumber: z.string().optional(),
      volume: z.string().optional(),
      // Champs non affichés mais présents pour cohérence
      pickupLocation: z.string().optional(),
      duration: z.string().optional(),
    });
  }

  // Transfer (défaut) : adresses requises, pas de volume
  return z.object({
    ...baseFields,
    departure: z.string().min(1, "Ce champ est obligatoire"),
    arrival: z.string().min(1, "Ce champ est obligatoire"),
    flightOrTrainNumber: z.string().optional(),
    // Champs non affichés mais présents pour cohérence
    pickupLocation: z.string().optional(),
    duration: z.string().optional(),
    volume: z.string().optional(),
  });
}

/** Type inféré depuis le schéma Zod (union des 3 variantes) */
type QuoteFormData = z.infer<ReturnType<typeof createQuoteSchema>>;

// ---------------------------------------------------------------------------
// Titres et descriptions dynamiques selon le serviceType
// ---------------------------------------------------------------------------

const FORM_CONFIG: Record<
  ServiceType,
  { title: string; description: string; submitLabel: string }
> = {
  transfer: {
    title: "Réserver un transfert",
    description:
      "Remplissez ce formulaire et recevez une confirmation sous 24h.",
    submitLabel: "Demander un devis transfert",
  },
  location: {
    title: "Mise à disposition",
    description:
      "Véhicule avec chauffeur à votre disposition pour la durée souhaitée.",
    submitLabel: "Demander un devis mise à disposition",
  },
  corporate: {
    title: "Demander un devis corporate",
    description:
      "Complétez ce formulaire et notre équipe commerciale vous recontactera sous 24h pour étudier vos besoins.",
    submitLabel: "Envoyer ma demande de devis",
  },
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function QuoteForm({ serviceType, defaultDestination }: QuoteFormProps) {
  // Récupération du schéma Zod correspondant au serviceType
  const schema = createQuoteSchema(serviceType);

  // Configuration du formulaire React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur", // Validation déclenchée au blur de chaque champ
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      departure: "",
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

  // Configuration textuelle du formulaire
  const config = FORM_CONFIG[serviceType];

  // Champs d'adresse affichés pour transfer et corporate
  const showAddressFields = serviceType !== "location";
  // Champs de mise à disposition affichés pour location uniquement
  const showDispositionFields = serviceType === "location";

  // Observer les valeurs du formulaire pour activer/désactiver le bouton
  const formValues = watch();

  // Calculer si le formulaire peut être soumis (champs obligatoires remplis)
  const isFormValid = useMemo(() => {
    // Vérifier les champs communs obligatoires
    const hasBaseFields =
      formValues.firstName?.trim() &&
      formValues.lastName?.trim() &&
      formValues.email?.trim() &&
      formValues.phone?.trim() &&
      formValues.date &&
      formValues.time &&
      formValues.passengers &&
      formValues.luggage;

    if (!hasBaseFields) return false;

    // Vérifier les champs spécifiques selon le serviceType
    if (serviceType === "location") {
      return !!(formValues.pickupLocation?.trim() && formValues.duration);
    }

    // Pour transfer et corporate : adresses requises
    return !!(formValues.departure?.trim() && formValues.arrival?.trim());
  }, [formValues, serviceType]);
  // Champ volume affiché pour corporate uniquement
  const showVolumeField = serviceType === "corporate";
  // Champ vol/train affiché pour transfer et corporate
  const showFlightField = serviceType !== "location";

  /**
   * Soumission du formulaire.
   * Simule un envoi avec setTimeout (1.5s).
   * TODO: Intégrer EmailJS ici pour l'envoi réel
   */
  const onSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_formData: QuoteFormData) => {
      try {
        // TODO: Intégrer EmailJS ici pour l'envoi réel
        // Exemple :
        // await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
        //   firstName: data.firstName,
        //   ...
        // }, 'PUBLIC_KEY');

        // Simulation d'envoi réseau (1.5 secondes)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Toast succès — style premium (fond anthracite, bordure dorée)
        toast.success("Demande envoyée avec succès", {
          description:
            "Nous vous contactons sous 24h. Un e-mail de confirmation vous a été envoyé.",
          duration: 5000,
          style: {
            background: "#1a1a1a",
            border: "1px solid rgba(200, 168, 78, 0.4)",
            color: "#f5f5f5",
          },
        });

        // Réinitialiser le formulaire après succès
        reset();
      } catch {
        // Toast erreur — style premium (fond anthracite, bordure rouge/bordeaux)
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
    [reset]
  );

  /**
   * Classe CSS conditionnelle pour les champs en erreur.
   * Ajoute une bordure rouge subtile quand le champ a une erreur.
   */
  const fieldErrorClass = (fieldName: keyof QuoteFormData) =>
    errors[fieldName] ? "border-red-500/50 focus-visible:ring-red-500/30" : "";

  return (
    <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Send className="h-5 w-5 text-gold" />
          {config.title}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {config.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ------------------------------------------------------------ */}
          {/* Section 1 : Informations personnelles                         */}
          {/* ------------------------------------------------------------ */}
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2 mb-1">
              <User className="h-4 w-4" />
              Informations personnelles
            </legend>

            {/* Séparateur doré */}
            <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

            {/* Nom de l'entreprise (optionnel, toujours visible) */}
            <div className="space-y-2">
              <Label htmlFor="company">
                Nom de l&apos;entreprise{" "}
                <span className="text-muted-foreground font-normal">
                  (optionnel)
                </span>
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {serviceType === "corporate"
                    ? "Email professionnel *"
                    : "Email *"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      serviceType === "corporate"
                        ? "contact@entreprise.com"
                        : "votre@email.com"
                    }
                    {...register("email")}
                    className={`pl-10 ${fieldErrorClass("email")}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* ------------------------------------------------------------ */}
          {/* Section 2 : Détails du trajet / mise à disposition             */}
          {/* ------------------------------------------------------------ */}
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4" />
              {showDispositionFields
                ? "Détails de la mise à disposition"
                : "Détails du trajet"}
            </legend>

            <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

            {/* --- Champs TRANSFER / CORPORATE : adresses départ + arrivée --- */}
            {showAddressFields && (
              <>
                {/* Adresse de départ — autocomplétion via Controller */}
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.departure.message}
                    </p>
                  )}
                </div>

                {/* Adresse d'arrivée — autocomplétion via Controller */}
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.arrival.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* --- Champs LOCATION : lieu de prise en charge + durée --- */}
            {showDispositionFields && (
              <>
                {/* Lieu de prise en charge */}
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">
                    Lieu de prise en charge *
                  </Label>
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.pickupLocation.message}
                    </p>
                  )}
                </div>

                {/* Durée de mise à disposition */}
                <div className="space-y-2">
                  <Label>
                    <Clock className="inline h-3.5 w-3.5 mr-1 text-gold" />
                    Durée de mise à disposition *
                  </Label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={
                            errors.duration
                              ? "border-red-500/50 focus:ring-red-500/30"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Sélectionner la durée" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Date & Heure — toujours affichés */}
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  <Clock className="inline h-3.5 w-3.5 mr-1 text-gold" />
                  Heure *
                </Label>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={
                          errors.time
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Sélectionner l'heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.time && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.time.message}
                  </p>
                )}
              </div>
            </div>

            {/* Passagers & Bagages — toujours affichés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  <Users className="inline h-3.5 w-3.5 mr-1 text-gold" />
                  Nombre de passagers *
                </Label>
                <Controller
                  name="passengers"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={
                          errors.passengers
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : ""
                        }
                      >
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.passengers.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  <Briefcase className="inline h-3.5 w-3.5 mr-1 text-gold" />
                  Nombre de bagages *
                </Label>
                <Controller
                  name="luggage"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={
                          errors.luggage
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : ""
                        }
                      >
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.luggage.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* ------------------------------------------------------------ */}
          {/* Section 3 : Information VIP (vol/train) — transfer/corporate  */}
          {/* ------------------------------------------------------------ */}
          {showFlightField && (
            <fieldset className="space-y-5">
              <legend className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2 mb-1">
                <Plane className="h-4 w-4" />
                Information VIP
                <span className="text-muted-foreground font-normal text-xs normal-case tracking-normal">
                  (optionnel)
                </span>
              </legend>

              <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

              {/* Numéro de vol ou de train */}
              <div className="space-y-2">
                <Label htmlFor="flightTrain">
                  Numéro de vol ou de train
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
                  Nous suivrons votre vol/train en temps réel pour adapter
                  l&apos;heure de prise en charge en cas de retard.
                </p>
              </div>
            </fieldset>
          )}

          {/* ------------------------------------------------------------ */}
          {/* Section 4 : Informations complémentaires                      */}
          {/* ------------------------------------------------------------ */}
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4" />
              Informations complémentaires
            </legend>

            <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

            {/* Volume de courses — corporate uniquement */}
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
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="volume">
                        <SelectValue placeholder="Sélectionnez une estimation" />
                      </SelectTrigger>
                      <SelectContent>
                        {VOLUME_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Message libre — toujours affiché */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Besoins spécifiques{" "}
                <span className="text-muted-foreground font-normal">
                  (optionnel)
                </span>
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
          </fieldset>

          {/* ------------------------------------------------------------ */}
          {/* Bouton de soumission — désactivé si formulaire invalide       */}
          {/* ------------------------------------------------------------ */}
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isSubmitting}
            className="w-full text-base transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {config.submitLabel}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
