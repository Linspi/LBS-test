import { useState, useCallback, useEffect } from "react";
import {
  Users,
  Briefcase,
  Wifi,
  Droplets,
  BatteryCharging,
  Newspaper,
  Armchair,
  Wine,
  Usb,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/* ── Icon map for service badges ── */
const SERVICE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "Wi-Fi à bord": Wifi,
  "Wi-Fi haut débit": Wifi,
  "Eau minérale offerte": Droplets,
  "Chargeurs universels": BatteryCharging,
  "Presse du jour": Newspaper,
  "Champagne à disposition": Wine,
  "Sièges massants": Armchair,
  "Ambiance personnalisée": Sparkles,
  "Espace généreux": Armchair,
  "Prises USB individuelles": Usb,
};

/**
 * Fleet data with enriched service details
 */
const FLEET = [
  {
    name: "Mercedes Classe E",
    label: "Berline Business",
    passengers: 3,
    luggage: 3,
    description:
      "L'élégance pour vos déplacements professionnels. Confort et discrétion assurés dans une berline d'exception.",
    services: [
      "Wi-Fi à bord",
      "Eau minérale offerte",
      "Chargeurs universels",
      "Presse du jour",
    ],
    image: "/images/Classe_E-removebg-preview.png",
  },
  {
    name: "Mercedes Classe S",
    label: "Berline de Luxe",
    passengers: 3,
    luggage: 3,
    description:
      "Le summum du raffinement. Une expérience de voyage incomparable pour vos occasions les plus prestigieuses.",
    services: [
      "Wi-Fi haut débit",
      "Champagne à disposition",
      "Sièges massants",
      "Ambiance personnalisée",
    ],
    image: "/images/classe_S.png",
  },
  {
    name: "Mercedes Classe V",
    label: "Van haut de gamme",
    passengers: 7,
    luggage: 6,
    description:
      "L'espace et le confort pour vos groupes. Idéal pour les transferts en famille ou les événements d'entreprise.",
    services: [
      "Wi-Fi à bord",
      "Espace généreux",
      "Eau minérale offerte",
      "Prises USB individuelles",
    ],
    image: "/images/Classe_V.png",
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
    <section className="py-28 overflow-hidden relative">
      {/* Background spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
            Showroom
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Notre{" "}
            <span className="text-gradient-gold">flotte</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Des véhicules premium entretenus avec soin pour un confort absolu à
            chaque trajet.
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-6xl mx-auto relative">
          <Carousel
            opts={{ align: "center", loop: true }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {FLEET.map((vehicle) => (
                <CarouselItem key={vehicle.name} className="basis-full">
                  {/* Showroom layout: 2 columns on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center py-4 px-4 sm:px-8">
                    {/* Left column (60%): Vehicle image with spotlight */}
                    <div className="md:col-span-3 relative flex items-center justify-center">
                      {/* Apple-style spotlight from above — softened */}
                      <div
                        className="absolute inset-0 blur-3xl"
                        style={{
                          background:
                            "radial-gradient(ellipse 55% 40% at 50% 12%, rgba(212,170,64,0.08) 0%, rgba(212,170,64,0.03) 35%, transparent 65%)",
                        }}
                      />
                      {/* Bottom reflection */}
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px]"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent)",
                        }}
                      />

                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="relative w-full aspect-[16/9] object-contain drop-shadow-[0_20px_50px_rgba(212,170,64,0.18)]"
                      />

                      {/* Ground shadow beneath the vehicle */}
                      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 h-4 w-3/4 bg-black blur-xl opacity-60 rounded-[100%]" />
                    </div>

                    {/* Right column (40%): Info */}
                    <div className="md:col-span-2 space-y-6">
                      {/* Badge */}
                      <span className="inline-block px-4 py-1.5 rounded-full glass text-gold text-xs font-semibold uppercase tracking-wider">
                        {vehicle.label}
                      </span>

                      {/* Name */}
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                        {vehicle.name}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {vehicle.description}
                      </p>

                      {/* Specs */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl glass flex items-center justify-center">
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
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl glass flex items-center justify-center">
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

                      {/* Separator */}
                      <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

                      {/* Service Badges (instead of bullet list) */}
                      <div className="flex flex-wrap gap-2">
                        {vehicle.services.map((service) => {
                          const IconComp =
                            SERVICE_ICON_MAP[service] || Sparkles;
                          return (
                            <div
                              key={service}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all duration-300"
                            >
                              <IconComp className="h-3 w-3 text-gold/70" />
                              {service}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Glassmorphism navigation buttons */}
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 h-12 w-12 rounded-full glass flex items-center justify-center text-gold hover:bg-white/[0.08] transition-all duration-300 z-10 hidden md:flex"
              aria-label="Véhicule précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 h-12 w-12 rounded-full glass flex items-center justify-center text-gold hover:bg-white/[0.08] transition-all duration-300 z-10 hidden md:flex"
              aria-label="Véhicule suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </Carousel>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Aller au véhicule ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  current === index
                    ? "w-8 h-2.5 bg-gradient-to-r from-gold to-gold-champagne"
                    : "w-2.5 h-2.5 bg-white/15 hover:bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
