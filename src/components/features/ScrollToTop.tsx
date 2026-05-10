import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scrolle automatiquement en haut de page à chaque changement de route.
 * Tue aussi les ScrollTriggers GSAP actifs pour éviter des watchers
 * orphelins après navigation (sans `pin`, il n'y a plus de page vide,
 * mais le kill reste une bonne pratique pour les perfs).
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
