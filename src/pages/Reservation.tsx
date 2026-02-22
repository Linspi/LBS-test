import { useSearchParams } from "react-router-dom";
import {
  Check,
  Clock,
  CreditCard,
  MessageCircle,
  Shield,
  Star,
  Headphones,
} from "lucide-react";
import { QuoteForm } from "@/components/features/QuoteForm";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/button";
import type { ServiceType } from "@/components/features/QuoteForm";

/** Mapping URL param → serviceType QuoteForm */
const TYPE_MAP: Record<string, ServiceType> = {
  trajet: "transfer",
  "mise-a-disposition": "location",
};

/** Titres et descriptions du Hero selon le mode */
const HERO_CONFIG: Record<ServiceType, { title: string; highlight: string; description: string }> = {
  transfer: {
    title: "Réservez votre",
    highlight: "transfert",
    description:
      "Obtenez une estimation instantanée et réservez votre véhicule en quelques clics. Forfaits aéroport CDG et Orly disponibles.",
  },
  location: {
    title: "Réservez votre",
    highlight: "mise à disposition",
    description:
      "Véhicule avec chauffeur à votre disposition pour la durée souhaitée. Liberté totale, service sur-mesure.",
  },
  corporate: {
    title: "Demandez votre",
    highlight: "devis corporate",
    description:
      "Un service dédié aux entreprises. Complétez le formulaire et notre équipe commerciale vous recontactera sous 24h.",
  },
};

/** Points de réassurance */
const REASSURANCE_ITEMS = [
  { icon: Clock, text: "Confirmation sous 24h" },
  { icon: CreditCard, text: "Paiement à bord, pas d'avance" },
  { icon: Shield, text: "Annulation flexible" },
  { icon: Headphones, text: "Conciergerie 24/7" },
];

export function Reservation() {
  const [searchParams] = useSearchParams();

  const rawType = searchParams.get("type");
  const serviceType: ServiceType = TYPE_MAP[rawType ?? ""] ?? "transfer";
  const departure = searchParams.get("departure") ?? undefined;
  const destination = searchParams.get("destination") ?? undefined;

  const hero = HERO_CONFIG[serviceType];

  return (
    <>
      {/* ── Hero avec fond gradient ── */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        {/* Arrière-plan : gradient + glow doré */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.04] via-background to-background" />
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative container text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <span className="text-xs uppercase tracking-[0.2em]">Réservation</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {hero.title}{" "}
              <span className="text-gradient-gold">{hero.highlight}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Contenu : formulaire + sidebar ── */}
      <section className="pb-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Colonne gauche : formulaire (3/5) */}
            <div className="lg:col-span-3">
              <FadeUp delay={0.1}>
                <QuoteForm
                  serviceType={serviceType}
                  defaultDeparture={departure}
                  defaultDestination={destination}
                />
              </FadeUp>
            </div>

            {/* Colonne droite : sidebar réassurance (2/5) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28 space-y-6">
                <FadeUp delay={0.2}>
                  <ReassuranceSidebar />
                </FadeUp>
                <FadeUp delay={0.3}>
                  <TestimonialMini />
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

// ---------------------------------------------------------------------------
// Sidebar de réassurance
// ---------------------------------------------------------------------------

function ReassuranceSidebar() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gold/[0.08] flex items-center justify-center">
          <Shield className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground tracking-tight">
            Réservation sécurisée
          </h3>
          <p className="text-xs text-muted-foreground">Service premium garanti</p>
        </div>
      </div>

      {/* Séparateur */}
      <div className="h-px bg-gradient-to-r from-gold/20 via-gold/5 to-transparent" />

      {/* Liste de réassurance */}
      <ul className="space-y-4">
        {REASSURANCE_ITEMS.map((item) => (
          <li key={item.text} className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-gold/[0.08] flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-gold" />
            </div>
            <span className="text-sm text-foreground/80">{item.text}</span>
          </li>
        ))}
      </ul>

      {/* Séparateur */}
      <div className="h-px bg-gradient-to-r from-gold/20 via-gold/5 to-transparent" />

      {/* Contact WhatsApp */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Besoin d'assistance ?
        </p>
        <Button
          asChild
          variant="outline-gold"
          size="sm"
          className="w-full"
        >
          <a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contacter par WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini témoignage
// ---------------------------------------------------------------------------

function TestimonialMini() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
      {/* Étoiles */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
        ))}
      </div>

      {/* Citation */}
      <p className="text-sm text-foreground/80 leading-relaxed italic">
        &ldquo;Ponctualité irréprochable, véhicule impeccable et chauffeur d'une
        grande courtoisie. Je recommande sans hésitation.&rdquo;
      </p>

      {/* Auteur */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gold/[0.12] flex items-center justify-center">
          <span className="text-xs font-semibold text-gold">PD</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Philippe D.</p>
          <p className="text-xs text-muted-foreground">Client régulier</p>
        </div>
      </div>
    </div>
  );
}
