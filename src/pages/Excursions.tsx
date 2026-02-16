import { Link } from "react-router-dom";
import { MapPin, Camera, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExperiencesByCategory } from "@/data/experiences";
import type { Experience } from "@/types";

const FEATURES = [
  {
    icon: MapPin,
    title: "Itinéraires sur mesure",
    description:
      "Créez votre parcours idéal à travers les plus beaux sites d'Île-de-France.",
  },
  {
    icon: Camera,
    title: "Arrêts photos",
    description:
      "Votre chauffeur connaît les meilleurs points de vue pour immortaliser votre journée.",
  },
  {
    icon: Clock,
    title: "Journée complète",
    description:
      "Profitez de votre excursion sans vous soucier du temps. Nos forfaits sont à la journée.",
  },
  {
    icon: Star,
    title: "Expérience premium",
    description:
      "Eau, chargeurs et Wi-Fi à bord. Votre confort est notre priorité.",
  },
];

const excursions = getExperiencesByCategory("excursion");

export function Excursions() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80"
            alt="Excursion en Île-de-France"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="relative container text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            <span className="text-gold">Excursions</span> en Île-de-France
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les trésors de la région parisienne avec un chauffeur
            privé. Châteaux, villages de charme et sites historiques à portée de
            main.
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

          {/* Grille des excursions (cliquables) */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Nos excursions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {excursions.map((excursion) => (
                <ExcursionCard key={excursion.id} excursion={excursion} />
              ))}
            </div>
          </div>

          {/* CTA principal */}
          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/reservation-experience">
                Planifier une excursion
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/** Carte d'excursion cliquable avec image, titre et prix */
function ExcursionCard({ excursion }: { excursion: Experience }) {
  return (
    <Link
      to={`/reservation-experience?experience=${excursion.id}`}
      className="group relative block overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={excursion.image}
          alt={excursion.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
          {excursion.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {excursion.subtitle}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-gold" />
            {excursion.duration}
          </div>
          {excursion.estimatedPrice !== null && (
            <span className="text-sm font-semibold text-gold">
              Dès {excursion.estimatedPrice}€
            </span>
          )}
        </div>
      </div>

      {/* Bordure dorée au hover */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gold/20 transition-colors pointer-events-none" />
    </Link>
  );
}
