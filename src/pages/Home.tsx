import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  Star,
  Coffee,
  ArrowRight,
  MapPin,
  Calendar,
  Compass,
  PartyPopper,
  Quote,
} from "lucide-react";
import { Hero } from "@/components/features/Hero";
import { InfiniteMarquee } from "@/components/features/InfiniteMarquee";
import { FleetCarousel } from "@/components/features/FleetCarousel";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { SERVICE_BLOCKS } from "@/data/navigation";

/* ───── Composant ornement Art Déco ───── */

function ArtDecoDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`art-deco-divider ${className}`}>
      <div className="art-deco-diamond" />
    </div>
  );
}

/* ───── Data ───── */

const COMMITMENTS = [
  {
    icon: Shield,
    title: "Chauffeurs Bilingues",
    description: "Français & Anglais couramment parlés pour un service international.",
  },
  {
    icon: Clock,
    title: "Ponctualité Garantie",
    description: "Suivi des vols en temps réel et anticipation du trafic parisien.",
  },
  {
    icon: Star,
    title: "Discrétion Absolue",
    description: "Confidentialité et professionnalisme pour tous vos déplacements.",
  },
  {
    icon: Coffee,
    title: "Confort VIP",
    description: "Wi-Fi, presse internationale et rafraîchissements à bord.",
  },
];

const TESTIMONIALS = [
  {
    text: "Un service irréprochable, des chauffeurs d'une courtoisie exceptionnelle. Je recommande vivement pour vos déplacements professionnels.",
    author: "Marie L.",
    role: "Directrice Générale",
  },
  {
    text: "Ponctualité parfaite, véhicules impeccables. Le service que j'attendais pour mes clients VIP. Une référence à Paris.",
    author: "Thomas D.",
    role: "Concierge Palace",
  },
  {
    text: "Discrétion, élégance et professionnalisme. Exactement ce dont nous avions besoin pour nos événements d'entreprise.",
    author: "Sophie M.",
    role: "Responsable Events",
  },
  {
    text: "Le meilleur service VTC de Paris, sans hésitation. Chaque trajet est une expérience de voyage unique et agréable.",
    author: "Pierre R.",
    role: "Entrepreneur",
  },
  {
    text: "Nos invités internationaux sont toujours impressionnés par la qualité du service. BLS est devenu notre partenaire incontournable.",
    author: "Claire B.",
    role: "Directrice Hôtelière",
  },
];


const SERVICE_ICONS = [MapPin, Calendar, Compass, PartyPopper];

/* ───── Component ───── */

