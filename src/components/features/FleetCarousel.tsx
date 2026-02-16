import { useState, useCallback, useEffect } from "react";
import { Users, Briefcase, Wifi, Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/**
 * Données de la flotte — enrichies avec descriptions marketing
 * et services détaillés pour le layout showroom.
 */
const FLEET = [
  {
    name: "Mercedes Classe E",
    label: "Berline Business",
    passengers: 3,
    luggage: 3,
    description:
      "L'élégance pour vos déplacements professionnels. Confort et discrétion assurés dans une berline d'exception.",
    services: ["Wi-Fi à bord", "Eau minérale offerte", "Chargeurs universels", "Presse du jour"],
    image:
      "/images/Classe_E-removebg-preview.png",
  },
  {
    name: "Mercedes Classe S",
    label: "Berline de Luxe",
    passengers: 3,
    luggage: 3,
    description:
      "Le summum du raffinement. Une expérience de voyage incomparable pour vos occasions les plus prestigieuses.",
    services: ["Wi-Fi haut débit", "Champagne à disposition", "Sièges massants", "Ambiance personnalisée"],
    image:
      "/images/classe_S.png",
  },
  {
    name: "Mercedes Classe V",
    label: "Van haut de gamme",
    passengers: 7,
    luggage: 6,
    description:
      "L'espace et le confort pour vos groupes. Idéal pour les transferts en famille ou les événements d'entreprise.",
    services: ["Wi-Fi à bord", "Espace généreux", "Eau minérale offerte", "Prises USB individuelles"],
    image:
      "/images/Classe_V.png",
  },
];

export function FleetCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="py-24 overflow-hidden">
      <div className="container">
        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium uppercase tracking-widest mb-3">
            Showroom
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Notre <span className="text-gold">flotte</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Des véhicules premium entretenus avec soin pour un confort absolu à
            chaque trajet.
          </p>
        </div>

        {/* Carrousel — 1 slide à la fois */}
        <div className="max-w-6xl mx-auto px-14">
          <Carousel
            opts={{ align: "center", loop: true }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {FLEET.map((vehicle) => (
                <CarouselItem key={vehicle.name} className="basis-full">
                  {/* Layout showroom : 2 colonnes desktop, empilé mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center py-4">
                    {/* Colonne gauche (3/5 ≈ 60%) : Image avec halo */}
                    <div className="md:col-span-3 relative flex items-center justify-center">
                      {/* Halo lumineux derrière le véhicule */}
                      <div
                        className="absolute inset-0 opacity-60"
                        style={{
                          background:
                            "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(200,168,78,0.08) 0%, rgba(45,45,45,0.15) 40%, transparent 70%)",
                        }}
                      />

                      {/* Image du véhicule */}
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="relative w-full aspect-[16/9] object-contain drop-shadow-[0_20px_40px_rgba(200,168,78,0.12)]"
                      />
                    </div>

                    {/* Colonne droite (2/5 ≈ 40%) : Infos */}
                    <div className="md:col-span-2 space-y-6">
                      {/* Badge label */}
                      <span className="inline-block px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-semibold uppercase tracking-wider">
                        {vehicle.label}
                      </span>

                      {/* Titre */}
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                        {vehicle.name}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {vehicle.description}
                      </p>

                      {/* Specs : passagers & bagages */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gold" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {vehicle.passengers}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Passagers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-gold" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {vehicle.luggage}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Valises
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Séparateur */}
                      <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

                      {/* Services à bord */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Wifi className="h-4 w-4 text-gold" />
                          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                            Services à bord
                          </p>
                        </div>
                        <ul className="space-y-1.5">
                          {vehicle.services.map((service) => (
                            <li
                              key={service}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="h-3.5 w-3.5 text-gold/70 flex-shrink-0" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Flèches de navigation */}
            <CarouselPrevious className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold size-10" />
            <CarouselNext className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold size-10" />
          </Carousel>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Aller au véhicule ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  current === index
                    ? "w-8 h-2.5 bg-gold"
                    : "w-2.5 h-2.5 bg-gold/25 hover:bg-gold/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
