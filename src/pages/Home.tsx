import { Link } from "react-router-dom";
import {
  Shield,
  Clock,
  Star,
  Coffee,
  Quote,
  ArrowRight,
  MapPin,
  Calendar,
  Compass,
  PartyPopper,
} from "lucide-react";
import { Hero } from "@/components/features/Hero";
import { InfiniteMarquee } from "@/components/features/InfiniteMarquee";
import { FleetCarousel } from "@/components/features/FleetCarousel";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/FadeUp";
import { SERVICE_BLOCKS } from "@/data/navigation";

/* ───── Data ───── */

const COMMITMENTS = [
  {
    icon: Shield,
    title: "Chauffeurs Bilingues",
    description:
      "Français & Anglais couramment parlés pour un service international.",
  },
  {
    icon: Clock,
    title: "Ponctualité Garantie",
    description:
      "Suivi des vols en temps réel et anticipation du trafic parisien.",
  },
  {
    icon: Star,
    title: "Discrétion Absolue",
    description:
      "Confidentialité et professionnalisme pour tous vos déplacements.",
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
    initial: "M",
    color: "from-rose-400 to-pink-600",
  },
  {
    text: "Ponctualité parfaite, véhicules impeccables. Le service que j'attendais pour mes clients VIP. Une référence à Paris.",
    author: "Thomas D.",
    role: "Concierge Palace",
    initial: "T",
    color: "from-blue-400 to-indigo-600",
  },
  {
    text: "Discrétion, élégance et professionnalisme. Exactement ce dont nous avions besoin pour nos événements d'entreprise.",
    author: "Sophie M.",
    role: "Responsable Events",
    initial: "S",
    color: "from-emerald-400 to-teal-600",
  },
  {
    text: "Le meilleur service VTC de Paris, sans hésitation. Chaque trajet est une expérience de voyage unique et agréable.",
    author: "Pierre R.",
    role: "Entrepreneur",
    initial: "P",
    color: "from-amber-400 to-orange-600",
  },
  {
    text: "Nos invités internationaux sont toujours impressionnés par la qualité du service. BLS est devenu notre partenaire incontournable.",
    author: "Claire B.",
    role: "Directrice Hôtelière",
    initial: "C",
    color: "from-violet-400 to-purple-600",
  },
];

const SERVICE_ICONS = [MapPin, Calendar, Compass, PartyPopper];

/* ───── Component ───── */

