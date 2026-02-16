import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolle automatiquement en haut de page à chaque changement de route.
 * Pattern standard React Router — à placer dans le Layout.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
