/**
 * MobileMenu — overlay plein écran style BLS mobile design
 *
 * - Slide depuis le haut (translateY(-100% → 0)
 * - Items en cascade (Cormorant Garamond, animation décalée)
 * - Verrou scroll/touch pendant l'ouverture
 * - Fermeture via bouton X ou changement de route
 */

import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Phone } from "lucide-react";
import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";
import { NAV_LINKS } from "@/data/navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Fermer à chaque changement de route
  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  // Verrouiller le scroll du body quand ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  return (
    <div
      className="fixed inset-0 z-[220] flex flex-col lg:hidden"
      aria-modal="true"
      aria-hidden={!open}
      style={{
        background: "rgba(6,8,18,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        transform: open ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: open ? "auto" : "none",
        overscrollBehavior: "contain",
      }}
    >
      {/* Barre supérieure : brand + bouton fermer */}
      <div className="flex items-center justify-between px-6 pt-14 pb-6">
        <Link to="/" onClick={onClose} className="flex items-baseline gap-1.5">
          <span
            className="font-display text-xl font-semibold tracking-wide"
            style={{ color: "var(--color-gold)" }}
          >
            <span className="italic">B</span>L<span className="italic">s</span>
          </span>
          <span
            className="font-sans text-[10px] tracking-[0.3em] opacity-70 mt-1"
            style={{ color: "var(--color-gold)" }}
          >
            PARIS
          </span>
        </Link>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-foreground hover:bg-white/[0.08] transition-colors"
          aria-label="Fermer le menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation principale — cascade animée */}
      <nav className="flex-1 flex flex-col justify-center px-6">
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className="flex items-baseline justify-between py-4 border-b border-white/[0.06] last:border-0"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(-14px)",
              transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.045}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.045}s`,
            }}
          >
            <span
              className="font-display text-[32px] font-medium tracking-tight leading-none"
              style={{
                color: pathname === link.href ? "var(--color-gold)" : "#fff",
              }}
            >
              {t(link.label)}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium font-sans">
              0{i + 1}
            </span>
          </Link>
        ))}
      </nav>

      {/* Pied : téléphone + sélecteur de langue */}
      <div className="px-6 pb-12 pt-5 border-t border-white/[0.07] space-y-4">
        <a
          href="tel:+33652868946"
          className="flex items-center gap-3 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
        >
          <Phone className="h-4 w-4" />
          06 52 86 89 46
        </a>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
