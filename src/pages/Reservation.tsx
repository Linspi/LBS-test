import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

/** Clés i18n pour la réassurance */
const REASSURANCE_KEYS = [
  { icon: Clock, key: "confirmation" },
  { icon: CreditCard, key: "payment" },
  { icon: Shield, key: "cancellation" },
  { icon: Headphones, key: "concierge" },
] as const;

export function Reservation() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const rawType = searchParams.get("type");
  const serviceType: ServiceType = TYPE_MAP[rawType ?? ""] ?? "transfer";
  const departure = searchParams.get("departure") ?? undefined;
  const destination = searchParams.get("destination") ?? undefined;
  const vehicle = searchParams.get("vehicle") ?? undefined;

  return (
    <>
      {/* ── Hero avec fond gradient ── */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.04] via-background to-background" />
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative container text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <span className="text-xs uppercase tracking-[0.2em]">{t("reservation.badge")}</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {t(`reservation.${serviceType}.title`)}{" "}
              <span className="text-gradient-gold">{t(`reservation.${serviceType}.highlight`)}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t(`reservation.${serviceType}.description`)}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Contenu : formulaire + sidebar ── */}
      <section className="pb-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              <FadeUp delay={0.1}>
                <QuoteForm
                  serviceType={serviceType}
                  defaultDeparture={departure}
                  defaultDestination={destination}
                  defaultVehicleType={vehicle}
                />
              </FadeUp>
            </div>

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
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gold/[0.08] flex items-center justify-center">
          <Shield className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground tracking-tight">
            {t("reservation.reassurance.title")}
          </h3>
          <p className="text-xs text-muted-foreground">{t("reservation.reassurance.subtitle")}</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-gold/20 via-gold/5 to-transparent" />

      <ul className="space-y-4">
        {REASSURANCE_KEYS.map((item) => (
          <li key={item.key} className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-gold/[0.08] flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-gold" />
            </div>
            <span className="text-sm text-foreground/80">{t(`reservation.reassurance.${item.key}`)}</span>
          </li>
        ))}
      </ul>

      <div className="h-px bg-gradient-to-r from-gold/20 via-gold/5 to-transparent" />

      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {t("reservation.reassurance.needHelp")}
        </p>
        <Button asChild variant="outline-gold" size="sm" className="w-full">
          <a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("reservation.reassurance.whatsapp")}
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
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
        ))}
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed italic">
        &ldquo;{t("reservation.testimonial.text")}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gold/[0.12] flex items-center justify-center">
          <span className="text-xs font-semibold text-gold">PD</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{t("reservation.testimonial.author")}</p>
          <p className="text-xs text-muted-foreground">{t("reservation.testimonial.role")}</p>
        </div>
      </div>
    </div>
  );
}
