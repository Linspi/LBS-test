import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PartyPopper, Users, GlassWater, Calendar, ArrowRight } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { getExperiencesByCategory } from "@/data/experiences";
import type { Experience } from "@/types";

const FEATURES = [
  { icon: PartyPopper, titleKey: "events.features.galas.title", descriptionKey: "events.features.galas.description" },
  { icon: Users, titleKey: "events.features.corporate.title", descriptionKey: "events.features.corporate.description" },
  { icon: GlassWater, titleKey: "events.features.weddings.title", descriptionKey: "events.features.weddings.description" },
  { icon: Calendar, titleKey: "events.features.bespoke.title", descriptionKey: "events.features.bespoke.description" },
];

const evenements = getExperiencesByCategory("evenement");

export function Evenements() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("seo.events.title")}
        description={t("seo.events.description")}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"
            alt={t("events.heroAlt")}
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
              <span className="text-xs uppercase tracking-[0.2em]">{t("events.badge")}</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              <span className="text-gradient-gold">{t("events.titleHighlight")}</span>
              <span className="font-light italic"> {t("events.titleSuffix")}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("events.subtitle")}
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

          {/* Grille des événements */}
          <FadeUp>
            <div className="mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3 text-center">
                {t("events.prestationsLabel")}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-8 text-center tracking-tight">
                {t("events.prestationsTitle")} <span className="text-gradient-gold">{t("events.prestationsTitleHighlight")}</span>
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
                  {t("events.ctaButton")}
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
  const { t } = useTranslation();
  const key = `experienceData.${event.id}`;

  return (
    <Link
      to={`/reservation-experience?experience=${event.id}`}
      className="group relative flex overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-gold/[0.15] transition-colors duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-1/3 min-h-[140px] overflow-hidden flex-shrink-0">
        <img
          src={event.image}
          alt={t(`${key}.title`)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Contenu */}
      <div className="flex flex-col justify-center p-4 space-y-1.5">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors tracking-tight">
          {t(`${key}.title`)}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {t(`${key}.description`)}
        </p>
        <span className="inline-flex items-center gap-1 text-xs text-gold font-medium pt-1">
          {t("events.requestQuote")}
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
