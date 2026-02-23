import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — remet la page en haut à chaque changement de route.
 *
 * React Router DOM ne scroll pas automatiquement vers le haut lors d'une
 * navigation. Sans ce composant, l'utilisateur arrive sur la nouvelle page
 * avec la position de scroll de la page précédente, ce qui fausse les
 * calculs de Framer Motion (whileInView pense que les éléments sont déjà
 * visibles et ne déclenche pas l'animation).
 *
 * À placer directement à l'intérieur de <BrowserRouter> dans App.tsx.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
