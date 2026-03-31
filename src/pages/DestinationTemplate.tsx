import { useParams, Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plane,
  UserCheck,
  Shield,
  Clock,
  MapPin,
  Home,
  Users,
  Baby,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { QuoteForm } from "@/components/features/QuoteForm";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/button";
import { getDestinationBySlug } from "@/data/destinations";
import { formatPrice } from "@/lib/pricing";
import type { VehicleClass } from "@/types";

/* ── Icônes par destination (4 features chacune) ── */

const DESTINATION_ICONS: Record<string, LucideIcon[]> = {
  cdg: [Plane, UserCheck, Shield, Clock],
  orly: [Plane, MapPin, Shield, Home],
  disneyland: [Users, Baby, Plane, Shield],
};

const DEFAULT_ICONS: LucideIcon[] = [Shield, Clock, UserCheck, MapPin];

/* ── Classes véhicules avec clés i18n existantes ── */

const VEHICLE_CLASSES: VehicleClass[] = ["classe-e", "classe-s", "classe-v"];

export function DestinationTemplate() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const destination = slug ? getDestinationBySlug(slug) : undefined;

  if (!destination) {
    return <Navigate to="/trajets" replace />;
  }

  const { id } = destination;
  const icons = DESTINATION_ICONS[id] ?? DEFAULT_ICONS;

  /* Image hero en haute résolution (upgrade du paramètre Unsplash) */
  const heroImage = destination.image.replace("w=800", "w=1920");

  return (
    <>
      <SEO
        title={t(`destinations.${id}.seoTitle`)}
        description={t(`destinations.${id}.seoDescription`)}
      />

      {/* ═══════════════════════════════════════════
          HERO — Image de fond + titre destination
       ═══════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={t(`destinations.${id}.heroHighlight`)}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-end pt-16 md:pt-20">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-medium">
                {t(`destinations.${id}.badge`)}
              </span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-center mb-6">
              <span className="text-foreground/90 font-light">
                {t(`destinations.${id}.heroTitle`)}
              </span>{" "}
              <span className="text-gradient-gold font-semibold block mt-1 md:mt-2">
                {t(`destinations.${id}.heroHighlight`)}
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl leading-relaxed">
              {t(`destinations.${id}.description`)}
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex gap-4 mt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:brightness-110 rounded-full px-8">
                <a href="#reservation">
                  {t("nav.bookNow")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/10 hover:border-gold/20">
                <Link to="/trajets">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("destinations.backToTrips")}
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES — 4 garanties par destination
       ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-14">
              <span className="text-xs uppercase tracking-[0.3em] text-gold/70 font-medium">
                {t("destinations.featuresLabel")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-3">
                {t("destinations.featuresTitle")}{" "}
                <span className="text-gradient-gold">{t("destinations.featuresTitleHighlight")}</span>
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[0, 1, 2, 3].map((i) => {
              const Icon = icons[i];
              return (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-gold/[0.15] transition-colors duration-500">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/[0.08] text-gold group-hover:bg-gold/[0.12] transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground/90 mb-2">
                      {t(`destinations.${id}.features.${i}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`destinations.${id}.features.${i}.description`)}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TARIFS — Prix par véhicule
       ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white/[0.01]">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl">
                {t("destinations.pricingTitle")}{" "}
                <span className="text-gradient-gold">{t("destinations.pricingHighlight")}</span>
              </h2>
              <p className="text-muted-foreground mt-3">
                {t("destinations.pricingSubtitle")}
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {VEHICLE_CLASSES.map((vc, i) => (
              <FadeUp key={vc} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-gold/[0.15] transition-colors duration-500">
                  <h3 className="font-display text-lg font-semibold text-foreground/90">
                    {t(`fleet.vehicles.${vc}.name`)}
                  </h3>
                  <p className="text-xs text-gold/70 uppercase tracking-wider mt-1 mb-6">
                    {t(`fleet.vehicles.${vc}.label`)}
                  </p>

                  <div className="mb-6">
                    <span className="text-xs text-muted-foreground block mb-1">
                      {t("destinations.startingFrom")}
                    </span>
                    <span className="text-3xl font-bold text-gradient-gold">
                      {formatPrice(destination.prices[vc])}
                    </span>
                  </div>

                  <Button
                    asChild
                    className="w-full rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:brightness-110"
                  >
                    <Link to={`/reservation?destination=${encodeURIComponent(destination.name)}&type=trajet`}>
                      {t("destinations.bookVehicle")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA + FORMULAIRE DE DEVIS
       ═══════════════════════════════════════════ */}
      <section id="reservation" className="py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] text-gold/70 font-medium">
                {t("destinations.ctaLabel")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-3">
                {t(`destinations.${id}.ctaTitle`)}{" "}
                <span className="text-gradient-gold">{t(`destinations.${id}.ctaHighlight`)}</span>
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                {t(`destinations.${id}.ctaDescription`)}
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <QuoteForm
              serviceType="transfer"
              defaultDestination={destination.name}
            />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
