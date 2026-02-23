/**
 * AddressInput — Champ d'adresse avec autocomplétion Google Places.
 *
 * Utilise le composant <Autocomplete> de @react-google-maps/api pour fournir
 * des suggestions d'adresses en temps réel. Quand Google Maps n'est pas encore
 * chargé, affiche un simple input texte (pas de crash).
 *
 * Design conservé : icône MapPin dorée, style glassmorphism/Tailwind premium.
 */

import { useRef, useCallback } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { cn } from "@/lib/utils";

interface AddressInputProps {
  /** Identifiant HTML du champ */
  id: string;
  /** Texte placeholder affiché quand le champ est vide */
  placeholder?: string;
  /** Valeur contrôlée du champ */
  value: string;
  /** Callback appelé à chaque frappe clavier (met à jour RHF, invalide la sélection) */
  onChange: (value: string) => void;
  /**
   * Callback appelé UNIQUEMENT quand une adresse est formellement sélectionnée
   * dans la liste déroulante Google — jamais sur une frappe clavier.
   */
  onPlaceSelected?: (address: string) => void;
  /** Classes CSS additionnelles pour le wrapper */
  className?: string;
}

/** Options Autocomplete : restreint aux adresses en France + pays limitrophes */
const AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  componentRestrictions: { country: "fr" },
  fields: ["formatted_address", "geometry"],
  types: ["geocode", "establishment"],
};

export function AddressInput({
  id,
  placeholder = "Saisissez une adresse...",
  value,
  onChange,
  onPlaceSelected,
  className,
}: AddressInputProps) {
  const { isLoaded } = useGoogleMaps();

  // Ref vers l'instance Autocomplete Google — permet d'appeler getPlace()
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  /** Appelé quand le composant Autocomplete est monté et prêt */
  const handleLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  /** Appelé quand l'utilisateur sélectionne une adresse dans la dropdown Google */
  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      // 1. Sync le champ texte (React Hook Form)
      onChange(place.formatted_address);
      // 2. Notifie le parent que cette adresse est formellement validée par Google
      onPlaceSelected?.(place.formatted_address);
    }
  }, [onChange, onPlaceSelected]);

  // Si Google Maps n'est pas encore chargé, afficher un input simple
  if (!isLoaded) {
    return (
      <div className={cn("relative", className)}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <Loader2 className="h-4 w-4 text-gold animate-spin" />
        </div>
        <Input
          id={id}
          type="text"
          placeholder="Chargement Google Maps..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          disabled
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Icône de localisation dorée */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <MapPin className="h-4 w-4 text-gold" />
      </div>

      <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handlePlaceChanged}
        options={AUTOCOMPLETE_OPTIONS}
      >
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          autoComplete="off"
        />
      </Autocomplete>
    </div>
  );
}
