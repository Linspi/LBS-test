import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plane, Train, Castle, TreePine, ArrowRight, Car } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeUp } from "@/components/ui/FadeUp";
import { PricingCard } from "@/components/features/PricingCard";
import { getDestinationsByCategory } from "@/data/destinations";
import { formatPrice } from "@/lib/pricing";
import type { Destination, DestinationCategory } from "@/types";
import type { LucideIcon } from "lucide-react";

/** Catégories avec icône et clé i18n */
const CATEGORIES: {
  value: DestinationCategory;
  Icon: LucideIcon;
  key: string;
}[] = [
  { value: "aeroports", Icon: Plane, key: "aeroports" },
  { value: "gares", Icon: Train, key: "gares" },
  { value: "chateaux", Icon: Castle, key: "chateaux" },
  { value: "parcs", Icon: TreePine, key: "parcs" },
];

export function Trajets() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("seo.trips.title")}
        description={t("seo.trips.description")}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/trajet.jpg"
            alt={t("trips.heroAlt")}
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
              <span className="text-xs uppercase tracking-[0.2em]">{t("trips.badge")}</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {t("trips.title")} <span className="text-gradient-gold">{t("trips.titleHighlight")}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("trips.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Onglets */}
      <section className="pb-24">
        <div className="container max-w-6xl">
          <FadeUp>
            <Tabs defaultValue="aeroports">
              <TabsList className="w-full justify-start gap-1 bg-secondary/50 p-1 rounded-lg flex-wrap">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="flex items-center gap-2 data-[state=active]:bg-gold data-[state=active]:text-primary-foreground cursor-pointer"
                  >
                    <cat.Icon className="h-4 w-4" />
                    {t(`trips.categories.${cat.key}.label`)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {CATEGORIES.map((cat) => {
                const destinations = getDestinationsByCategory(cat.value);

                return (
                  <TabsContent key={cat.value} value={cat.value} className="mt-10">
                    {/* En-tête éditorial */}
                    <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
                      <div className="flex-shrink-0 h-16 w-16 rounded-full border border-gold/20 bg-gold/[0.06] flex items-center justify-center">
                        <cat.Icon className="h-7 w-7 text-gold" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-2 tracking-tight">
                          {t(`trips.categories.${cat.key}.headline`)}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                          {t(`trips.categories.${cat.key}.editorial`)}
                        </p>
                      </div>
                    </div>

                    {/* Bande tarifaire — Pricing Cards */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">
                        {t("trips.pricesLabel")}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {destinations.map((dest, i) => (
                          <PricingCard
                            key={dest.id}
                            planName={dest.name}
                            description={t("trips.startingFrom")}
                            price={formatPrice(dest.startingPrice)}
                            priceDescription={t("trips.book")}
                            features={[
                              t("fleet.services.wifiOnboard"),
                              t("fleet.services.water"),
                              t("fleet.services.chargers"),
                              "Classe E, S ou V",
                            ]}
                            icon={<Car className="h-5 w-5 text-gold" />}
                            iconBgClass="from-gold/20 to-amber-500/10"
                            isPopular={i === 0}
                            buttonText={t("trips.book")}
                            buttonHref={`/reservation?destination=${encodeURIComponent(dest.name)}&type=trajet`}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

