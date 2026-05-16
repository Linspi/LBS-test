import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, Shield, UserCheck, Route, ArrowRight, Car, Star, Users } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { PricingCard } from "@/components/features/PricingCard";

const FEATURE_KEYS = [
  { icon: Clock, key: "flexibility" },
  { icon: Shield, key: "discretion" },
  { icon: UserCheck, key: "dedicated" },
  { icon: Route, key: "multiStop" },
] as const;

export function MiseADisposition() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("seo.chauffeur.title")}
        description={t("seo.chauffeur.description")}
      />
      {/* Hero */}
      <section className="relative min-h-[35vh] pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/MAD.jpg"
            alt={t("chauffeur.heroAlt")}
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
              <span className="text-xs uppercase tracking-[0.2em]">{t("chauffeur.badge")}</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {t("chauffeur.title")} <span className="text-gradient-gold">{t("chauffeur.titleHighlight")}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("chauffeur.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Pricing + Features + Véhicules d'exception */}
      <section className="py-20 md:py-24">
        <div className="container max-w-5xl">

          {/* Tarifs indicatifs — Pricing Cards */}
          <FadeUp>
            <div className="mb-10">
              {/* En-tête — même esthétique que les cards (fond sombre + halo or) */}
              <div
                className="relative rounded-2xl p-8 text-center mb-8 overflow-hidden"
                style={{
                  background: [
                    "radial-gradient(at 88% 40%, hsla(222, 47%, 7%, 1) 0px, transparent 85%)",
                    "radial-gradient(at 14% 26%, hsla(222, 47%, 7%, 1) 0px, transparent 85%)",
                    "radial-gradient(at 0%  64%, hsla(211, 27%, 25%, 0.6) 0px, transparent 85%)",
                    "radial-gradient(at 100% 99%, hsla(211, 30%, 35%, 0.5) 0px, transparent 85%)",
                  ].join(", "),
                  boxShadow: "0px -12px 24px 0px rgba(90, 122, 156, 0.06) inset",
                }}
              >
                {/* Bordure fine dorée */}
                <div className="absolute inset-0 rounded-2xl border border-gold/[0.15] pointer-events-none" />

                {/* Losange Art Déco centré */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
                  <div className="h-1.5 w-1.5 bg-gold rotate-45" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
                </div>

                <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                  {t("chauffeur.pricing.label")}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2 tracking-tight">
                  {t("chauffeur.pricing.title")}{" "}
                  <span className="text-gradient-gold">{t("chauffeur.pricing.titleHighlight")}</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t("chauffeur.pricing.minimumHours")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <PricingCard
                  planName="Classe E"
                  description={t("fleet.vehicles.classe-e.label")}
                  price="60 €"
                  priceDescription="/ heure"
                  priceNote={t("chauffeur.pricing.minimumHours")}
                  features={[
                    t("fleet.services.wifiOnboard"),
                    t("fleet.services.water"),
                    t("fleet.services.chargers"),
                    t("fleet.services.press"),
                    "3 passagers max",
                  ]}
                  icon={<Car className="h-5 w-5 text-emerald-400" />}
                  iconBgClass="from-emerald-500/20 to-teal-500/20"
                  buttonText={t("chauffeur.pricing.book")}
                  buttonHref="/reservation?type=mise-a-disposition&vehicle=Classe%20E"
                />
                <PricingCard
                  planName="Classe S"
                  description={t("fleet.vehicles.classe-s.label")}
                  price="95 €"
                  priceDescription="/ heure"
                  priceNote={t("chauffeur.pricing.minimumHours")}
                  features={[
                    t("fleet.services.wifiHighSpeed"),
                    t("fleet.services.champagne"),
                    t("fleet.services.massageSeats"),
                    t("fleet.services.ambiance"),
                    "3 passagers max",
                  ]}
                  icon={<Star className="h-5 w-5 text-blue-400" />}
                  iconBgClass="from-blue-500/20 to-cyan-500/20"
                  isPopular
                  buttonText={t("chauffeur.pricing.book")}
                  buttonHref="/reservation?type=mise-a-disposition&vehicle=Classe%20S"
                />
                <PricingCard
                  planName="Classe V"
                  description={t("fleet.vehicles.classe-v.label")}
                  price="75 €"
                  priceDescription="/ heure"
                  priceNote={t("chauffeur.pricing.minimumHours")}
                  features={[
                    t("fleet.services.wifiOnboard"),
                    t("fleet.services.spacious"),
                    t("fleet.services.water"),
                    t("fleet.services.usbPorts"),
                    "7 passagers max",
                  ]}
                  icon={<Users className="h-5 w-5 text-purple-400" />}
                  iconBgClass="from-purple-500/20 to-indigo-500/20"
                  buttonText={t("chauffeur.pricing.book")}
                  buttonHref="/reservation?type=mise-a-disposition&vehicle=Classe%20V"
                />
              </div>

              {/* Features — entre le pricing et les véhicules d'exception */}
              <div className="mt-8 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {FEATURE_KEYS.map((feature) => (
                  <div
                    key={feature.key}
                    className="relative flex gap-4 p-5 rounded-2xl overflow-hidden"
                    style={{
                      background: [
                        "radial-gradient(at 88% 40%, hsla(222, 47%, 7%, 1) 0px, transparent 85%)",
                        "radial-gradient(at 14% 26%, hsla(222, 47%, 7%, 1) 0px, transparent 85%)",
                        "radial-gradient(at 0%  64%, hsla(211, 27%, 25%, 0.6) 0px, transparent 85%)",
                        "radial-gradient(at 100% 99%, hsla(211, 30%, 35%, 0.4) 0px, transparent 85%)",
                      ].join(", "),
                      boxShadow: "0px -8px 16px 0px rgba(90, 122, 156, 0.05) inset",
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl border border-gold/[0.12] pointer-events-none" />
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gold/[0.10] border border-gold/[0.15] flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground mb-1 tracking-tight">
                        {t(`chauffeur.features.${feature.key}.title`)}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(`chauffeur.features.${feature.key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA — entre les features et les véhicules d'exception */}
              <div className="mt-6 mb-6 text-center">
                <Button asChild variant="gold" size="lg" className="text-base">
                  <Link to="/reservation?type=mise-a-disposition">
                    {t("chauffeur.cta.button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Véhicules d'exception */}
              <div className="mt-6 p-6 rounded-2xl border border-gold/[0.12] bg-gold/[0.03] text-center">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  {t("chauffeur.pricing.exceptionalVehicles")}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t("chauffeur.pricing.exceptionalList")}
                </p>
                <span className="text-sm font-semibold text-gradient-gold block mb-3">
                  {t("chauffeur.pricing.quoteOnly")}
                </span>
                <Link
                  to="/reservation?type=mise-a-disposition"
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-gold transition-colors cursor-pointer"
                >
                  {t("chauffeur.pricing.requestQuote")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </>
  );
}
