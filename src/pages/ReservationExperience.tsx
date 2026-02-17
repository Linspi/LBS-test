/**
 * ReservationExperience — Page de réservation d'excursions et événements.
 *
 * Layout unique : formulaire à gauche (3/5), récapitulatif expérience à droite (2/5).
 * Utilise React Hook Form + Zod pour la validation (mode onBlur).
 * Autocomplétion d'adresse via AddressInput (API BAN).
 * Notifications via Toast Sonner (style premium).
 */

import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Clock,
  Users,
  Check,
  CalendarDays,
  Sparkles,
  Send,
  Loader2,
  User,
  Mail,
  Phone,
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

/** Regex pour téléphone (format international ou local) */
const phoneRegex =
  /^(\+?\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;

const experienceFormSchema = z.object({
  // Informations personnelles
  firstName: z.string().min(1, "Ce champ est obligatoire"),
  lastName: z.string().min(1, "Ce champ est obligatoire"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().regex(phoneRegex, "Numéro de téléphone invalide"),
  // Détails de la réservation
  experience: z.string().min(1, "Veuillez sélectionner une expérience"),
  date: z.date({ message: "Veuillez sélectionner une date" }),
  time: z.string().min(1, "Veuillez sélectionner une heure"),
  departure: z.string().min(3, "L'adresse doit contenir au moins 3 caractères"),
  passengers: z.string().min(1, "Veuillez sélectionner le nombre de passagers"),
  specialRequests: z.string().optional(),
});

/** Type inféré depuis le schéma Zod */
type ExperienceFormData = z.infer<typeof experienceFormSchema>;

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function ReservationExperience() {
  const [searchParams] = useSearchParams();
  const experienceIdFromUrl = searchParams.get("experience");

  // ── Configuration React Hook Form ─────────────────────
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
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

  // Surveiller les valeurs du formulaire
  const formValues = watch();

  // Surveiller l'expérience sélectionnée pour le récapitulatif
  const selectedExperienceId = formValues.experience;

  // Expérience active (URL ou sélection manuelle)
  const selectedExperience: Experience | undefined = useMemo(
    () =>
      selectedExperienceId
        ? getExperienceById(selectedExperienceId)
        : undefined,
    [selectedExperienceId]
  );

  // Calculer si le formulaire peut être soumis (tous les champs obligatoires remplis)
  const isFormValid = useMemo(() => {
    return !!(
      formValues.firstName?.trim() &&
      formValues.lastName?.trim() &&
      formValues.email?.trim() &&
      formValues.phone?.trim() &&
      formValues.experience &&
      formValues.date &&
      formValues.time &&
      formValues.departure?.trim() &&
      formValues.passengers
    );
  }, [formValues]);

  // ── Soumission du formulaire ──────────────────────────
  const onSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_formData: ExperienceFormData) => {
      try {
        // TODO: Intégrer EmailJS ici
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
        // Toast erreur — style premium (fond anthracite, bordure rouge)
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
    [reset]
  );

  /**
   * Classe CSS conditionnelle pour les champs en erreur.
   * Ajoute une bordure rouge subtile.
   */
  const fieldErrorClass = (fieldName: keyof ExperienceFormData) =>
    errors[fieldName] ? "border-red-500/50 focus-visible:ring-red-500/30" : "";

  return (
    <>
      {/* Hero compact */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Réservation premium
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Planifiez votre{" "}
            <span className="text-gold">expérience</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Excursion ou événement, nous créons un service sur mesure pour
            chaque occasion.
          </p>
        </div>
      </section>

      {/* Contenu deux colonnes */}
      <section className="pb-24">
        <div className="container max-w-6xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          >
            {/* ── Colonne gauche : Formulaire (3/5) ─── */}
            <div className="lg:col-span-3 space-y-6">
              {/* ── Section 1 : Informations personnelles ── */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-gold" />
                    Informations personnelles
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
                </CardContent>
              </Card>

              {/* ── Section 2 : Détails de la réservation ── */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-gold" />
                    Détails de votre réservation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Sélection de l'expérience (si pas de paramètre URL) */}
                  {!experienceIdFromUrl && (
                    <div className="space-y-2">
                      <Label htmlFor="experience">Expérience souhaitée *</Label>
                      <Controller
                        name="experience"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="experience"
                              className={
                                errors.experience
                                  ? "border-red-500/50 focus:ring-red-500/30"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Choisissez une excursion ou un événement" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Groupe Excursions */}
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

                              {/* Groupe Événements */}
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
                        <p className="text-sm text-red-500 mt-1">
                          {errors.experience.message}
                        </p>
                      )}
                    </div>
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
                        <p className="text-sm text-red-500 mt-1">
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Heure de prise en charge *</Label>
                      <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="time"
                              className={
                                errors.time
                                  ? "border-red-500/50 focus:ring-red-500/30"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
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

                  {/* Adresse de départ — AddressInput avec autocomplétion */}
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
                      <p className="text-sm text-red-500 mt-1">
                        {errors.departure.message}
                      </p>
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="passengers"
                              className={`pl-10 ${
                                errors.passengers
                                  ? "border-red-500/50 focus:ring-red-500/30"
                                  : ""
                              }`}
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
                      <p className="text-sm text-red-500 mt-1">
                        {errors.passengers.message}
                      </p>
                    )}
                  </div>

                  {/* Demandes spécifiques (optionnel) */}
                  <div className="space-y-2">
                    <Label htmlFor="special-requests">
                      Demandes spécifiques{" "}
                      <span className="text-muted-foreground font-normal">
                        (optionnel)
                      </span>
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

              {/* Bouton de soumission — spinner + disabled si invalide */}
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
                    Demander un devis personnalisé
                  </>
                )}
              </Button>
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

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {experience.description}
        </p>

        {/* Durée */}
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Clock className="h-4 w-4 text-gold" />
          {experience.duration}
        </div>

        {/* Inclusions */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold">
            Inclus dans la prestation
          </h4>
          <ul className="space-y-1.5">
            {experience.inclusions.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <Check className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Séparateur doré */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        {/* Prix estimé */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {experience.estimatedPrice !== null
                ? "Estimation tarifaire"
                : "Tarif"}
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
