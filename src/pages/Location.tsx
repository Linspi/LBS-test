import { Link } from "react-router-dom";
import { Users, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Catalogue des véhicules disponibles à la location.
 * Images Unsplash haute qualité pour chaque modèle.
 */
const RENTAL_VEHICLES = [
  {
    id: "classe-e",
    name: "Mercedes Classe E",
    subtitle: "Berline Business",
    passengers: 3,
    luggage: 3,
    description:
      "L'élégance discrète pour vos déplacements d'affaires et vos sorties en ville.",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
  },
  {
    id: "classe-s",
    name: "Mercedes Classe S",
    subtitle: "Berline de Luxe",
    passengers: 3,
    luggage: 3,
    description:
      "Le summum du raffinement automobile. Technologie de pointe et confort absolu.",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
  },
  {
    id: "classe-v",
    name: "Mercedes Classe V",
    subtitle: "Van Premium",
    passengers: 7,
    luggage: 6,
    description:
      "Espace généreux et modularité parfaite pour vos groupes et familles.",
    image:
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80",
  },
  {
    id: "range-rover",
    name: "Range Rover Vogue",
    subtitle: "SUV Prestige",
    passengers: 4,
    luggage: 4,
    description:
      "Puissance et prestance britannique. Le SUV de luxe par excellence pour toutes les occasions.",
    image:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
  },
  {
    id: "classe-g",
    name: "Mercedes Classe G",
    subtitle: "SUV Iconique",
    passengers: 4,
    luggage: 3,
    description:
      "L'icône intemporelle de Mercedes-Benz. Un caractère affirmé, un style incomparable.",
    image:
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80",
  },
  {
    id: "rolls-royce",
    name: "Rolls Royce",
    subtitle: "Ultra-Luxe",
    passengers: 3,
    luggage: 3,
    description:
      "Le nec plus ultra de l'automobile. Réservé aux moments les plus exceptionnels de votre vie.",
    image:
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
  },
];

export function Location() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Nouveau service
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            <span className="text-gold">Location</span> de véhicules premium
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des véhicules d'exception avec chauffeur, disponibles à la location
            pour sublimer chacun de vos déplacements.
          </p>
        </div>
      </section>

      {/* Grille véhicules */}
      <section className="pb-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RENTAL_VEHICLES.map((vehicle) => (
              <VehicleRentalCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** Carte véhicule de location — image, infos, bouton devis */
function VehicleRentalCard({
  vehicle,
}: {
  vehicle: (typeof RENTAL_VEHICLES)[number];
}) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card/60 overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gold/90 text-xs font-semibold text-black uppercase tracking-wider">
          {vehicle.subtitle}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        {/* Titre */}
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-gold transition-colors">
          {vehicle.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
          {vehicle.description}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-5 mb-5">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold" />
            <span className="text-sm text-foreground">
              {vehicle.passengers} passagers
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gold" />
            <span className="text-sm text-foreground">
              {vehicle.luggage} valises
            </span>
          </div>
        </div>

        {/* CTA */}
        <Button asChild size="sm" className="w-full">
          <Link
            to={`/reservation-experience?experience=sur-mesure`}
          >
            Demander un devis
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
