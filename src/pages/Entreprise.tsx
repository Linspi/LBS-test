import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  UserCheck,
  Clock,
  CalendarCheck,
  Building,
  User,
  Mail,
  Phone,
  Send,
  Users,
  Briefcase,
  Plane,
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
// Données statiques — Avantages du service Corporate
// ---------------------------------------------------------------------------

const CORPORATE_ADVANTAGES = [
  {
    icon: FileText,
    title: "Facturation Simplifiée",
    description:
      "Relevé mensuel unique regroupant toutes vos courses. Pas d'avance de frais pour vos collaborateurs, règlement à 30 jours.",
  },
  {
    icon: UserCheck,
    title: "Accueil VIP",
    description:
      "Pancarte nominative sur tablette iPad aux aéroports et gares. Un accueil professionnel qui valorise votre image de marque.",
  },
  {
    icon: Clock,
    title: "Priorité de Réservation",
    description:
      "Disponibilité garantie même en période de forte demande (Fashion Week, salons professionnels, événements).",
  },
  {
    icon: CalendarCheck,
    title: "Événementiel & Flottes",
    description:
      "Mise à disposition de flottes complètes pour vos séminaires, conventions, Fashion Weeks et événements d'entreprise.",
  },
];

// ---------------------------------------------------------------------------
// Créneaux horaires (de 00:00 à 23:30 par tranche de 30 minutes)
// ---------------------------------------------------------------------------

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

// ---------------------------------------------------------------------------
// Interface du formulaire — typage strict de chaque champ
// ---------------------------------------------------------------------------

interface CorporateFormData {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  // Détails du trajet
  departure: string;
  arrival: string;
  date: Date | undefined;
  time: string;
  passengers: string;
  luggage: string;
  // Infos VIP optionnelles
  flightOrTrainNumber: string;
  // Volume & message
  volume: string;
  message: string;
}

/** État initial du formulaire — tous les champs vides */
const INITIAL_FORM_DATA: CorporateFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  departure: "",
  arrival: "",
  date: undefined,
  time: "",
  passengers: "",
  luggage: "",
  flightOrTrainNumber: "",
  volume: "",
  message: "",
};

// ---------------------------------------------------------------------------
// Composant principal — Page Entreprise
// ---------------------------------------------------------------------------

