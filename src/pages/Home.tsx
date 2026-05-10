import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  Star,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Hero } from "@/components/features/Hero";
import { InfiniteMarquee } from "@/components/features/InfiniteMarquee";
import { FleetCarousel } from "@/components/features/FleetCarousel";
import { SkewServiceCards } from "@/components/features/SkewServiceCards";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { SectionReveal } from "@/components/ui/section-reveal";

/* ───── Composant ornement Art Déco ───── */

function ArtDecoDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`art-deco-divider ${className}`}>
      <div className="art-deco-diamond" />
    </div>
  );
}

/* ───── Data ───── */

const COMMITMENT_KEYS = [
  { icon: Shield, key: "bilingual" },
  { icon: Clock, key: "punctuality" },
  { icon: Star, key: "discretion" },
  { icon: Coffee, key: "comfort" },
] as const;

/** Photos portraits Unsplash — dans le même ordre que les clés i18n (0 → 4) */
const TESTIMONIAL_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
];

/* ───── Component ───── */

export function Home() {
  const { t } = useTranslation();

  /** Données des témoignages construites depuis i18n + photos Unsplash */
  const testimonials = TESTIMONIAL_PHOTOS.map((image, i) => ({
    text: t(`home.testimonials.${i}.text`),
    image,
    name: t(`home.testimonials.${i}.author`),
    role: t(`home.testimonials.${i}.role`),
  }));

  // Répartition en 3 colonnes (avec overlap léger pour varier les vitesses)
  const firstColumn  = [testimonials[0], testimonials[1], testimonials[2]];
  const secondColumn = [testimonials[2], testimonials[3], testimonials[4]];
  const thirdColumn  = [testimonials[1], testimonials[3], testimonials[4]];

  return (
    <>
      <SEO
        title={t("seo.home.title")}
        description={t("seo.home.description")}
      />
      <SectionReveal index={0}>
        <Hero />
        <InfiniteMarquee />
      </SectionReveal>

      {/* ═══════════════════════════════════════════
          Section: Services
          ═══════════════════════════════════════════ */}
      <SectionReveal index={1}>
      <section className="py-10 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none hidden md:block" />

        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-8 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                {t("home.services.label")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                {t("home.services.title")} <span className="text-gradient-gold">{t("home.services.titleHighlight")}</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed hidden md:block">
                {t("home.services.subtitle")}
              </p>
            </div>
          </FadeUp>

          <SkewServiceCards />
        </div>
      </section>
      </SectionReveal>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Fleet Showroom
          ═══════════════════════════════════════════ */}
      <SectionReveal index={2}>
        <FadeUp>
          <FleetCarousel />
        </FadeUp>
      </SectionReveal>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Engagements
          ═══════════════════════════════════════════ */}
      <SectionReveal index={3}>
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.02] blur-[100px] rounded-full pointer-events-none hidden md:block" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <FadeUp className="hidden lg:block">
              <div className="relative">
                <img
                  src="/images/nos-engagements.jpg"
                  alt={t("home.commitments.altDesktop")}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/60 via-transparent to-background/20" />
                <div className="absolute inset-3 border border-gold/[0.1] rounded-xl pointer-events-none" />
              </div>
            </FadeUp>

            <div>
              <FadeUp>
                <div className="flex items-start gap-4 mb-8 lg:block">
                  <img
                    src="/images/nos-engagements.jpg"
                    alt={t("home.commitments.altMobile")}
                    className="lg:hidden w-16 h-20 object-cover rounded-xl shrink-0 mt-1"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                      {t("home.commitments.label")}
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground lg:mb-10">
                      {t("home.commitments.title")} <span className="text-gradient-gold">{t("home.commitments.titleHighlight")}</span>
                    </h2>
                  </div>
                </div>
              </FadeUp>

              <div className="space-y-0">
                {COMMITMENT_KEYS.map((item, index) => (
                  <FadeUp key={item.key} delay={0.05 + index * 0.07}>
                    <div
                      className={`flex items-start gap-5 py-5 ${
                        index < COMMITMENT_KEYS.length - 1 ? "border-b border-white/[0.05]" : ""
                      }`}
                    >
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {t(`home.commitments.${item.key}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t(`home.commitments.${item.key}.description`)}
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </SectionReveal>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Témoignages — colonnes défilantes
          ═══════════════════════════════════════════ */}
      <SectionReveal index={4}>
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Halo décoratif en arrière-plan */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                {t("home.testimonials.label")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                {t("home.testimonials.title")}{" "}
                <span className="text-gradient-gold">
                  {t("home.testimonials.titleHighlight")}
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed hidden md:block">
                {t("home.testimonials.subtitle")}
              </p>
            </div>
          </FadeUp>

          {/* Colonnes défilantes — masque vertical pour l'effet de fondu */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] max-h-[620px] overflow-hidden"
          >
            <TestimonialsColumn testimonials={firstColumn} duration={18} />
            <TestimonialsColumn
              testimonials={secondColumn}
              duration={23}
              className="hidden md:block"
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              duration={20}
              className="hidden lg:block"
            />
          </motion.div>
        </div>
      </section>
      </SectionReveal>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Corporate & B2B
          ═══════════════════════════════════════════ */}
      <SectionReveal index={5}>
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <FadeUp>
              <div>
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gold text-sm mb-8">
                  <div className="h-1.5 w-1.5 bg-gold rotate-45" />
                  <span className="text-xs uppercase tracking-[0.2em]">{t("home.corporate.badge")}</span>
                  <div className="h-1.5 w-1.5 bg-gold rotate-45" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                  {t("home.corporate.title")} <span className="text-gradient-gold">{t("home.corporate.titleHighlight")}</span>
                  <br className="hidden sm:block" />
                  <span className="font-light italic"> {t("home.corporate.titleSuffix")}</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t("home.corporate.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="gold" size="lg">
                    <Link to="/entreprise">
                      {t("home.corporate.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline-gold" size="lg">
                    <Link to="/entreprise">{t("home.corporate.ctaSecondary")}</Link>
                  </Button>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 rounded-[2rem] blur-xl pointer-events-none" />
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  alt={t("home.corporate.altImage")}
                  className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
                  loading="lazy"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      </SectionReveal>
    </>
  );
}
