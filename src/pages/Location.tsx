import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Users, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";

/**
 * Catalogue des véhicules disponibles à la location.
 * Les textes traduits (subtitle, description) sont dans les dictionnaires i18n
 * sous la clé rental.vehicles.<id>.
 */
const RENTAL_VEHICLES = [
  { id: "classe-e", name: "Mercedes Classe E", passengers: 3, luggage: 3, image: "/images/classe_e_loc.jpg" },
  { id: "classe-s", name: "Mercedes Classe S", passengers: 3, luggage: 3, image: "/images/classe_s_loc.jpg" },
  { id: "classe-v", name: "Mercedes Classe V", passengers: 7, luggage: 6, image: "/images/classe_v_loc.jpg" },
  { id: "range-rover", name: "Range Rover Vogue", passengers: 4, luggage: 4, image: "/images/range_rover_loc.jpg" },
  { id: "classe-g", name: "Mercedes Classe G", passengers: 4, luggage: 3, image: "/images/classe_g_loc.jpg" },
  { id: "rolls-royce", name: "Rolls Royce Phantom", passengers: 3, luggage: 3, image: "/images/rolls_phantom_loc.jpg" },
  { id: "lamborghini-urus", name: "Lamborghini Urus", passengers: 4, luggage: 2, image: "/images/urus_loc.jpg" },
  { id: "rr-cullinan", name: "Rolls Royce Cullinan", passengers: 4, luggage: 4, image: "/images/rolls_cullingam_loc.jpg" },
];

export function Location() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-[0.2em]">{t("rental.badge")}</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              <span className="text-gradient-gold">{t("rental.titleHighlight")}</span> {t("rental.titleSuffix")}
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("rental.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Grille véhicules */}
      <section className="pb-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RENTAL_VEHICLES.map((vehicle, i) => (
              <FadeUp key={vehicle.id} delay={i * 0.05}>
                <VehicleRentalCard vehicle={vehicle} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** Carte véhicule de location */
function VehicleRentalCard({
  vehicle,
}: {
  vehicle: (typeof RENTAL_VEHICLES)[number];
}) {
  const { t } = useTranslation();

  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-gold/[0.15] transition-colors duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-gold to-gold-light text-xs font-semibold text-background uppercase tracking-wider">
          {t(`rental.vehicles.${vehicle.id}.subtitle`)}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-gold transition-colors tracking-tight">
          {vehicle.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
          {t(`rental.vehicles.${vehicle.id}.description`)}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-5 mb-5">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold" />
            <span className="text-sm text-foreground">
              {t("rental.passengers", { count: vehicle.passengers })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gold" />
            <span className="text-sm text-foreground">
              {t("rental.suitcases", { count: vehicle.luggage })}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Button asChild variant="gold" size="sm" className="w-full">
          <Link to="/reservation-experience?experience=sur-mesure">
            {t("rental.requestQuote")}
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
