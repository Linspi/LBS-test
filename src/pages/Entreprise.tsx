import { useState } from "react";
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

export function Entreprise() {
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    volume: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Remplacer par un appel API réel
    alert(
      `Demande de convention envoyée !\n\nEntreprise : ${formData.companyName}\nContact : ${formData.firstName} ${formData.lastName}\nEmail : ${formData.email}\nVolume : ${formData.volume || "Non spécifié"}`
    );
  };

  const isFormValid =
    formData.companyName &&
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone;

  return (
    <>
      {/* Hero Section */}
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
            Solutions pour les <span className="text-gold">Professionnels</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un service de transport premium adapté aux besoins des entreprises
            exigeantes. Facturation simplifiée, priorité de service et accueil
            VIP.
          </p>
        </div>
      </section>

      {/* Grille des Avantages Corporate */}
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

      {/* Formulaire de Contact Commercial */}
      <section className="py-24">
        <div className="container max-w-3xl">
          <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Send className="h-5 w-5 text-gold" />
                Demander une convention corporate
              </CardTitle>
              <CardDescription>
                Complétez ce formulaire et notre équipe commerciale vous
                recontactera sous 24h pour étudier vos besoins.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom de l'entreprise */}
                <div className="space-y-2">
                  <Label htmlFor="company">Nom de l'entreprise *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                    <Input
                      id="company"
                      placeholder="Votre société"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Nom & Prénom */}
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
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
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
                          setFormData({ ...formData, email: e.target.value })
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
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Volume de courses */}
                <div className="space-y-2">
                  <Label htmlFor="volume">
                    Volume de courses estimé par mois
                  </Label>
                  <Select
                    value={formData.volume}
                    onValueChange={(value) =>
                      setFormData({ ...formData, volume: value })
                    }
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

                {/* Message */}
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
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="min-h-32 resize-none"
                  />
                </div>

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid}
                  className="w-full text-base"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Demander une convention corporate
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
