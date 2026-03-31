import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

/* ── Icon map for service badges (keyed by i18n service key) ── */
const SERVICE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  wifiOnboard: Wifi,
  wifiHighSpeed: Wifi,
  water: Droplets,
  chargers: BatteryCharging,
  press: Newspaper,
  champagne: Wine,
  massageSeats: Armchair,
  ambiance: Sparkles,
  spacious: Armchair,
  usbPorts: Usb,
};

/**
 * Fleet data — seules les données non-textuelles restent ici.
 * Les textes (name, label, description, services) sont dans les
 * dictionnaires i18n sous `fleet.vehicles.<id>.*` et `fleet.services.*`.
 */
const FLEET = [
  {
    id: "classe-e",
    passengers: 3,
    luggage: 3,
    serviceKeys: ["wifiOnboard", "water", "chargers", "press"],
    image: "/images/Classe_E-removebg-preview.png",
  },
  {
    id: "classe-s",
    passengers: 3,
    luggage: 3,
    serviceKeys: ["wifiHighSpeed", "champagne", "massageSeats", "ambiance"],
    image: "/images/classe_S.png",
  },
  {
    id: "classe-v",
    passengers: 7,
    luggage: 6,
    serviceKeys: ["wifiOnboard", "spacious", "water", "usbPorts"],
    image: "/images/Classe_V.png",
  },
];

export function FleetCarousel() {
  const { t } = useTranslation();
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
    <section className="py-12 md:py-20 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
            {t("fleet.label")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            {t("fleet.title")}{" "}
            <span className="text-gradient-gold">{t("fleet.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("fleet.subtitle")}
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
                <CarouselItem key={vehicle.id} className="basis-full">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center py-4 px-4 sm:px-8">
                    {/* Left column (60%): Vehicle image with spotlight */}
                    <div className="md:col-span-3 relative flex items-center justify-center">
                      <div
                        className="absolute inset-0 blur-3xl"
                        style={{
                          background:
                            "radial-gradient(ellipse 55% 40% at 50% 12%, rgba(212,170,64,0.08) 0%, rgba(212,170,64,0.03) 35%, transparent 65%)",
                        }}
                      />
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px]"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent)",
                        }}
                      />
                      <img
                        src={vehicle.image}
                        alt={t(`fleet.vehicles.${vehicle.id}.name`)}
                        className="relative w-full aspect-[16/9] object-contain drop-shadow-[0_20px_50px_rgba(212,170,64,0.18)]"
                        loading="lazy"
                      />
                      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 h-4 w-3/4 bg-black blur-xl opacity-60 rounded-[100%]" />
                    </div>

                    {/* Right column (40%): Info */}
                    <div className="md:col-span-2 space-y-6">
                      <span className="inline-block px-4 py-1.5 rounded-full glass text-gold text-xs font-semibold uppercase tracking-wider">
                        {t(`fleet.vehicles.${vehicle.id}.label`)}
                      </span>
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                        {t(`fleet.vehicles.${vehicle.id}.name`)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(`fleet.vehicles.${vehicle.id}.description`)}
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
                              {t("fleet.passengers")}
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
                              {t("fleet.suitcases")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

                      {/* Service Badges */}
                      <div className="flex flex-wrap gap-2">
                        {vehicle.serviceKeys.map((serviceKey) => {
                          const IconComp = SERVICE_ICON_MAP[serviceKey] || Sparkles;
                          return (
                            <div
                              key={serviceKey}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all duration-300"
                            >
                              <IconComp className="h-3 w-3 text-gold/70" />
                              {t(`fleet.services.${serviceKey}`)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 h-12 w-12 rounded-full glass flex items-center justify-center text-gold hover:bg-white/[0.08] transition-all duration-300 z-10 hidden md:flex"
              aria-label={t("fleet.prevAriaLabel")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 h-12 w-12 rounded-full glass flex items-center justify-center text-gold hover:bg-white/[0.08] transition-all duration-300 z-10 hidden md:flex"
              aria-label={t("fleet.nextAriaLabel")}
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
                aria-label={t("fleet.goToVehicle", { index: index + 1 })}
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