export function Home() {
  return (
    <>
      <Hero />
      <InfiniteMarquee />

      {/* ═══════════════════════════════════════════
          Section: Bento Grid Services
          ═══════════════════════════════════════════ */}
      <section className="py-10 md:py-16 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                Ce que nous proposons
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                Nos{" "}
                <span className="text-gradient-gold">services</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Une gamme complète de prestations pour répondre à chacun de vos
                besoins de transport haut de gamme.
              </p>
            </div>
          </FadeUp>

          {/* Bento Grid: 1 large (2 cols) + 2 stacked */}
          {/* Ordre mobile (order-n) différent de l'ordre HTML — annulé sur md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Mise à disposition — grande carte (row-span-2 sur lg) */}
            {/* Mobile : passe en 2e position (order-2) */}
            {SERVICE_BLOCKS[1] && (
              <FadeUp delay={0} className="order-2 md:order-none lg:row-span-2">
                <BentoCard
                  block={SERVICE_BLOCKS[1]}
                  icon={SERVICE_ICONS[1]}
                  large
                />
              </FadeUp>
            )}

            {/* Trajets — 1ère position sur mobile */}
            {SERVICE_BLOCKS[0] && (
              <FadeUp delay={0.15} className="order-1 md:order-none">
                <BentoCard block={SERVICE_BLOCKS[0]} icon={SERVICE_ICONS[0]} />
              </FadeUp>
            )}
            {/* Excursions */}
            {SERVICE_BLOCKS[2] && (
              <FadeUp delay={0.25} className="order-3 md:order-none">
                <BentoCard block={SERVICE_BLOCKS[2]} icon={SERVICE_ICONS[2]} />
              </FadeUp>
            )}

            {/* Événements — pleine largeur sur md+ */}
            {SERVICE_BLOCKS[3] && (
              <FadeUp delay={0.35} className="order-4 md:order-none md:col-span-2">
                <BentoCard block={SERVICE_BLOCKS[3]} icon={SERVICE_ICONS[3]} />
              </FadeUp>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Section: Fleet Showroom
          ═══════════════════════════════════════════ */}
      <FadeUp>
        <FleetCarousel />
      </FadeUp>

      {/* ═══════════════════════════════════════════
          Section: Engagements — Split Feature
          ═══════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/[0.02] blur-[100px] rounded-full pointer-events-none" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            {/* Left: Portrait image */}
            <FadeUp>
              <div className="relative">
                <img
                  src="/images/nos-engagements.jpg"
                  alt="Chauffeur privé ouvrant la porte"
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover rounded-2xl"
                />
                {/* Subtle overlay to blend with dark bg */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/60 via-transparent to-background/20" />
              </div>
            </FadeUp>

            {/* Right: Engagements list */}
            <div>
              <FadeUp>
                <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                  Pourquoi nous choisir
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-10">
                  Nos{" "}
                  <span className="text-gradient-gold">engagements</span>
                </h2>
              </FadeUp>

              <div className="space-y-0">
                {COMMITMENTS.map((item, index) => (
                  <FadeUp key={item.title} delay={0.05 + index * 0.07}>
                    <div
                      className={`flex items-start gap-5 py-6 ${index < COMMITMENTS.length - 1
                        ? "border-b border-white/[0.05]"
                        : ""
                        }`}
                    >
                      {/* Icon */}
                      <div className="h-11 w-11 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-gold" />
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {item.title}
                        </h3>
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

      {/* ═══════════════════════════════════════════
          Section: Testimonials (Horizontal Scroll)
          ═══════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container relative">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
                Ils nous font confiance
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
                Ce que disent nos{" "}
                <span className="text-gradient-gold">clients</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                La confiance de nos clients est notre plus belle récompense.
              </p>
            </div>
          </FadeUp>

          {/* Horizontal scroll container */}
          <FadeUp>
            <div className="relative">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 -mx-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {TESTIMONIALS.map((testimonial, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[340px] sm:w-[380px] snap-center rounded-2xl p-8 flex flex-col bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-[background-color] duration-300"
                  >
                    {/* Quote icon */}
                    <Quote className="h-7 w-7 text-gold/20 mb-5" />

                    {/* Text */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {testimonial.text}
                    </p>

                    {/* 5 stars */}
                    <div className="flex gap-0.5 mb-5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-gold text-gold"
                        />
                      ))}
                    </div>

                    {/* Author with avatar initial */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {testimonial.initial}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Section: Corporate & B2B (Split Screen)
          ═══════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Text content */}
            <FadeUp>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-gold text-sm mb-8">
                  <Shield className="h-4 w-4" />
                  Solutions Professionnelles
                </div>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6">
                  Service{" "}
                  <span className="text-gradient-gold">Corporate</span>
                  <br />& Partenaires
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
                    <Link to="/entreprise">
                      Contacter le service commercial
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeUp>

            {/* Right: Image */}
            <FadeUp delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 rounded-[2rem] blur-xl pointer-events-none" />
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  alt="Business district"
                  className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

/* ───── Bento Card ───── */

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
      className={`group relative block overflow-hidden rounded-2xl border border-white/[0.08] ${
        large ? "h-56 md:h-[450px]" : "h-56 md:h-[215px]"
      }`}
    >
      {/* Background image — transition ciblée sur transform uniquement (GPU) */}
      <img
        src={block.image}
        alt={block.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Gradient overlay — transition ciblée sur opacity (GPU-friendly) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Hover glow — opacity uniquement */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />

      {/* Icon in top-right corner */}
      <div className="absolute top-4 right-4 z-10 h-10 w-10 rounded-xl glass flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <Icon className="h-4 w-4 text-gold" />
      </div>

      {/* Text content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white mb-1 transform transition-transform duration-500 group-hover:-translate-y-1">
          {block.title}
        </h3>
        <p className="text-sm text-white/60 transform transition-transform duration-500 group-hover:-translate-y-1">
          {block.subtitle}
        </p>

        {/* Arrow CTA that appears on hover */}
        <div className="flex items-center gap-2 mt-3 text-gold text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-300">
          Découvrir
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
