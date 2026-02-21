import { Link } from "react-router-dom";
import { Clock, Shield, UserCheck, Route, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";

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
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <span className="text-xs uppercase tracking-[0.2em]">Service Personnalisé</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Mise à <span className="text-gradient-gold">disposition</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un chauffeur privé à votre service, pour la durée de votre choix.
              L'élégance et la liberté d'un transport sur-mesure.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
            {FEATURES.map((feature, i) => (
              <FadeUp key={feature.title} delay={i * 0.07}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gold/[0.08] flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Ornement Art Déco */}
          <div className="art-deco-divider">
            <div className="art-deco-diamond" />
          </div>

          {/* Tarifs indicatifs */}
          <FadeUp>
            <div className="rounded-2xl border border-gold/[0.12] bg-white/[0.02] p-8 text-center mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                Nos formules
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2 tracking-tight">
                Tarifs <span className="text-gradient-gold">indicatifs</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                À partir de 3 heures minimum
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { vehicle: "Classe E", price: "60 €/h" },
                  { vehicle: "Classe V", price: "75 €/h" },
                  { vehicle: "Classe S", price: "95 €/h" },
                ].map((rate) => (
                  <div key={rate.vehicle} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-gold/[0.15] transition-colors duration-300 flex flex-col items-center">
                    <div className="text-sm text-muted-foreground">
                      {rate.vehicle}
                    </div>
                    <div className="font-display text-2xl font-semibold text-gradient-gold mt-1 mb-3">
                      {rate.price}
                    </div>
                    <Link
                      to="/reservation?type=mise-a-disposition"
                      className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-gold transition-colors cursor-pointer"
                    >
                      Réserver
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Véhicules d'exception */}
              <div className="mt-8 p-6 rounded-xl border border-gold/[0.1] bg-gold/[0.03] text-center">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  Véhicules d'exception
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Range Rover · Maybach · Rolls Royce
                </p>
                <span className="text-sm font-semibold text-gradient-gold block mb-3">
                  Sur devis uniquement
                </span>
                <Link
                  to="/reservation?type=mise-a-disposition"
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-gold transition-colors cursor-pointer"
                >
                  Demander un devis
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="container text-center">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Réserver une <span className="text-gradient-gold">mise à disposition</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Renseignez vos informations pour recevoir un devis personnalisé
              pour votre chauffeur privé.
            </p>
            <Button asChild variant="gold" size="lg" className="text-base">
              <Link to="/reservation?type=mise-a-disposition">
                Demander un devis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
