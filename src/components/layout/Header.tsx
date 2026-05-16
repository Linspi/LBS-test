import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";
import { MobileMenu } from "@/components/features/MobileMenu";
import { NAV_LINKS } from "@/data/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMobileMenuChange?: (open: boolean) => void;
}

export function Header({ onMobileMenuChange }: HeaderProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Fermer le menu à chaque changement de route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Détecter le scroll
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Notifier le parent
  useEffect(() => {
    onMobileMenuChange?.(mobileOpen);
  }, [mobileOpen, onMobileMenuChange]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <div className="w-full flex h-16 items-center px-4 sm:px-6 md:px-12 lg:px-16">

          {/* ── Mobile : brand BLS + actions (phone + menu) ── */}
          <div className="flex flex-1 items-center justify-between lg:hidden">
            {/* Brand "BLs PARIS" */}
            <Link to="/" className="flex items-baseline gap-1.5">
              <span
                className="font-display text-xl font-semibold tracking-wide"
                style={{ color: "var(--color-gold)" }}
              >
                <span className="italic">B</span>L<span className="italic">s</span>
              </span>
              <span
                className="font-sans text-[9px] tracking-[0.3em] opacity-60 mt-0.5"
                style={{ color: "var(--color-gold)" }}
              >
                PARIS
              </span>
            </Link>

            {/* Boutons icônes */}
            <div className="flex items-center gap-2">
              <a
                href="tel:+33652868946"
                aria-label="Appeler BLS"
                className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gold hover:bg-white/[0.08] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-foreground hover:bg-white/[0.08] transition-colors"
                aria-label={t("nav.openMenu")}
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Desktop : Logo gauche ── */}
          <div className="hidden lg:flex flex-1 justify-start items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src="/images/BSL_logo.jpeg"
                alt="BLS — Bedadi Limousine Services"
                className="h-10 w-auto mix-blend-screen"
                style={{ filter: "invert(1) sepia(0.1) saturate(1.2)" }}
              />
            </Link>
            <LanguageSwitcher />
          </div>

          {/* ── Desktop : Navigation centrale ── */}
          <nav className="hidden lg:flex justify-center items-center gap-5 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          {/* ── Desktop : Actions droite ── */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-4">
            <a
              href="tel:+33652868946"
              className="hidden xl:flex text-sm text-muted-foreground hover:text-foreground transition-colors items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              06 52 86 89 46
            </a>
            <Button asChild variant="gold" size="sm">
              <Link to="/reservation">{t("nav.book")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
