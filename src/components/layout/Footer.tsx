import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  L
                </span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                LBS
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Service de chauffeur privé haut de gamme à Paris et en
              Île-de-France. Disponible 24h/24 et 7j/7.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/trajets"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Trajets & transferts
                </Link>
              </li>
              <li>
                <Link
                  to="/mise-a-disposition"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Mise à disposition
                </Link>
              </li>
              <li>
                <Link
                  to="/excursions"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Excursions
                </Link>
              </li>
              <li>
                <Link
                  to="/evenements"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Événements & soirées
                </Link>
              </li>
              <li>
                <Link
                  to="/location"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Location de véhicules
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>01 23 45 67 89</li>
              <li>contact@lbs.fr</li>
              <li>Paris, Île-de-France</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LBS. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
