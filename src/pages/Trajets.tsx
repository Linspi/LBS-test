import { Link } from "react-router-dom";
import { Plane, Train, Castle, TreePine, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeUp } from "@/components/ui/FadeUp";
import { getDestinationsByCategory } from "@/data/destinations";
import { formatPrice } from "@/lib/pricing";
import type { Destination, DestinationCategory } from "@/types";
import type { LucideIcon } from "lucide-react";

/** Données enrichies pour chaque catégorie — icône + texte éditorial */
const CATEGORIES: {
  value: DestinationCategory;
  label: string;
  Icon: LucideIcon;
  headline: string;
  editorial: string;
}[] = [
  {
    value: "aeroports",
    label: "Aéroports",
    Icon: Plane,
    headline: "Transferts Aéroports",
    editorial:
      "Préparez vos trajets aéroports avec une solution simple et confortable. Forfaits tout inclus, accueil en zone d'arrivée avec panneau nominatif et suivi de vol en temps réel. Aucune surprise, que du confort.",
  },
  {
    value: "gares",
    label: "Gares",
    Icon: Train,
    headline: "Navettes Gares",
    editorial:
      "Rejoignez les grandes gares parisiennes sans stress. Prise en charge à quai possible, aide aux bagages et ponctualité garantie. Un service pensé pour les voyageurs exigeants.",
  },
  {
    value: "chateaux",
    label: "Châteaux",
    Icon: Castle,
    headline: "Excursions Châteaux",
    editorial:
      "Découvrez les plus beaux châteaux d'Île-de-France en toute sérénité. Votre chauffeur vous accompagne et vous attend sur place le temps de votre visite. Un voyage dans le temps, en toute élégance.",
  },
  {
    value: "parcs",
    label: "Parcs",
    Icon: TreePine,
    headline: "Transferts Parcs",
    editorial:
      "Offrez à votre famille ou votre groupe un transfert sans contrainte vers les parcs de loisirs de la région. Prise en charge aller-retour, véhicule spacieux et chauffeur attentionné.",
  },
];

export function Trajets() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/trajet.jpg"
            alt="Transfert premium Paris"
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
              <span className="text-xs uppercase tracking-[0.2em]">Transferts Premium</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Nos <span className="text-gradient-gold">trajets</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des transferts premium vers les aéroports, gares, châteaux et parcs
              d'Île-de-France. Prix fixes, sans surprise.
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
                    {cat.label}
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
                          {cat.headline}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                          {cat.editorial}
                        </p>
                      </div>
                    </div>

                    {/* Bande tarifaire */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-6">
                        Tarifs depuis & vers Paris
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {destinations.map((dest, i) => (
                          <PriceColumn
                            key={dest.id}
                            destination={dest}
                            isLast={i === destinations.length - 1}
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

/** Colonne tarifaire individuelle */
function PriceColumn({
  destination,
  isLast,
}: {
  destination: Destination;
  isLast: boolean;
}) {
  return (
    <div
      className={`py-6 px-5 text-center ${
        isLast ? "" : "lg:border-r lg:border-border/30"
      }`}
    >
      <p className="text-sm text-muted-foreground mb-3">
        {destination.name}
      </p>
      <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-1">
        À partir de
      </p>
      <p className="font-display text-4xl lg:text-5xl font-semibold text-gradient-gold tabular-nums mb-4">
        {formatPrice(destination.startingPrice)}
      </p>
      <Link
        to={`/reservation?destination=${encodeURIComponent(destination.name)}&type=trajet`}
        className="inline-flex items-center gap-1 text-sm text-foreground font-medium hover:text-gold transition-colors cursor-pointer"
      >
        Réserver
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
