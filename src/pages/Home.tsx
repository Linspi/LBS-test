import { Link } from "react-router-dom";
import { Shield, Clock, Star, Coffee, Quote, ArrowRight } from "lucide-react";
import { Hero } from "@/components/features/Hero";
import { FleetCarousel } from "@/components/features/FleetCarousel";
import { Button } from "@/components/ui/button";
import { SERVICE_BLOCKS } from "@/data/navigation";

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
];

export function Home() {
  return (
    <>
      <Hero />

      {/* Grille de navigation visuelle */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Nos <span className="text-gold">services</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Une gamme complète de prestations pour répondre à chacun de vos
              besoins de transport haut de gamme.
            </p>
          </div>

          {/* Ligne 1 : 3 blocs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mb-4">
            {SERVICE_BLOCKS.slice(0, 3).map((block) => (
              <ServiceBlockCard key={block.href} block={block} />
            ))}
          </div>

          {/* Ligne 2 : 1 bloc centré */}
          <div className="max-w-md mx-auto">
            {SERVICE_BLOCKS[3] && (
              <ServiceBlockCard block={SERVICE_BLOCKS[3]} />
            )}
          </div>
        </div>
      </section>

      {/* Section Flotte */}
      <FleetCarousel />

      {/* Section Nos Engagements */}
      <section className="py-24 bg-card/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Nos <span className="text-gold">engagements</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Des garanties qui font la différence pour une expérience de
              transport d'exception.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {COMMITMENTS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ce que disent nos <span className="text-gold">clients</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              La confiance de nos clients est notre plus belle récompense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-border/50 bg-anthracite/50 p-8 flex flex-col"
              >
                <Quote className="h-8 w-8 text-gold/30 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {testimonial.text}
                </p>

                {/* 5 étoiles dorées */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-gold text-gold"
                    />
                  ))}
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Service Corporate & B2B */}
      <section className="relative py-32 overflow-hidden">
        {/* Image de fond assombrie */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            alt="Business district"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70" />
        </div>

        {/* Contenu */}
        <div className="relative container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm mb-6">
            <Shield className="h-4 w-4" />
            Solutions Professionnelles
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Service <span className="text-gold">Corporate</span> & Partenaires
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Facturation mensuelle simplifiée, chauffeurs dédiés et accueil VIP
            pour vos collaborateurs et invités de marque. Une solution sur
            mesure pour les entreprises exigeantes.
          </p>

          <Button asChild size="lg" className="text-base">
            <Link to="/entreprise">
              Contacter le service commercial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function ServiceBlockCard({
  block,
}: {
  block: (typeof SERVICE_BLOCKS)[number];
}) {
  return (
    <Link
      to={block.href}
      className="group relative block overflow-hidden rounded-xl aspect-[4/3] md:aspect-[3/2]"
    >
      {/* Image de fond */}
      <img
        src={block.image}
        alt={block.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay sombre + gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-colors group-hover:from-black/90" />

      {/* Contenu texte */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-1">
          {block.title}
        </h3>
        <p className="text-sm text-white/70">{block.subtitle}</p>
      </div>

      {/* Bordure dorée au hover */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gold/40 transition-colors" />
    </Link>
  );
}
