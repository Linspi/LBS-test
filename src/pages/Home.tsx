import { Link } from "react-router-dom";
import { Hero } from "@/components/features/Hero";
import { FleetCarousel } from "@/components/features/FleetCarousel";
import { SERVICE_BLOCKS } from "@/data/navigation";

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
