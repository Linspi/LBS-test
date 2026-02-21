import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#080b14] pt-16 pb-10">
      {/* Ornement Art Déco en haut du footer */}
      <div className="absolute -top-px left-0 right-0 flex justify-center">
        <div className="flex items-center gap-0">
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-gold/30" />
          <div className="h-[6px] w-[6px] bg-gold/50 rotate-45 mx-3" />
          <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-gold/30" />
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand — Monogramme BLS signature */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6 group">
              {/* Monogramme avec cadre Art Déco */}
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 rounded-lg bg-gradient-to-br from-gold via-gold-light to-gold-champagne flex items-center justify-center">
                  {/* Cadre intérieur */}
                  <div className="absolute inset-[3px] rounded-md border border-background/20" />
                  <span className="text-sm font-bold text-background tracking-tight relative">B</span>
                </div>
                <div>
                  <span className="block text-lg font-bold tracking-[0.15em] text-foreground leading-none">
                    BLS
                  </span>
                  <span className="block text-[8px] uppercase tracking-[0.3em] text-gold/60 mt-0.5">
                    Limousine Services
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Service de chauffeur privé haut de gamme à Paris et en
              Île-de-France. Disponible 24h/24 et 7j/7.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Trajets & transferts", href: "/trajets" },
                { label: "Mise à disposition", href: "/mise-a-disposition" },
                { label: "Excursions", href: "/excursions" },
                { label: "Événements & soirées", href: "/evenements" },
                { label: "Location de véhicules", href: "/location" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="tel:+33652868946"
                  className="hover:text-gold transition-colors duration-300"
                >
                  06 52 86 89 46
                </a>
              </li>
              <li>
                <a
                  href="mailto:bls.transport75@gmail.com"
                  className="hover:text-gold transition-colors duration-300"
                >
                  bls.transport75@gmail.com
                </a>
              </li>
              <li>Paris, Île-de-France</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-5">
              Légal
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/entreprise"
                  className="hover:text-gold transition-colors duration-300"
                >
                  Service Corporate
                </Link>
              </li>
              <li>
                <span className="cursor-default">
                  Mentions légales
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Politique de confidentialité
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar avec ornement */}
        <div className="mt-14 pt-8 border-t border-white/[0.06]">
          {/* Ornement central */}
          <div className="flex items-center justify-center gap-0 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/20" />
            <div className="h-1 w-1 bg-gold/30 rotate-45 mx-2" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/20" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} BLS — Bedadi Limousine Services. Tous droits réservés.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-5">
              {["Instagram", "LinkedIn", "X"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="text-xs text-muted-foreground/60 hover:text-gold transition-colors duration-300 uppercase tracking-wider"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
