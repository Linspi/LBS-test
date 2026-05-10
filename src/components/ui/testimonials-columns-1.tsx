import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

/**
 * Colonne de témoignages défilante en boucle infinie.
 * La hauteur est doublée (2 copies) pour que la transition
 * translateY(-50%) crée un effet seamless sans saut visible.
 */
export const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 15,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {/* Duplication x2 pour le loop seamless */}
        {[0, 1].map((copyIndex) => (
          <React.Fragment key={copyIndex}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] max-w-xs w-full shadow-lg shadow-black/30"
              >
                {/* Guillemet décoratif */}
                <div className="font-display text-5xl leading-none text-gold/20 -mb-1 select-none">
                  &ldquo;
                </div>

                {/* Texte du témoignage */}
                <p className="text-sm text-foreground/80 leading-relaxed italic font-display">
                  {text}
                </p>

                {/* Étoiles */}
                <div className="flex gap-1 my-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-gold text-gold" />
                  ))}
                </div>

                {/* Auteur */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
                  <img
                    src={image}
                    alt={name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/30"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-medium text-sm text-foreground">{name}</p>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gold/70 mt-0.5">
                      {role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
