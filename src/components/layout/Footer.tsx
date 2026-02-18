import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#080b14] py-16">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-gold to-gold-champagne flex items-center justify-center">
                <span className="text-sm font-bold text-background">B</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                BLS
              </span>
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

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BLS. Tous droits réservés.
          </p>

          {/* Social links (placeholder icons as text) */}
          <div className="flex items-center gap-5">
            {["Instagram", "LinkedIn", "X"].map((name) => (
              <a
                key={name}
                href="#"
                className="text-xs text-muted-foreground/60 hover:text-gold transition-colors duration-300"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
