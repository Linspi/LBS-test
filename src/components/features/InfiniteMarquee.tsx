import { useTranslation } from "react-i18next";
import { Star, ShieldCheck, Clock, Award } from "lucide-react";

const MARQUEE_ICONS = [Star, ShieldCheck, Clock, Award, Star, ShieldCheck];

export function InfiniteMarquee() {
    const { t } = useTranslation();

    const items = MARQUEE_ICONS.map((icon, i) => ({
        icon,
        text: t(`marquee.${i}`),
    }));

    const renderItems = (ariaHidden?: boolean) =>
        items.map((item, i) => (
            <div
                key={i}
                className="flex items-center gap-2 mx-8 text-muted-foreground/60"
                {...(ariaHidden ? { "aria-hidden": true } : {})}
            >
                <item.icon className="h-3.5 w-3.5 text-gold/40" />
                <span className="text-xs uppercase tracking-widest font-medium">
                    {item.text}
                </span>
            </div>
        ));

    return (
        <div
            className="relative w-full overflow-hidden py-5 border-y border-white/[0.06] bg-white/[0.02]"
            role="marquee"
            aria-label={t("marquee.ariaLabel", { defaultValue: "Nos engagements qualité" })}
        >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Scrolling track — will-change:transform légitime ici car l'animation est permanente */}
            <div className="flex animate-marquee whitespace-nowrap" style={{ willChange: "transform" }}>
                {renderItems()}
                {renderItems(true)}
            </div>
        </div>
    );
}
