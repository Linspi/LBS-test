import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Camera, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { getExperiencesByCategory } from "@/data/experiences";
import type { Experience } from "@/types";

const FEATURES = [
  { icon: MapPin, titleKey: "excursions.features.itineraries.title", descriptionKey: "excursions.features.itineraries.description" },
  { icon: Camera, titleKey: "excursions.features.photos.title", descriptionKey: "excursions.features.photos.description" },
  { icon: Clock, titleKey: "excursions.features.fullDay.title", descriptionKey: "excursions.features.fullDay.description" },
  { icon: Star, titleKey: "excursions.features.premium.title", descriptionKey: "excursions.features.premium.description" },
];

const excursions = getExperiencesByCategory("excursion");

export function Excursions() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80"
            alt={t("excursions.heroAlt")}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="relative container text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <span className="text-xs uppercase tracking-[0.2em]">{t("excursions.badge")}</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              <span className="text-gradient-gold">{t("excursions.titleHighlight")}</span> {t("excursions.titleSuffix")}
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("excursions.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
            {FEATURES.map((feature, i) => (
              <FadeUp key={feature.titleKey} delay={i * 0.07}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gold/[0.08] flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 tracking-tight">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(feature.descriptionKey)}
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

          {/* Grille des excursions */}
          <FadeUp>
            <div className="mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3 text-center">
                {t("excursions.destinationsLabel")}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-8 text-center tracking-tight">
                {t("excursions.destinationsTitle")} <span className="text-gradient-gold">{t("excursions.destinationsTitleHighlight")}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {excursions.map((excursion, i) => (
                  <FadeUp key={excursion.id} delay={i * 0.06}>
                    <ExcursionCard excursion={excursion} />
                  </FadeUp>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* CTA principal */}
          <FadeUp>
            <div className="text-center">
              <Button asChild variant="gold" size="lg">
                <Link to="/reservation-experience">
                  {t("excursions.ctaButton")}
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

/** Carte d'excursion cliquable avec image, titre et prix */
function ExcursionCard({ excursion }: { excursion: Experience }) {
  const { t } = useTranslation();
  const key = `experienceData.${excursion.id}`;

  return (
    <Link
      to={`/reservation-experience?experience=${excursion.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-gold/[0.15] transition-colors duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={excursion.image}
          alt={t(`${key}.title`)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors tracking-tight">
          {t(`${key}.title`)}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {t(`${key}.subtitle`)}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-gold" />
            {t(`${key}.duration`)}
          </div>
          <span className="text-xs font-medium text-gold">
            {t("excursions.contactUs")}
          </span>
        </div>
      </div>
    </Link>
  );
}
