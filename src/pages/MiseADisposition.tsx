import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, Shield, UserCheck, Route, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";

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
      {/* Hero */}
      <section className="relative min-h-[60vh] pt-28 pb-20 overflow-hidden">
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

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
            {FEATURE_KEYS.map((feature, i) => (
              <FadeUp key={feature.key} delay={i * 0.07}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gold/[0.08] flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 tracking-tight">
                      {t(`chauffeur.features.${feature.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`chauffeur.features.${feature.key}.description`)}
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

          {/* Tarifs indicatifs */}
          <FadeUp>
            <div className="rounded-2xl border border-gold/[0.12] bg-white/[0.02] p-8 text-center mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                {t("chauffeur.pricing.label")}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2 tracking-tight">
                {t("chauffeur.pricing.title")} <span className="text-gradient-gold">{t("chauffeur.pricing.titleHighlight")}</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                {t("chauffeur.pricing.minimumHours")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { vehicle: "Classe E", price: "60 €/h" },
                  { vehicle: "Classe V", price: "75 €/h" },
                  { vehicle: "Classe S", price: "95 €/h" },
                ].map((rate) => (
                  <div key={rate.vehicle} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-gold/[0.15] transition-colors duration-300 flex flex-col items-center">
                    <div className="text-sm text-muted-foreground">
                      {rate.vehicle}
                    </div>
                    <div className="font-display text-2xl font-semibold text-gradient-gold mt-1 mb-3">
                      {rate.price}
                    </div>
                    <Link
                      to={`/reservation?type=mise-a-disposition&vehicle=${encodeURIComponent(rate.vehicle)}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-gold transition-colors cursor-pointer"
                    >
                      {t("chauffeur.pricing.book")}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Véhicules d'exception */}
              <div className="mt-8 p-6 rounded-xl border border-gold/[0.1] bg-gold/[0.03] text-center">
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

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="container text-center">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
              {t("chauffeur.cta.title")} <span className="text-gradient-gold">{t("chauffeur.cta.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              {t("chauffeur.cta.subtitle")}
            </p>
            <Button asChild variant="gold" size="lg" className="text-base">
              <Link to="/reservation?type=mise-a-disposition">
                {t("chauffeur.cta.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
