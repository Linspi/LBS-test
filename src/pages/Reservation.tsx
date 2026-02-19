import { useSearchParams } from "react-router-dom";
import { QuoteForm } from "@/components/features/QuoteForm";
import type { ServiceType } from "@/components/features/QuoteForm";

/**
 * Page de réservation principale.
 *
 * Mappe le paramètre URL `?type=` vers le serviceType du QuoteForm :
 * - `?type=trajet`              → serviceType = "transfer"
 * - `?type=mise-a-disposition`  → serviceType = "location"
 * - Pas de param / inconnu      → serviceType = "transfer" (défaut)
 */

/** Mapping URL param → serviceType QuoteForm */
const TYPE_MAP: Record<string, ServiceType> = {
  trajet: "transfer",
  "mise-a-disposition": "location",
};

/** Titres et descriptions du Hero selon le mode */
const HERO_CONFIG: Record<ServiceType, { title: string; highlight: string; description: string }> = {
  transfer: {
    title: "Réservez votre",
    highlight: "transfert",
    description:
      "Obtenez une estimation instantanée et réservez votre véhicule en quelques clics. Forfaits aéroport CDG et Orly disponibles.",
  },
  location: {
    title: "Réservez votre",
    highlight: "mise à disposition",
    description:
      "Véhicule avec chauffeur à votre disposition pour la durée souhaitée. Liberté totale, service sur-mesure.",
  },
  corporate: {
    title: "Demandez votre",
    highlight: "devis corporate",
    description:
      "Un service dédié aux entreprises. Complétez le formulaire et notre équipe commerciale vous recontactera sous 24h.",
  },
};

export function Reservation() {
  const [searchParams] = useSearchParams();

  // Récupération du type depuis l'URL, fallback sur "transfer"
  const rawType = searchParams.get("type");
  const serviceType: ServiceType = TYPE_MAP[rawType ?? ""] ?? "transfer";

  // Récupération de la destination pour pré-remplir le champ arrivée
  const destination = searchParams.get("destination") ?? undefined;

  const hero = HERO_CONFIG[serviceType];

  return (
    <section className="pt-28 pb-24">
      <div className="container">
        {/* Hero dynamique selon le mode */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {hero.title} <span className="text-gold">{hero.highlight}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {hero.description}
          </p>
        </div>

        {/* Formulaire de devis réutilisable */}
        <div className="max-w-3xl mx-auto">
          <QuoteForm serviceType={serviceType} defaultDestination={destination} />
        </div>
      </div>
    </section>
  );
}
