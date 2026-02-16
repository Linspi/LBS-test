import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  useAddressAutocomplete,
  type AddressSuggestion,
} from "@/hooks/useAddressAutocomplete";
import { cn } from "@/lib/utils";

interface AddressInputProps {
  /** Identifiant HTML du champ */
  id: string;
  /** Texte placeholder affiché quand le champ est vide */
  placeholder?: string;
  /** Valeur contrôlée du champ */
  value: string;
  /** Callback appelé quand la valeur change (frappe clavier ou sélection) */
  onChange: (value: string) => void;
  /** Classes CSS additionnelles pour le wrapper */
  className?: string;
}

/**
 * Champ de saisie d'adresse avec autocomplétion via l'API Adresse (BAN).
 *
 * Affiche une liste déroulante stylisée "premium" sous le champ quand des
 * suggestions sont disponibles. Gère :
 * - Navigation clavier (ArrowUp/Down, Enter, Escape)
 * - Fermeture au clic extérieur
 * - Icône de chargement pendant la recherche
 * - Design anthracite/noir avec hover doré
 */
export function AddressInput({
  id,
  placeholder = "Saisissez une adresse...",
  value,
  onChange,
  className,
}: AddressInputProps) {
  // État : le champ est-il en cours de saisie active (pas encore de sélection)
  const [isFocused, setIsFocused] = useState(false);
  // État : l'utilisateur a-t-il explicitement fermé la dropdown (Escape / clic extérieur)
  const [isDismissed, setIsDismissed] = useState(false);
  // Index de la suggestion actuellement surlignée au clavier (-1 = aucune)
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Refs pour détecter les clics extérieurs et scroller dans la liste
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Hook d'autocomplétion : récupère les suggestions depuis l'API
  const { suggestions, isLoading, clearSuggestions } =
    useAddressAutocomplete(value);

  /**
   * La dropdown est visible quand :
   * 1. Le champ est focus
   * 2. Des suggestions sont disponibles
   * 3. L'utilisateur n'a pas explicitement fermé la dropdown (Escape / sélection)
   *
   * C'est une valeur dérivée (calculée à chaque rendu), pas un état séparé.
   * Cela évite les cascades de setState dans des useEffect.
   */
  const isOpen = isFocused && suggestions.length > 0 && !isDismissed;

  // Fermer la dropdown au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Sélectionner une suggestion — remplit le champ et ferme la dropdown */
  const handleSelect = useCallback(
    (suggestion: AddressSuggestion) => {
      onChange(suggestion.label);
      setIsDismissed(true);
      clearSuggestions();
    },
    [onChange, clearSuggestions]
  );

  /** Gestion de la navigation clavier dans la dropdown */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsDismissed(true);
          break;
      }
    },
    [isOpen, suggestions, highlightedIndex, handleSelect]
  );

  // Scroll automatique pour garder l'élément surligné visible
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {/* Icône de localisation ou spinner de chargement */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        {isLoading ? (
          <Loader2 className="h-4 w-4 text-gold animate-spin" />
        ) : (
          <MapPin className="h-4 w-4 text-gold" />
        )}
      </div>

      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          // Quand l'utilisateur tape, on réactive la dropdown et reset la sélection clavier
          setIsDismissed(false);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Délai court pour permettre le clic sur une suggestion
          setTimeout(() => setIsFocused(false), 200);
        }}
        className="pl-10"
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls={`${id}-suggestions`}
        aria-activedescendant={
          highlightedIndex >= 0
            ? `${id}-suggestion-${highlightedIndex}`
            : undefined
        }
      />

      {/* Dropdown des suggestions — design premium */}
      {isOpen && (
        <ul
          ref={listRef}
          id={`${id}-suggestions`}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gold/20 bg-card shadow-xl shadow-black/30 backdrop-blur-sm"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`${id}-suggestion-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              onMouseDown={(e) => {
                // Empêcher le blur du input avant la sélection
                e.preventDefault();
                handleSelect(suggestion);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 text-sm",
                "border-b border-border/30 last:border-b-0",
                index === highlightedIndex
                  ? "bg-gold/10 text-gold"
                  : "text-foreground hover:bg-gold/5 hover:text-gold"
              )}
            >
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gold/60" />
              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium">
                  {suggestion.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {suggestion.postcode} {suggestion.city}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
