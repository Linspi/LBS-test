import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Interface représentant une suggestion d'adresse renvoyée par l'API.
 * On extrait uniquement les champs utiles du GeoJSON.
 */
export interface AddressSuggestion {
  /** Identifiant unique (id GeoJSON) */
  id: string;
  /** Adresse complète formatée (ex: "12 Rue de Rivoli 75001 Paris") */
  label: string;
  /** Nom de la rue / voie */
  name: string;
  /** Ville */
  city: string;
  /** Code postal */
  postcode: string;
}

/** Durée du debounce en ms — évite de surcharger l'API à chaque frappe */
const DEBOUNCE_MS = 300;

/** Nombre minimum de caractères avant de déclencher la recherche */
const MIN_QUERY_LENGTH = 3;

/** URL de base de l'API Adresse du gouvernement français (gratuite, sans clé) */
const API_BASE_URL = "https://api-adresse.data.gouv.fr/search";

/**
 * Hook personnalisé pour l'autocomplétion d'adresses françaises.
 *
 * Utilise l'API publique api-adresse.data.gouv.fr (BAN - Base Adresse Nationale).
 * - Debounce de 300ms pour limiter les appels réseau
 * - Déclenchement après 3 caractères minimum
 * - Gestion d'erreurs silencieuse (pas de crash côté utilisateur)
 * - Nettoyage automatique des requêtes en cours si le composant est démonté
 *
 * @param query - Le texte saisi par l'utilisateur dans le champ d'adresse
 * @returns { suggestions, isLoading } — liste de suggestions et état de chargement
 */
export function useAddressAutocomplete(query: string) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Référence vers le controller AbortController pour annuler les requêtes en vol
  const abortControllerRef = useRef<AbortController | null>(null);

  /** Efface les suggestions (utile quand l'utilisateur sélectionne une adresse) */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  useEffect(() => {
    // Si le texte est trop court, on vide les suggestions et on arrête
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Debounce : on attend DEBOUNCE_MS avant de lancer la requête
    const timeoutId = setTimeout(async () => {
      // Annuler la requête précédente si elle est encore en cours
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      try {
        const url = `${API_BASE_URL}?q=${encodeURIComponent(query.trim())}&limit=5`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          // Erreur serveur — on échoue silencieusement
          setSuggestions([]);
          return;
        }

        const data = await response.json();

        // L'API renvoie un GeoJSON FeatureCollection
        // Chaque "feature" contient les propriétés de l'adresse
        const results: AddressSuggestion[] = (data.features ?? []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (feature: any) => ({
            id: feature.properties.id ?? crypto.randomUUID(),
            label: feature.properties.label ?? "",
            name: feature.properties.name ?? "",
            city: feature.properties.city ?? "",
            postcode: feature.properties.postcode ?? "",
          })
        );

        // Vérifier que la requête n'a pas été annulée entre-temps
        if (!controller.signal.aborted) {
          setSuggestions(results);
        }
      } catch (error: unknown) {
        // AbortError = requête annulée volontairement — pas une vraie erreur
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        // Toute autre erreur réseau → échouer silencieusement
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    // Cleanup : annuler le timeout si le query change avant le debounce
    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return { suggestions, isLoading, clearSuggestions };
}
