import { Link } from "react-router-dom";
import { Clock, Shield, UserCheck, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Clock,
    title: "Flexibilité totale",
    description:
      "Votre chauffeur reste à votre disposition pendant toute la durée souhaitée, sans contrainte d'itinéraire.",
  },
  {
    icon: Shield,
    title: "Discrétion assurée",
    description:
      "Nos chauffeurs sont formés aux exigences de confidentialité les plus strictes.",
  },
  {
    icon: UserCheck,
    title: "Chauffeur dédié",
    description:
      "Un seul interlocuteur pour toute la durée de votre mise à disposition.",
  },
  {
    icon: Route,
    title: "Multi-arrêts",
    description:
      "Rendez-vous d'affaires, shopping, visites — organisez votre journée comme vous l'entendez.",
  },
];

export function MiseADisposition() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1600&q=80"
            alt="Chauffeur privé"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="relative container text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Mise à <span className="text-gold">disposition</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un chauffeur privé à votre service, pour la durée de votre choix.
            L'élégance et la liberté d'un transport sur-mesure.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card/30">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tarifs indicatifs */}
          <div className="rounded-xl border border-gold/20 bg-card p-8 text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Tarifs indicatifs
            </h2>
            <p className="text-muted-foreground mb-6">
              À partir de 3 heures minimum
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { vehicle: "Classe E", price: "55 €/h" },
                { vehicle: "Classe S", price: "95 €/h" },
                { vehicle: "Classe V", price: "75 €/h" },
              ].map((rate) => (
                <div key={rate.vehicle} className="p-4 rounded-lg bg-secondary">
                  <div className="text-sm text-muted-foreground">
                    {rate.vehicle}
                  </div>
                  <div className="text-xl font-bold text-gold mt-1">
                    {rate.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/reservation?type=mise-a-disposition">
                Réserver une mise à disposition
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
