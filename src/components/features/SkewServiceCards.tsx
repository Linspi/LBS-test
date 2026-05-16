/**
 * SkewServiceCards — Section Services avec effet skew + glassmorphism
 *
 * Design inspiré du composant SkewCards :
 * - Panneau gradient incliné (skew) derrière la carte — se déplie au hover
 * - Halo flou doré en fond (blur glow)
 * - Deux blobs flottants animés qui apparaissent au hover
 * - Photo du service en fond, avec overlay sombre + contenu glassmorphism
 * - CTA "Découvrir" slide-up au hover
 *
 * Données : SERVICE_BLOCKS de /data/navigation.ts (photos + clés i18n)
 * Palette  : steel blue BLS (#5A7A9C) avec variations powder blue / icy blue / deep blue
 */

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { SERVICE_BLOCKS } from "@/data/navigation";

/** Gradient bleu acier unique par service — palette BLS steel blue */
const CARD_GRADIENTS: { from: string; to: string }[] = [
  { from: "#5A7A9C", to: "#3d5f7e" },   // Trajets     : bleu acier → bleu profond
  { from: "#A3C0DC", to: "#5A7A9C" },   // Chauffeur   : bleu glacé → bleu acier
  { from: "#5A7A9C", to: "#7EA0C4" },   // Excursions  : bleu acier → bleu poudré
  { from: "#3d5f7e", to: "#A3C0DC" },   // Évènements  : bleu profond → bleu glacé
];

export function SkewServiceCards() {
  const { t } = useTranslation();

  return (
    <>
      {/* Grille responsive : 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-6 justify-items-center py-4">
        {SERVICE_BLOCKS.map((block, idx) => {
          const { from, to } = CARD_GRADIENTS[idx] ?? CARD_GRADIENTS[0];

          return (
            <Link
              key={block.href}
              to={block.href}
              className="group relative w-[300px] h-[420px] transition-all duration-500 focus:outline-none"
              aria-label={t(block.titleKey)}
            >
              {/* ── Panneau gradient incliné (solid) ── */}
              <span
                className="absolute top-0 left-[50px] w-1/2 h-full rounded-2xl skew-x-[15deg] transition-all duration-500
                           group-hover:skew-x-0 group-hover:left-[16px] group-hover:w-[calc(100%-32px)]"
                style={{ background: `linear-gradient(315deg, ${from}, ${to})` }}
              />

              {/* ── Même panneau flou — effet halo lumineux ── */}
              <span
                className="absolute top-0 left-[50px] w-1/2 h-full rounded-2xl skew-x-[15deg] blur-[28px] opacity-70 transition-all duration-500
                           group-hover:skew-x-0 group-hover:left-[16px] group-hover:w-[calc(100%-32px)]"
                style={{ background: `linear-gradient(315deg, ${from}, ${to})` }}
              />

              {/* ── Blobs flottants (apparaissent au hover) ── */}
              <span className="pointer-events-none absolute inset-0 z-10">
                {/* Blob haut-gauche */}
                <span
                  className="absolute top-0 left-0 w-0 h-0 rounded-xl opacity-0
                             bg-white/10 backdrop-blur-[10px]
                             transition-all duration-300
                             group-hover:-top-10 group-hover:left-10
                             group-hover:w-[90px] group-hover:h-[90px] group-hover:opacity-100"
                  style={{ animation: "bls-blob 2s ease-in-out infinite" }}
                />
                {/* Blob bas-droite */}
                <span
                  className="absolute bottom-0 right-0 w-0 h-0 rounded-xl opacity-0
                             bg-white/10 backdrop-blur-[10px]
                             transition-all duration-500
                             group-hover:-bottom-10 group-hover:right-10
                             group-hover:w-[90px] group-hover:h-[90px] group-hover:opacity-100"
                  style={{ animation: "bls-blob 2s ease-in-out infinite", animationDelay: "-1s" }}
                />
              </span>

              {/* ── Carte principale avec photo ── */}
              <div
                className="relative z-20 h-full overflow-hidden rounded-2xl
                           bg-black/20 backdrop-blur-sm
                           transition-all duration-500
                           group-hover:-translate-x-4"
              >
                {/* Photo de fond */}
                <img
                  src={block.image}
                  alt={t(block.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />

                {/* Overlay sombre dégradé du bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                {/* Overlay gold subtil au hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: `linear-gradient(315deg, ${from}66, ${to}33)` }}
                />

                {/* Contenu textuel */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                  <h3 className="font-display text-2xl font-semibold text-white mb-2 tracking-wide leading-snug">
                    {t(block.titleKey)}
                  </h3>
                  <p className="text-sm text-white/65 leading-relaxed line-clamp-2 mb-4">
                    {t(block.subtitleKey)}
                  </p>

                  {/* CTA — slide-up au hover */}
                  <span
                    className="inline-flex items-center gap-2 w-fit
                               text-sm font-bold text-black bg-gold px-4 py-2 rounded-full
                               opacity-0 translate-y-3
                               group-hover:opacity-100 group-hover:translate-y-0
                               transition-[opacity,transform] duration-300
                               hover:bg-gold-light"
                  >
                    {t("home.services.discover")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Animation blob locale — évite de polluer le CSS global */}
      <style>{`
        @keyframes bls-blob {
          0%, 100% { transform: translateY(8px);  }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}
