import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  Star,
  Coffee,
  ArrowRight,
  Quote,
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ScrollExpandHero } from "@/components/features/ScrollExpandHero";
import { InfiniteMarquee } from "@/components/features/InfiniteMarquee";
import { FleetCarousel } from "@/components/features/FleetCarousel";
import { SkewServiceCards } from "@/components/features/SkewServiceCards";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { SectionReveal } from "@/components/ui/section-reveal";

/* ───── Ornement Art Déco ───── */

function ArtDecoDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`art-deco-divider ${className}`}>
      <div className="art-deco-diamond" />
    </div>
  );
}

/* ───── Data desktop ───── */

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

/**
 * Données enrichies pour la version mobile éditoriale des engagements.
 * Chaque engagement a une photo portrait, une stat chiffrée et son libellé.
 */
const COMMITMENT_MOBILE = [
  {
    key: "bilingual",
    icon: Shield,
    stat: "100%",
    statLabel: "Bilingues FR / EN",
    img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80",
  },
  {
    key: "punctuality",
    icon: Clock,
    stat: "< 3 min",
    statLabel: "Délai moyen d'attente",
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
  },
  {
    key: "discretion",
    icon: Star,
    stat: "NDA",
    statLabel: "Sur demande, signé",
    img: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80",
  },
  {
    key: "comfort",
    icon: Coffee,
    stat: "4G+",
    statLabel: "Wi-Fi & presse à bord",
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
  },
] as const;

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

  const firstColumn  = [testimonials[0], testimonials[1], testimonials[2]];
  const secondColumn = [testimonials[2], testimonials[3], testimonials[4]];
  const thirdColumn  = [testimonials[1], testimonials[3], testimonials[4]];

  return (
    <>
      <SEO
        title={t("seo.home.title")}
        description={t("seo.home.description")}
      />
      <ScrollExpandHero
        mediaType="video"
        mediaSrc="/images/hero.mp4"
        bgImageSrc="/images/hero_nocar.png"
      >
        <InfiniteMarquee />
      </ScrollExpandHero>

      {/* ═══════════════════════════════════════════
          Section: Services (inchangée)
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
                  {t("home.services.title")}{" "}
                  <span className="text-gradient-gold">{t("home.services.titleHighlight")}</span>
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
          Mobile  : Manifeste éditorial vertical
          Desktop : Photo + liste (existant)
          ═══════════════════════════════════════════ */}
      <SectionReveal index={3}>
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.02] blur-[100px] rounded-full pointer-events-none hidden md:block" />

          <div className="container relative">

            {/* ── Mobile : manifeste éditorial (visible uniquement < lg) ── */}
            <div className="lg:hidden">
              <FadeUp>
                {/* En-tête section */}
                <div className="text-center mb-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                    {t("home.commitments.label")}
                  </p>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                    {t("home.commitments.title")}{" "}
                    <span className="text-gradient-gold">{t("home.commitments.titleHighlight")}</span>
                  </h2>
                </div>

                {/* Citation manifeste */}
                <div className="px-4 mb-8">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-6 h-px bg-gold/60" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-gold font-semibold">Manifeste</span>
                  </div>
                  <p className="font-display italic text-lg leading-[1.45] text-foreground/90">
                    « Quatre promesses, tenues à chaque trajet —{" "}
                    parce que l'excellence n'est jamais accidentelle. »
                  </p>
                </div>

                {/* Timeline verticale */}
                <div className="relative">
                  {/* Filet doré vertical */}
                  <div
                    className="absolute top-6 bottom-14"
                    style={{
                      left: 38,
                      width: 1,
                      background:
                        "linear-gradient(180deg, transparent, var(--color-gold) 8%, var(--color-gold) 92%, transparent)",
                      opacity: 0.4,
                    }}
                  />

                  {COMMITMENT_MOBILE.map((c, i) => (
                    <div
                      key={c.key}
                      className="relative flex gap-4 px-4 py-5"
                    >
                      {/* Médaillon circulaire */}
                      <div className="relative shrink-0 w-[76px] h-[76px]">
                        {/* Photo portrait */}
                        <div
                          className="absolute inset-2 rounded-full overflow-hidden border border-gold/35"
                          style={{
                            boxShadow:
                              "0 6px 22px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(12,15,26,0.6)",
                          }}
                        >
                          <img
                            src={c.img}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-cover"
                            style={{ filter: "saturate(0.85) contrast(1.05)" }}
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(circle at 50% 30%, transparent, rgba(12,15,26,0.55))",
                            }}
                          />
                        </div>
                        {/* Anneau extérieur */}
                        <div className="absolute inset-0 rounded-full border border-gold/[0.18]" />
                        {/* Pastille icône en bas-droite */}
                        <div
                          className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full flex items-center justify-center"
                          style={{
                            background: "var(--color-gold)",
                            boxShadow: "0 4px 10px rgba(90,122,156,0.4)",
                          }}
                        >
                          <c.icon className="h-2.5 w-2.5 text-background" strokeWidth={2.5} />
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 pt-0.5">
                        {/* Numéro + règle */}
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span
                            className="font-display italic font-medium text-[28px] leading-none text-gold"
                            style={{ letterSpacing: "-0.02em" }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="flex-1 h-px"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(90,122,156,0.4), transparent)",
                            }}
                          />
                        </div>

                        <h3 className="font-display text-[22px] font-medium leading-[1.1] text-foreground mb-1.5 tracking-tight">
                          {t(`home.commitments.${c.key}.title`)}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                          {t(`home.commitments.${c.key}.description`)}
                        </p>

                        {/* Pill stat */}
                        <div
                          className="inline-flex items-center gap-2 px-3 py-[7px] rounded-full"
                          style={{
                            background: "rgba(90,122,156,0.06)",
                            border: "1px solid rgba(90,122,156,0.18)",
                          }}
                        >
                          <span className="font-display italic text-[15px] font-semibold text-gold-light leading-none">
                            {c.stat}
                          </span>
                          <span className="w-px h-2.5 bg-gold/30" />
                          <span className="text-[9px] uppercase tracking-[0.12em] text-foreground/70 font-medium">
                            {c.statLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sceau de signature */}
                <div className="mx-4 mt-2 pt-5 pb-5 border-t border-b border-white/[0.06] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1.5 font-semibold">
                      Depuis 2015
                    </div>
                    <div className="font-display italic text-[18px] leading-[1.2] font-medium">
                      Engagement
                      <br />
                      <span className="text-gradient-gold not-italic">signé BLS Paris</span>
                    </div>
                  </div>
                  {/* Sceau circulaire */}
                  <div
                    className="relative w-[68px] h-[68px] rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      border: "1px solid rgba(90,122,156,0.35)",
                      background:
                        "radial-gradient(circle, rgba(90,122,156,0.12), transparent 70%)",
                    }}
                  >
                    <div
                      className="absolute inset-1 rounded-full"
                      style={{ border: "1px dashed rgba(90,122,156,0.25)" }}
                    />
                    <span
                      className="font-display italic text-[26px] font-semibold text-gold-light"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      B<span className="text-gold">L</span>s
                    </span>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* ── Desktop : photo + liste (existant, visible uniquement ≥ lg) ── */}
            <div className="hidden lg:block">
              <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                <FadeUp>
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
                    <div className="mb-10">
                      <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                        {t("home.commitments.label")}
                      </p>
                      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
                        {t("home.commitments.title")}{" "}
                        <span className="text-gradient-gold">{t("home.commitments.titleHighlight")}</span>
                      </h2>
                    </div>
                  </FadeUp>

                  <div className="space-y-0">
                    {COMMITMENT_KEYS.map((item, index) => (
                      <FadeUp key={item.key} delay={0.05 + index * 0.07}>
                        <div
                          className={`flex items-start gap-5 py-5 ${
                            index < COMMITMENT_KEYS.length - 1
                              ? "border-b border-white/[0.05]"
                              : ""
                          }`}
                        >
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-gold/[0.08] flex items-center justify-center">
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

          </div>
        </section>
      </SectionReveal>

      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Témoignages
          Mobile  : Carousel swipe horizontal
          Desktop : Colonnes défilantes (existant)
          ═══════════════════════════════════════════ */}
      <SectionReveal index={4}>
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none" />

          <div className="container relative">
            <FadeUp>
              <div className="text-center mb-10 md:mb-16">
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

            {/* ── Mobile : carousel swipe (visible uniquement < md) ── */}
            <div
              className="md:hidden -mx-4"
              style={{
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                display: "flex",
                gap: 12,
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 24,
              }}
            >
              {testimonials.map((t_item, i) => (
                <div
                  key={i}
                  style={{
                    scrollSnapAlign: "center",
                    flexShrink: 0,
                    width: "min(300px, calc(100vw - 48px))",
                    padding: 20,
                    borderRadius: 20,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <Quote className="h-5 w-5 text-gold/50" />
                  {/* Étoiles */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <span key={si} className="text-gold text-sm">★</span>
                    ))}
                  </div>
                  {/* Texte */}
                  <p className="font-display italic text-base leading-[1.45] text-foreground/90 flex-1">
                    « {t_item.text} »
                  </p>
                  {/* Auteur */}
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                    <img
                      src={t_item.image}
                      alt={t_item.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                      loading="lazy"
                    />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t_item.name}</div>
                      <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                        {t_item.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop : colonnes défilantes (visible ≥ md) ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="hidden md:flex justify-center gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] max-h-[620px] overflow-hidden"
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
                    {t("home.corporate.title")}{" "}
                    <span className="text-gradient-gold">{t("home.corporate.titleHighlight")}</span>
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
