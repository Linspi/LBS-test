import { ArrowRight, MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background image ── */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/Hero.jpg"
          alt="Paris la nuit"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      {/* ── Multi-layer overlay (richer than flat black) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0f1a]/80 via-[#0c0f1a]/85 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f1a]/40 via-transparent to-[#0c0f1a]/40" />
      {/* Radial focus light at center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,23,42,0.3)_0%,_rgba(12,15,26,0.8)_50%,_rgba(12,15,26,0.95)_100%)]" />

      {/* ── Radial spotlight glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gold/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-glow/[0.03] blur-[80px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">

        {/* Badge — démarrage immédiat (CSS) */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 glass animate-hero-in"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            Chauffeurs Privés Paris
          </span>
        </div>

        {/* Heading */}
        <h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.1] mb-6 animate-hero-in"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="text-foreground font-light italic">L'excellence du</span>
          <br />
          <span className="text-gradient-gold">transport privé</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed animate-hero-in"
          style={{ animationDelay: "0.3s" }}
        >
          Découvrez un service de chauffeur privé d'exception à Paris.
          Ponctualité, discrétion et véhicules haut de gamme pour tous vos
          déplacements.
        </p>

        {/* ── Floating Trip Simulator Bar (Glassmorphism) ── */}
        <div
          className="max-w-2xl mx-auto animate-hero-in"
          style={{ animationDelay: "0.45s" }}
        >
          <Link
            to="/reservation"
            className="group flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 rounded-2xl sm:rounded-full glass-strong p-2 sm:p-2 shadow-gold-glow hover:shadow-[0_0_40px_rgba(212,168,67,0.2)] transition-shadow duration-500"
          >
            {/* Departure field */}
            <div className="flex items-center gap-3 flex-1 px-5 py-3 sm:py-0">
              <MapPin className="h-4 w-4 text-gold shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Départ</p>
                <p className="text-sm text-foreground/70">Adresse de prise en charge</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-white/10 my-2" />
            <div className="block sm:hidden h-px bg-white/10 mx-4" />

            {/* Arrival field */}
            <div className="flex items-center gap-3 flex-1 px-5 py-3 sm:py-0">
              <Navigation className="h-4 w-4 text-gold shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Arrivée</p>
                <p className="text-sm text-foreground/70">Destination souhaitée</p>
              </div>
            </div>

            {/* Estimate button */}
            <div className="sm:ml-auto px-2 py-2">
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-200 via-gold to-yellow-500 text-background font-semibold rounded-full px-6 py-3 sm:px-8 group-hover:brightness-110 transition-all duration-300 shadow-[0_4px_20px_rgba(212,168,67,0.25)]">
                Estimer
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* ── Stats ── */}
        <div
          className="mt-24 grid grid-cols-3 gap-8 max-w-md mx-auto pb-10 animate-hero-in"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            { value: "15K+", label: "Courses réalisées" },
            { value: "98%", label: "Clients satisfaits" },
            { value: "24/7", label: "Disponibilité" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
