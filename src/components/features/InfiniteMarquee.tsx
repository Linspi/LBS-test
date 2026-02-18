import { Star, ShieldCheck, Clock, Award } from "lucide-react";

const MARQUEE_ITEMS = [
    { icon: Star, text: "15 000+ courses réalisées" },
    { icon: ShieldCheck, text: "Chauffeurs certifiés & formés" },
    { icon: Clock, text: "Disponible 24h/24 & 7j/7" },
    { icon: Award, text: "98% de clients satisfaits" },
    { icon: Star, text: "Service premium depuis 2018" },
    { icon: ShieldCheck, text: "Véhicules assurés tous risques" },
];

export function InfiniteMarquee() {
    return (
        <div className="relative w-full overflow-hidden py-5 border-y border-white/[0.06] bg-white/[0.02]">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Scrolling track — will-change:transform légitime ici car l'animation est permanente */}
            <div className="flex animate-marquee whitespace-nowrap" style={{ willChange: "transform" }}>
                {/* Duplicate items for seamless loop */}
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 mx-8 text-muted-foreground/60"
                    >
                        <item.icon className="h-3.5 w-3.5 text-gold/40" />
                        <span className="text-xs uppercase tracking-widest font-medium">
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