export function Home() {
  /* Index du témoignage actif sur mobile */
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <>
      <Hero />
      <InfiniteMarquee />

      {/* ═══════════════════════════════════════════
          Section: Services
          ═══════════════════════════════════════════ */}
      <section className="py-10 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none hidden md:block" />

        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-8 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                Ce que nous proposons
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                Nos <span className="text-gradient-gold">services</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed hidden md:block">
                Une gamme complète de prestations pour répondre à chacun de vos
                besoins de transport haut de gamme.
              </p>
            </div>
          </FadeUp>

          {/* ── Mobile : liste numérotée avec thumbnail ── */}
          <div className="md:hidden border-t border-white/[0.06]">
            {SERVICE_BLOCKS.map((block, i) => (
              <FadeUp key={block.href} delay={i * 0.06}>
                <Link
                  to={block.href}
                  className="flex items-center gap-4 py-4 border-b border-white/[0.06] group"
                >
                  {/* Numéro */}
                  <span className="text-[10px] text-gold/70 font-light tracking-widest w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Thumbnail */}
                  <img
                    src={block.image}
                    alt={block.title}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                    loading="lazy"
                  />

                  {/* Texte */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[1.1rem] font-semibold text-foreground leading-tight">
                      {block.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {block.subtitle}
                    </p>
                  </div>

                  {/* Flèche */}
                  <ArrowRight className="h-4 w-4 text-gold/30 group-hover:text-gold transition-colors duration-300 shrink-0" />
                </Link>
              </FadeUp>
            ))}
          </div>

          {/* ── Desktop : Bento Grid ── */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {SERVICE_BLOCKS[1] && (
              <FadeUp delay={0} className="lg:row-span-2">
                <BentoCard block={SERVICE_BLOCKS[1]} icon={SERVICE_ICONS[1]} large />
              </FadeUp>
            )}
            {SERVICE_BLOCKS[0] && (
              <FadeUp delay={0.15}>
                <BentoCard block={SERVICE_BLOCKS[0]} icon={SERVICE_ICONS[0]} />
              </FadeUp>
            )}
            {SERVICE_BLOCKS[2] && (
              <FadeUp delay={0.25}>
                <BentoCard block={SERVICE_BLOCKS[2]} icon={SERVICE_ICONS[2]} />
              </FadeUp>
            )}
            {SERVICE_BLOCKS[3] && (
              <FadeUp delay={0.35} className="md:col-span-2">
                <BentoCard block={SERVICE_BLOCKS[3]} icon={SERVICE_ICONS[3]} />
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* ── Ornement Art Déco ── */}
      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Fleet Showroom
          ═══════════════════════════════════════════ */}
      <FadeUp>
        <FleetCarousel />
      </FadeUp>

      {/* ── Ornement Art Déco ── */}
      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Engagements
          ═══════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.02] blur-[100px] rounded-full pointer-events-none hidden md:block" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">

            {/* Portrait — desktop uniquement (grand format) */}
            <FadeUp className="hidden lg:block">
              <div className="relative">
                <img
                  src="/images/nos-engagements.jpg"
                  alt="Chauffeur privé ouvrant la porte"
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/60 via-transparent to-background/20" />
                {/* Cadre Art Déco sur l'image */}
                <div className="absolute inset-3 border border-gold/[0.1] rounded-xl pointer-events-none" />
              </div>
            </FadeUp>

            {/* Contenu texte + engagements */}
            <div>
              <FadeUp>
                {/* Mobile : titre avec petite photo en ligne */}
                <div className="flex items-start gap-4 mb-8 lg:block">
                  {/* Petite photo — mobile uniquement */}
                  <img
                    src="/images/nos-engagements.jpg"
                    alt="Chauffeur privé"
                    className="lg:hidden w-16 h-20 object-cover rounded-xl shrink-0 mt-1"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-3">
                      Pourquoi nous choisir
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground lg:mb-10">
                      Nos <span className="text-gradient-gold">engagements</span>
                    </h2>
                  </div>
                </div>
              </FadeUp>

              <div className="space-y-0">
                {COMMITMENTS.map((item, index) => (
                  <FadeUp key={item.title} delay={0.05 + index * 0.07}>
                    <div
                      className={`flex items-start gap-5 py-5 ${
                        index < COMMITMENTS.length - 1 ? "border-b border-white/[0.05]" : ""
                      }`}
                    >
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
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

      {/* ── Ornement Art Déco ── */}
      <ArtDecoDivider />

      {/* ═══════════════════════════════════════════
          Section: Témoignages — style éditorial
          ═══════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                Ils nous font confiance
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                Ce que disent nos <span className="text-gradient-gold">clients</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed hidden md:block">
                La confiance de nos clients est notre plus belle récompense.
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
                  if (info.offset.x < -55 && testimonialIdx < TESTIMONIALS.length - 1) {
                    setTestimonialIdx((i) => i + 1);
                  } else if (info.offset.x > 55 && testimonialIdx > 0) {
                    setTestimonialIdx((i) => i - 1);
                  }
                }}
                className="touch-pan-y cursor-grab active:cursor-grabbing select-none"
              >
                {/* Guillemet décoratif */}
                <div className="font-display text-[6rem] leading-none text-gold/10 -mb-4 select-none">
                  "
                </div>

                {/* Texte du témoignage */}
                <p className="font-display text-[1.25rem] italic leading-relaxed text-foreground/90">
                  {TESTIMONIALS[testimonialIdx].text}
                </p>

                {/* Étoiles */}
                <div className="flex gap-1 mt-6 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Auteur */}
                <p className="text-sm font-medium text-foreground">
                  — {TESTIMONIALS[testimonialIdx].author}
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1">
                  {TESTIMONIALS[testimonialIdx].role}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Indicateurs + hint */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTestimonialIdx(i)}
                    aria-label={`Témoignage ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === testimonialIdx
                        ? "w-5 h-1.5 bg-gold"
                        : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] text-muted-foreground/40 uppercase tracking-widest">
                Glisser
              </span>
            </div>
          </div>

          {/* ── Desktop : layout éditorial magazine ── */}
          <FadeUp className="hidden md:block">
            <div className="max-w-5xl mx-auto">
              {/* Grille responsive : stack sur tablette, 2 colonnes sur desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">

                {/* Citation principale oversize */}
                <div className="lg:col-span-2 relative pt-4 lg:pr-8">
                  <Quote className="h-10 w-10 text-gold/20 mb-6" />
                  <blockquote className="font-display text-2xl lg:text-3xl italic leading-snug text-foreground/90 mb-8">
                    {TESTIMONIALS[0].text}
                  </blockquote>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="font-semibold text-foreground">
                    {TESTIMONIALS[0].author}
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold/70 mt-1">
                    {TESTIMONIALS[0].role}
                  </p>
                  {/* Ligne décorative — verticale sur desktop, horizontale sur tablette */}
                  <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/15 to-transparent" />
                  <div className="lg:hidden h-px w-full mt-8 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                </div>

                {/* Cards compactes empilées */}
                <div className="lg:col-span-3 space-y-4">
                  {TESTIMONIALS.slice(1).map((testimonial, i) => (
                    <div
                      key={i}
                      className="group rounded-xl p-5 lg:p-6 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-gold/[0.1] transition-colors duration-300 cursor-default"
                    >
                      <div className="flex items-start gap-4">
                        {/* Numéro décoratif */}
                        <span className="text-[10px] text-gold/40 font-light tracking-widest mt-1 shrink-0">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3 group-hover:text-foreground/80 transition-colors duration-300">
                            "{testimonial.text}"
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-foreground">
                                {testimonial.author}
                              </span>
                              <span className="text-xs text-muted-foreground/60 ml-2">
                                {testimonial.role}
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
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Ornement Art Déco ── */}
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
                  <span className="text-xs uppercase tracking-[0.2em]">Solutions Professionnelles</span>
                  <div className="h-1.5 w-1.5 bg-gold rotate-45" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                  Service <span className="text-gradient-gold">Corporate</span>
                  <br className="hidden sm:block" />
                  <span className="font-light italic"> & Partenaires</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  Facturation mensuelle simplifiée, chauffeurs dédiés et accueil
                  VIP pour vos collaborateurs et invités de marque. Une solution
                  sur mesure pour les entreprises exigeantes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="gold" size="lg">
                    <Link to="/entreprise">
                      Découvrir l'offre
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline-gold" size="lg">
                    <Link to="/entreprise">Contacter le service commercial</Link>
                  </Button>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 rounded-[2rem] blur-xl pointer-events-none" />
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  alt="Business district"
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

/* ───── Bento Card (desktop uniquement) ───── */

function BentoCard({
  block,
  icon: Icon,
  large = false,
}: {
  block: (typeof SERVICE_BLOCKS)[number];
  icon: React.ComponentType<{ className?: string }>;
  large?: boolean;
}) {
  return (
    <Link
      to={block.href}
      className={`group relative block overflow-hidden rounded-2xl border border-white/[0.08] hover:border-gold/[0.12] transition-[border-color] duration-500 ${
        large ? "h-[450px]" : "h-[215px]"
      }`}
    >
      <img
        src={block.image}
        alt={block.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />

      <div className="absolute top-4 right-4 z-10 h-10 w-10 rounded-xl glass flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <Icon className="h-4 w-4 text-gold" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8">
        {/* Numéro décoratif Art Déco */}
        <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white mb-1 transition-transform duration-300 group-hover:-translate-y-1">
          {block.title}
        </h3>
        <p className="text-sm text-white/60 transition-transform duration-300 group-hover:-translate-y-1">
          {block.subtitle}
        </p>
        <div className="flex items-center gap-2 mt-3 text-gold text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-300">
          Découvrir
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
