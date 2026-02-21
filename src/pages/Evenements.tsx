import { Link } from "react-router-dom";
import { PartyPopper, Users, GlassWater, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { getExperiencesByCategory } from "@/data/experiences";
import type { Experience } from "@/types";

const FEATURES = [
  {
    icon: PartyPopper,
    title: "Galas & soirées",
    description:
      "Arrivez avec élégance à vos événements les plus prestigieux. Service de navette aller-retour.",
  },
  {
    icon: Users,
    title: "Événements d'entreprise",
    description:
      "Gestion de flotte pour vos séminaires, team buildings et conférences.",
  },
  {
    icon: GlassWater,
    title: "Mariages",
    description:
      "Un service irréprochable pour le plus beau jour de votre vie. Véhicules décorés sur demande.",
  },
  {
    icon: Calendar,
    title: "Sur mesure",
    description:
      "Chaque événement est unique. Contactez-nous pour un devis personnalisé adapté à vos besoins.",
  },
];

const evenements = getExperiencesByCategory("evenement");

export function Evenements() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"
            alt="Événement"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="relative container text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <span className="text-xs uppercase tracking-[0.2em]">Occasions Spéciales</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              <span className="text-gradient-gold">Événements</span>
              <span className="font-light italic"> & occasions spéciales</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un service de transport d'exception pour vos soirées, galas,
              mariages et événements d'entreprise.
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

          {/* Grille des événements */}
          <FadeUp>
            <div className="mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3 text-center">
                Nos prestations
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-8 text-center tracking-tight">
                Nos prestations <span className="text-gradient-gold">événementielles</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {evenements.map((evt, i) => (
                  <FadeUp key={evt.id} delay={i * 0.07}>
                    <EventCard event={evt} />
                  </FadeUp>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* CTA */}
          <FadeUp>
            <div className="text-center">
              <Button asChild variant="gold" size="lg">
                <Link to="/reservation-experience">
                  Demander un devis événement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

/** Carte événement cliquable */
function EventCard({ event }: { event: Experience }) {
  return (
    <Link
      to={`/reservation-experience?experience=${event.id}`}
      className="group relative flex overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-gold/[0.15] transition-colors duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-1/3 min-h-[140px] overflow-hidden flex-shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Contenu */}
      <div className="flex flex-col justify-center p-4 space-y-1.5">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors tracking-tight">
          {event.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        <span className="inline-flex items-center gap-1 text-xs text-gold font-medium pt-1">
          Demander un devis
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
