import {
  FileText,
  UserCheck,
  Clock,
  CalendarCheck,
  Building,
} from "lucide-react";
import { QuoteForm } from "@/components/features/QuoteForm";

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
// Composant principal — Page Entreprise
// ---------------------------------------------------------------------------

export function Entreprise() {
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
      {/* Formulaire de Devis Corporate — composant réutilisable             */}
      {/* ================================================================== */}
      <section className="py-24">
        <div className="container max-w-3xl">
          <QuoteForm serviceType="corporate" />
        </div>
      </section>
    </>
  );
}
