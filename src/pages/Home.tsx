import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  Star,
  Coffee,
  ArrowRight,
  Quote,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { Hero } from "@/components/features/Hero";
import { InfiniteMarquee } from "@/components/features/InfiniteMarquee";
import { FleetCarousel } from "@/components/features/FleetCarousel";
import { ServicesCoverflow } from "@/components/features/ServicesCoverflow";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";

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

const TESTIMONIAL_COUNT = 5;

/* ───── Component ───── */

export function Home() {
  const { t } = useTranslation();
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <>
      <SEO
        title={t("seo.home.title")}
        description={t("seo.home.description")}
      />
      <Hero />
      <InfiniteMarquee />

      {/* ═══════════════════════════════════════════
          Section: Services — Carrousel 3D Cover Flow
          ═══════════════════════════════════════════ */}
      <section className="py-10 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none hidden md:block" />

        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-8 md:mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                {t("home.services.label")}
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5">
                {t("home.services.title")}{" "}
                <span className="text-gradient-gold">{t("home.services.titleHighlight")}</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed hidden md:block">
                {t("home.services.subtitle")}
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <ServicesCoverflow />
          </FadeUp>
        </div>
      </section>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Fleet Showroom
          ═══════════════════════════════════════════ */}
      <FadeUp>
        <FleetCarousel />
      </FadeUp>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Engagements
          ═══════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.02] blur-[100px] rounded-full pointer-events-none hidden md:block" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <FadeUp className="hidden lg:block">
              <div className="relative">
                <img
                  src="/images/nos-engagements.jpg"
                  alt={t("home.commitments.altDesktop")}
                  width={600}
                  height={800}
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
                    width={64}
                    height={80}
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

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Témoignages — style éditorial
          ═══════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                {t("home.testimonials.label")}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                {t("home.testimonials.title")} <span className="text-gradient-gold">{t("home.testimonials.titleHighlight")}</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed hidden md:block">
                {t("home.testimonials.subtitle")}
              </p>
            </div>
          </FadeUp>

          {/* ── Mobile : pullquote éditorial swipeable ── */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -55 && testimonialIdx < TESTIMONIAL_COUNT - 1) {
                    setTestimonialIdx((i) => i + 1);
                  } else if (info.offset.x > 55 && testimonialIdx > 0) {
                    setTestimonialIdx((i) => i - 1);
                  }
                }}
                className="touch-pan-y cursor-grab active:cursor-grabbing select-none"
              >
                <div className="font-display text-[6rem] leading-none text-gold/10 -mb-4 select-none">
                  &ldquo;
                </div>
                <p className="font-display text-[1.25rem] italic leading-relaxed text-foreground/90">
                  {t(`home.testimonials.${testimonialIdx}.text`)}
                </p>
                <div className="flex gap-1 mt-6 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm font-medium text-foreground">
                  — {t(`home.testimonials.${testimonialIdx}.author`)}
                </p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold mt-1">
                  {t(`home.testimonials.${testimonialIdx}.role`)}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-8">
              <div className="flex gap-1">
                {Array.from({ length: TESTIMONIAL_COUNT }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTestimonialIdx(i)}
                    aria-label={t("home.testimonials.testimonialAriaLabel", { index: i + 1 })}
                    className="relative flex items-center justify-center min-w-[44px] min-h-[44px]"
                  >
                    <span className={`block rounded-full transition-all duration-300 ${
                      i === testimonialIdx
                        ? "w-5 h-1.5 bg-gold"
                        : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                    }`} />
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground/40 uppercase tracking-widest">
                {t("home.testimonials.swipe")}
              </span>
            </div>
          </div>

          {/* ── Desktop : layout éditorial magazine ── */}
          <FadeUp className="hidden md:block">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
                <div className="lg:col-span-2 relative pt-4 lg:pr-8">
                  <Quote className="h-10 w-10 text-gold/20 mb-6" />
                  <blockquote className="font-display text-2xl lg:text-3xl italic leading-snug text-foreground/90 mb-8">
                    {t("home.testimonials.0.text")}
                  </blockquote>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="font-semibold text-foreground">
                    {t("home.testimonials.0.author")}
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold/70 mt-1">
                    {t("home.testimonials.0.role")}
                  </p>
                  <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/15 to-transparent" />
                  <div className="lg:hidden h-px w-full mt-8 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                </div>

                <div className="lg:col-span-3 space-y-4">
                  {Array.from({ length: TESTIMONIAL_COUNT - 1 }).map((_, i) => {
                    const idx = i + 1;
                    return (
                      <div
                        key={idx}
                        className="group rounded-xl p-5 lg:p-6 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-gold/[0.1] transition-colors duration-300 cursor-default"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-[11px] text-gold/40 font-light tracking-widest mt-1 shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3 group-hover:text-foreground/80 transition-colors duration-300">
                              &ldquo;{t(`home.testimonials.${idx}.text`)}&rdquo;
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-sm font-medium text-foreground">
                                  {t(`home.testimonials.${idx}.author`)}
                                </span>
                                <span className="text-xs text-muted-foreground/60 ml-2">
                                  {t(`home.testimonials.${idx}.role`)}
                                </span>
                              </div>
                              <div className="flex gap-0.5 shrink-0">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className="h-3 w-3 fill-gold/60 text-gold/60" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Corporate & B2B
          ═══════════════════════════════════════════ */}
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
                  width={800}
                  height={600}
                  className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
                  loading="lazy"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

