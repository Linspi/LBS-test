import { useTranslation } from "react-i18next";
import {
  FileText,
  UserCheck,
  Clock,
  CalendarCheck,
  Building,
} from "lucide-react";
import { QuoteForm } from "@/components/features/QuoteForm";
import { FadeUp } from "@/components/ui/FadeUp";

const ADVANTAGE_KEYS = [
  { icon: FileText, key: "billing" },
  { icon: UserCheck, key: "vip" },
  { icon: Clock, key: "priority" },
  { icon: CalendarCheck, key: "fleet" },
] as const;

export function Entreprise() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
            alt={t("corporate.heroAlt")}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-background" />
        </div>

        <div className="relative container text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-6">
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
              <Building className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-[0.2em]">{t("corporate.badge")}</span>
              <div className="h-1.5 w-1.5 bg-gold rotate-45" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {t("corporate.titlePrefix")}{" "}
              <span className="text-gradient-gold">{t("corporate.titleHighlight")}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("corporate.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Grille des Avantages Corporate */}
      <section className="py-20 md:py-24">
        <div className="container max-w-6xl">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                {t("corporate.advantagesLabel")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
                {t("corporate.advantagesTitle")} <span className="text-gradient-gold">{t("corporate.advantagesTitleHighlight")}</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("corporate.advantagesSubtitle")}
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADVANTAGE_KEYS.map((advantage, i) => (
              <FadeUp key={advantage.key} delay={i * 0.07}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 flex gap-5 hover:border-gold/[0.15] transition-colors duration-300 cursor-default">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gold/[0.08] flex items-center justify-center">
                    <advantage.icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 tracking-tight">
                      {t(`corporate.advantages.${advantage.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`corporate.advantages.${advantage.key}.description`)}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Ornement Art Déco */}
      <div className="art-deco-divider">
        <div className="art-deco-diamond" />
      </div>

      {/* Formulaire de Devis Corporate */}
      <section className="py-20 md:py-24">
        <div className="container max-w-3xl">
          <FadeUp>
            <QuoteForm serviceType="corporate" />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
