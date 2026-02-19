import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Fermer le menu mobile à chaque changement de route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Détecter le scroll pour changer l'apparence du header
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "bg-background/95 md:bg-background/90 md:backdrop-blur-md border-b border-border/50 shadow-lg shadow-black/10"
            : "bg-transparent",
        )}
      >
        <div className="w-full flex h-16 items-center px-6 md:px-12 lg:px-16">
          {/* Partie Gauche — Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center">
              <img
                src="/images/BSL_logo.jpeg"
                alt="BLS — Bedadi Limousine Services"
                className="h-10 w-auto mix-blend-screen"
                style={{ filter: "invert(1) sepia(0.1) saturate(1.2)" }}
              />
            </Link>
          </div>

          {/* Partie Centrale — Navigation desktop */}
          <nav className="hidden lg:flex justify-center items-center gap-5 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Partie Droite — Actions desktop + Hamburger mobile */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <a
              href="tel:+33652868946"
              className="hidden xl:flex text-sm text-muted-foreground hover:text-foreground transition-colors items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              06 52 86 89 46
            </a>
            <Button asChild variant="gold" size="sm" className="hidden lg:inline-flex">
              <Link to="/reservation">Réserver</Link>
            </Button>

            {/* Bouton hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-foreground"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Menu mobile slide-out */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-[100dvh] max-h-[100dvh] w-72 bg-background border-l border-border transform transition-transform duration-300 lg:hidden flex flex-col",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <span className="text-lg font-semibold text-foreground">Menu</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-border space-y-3">
          <a
            href="tel:+33652868946"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            06 52 86 89 46
          </a>
          <Button asChild className="w-full">
            <Link to="/reservation">Réserver maintenant</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
