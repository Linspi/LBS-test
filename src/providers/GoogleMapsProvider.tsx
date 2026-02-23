/**
 * GoogleMapsProvider — Charge le script Google Maps une seule fois pour toute l'application.
 *
 * Utilise useJsApiLoader de @react-google-maps/api et expose `isLoaded` via React Context.
 * Les composants enfants (ex: AddressInput) consomment ce contexte pour savoir
 * quand Google Maps est prêt à être utilisé.
 *
 * IMPORTANT : la prop `libraries` doit être un tableau stable (déclaré hors du composant)
 * sinon useJsApiLoader rechargerait le script en boucle.
 */

import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// Tableau stable déclaré hors du composant — évite les rechargements infinis
const LIBRARIES: ("places")[] = ["places"];

interface GoogleMapsContextValue {
  isLoaded: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  isLoaded: false,
});

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

/** Hook pour accéder au contexte Google Maps depuis n'importe quel composant enfant */
export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}
