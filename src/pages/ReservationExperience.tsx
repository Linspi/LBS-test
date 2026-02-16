import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock,
  MapPin,
  Users,
  Check,
  CalendarDays,
  Sparkles,
  Send,
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
import { experiences, getExperienceById } from "@/data/experiences";
import { formatPrice } from "@/lib/pricing";
import type { Experience } from "@/types";

/** Créneaux horaires (30 min) de 06:00 à 22:00 */
const TIME_SLOTS = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const min = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${min}`;
});

export function ReservationExperience() {
  const [searchParams] = useSearchParams();
  const experienceIdFromUrl = searchParams.get("experience");

  // ── État du formulaire ──────────────────────────────
  const [selectedExperienceId, setSelectedExperienceId] = useState<string>(
    experienceIdFromUrl ?? ""
  );
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [departure, setDeparture] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [specialRequests, setSpecialRequests] = useState("");

  // Expérience active (URL ou sélection manuelle)
  const selectedExperience: Experience | undefined = useMemo(
    () => (selectedExperienceId ? getExperienceById(selectedExperienceId) : undefined),
    [selectedExperienceId]
  );

  // ── Validation ──────────────────────────────────────
  const isFormValid =
    selectedExperienceId && date && time && departure && passengers;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || !selectedExperience) return;

    // TODO: Remplacer par un appel API / envoi de mail réel
    alert(
      [
        `Demande de devis envoyée !`,
        ``,
        `Expérience : ${selectedExperience.title}`,
        `Date : ${date?.toLocaleDateString("fr-FR")}`,
        `Heure : ${time}`,
        `Départ : ${departure}`,
        `Passagers : ${passengers}`,
        specialRequests ? `Demandes : ${specialRequests}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );
  }

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
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          >
            {/* ── Colonne gauche : Formulaire (3/5) ─── */}
            <div className="lg:col-span-3 space-y-6">
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
                      <Label htmlFor="experience">Expérience souhaitée</Label>
                      <Select
                        value={selectedExperienceId}
                        onValueChange={setSelectedExperienceId}
                      >
                        <SelectTrigger id="experience">
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
                    </div>
                  )}

                  {/* Date & Heure */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de prise en charge</Label>
                      <DatePicker date={date} onDateChange={setDate} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Heure de prise en charge</Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger id="time">
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
                    </div>
                  </div>

                  {/* Adresse de départ */}
                  <div className="space-y-2">
                    <Label htmlFor="departure">Adresse de départ</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="departure"
                        placeholder="Hôtel, adresse parisienne..."
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Nombre de passagers */}
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Nombre de passagers</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger id="passengers" className="pl-10">
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
                    </div>
                  </div>

                  {/* Demandes spécifiques */}
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
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="min-h-28 bg-input border-border resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid}
                className="w-full text-base"
              >
                <Send className="mr-2 h-4 w-4" />
                Demander un devis personnalisé
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
