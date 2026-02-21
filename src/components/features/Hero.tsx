import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, MapPin, Navigation, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useAddressAutocomplete,
  type AddressSuggestion,
} from "@/hooks/useAddressAutocomplete";

export function Hero() {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");

  /** Naviguer vers la page de réservation avec les adresses pré-remplies */
  const handleEstimate = useCallback(() => {
    const params = new URLSearchParams({ type: "trajet" });
    if (departure.trim()) params.set("departure", departure.trim());
    if (arrival.trim()) params.set("destination", arrival.trim());
    navigate(`/reservation?${params.toString()}`);
  }, [departure, arrival, navigate]);

  return (
    /* Mobile : texte ancré en bas (items-end) — Desktop : centré (items-center) */
    <section className="relative min-h-screen flex items-end md:items-center justify-center overflow-hidden">

      {/* ── Image de fond ── */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/Hero.jpg"
          alt="Paris la nuit"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      {/* ── Overlays : gradient plus dense en bas sur mobile pour lisibilité ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0f1a]/40 via-[#0c0f1a]/65 to-[#0c0f1a]/97 md:from-[#0c0f1a]/80 md:via-[#0c0f1a]/85 md:to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f1a]/40 via-transparent to-[#0c0f1a]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,23,42,0.3)_0%,_rgba(12,15,26,0.8)_50%,_rgba(12,15,26,0.95)_100%)]" />

      {/* ── Glows décoratifs — masqués sur mobile (perf) ── */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gold/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-glow/[0.03] blur-[80px]" />
      </div>

      {/* ── Cadre Art Déco — bordure fine dorée desktop ── */}
      <div className="hidden md:block absolute inset-6 lg:inset-10 border border-gold/[0.07] rounded-lg pointer-events-none" />

      {/* ── Marqueur vertical signature — "PARIS · SINCE 2018" ── */}
      <div
        className="hidden lg:flex absolute left-10 xl:left-14 top-1/2 -translate-y-1/2 items-center gap-3 animate-hero-in z-10"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        <p className="text-vertical text-[9px] uppercase tracking-[0.5em] text-gold/50 font-medium">
          Paris · Depuis 2018
        </p>
      </div>

      {/* ── Contenu ── */}
      <div className="relative z-10 w-full max-w-5xl md:mx-auto px-6 md:px-4 pb-10 md:pb-0 md:text-center md:pt-20">

        {/* Mobile : ligne dorée + label ville */}
        <div className="md:hidden animate-hero-in mb-5" style={{ animationDelay: "0.05s" }}>
          <div className="w-7 h-px bg-gold mb-3" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
            Paris · Île-de-France · 24/7
          </p>
        </div>

        {/* Desktop : badge pill avec ornement */}
        <div
          className="hidden md:inline-flex items-center gap-3 rounded-full px-6 py-2.5 mb-8 glass animate-hero-in"
          style={{ animationDelay: "0.05s" }}
        >
          {/* Mini losange Art Déco */}
          <div className="h-1.5 w-1.5 bg-gold rotate-45" />
          <span className="text-xs uppercase tracking-[0.3em] text-gold/80 font-medium">
            Chauffeurs Privés d'Exception
          </span>
          <div className="h-1.5 w-1.5 bg-gold rotate-45" />
        </div>

        {/* Titre principal — typographie plus éditorial */}
        <h1
          className="font-display text-[2.5rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight md:leading-[1.05] mb-5 md:mb-6 animate-hero-in text-left md:text-center"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="text-foreground/90 font-light italic block">L'art du</span>
          <span className="text-gradient-gold font-semibold block mt-1 md:mt-2">transport privé</span>
        </h1>

        {/* Sous-titre — desktop uniquement */}
        <p
          className="hidden md:block text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-hero-in font-light"
          style={{ animationDelay: "0.3s" }}
        >
          Là où chaque trajet devient une expérience.
          <br className="hidden lg:block" />
          Ponctualité, discrétion et élégance à Paris.
        </p>

        {/* Barre de réservation fonctionnelle */}
        <div
          className="w-full md:max-w-3xl md:mx-auto animate-hero-in mb-5 md:mb-0"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 rounded-2xl sm:rounded-full glass-strong p-2 shadow-gold-glow">
            {/* Départ */}
            <HeroAddressField
              icon={<MapPin className="h-4 w-4 text-gold shrink-0" />}
              label="Départ"
              placeholder="Adresse de prise en charge"
              value={departure}
              onChange={setDeparture}
              inputId="hero-departure"
            />
            <div className="hidden sm:block w-px bg-white/10 my-2" />
            <div className="block sm:hidden h-px bg-white/10 mx-4" />
            {/* Arrivée */}
            <HeroAddressField
              icon={<Navigation className="h-4 w-4 text-gold shrink-0" />}
              label="Arrivée"
              placeholder="Destination souhaitée"
              value={arrival}
              onChange={setArrival}
              inputId="hero-arrival"
            />
            {/* Bouton Estimer */}
            <div className="sm:ml-auto flex items-center px-2 py-2">
              <button
                type="button"
                onClick={handleEstimate}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-light text-background font-semibold rounded-full px-6 py-3 sm:px-8 hover:brightness-110 transition-[filter] duration-300 shadow-[0_4px_20px_rgba(212,168,67,0.25)] cursor-pointer w-full sm:w-auto whitespace-nowrap"
              >
                Estimer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats — strip horizontal */}
        <div
          className="grid grid-cols-3 mt-0 md:mt-24 md:gap-8 md:max-w-md md:mx-auto pb-0 md:pb-10 animate-hero-in border-t border-white/[0.07] md:border-none pt-4 md:pt-0"
          style={{ animationDelay: "0.45s" }}
        >
          {[
            { value: "15K+", label: "Courses" },
            { value: "98%", label: "Satisfaction" },
            { value: "24/7", label: "Disponible" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
            >
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-gradient-gold">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Ornement bas de page desktop — ligne dorée avec losange ── */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <div className="art-deco-divider !py-4 !max-w-xs opacity-40">
          <div className="art-deco-diamond !w-[5px] !h-[5px]" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sous-composant : champ d'adresse inline pour le Hero
// ---------------------------------------------------------------------------

interface HeroAddressFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  inputId: string;
}

/**
 * Champ d'adresse inline avec autocomplétion, stylisé pour le Hero glass.
 * Utilise le même hook useAddressAutocomplete que AddressInput,
 * mais avec un design transparent qui s'intègre au conteneur glass-strong.
 */
function HeroAddressField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  inputId,
}: HeroAddressFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // Position calculée du dropdown (coordonnées viewport pour position: fixed)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { suggestions, isLoading, clearSuggestions } =
    useAddressAutocomplete(value);

  const isOpen = isFocused && suggestions.length > 0 && !isDismissed;

  /**
   * Calcule et applique la position du dropdown en fixed/viewport.
   * Appelé à l'ouverture puis à chaque scroll/resize pour que le dropdown
   * suive l'input. Si l'input sort du viewport, on ferme le dropdown.
   */
  const updateDropdownPosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // L'input est sorti de l'écran → fermer
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setIsFocused(false);
      return;
    }
    const isDesktop = window.innerWidth >= 640;
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      minWidth: isDesktop ? Math.max(rect.width, 420) : rect.width,
      zIndex: 9999,
      backgroundColor: "#0d1020",
      maxHeight: "18rem",
      overflowY: "auto",
      borderRadius: "0.75rem",
      border: "1px solid rgba(212, 168, 67, 0.2)",
      boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
    });
  }, []);

  // Calculer la position à l'ouverture du dropdown
  useEffect(() => {
    if (isOpen) updateDropdownPosition();
  }, [isOpen, updateDropdownPosition]);

  // Suivre le scroll et le resize pour que le dropdown reste ancré à l'input
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", updateDropdownPosition, { passive: true });
    window.addEventListener("resize", updateDropdownPosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  // Fermer au clic extérieur
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

  const handleSelect = useCallback(
    (suggestion: AddressSuggestion) => {
      onChange(suggestion.label);
      setIsDismissed(true);
      clearSuggestions();
    },
    [onChange, clearSuggestions]
  );

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

  // Scroll vers l'élément surligné
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div ref={wrapperRef} className="relative flex-1 flex">
      <div className="flex items-center gap-3 px-5 py-3 flex-1">
        {isLoading ? (
          <Loader2 className="h-4 w-4 text-gold shrink-0 animate-spin" />
        ) : (
          icon
        )}
        <div className="text-left flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-none mb-1">
            {label}
          </p>
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsDismissed(false);
              setHighlightedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={`${inputId}-suggestions`}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `${inputId}-suggestion-${highlightedIndex}`
                : undefined
            }
            className="w-full bg-transparent border-none outline-none text-sm text-foreground/90 placeholder:text-foreground/40 focus:text-foreground"
          />
        </div>
      </div>

      {/* Dropdown via Portal — rendu dans document.body pour sortir de tout
          contexte de stacking (backdrop-filter, glass, overlays Hero). */}
      {isOpen &&
        createPortal(
          <ul
            ref={listRef}
            id={`${inputId}-suggestions`}
            role="listbox"
            style={dropdownStyle}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                id={`${inputId}-suggestion-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(suggestion);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  backgroundColor:
                    index === highlightedIndex ? "#1a1608" : undefined,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  color: index === highlightedIndex ? "#d4a843" : "rgba(255,255,255,0.8)",
                  transition: "background-color 0.15s",
                }}
                onMouseLeave={(e) => {
                  if (index !== highlightedIndex) {
                    (e.currentTarget as HTMLLIElement).style.backgroundColor = "";
                  }
                }}
              >
                <MapPin
                  style={{ width: 14, height: 14, flexShrink: 0, color: "rgba(212,168,67,0.6)" }}
                />
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                    {suggestion.name}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {suggestion.postcode} {suggestion.city}
                  </span>
                </div>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}
