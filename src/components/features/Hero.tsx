import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Image de fond — confinée à la section Hero uniquement */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/Hero.jpg"
          alt="Paris la nuit"
          className="w-full h-full object-cover"
        />  {/* https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80 */ }
      </div>

      {/* Overlay gradient sombre pour lisibilité + fusion avec le fond noir */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/75 via-black/80 to-background" />

      {/* Subtle gold radial glow par-dessus */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/4 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Contenu — z-10 pour passer au-dessus de l'image et overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-gold/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm bg-black/20">
          <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-xs uppercase tracking-[0.2em] text-gold">
            Chauffeurs privés Paris
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-foreground">L'excellence du</span>
          <br />
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            transport privé
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Découvrez un service de chauffeur privé d'exception à Paris.
          Ponctualité, discrétion et véhicules haut de gamme pour tous vos
          déplacements.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/reservation">Réserver maintenant</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/trajets">Découvrir nos trajets</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "15K+", label: "Courses réalisées" },
            { value: "98%", label: "Clients satisfaits" },
            { value: "24/7", label: "Disponibilité" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-gold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground animate-bounce">
        <ArrowDown className="h-5 w-5" />
      </div>
    </section>
  );
}
