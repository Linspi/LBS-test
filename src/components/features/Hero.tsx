import { useState, useRef, useCallback } from "react";
import { ArrowRight, MapPin, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";

/** Options partagées pour les deux champs du Hero */
const AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  componentRestrictions: { country: "fr" },
  fields: ["formatted_address"],
  types: ["geocode", "establishment"],
};

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

        {/* Barre de réservation fonctionnelle
            IMPORTANT : animate-hero-in est sur un wrapper SÉPARÉ qui ne contient
            PAS le dropdown. L'animation CSS avec fill-mode:both crée un stacking
            context GPU qui force la transparence sur tous les enfants. */}
        <div
          className="relative z-50 w-full md:max-w-3xl md:mx-auto animate-hero-in mb-5 md:mb-0"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="relative">

            {/* 2. Fond Glassmorphism indépendant — ne crée PAS de stacking context sur les enfants */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-full bg-[rgba(14,16,28,0.82)] border border-white/[0.12] shadow-gold-glow pointer-events-none" />

            {/* 3. Zone interactive — relative, passe par-dessus le fond */}
            <div className="relative flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 p-2">
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
        </div>

        {/* Stats — z-10 pour rester derrière le wrapper barre (z-50) */}
        <div
          className="relative z-10 grid grid-cols-3 mt-0 md:mt-24 md:gap-8 md:max-w-md md:mx-auto pb-0 md:pb-10 animate-hero-in border-t border-white/[0.07] md:border-none pt-4 md:pt-0"
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
// Sous-composant : champ d'adresse Hero avec Google Places Autocomplete
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
 * Champ d'adresse inline pour le Hero, branché sur Google Places Autocomplete.
 *
 * Le dropdown natif de Google (.pac-container) est stylisé via index.css.
 * syncPacWidth() force la largeur du dropdown à correspondre exactement
 * à celle du champ complet (icône incluse), car Google la calcule
 * en se basant uniquement sur la largeur de l'<input> brut.
 */
function HeroAddressField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  inputId,
}: HeroAddressFieldProps) {
  const { isLoaded } = useGoogleMaps();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLoad = useCallback((ac: google.maps.places.Autocomplete) => {
    autocompleteRef.current = ac;
  }, []);

  /** Déclenché quand l'utilisateur clique une suggestion Google */
  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      onChange(place.formatted_address);
    }
  }, [onChange]);

  /**
   * Aligne la largeur du dropdown sur le wrapper complet du champ.
   *
   * Google crée un .pac-container par instance <Autocomplete>.
   * On applique les dimensions à TOUS les dropdowns non masqués pour éviter
   * les conflits entre les deux instances du Hero (Départ / Arrivée).
   * setTimeout(10ms) laisse à Google le temps de finir d'injecter le DOM.
   */
  const syncPacWidth = useCallback(() => {
    // Un léger setTimeout permet à l'API Google de finir d'injecter/afficher le DOM
    setTimeout(() => {
      if (!wrapperRef.current) return;

      const { width, left } = wrapperRef.current.getBoundingClientRect();
      const pacContainers = document.querySelectorAll(".pac-container");
      // On applique les dimensions à TOUS les dropdowns qui ne sont pas explicitement cachés.
      // Cela évite les conflits entre les instances de l'Autocomplete.
      pacContainers.forEach((pac) => {
        const el = pac as HTMLElement;
        if (el.style.display !== "none") {
          el.style.width = `${Math.round(width)}px`;
          el.style.left = `${Math.round(left + window.scrollX)}px`;
        }
      });
    }, 10);
  }, []);

  /** Input avec le style Hero (transparent, sans bordure) */
  const inputEl = (
    <input
      id={inputId}
      type="text"
      value={value}
      onChange={(e) => { onChange(e.target.value); syncPacWidth(); }}
      onFocus={syncPacWidth}
      placeholder={placeholder}
      autoComplete="off"
      className="w-full bg-transparent border-none outline-none text-sm text-foreground/90 placeholder:text-foreground/40 focus:text-foreground"
    />
  );

  return (
    <div ref={wrapperRef} className="relative flex-1 flex">
      <div className="flex items-center gap-3 px-5 py-3 flex-1">
        {icon}
        <div className="text-left flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-none mb-1">
            {label}
          </p>
          {isLoaded ? (
            <Autocomplete
              onLoad={handleLoad}
              onPlaceChanged={handlePlaceChanged}
              options={AUTOCOMPLETE_OPTIONS}
            >
              {inputEl}
            </Autocomplete>
          ) : (
            inputEl
          )}
        </div>
      </div>
    </div>
  );
}