export function Entreprise() {
  const [formData, setFormData] = useState<CorporateFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Met à jour un champ du formulaire de manière type-safe.
   * Utilise un generic K contraint aux clés de CorporateFormData
   * pour garantir que la clé et la valeur correspondent.
   */
  function updateField<K extends keyof CorporateFormData>(
    field: K,
    value: CorporateFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Validation — les champs obligatoires sont remplis
  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.departure.trim() !== "" &&
    formData.arrival.trim() !== "" &&
    formData.date !== undefined &&
    formData.time !== "";

  /**
   * Soumission du formulaire.
   * Pour l'instant on simule l'envoi avec un setTimeout.
   * TODO: Intégrer EmailJS ici pour l'envoi réel
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    // TODO: Intégrer EmailJS ici pour l'envoi réel
    // Exemple avec EmailJS :
    // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   email: formData.email,
    //   phone: formData.phone,
    //   companyName: formData.companyName,
    //   departure: formData.departure,
    //   arrival: formData.arrival,
    //   date: formData.date?.toLocaleDateString('fr-FR'),
    //   time: formData.time,
    //   passengers: formData.passengers,
    //   luggage: formData.luggage,
    //   flightOrTrainNumber: formData.flightOrTrainNumber,
    //   volume: formData.volume,
    //   message: formData.message,
    // }, 'PUBLIC_KEY');

    // Simulation d'envoi (1.5 secondes)
    setTimeout(() => {
      setIsSubmitting(false);

      // Toast de succès premium
      toast.success("Demande envoyée avec succès", {
        description:
          "Un e-mail de confirmation vous a été envoyé. Notre équipe vous recontactera sous 24h.",
        duration: 4000,
      });

      // Réinitialiser le formulaire après succès
      setFormData(INITIAL_FORM_DATA);
    }, 1500);
  };

  return (
    <>
      {/* ================================================================== */}
      {/* Hero Section                                                       */}
      {/* ================================================================== */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
            alt="Business"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-background" />
        </div>

        <div className="relative container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm mb-6">
            <Building className="h-4 w-4" />
            Service Corporate
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Solutions pour les{" "}
            <span className="text-gold">Professionnels</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un service de transport premium adapté aux besoins des entreprises
            exigeantes. Facturation simplifiée, priorité de service et accueil
            VIP.
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Grille des Avantages Corporate                                     */}
      {/* ================================================================== */}
      <section className="py-24 bg-card/20">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Pourquoi nous <span className="text-gold">choisir</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Des avantages pensés pour les professionnels et les entreprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CORPORATE_ADVANTAGES.map((advantage) => (
              <div
                key={advantage.title}
                className="rounded-xl border border-border/50 bg-anthracite/50 p-8 flex gap-5 transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
              >
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <advantage.icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Formulaire de Devis Corporate Premium                              */}
      {/* ================================================================== */}
      <section className="py-24">
        <div className="container max-w-3xl">
          <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Send className="h-5 w-5 text-gold" />
                Demander un devis corporate
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Complétez ce formulaire et notre équipe commerciale vous
                recontactera sous 24h pour étudier vos besoins.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* ------------------------------------------------------ */}
                {/* Section 1 : Informations personnelles                   */}
                {/* ------------------------------------------------------ */}
                <fieldset className="space-y-5">
                  <legend className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" />
                    Informations personnelles
                  </legend>

                  {/* Séparateur fin doré */}
                  <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

                  {/* Nom de l'entreprise */}
                  <div className="space-y-2">
                    <Label htmlFor="company">
                      Nom de l'entreprise{" "}
                      <span className="text-muted-foreground font-normal">
                        (optionnel)
                      </span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        id="company"
                        placeholder="Votre société"
                        value={formData.companyName}
                        onChange={(e) =>
                          updateField("companyName", e.target.value)
                        }
                        className="pl-10"
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
                          value={formData.firstName}
                          onChange={(e) =>
                            updateField("firstName", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                        <Input
                          id="lastName"
                          placeholder="Votre nom"
                          value={formData.lastName}
                          onChange={(e) =>
                            updateField("lastName", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Téléphone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="contact@entreprise.com"
                          value={formData.email}
                          onChange={(e) =>
                            updateField("email", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="01 23 45 67 89"
                          value={formData.phone}
                          onChange={(e) =>
                            updateField("phone", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* ------------------------------------------------------ */}
                {/* Section 2 : Détails du trajet                           */}
                {/* ------------------------------------------------------ */}
                <fieldset className="space-y-5">
                  <legend className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4" />
                    Détails du trajet
                  </legend>

                  <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

                  {/* Adresse de départ — avec autocomplétion */}
                  <div className="space-y-2">
                    <Label htmlFor="departure">Adresse de départ *</Label>
                    <AddressInput
                      id="departure"
                      placeholder="Ex : 1 Avenue des Champs-Élysées, Paris"
                      value={formData.departure}
                      onChange={(value) => updateField("departure", value)}
                    />
                  </div>

                  {/* Adresse d'arrivée — avec autocomplétion */}
                  <div className="space-y-2">
                    <Label htmlFor="arrival">Adresse d'arrivée *</Label>
                    <AddressInput
                      id="arrival"
                      placeholder="Ex : Aéroport CDG Terminal 2"
                      value={formData.arrival}
                      onChange={(value) => updateField("arrival", value)}
                    />
                  </div>

                  {/* Date & Heure */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de prise en charge *</Label>
                      <DatePicker
                        date={formData.date}
                        onDateChange={(d) => updateField("date", d)}
                        placeholder="Sélectionner une date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        <Clock className="inline h-3.5 w-3.5 mr-1 text-gold" />
                        Heure *
                      </Label>
                      <Select
                        value={formData.time}
                        onValueChange={(v) => updateField("time", v)}
                      >
                        <SelectTrigger>
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
                    </div>
                  </div>

                  {/* Passagers & Bagages */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        <Users className="inline h-3.5 w-3.5 mr-1 text-gold" />
                        Nombre de passagers
                      </Label>
                      <Select
                        value={formData.passengers}
                        onValueChange={(v) => updateField("passengers", v)}
                      >
                        <SelectTrigger>
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
                    </div>
                    <div className="space-y-2">
                      <Label>
                        <Briefcase className="inline h-3.5 w-3.5 mr-1 text-gold" />
                        Nombre de bagages
                      </Label>
                      <Select
                        value={formData.luggage}
                        onValueChange={(v) => updateField("luggage", v)}
                      >
                        <SelectTrigger>
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
                    </div>
                  </div>
                </fieldset>

                {/* ------------------------------------------------------ */}
                {/* Section 3 : Informations VIP (optionnel)                */}
                {/* ------------------------------------------------------ */}
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
                        value={formData.flightOrTrainNumber}
                        onChange={(e) =>
                          updateField("flightOrTrainNumber", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Nous suivrons votre vol/train en temps réel pour adapter
                      l'heure de prise en charge en cas de retard.
                    </p>
                  </div>
                </fieldset>

                {/* ------------------------------------------------------ */}
                {/* Section 4 : Volume & message complémentaire             */}
                {/* ------------------------------------------------------ */}
                <fieldset className="space-y-5">
                  <legend className="text-sm font-semibold text-gold uppercase tracking-wider flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4" />
                    Informations complémentaires
                  </legend>

                  <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

                  {/* Volume de courses */}
                  <div className="space-y-2">
                    <Label htmlFor="volume">
                      Volume de courses estimé par mois
                    </Label>
                    <Select
                      value={formData.volume}
                      onValueChange={(v) => updateField("volume", v)}
                    >
                      <SelectTrigger id="volume">
                        <SelectValue placeholder="Sélectionnez une estimation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1 à 10 courses</SelectItem>
                        <SelectItem value="11-50">11 à 50 courses</SelectItem>
                        <SelectItem value="50+">Plus de 50 courses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message libre */}
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Besoins spécifiques{" "}
                      <span className="text-muted-foreground font-normal">
                        (optionnel)
                      </span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez vos besoins : événements réguliers, chauffeurs dédiés, zones géographiques spécifiques..."
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      className="min-h-32 resize-none"
                    />
                  </div>
                </fieldset>

                {/* ------------------------------------------------------ */}
                {/* Bouton de soumission avec état de chargement            */}
                {/* ------------------------------------------------------ */}
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
                      Envoyer ma demande de devis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
