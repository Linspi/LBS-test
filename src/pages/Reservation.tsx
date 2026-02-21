import { useSearchParams } from "react-router-dom";
import { QuoteForm } from "@/components/features/QuoteForm";
import { FadeUp } from "@/components/ui/FadeUp";
import type { ServiceType } from "@/components/features/QuoteForm";

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

  const rawType = searchParams.get("type");
  const serviceType: ServiceType = TYPE_MAP[rawType ?? ""] ?? "transfer";
  const departure = searchParams.get("departure") ?? undefined;
  const destination = searchParams.get("destination") ?? undefined;

  const hero = HERO_CONFIG[serviceType];

  return (
    <section className="pt-28 pb-24">
      <div className="container">
        {/* Hero dynamique selon le mode */}
        <FadeUp>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <span className="text-xs uppercase tracking-[0.2em]">Réservation</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
              {hero.title} <span className="text-gradient-gold">{hero.highlight}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {hero.description}
            </p>
          </div>
        </FadeUp>

        {/* Formulaire de devis réutilisable */}
        <div className="max-w-3xl mx-auto">
          <FadeUp delay={0.1}>
            <QuoteForm serviceType={serviceType} defaultDeparture={departure} defaultDestination={destination} />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
