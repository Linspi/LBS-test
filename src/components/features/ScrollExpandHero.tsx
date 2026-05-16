/**
 * ScrollExpandHero — Hero interactif à expansion au scroll
 *
 * Séquence :
 *   1. La vidéo démarre petite au centre, le titre s'écarte au scroll
 *   2. À 100% d'expansion → overlays sombres + contenu Hero original
 *      (badge, titre, sous-titre, barre de réservation, stats)
 *      apparaissent en fondu par-dessus la vidéo plein écran
 *   3. Le scroll se libère, le reste de la page défile normalement
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Navigation } from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { HoverButton } from "@/components/ui/hover-button";

/* ─── Props ──────────────────────────────────────────────── */

interface ScrollExpandHeroProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  children?: ReactNode;
}

/* ─── Composant principal ────────────────────────────────── */

export function ScrollExpandHero({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  children,
}: ScrollExpandHeroProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [scrollProgress, setScrollProgress]         = useState(0);
  const [showContent, setShowContent]               = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY]               = useState(0);
  const [isMobile, setIsMobile]                     = useState(false);
  const [videoOpacity, setVideoOpacity]             = useState(1);

  /* Champs de réservation */
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival]     = useState("");

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  const handleEstimate = useCallback(() => {
    const params = new URLSearchParams({ type: "trajet" });
    if (departure.trim()) params.set("departure", departure.trim());
    if (arrival.trim())   params.set("destination", arrival.trim());
    navigate(`/reservation?${params.toString()}`);
  }, [departure, arrival, navigate]);

  /* Reset si le type de media change */
  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  /* Pause / lecture selon si le scroll a commencé */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (scrollProgress > 0) {
      video.playbackRate = 0.65; // cinématique sans être trop lent
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [scrollProgress]);

  /* Boucle invisible : fondu sortant → reset → fondu entrant */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      /* 1. Fondu vers noir (600ms via transition CSS) */
      setVideoOpacity(0);
      setTimeout(() => {
        /* 2. Retour au début + relance */
        video.currentTime = 0;
        video.playbackRate = 0.65;
        video.play().catch(() => {});
        /* 3. Fondu retour (léger délai pour que le frame 0 soit chargé) */
        setTimeout(() => setVideoOpacity(1), 80);
      }, 620);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  /* Détection mobile / resize */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Gestion des événements de scroll / touch */
  useEffect(() => {
    const handleWheel = (e: Event) => {
      const we = e as unknown as WheelEvent;
      if (mediaFullyExpanded && we.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        setShowContent(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const delta       = we.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
        }
        setShowContent(newProgress >= 0.5);
      }
    };

    const handleTouchStart = (e: Event) => {
      const te = e as unknown as TouchEvent;
      setTouchStartY(te.touches[0].clientY);
    };

    const handleTouchMove = (e: Event) => {
      const te = e as unknown as TouchEvent;
      if (!touchStartY) return;
      const deltaY = touchStartY - te.touches[0].clientY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        setShowContent(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const factor      = deltaY < 0 ? 0.008 : 0.005;
        const newProgress = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
        }
        setShowContent(newProgress >= 0.5);
        setTouchStartY(te.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

    const handleScroll = () => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel",      handleWheel,      { passive: false });
    window.addEventListener("scroll",     handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove",  handleTouchMove,  { passive: false });
    window.addEventListener("touchend",   handleTouchEnd);

    return () => {
      window.removeEventListener("wheel",      handleWheel);
      window.removeEventListener("scroll",     handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove",  handleTouchMove);
      window.removeEventListener("touchend",   handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  /* ── Calculs d'animation ── */
  const mediaWidth     = 300 + scrollProgress * (isMobile ? 650  : 1250);
  const mediaHeight    = 400 + scrollProgress * (isMobile ? 200  : 400);
  const textTranslateX = scrollProgress * (isMobile ? 180 : 150);

  const titleLine1 = t("hero.titleLine1");
  const titleLine2 = t("hero.titleLine2");

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">

          {/* ── Image de fond (disparaît au scroll) ── */}
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt={t("hero.altImage")}
              className="w-screen h-screen object-cover"
              style={{ objectPosition: "center 55%" }}
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>

          {/* ── Contenu centré ── */}
          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">

              {/* ── Bloc média (s'étend au scroll) ── */}
              <div
                className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
                style={{
                  width:      `${mediaWidth}px`,
                  height:     `${mediaHeight}px`,
                  maxWidth:   "100vw",
                  maxHeight:  "100vh",
                  boxShadow:  mediaFullyExpanded ? "none" : "0 0 60px rgba(0,0,0,0.4)",
                  borderRadius: mediaFullyExpanded ? 0 : undefined,
                  transition: "border-radius 0.4s, box-shadow 0.4s",
                }}
              >
                {mediaType === "video" ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      ref={videoRef}
                      src={mediaSrc}
                      poster={posterSrc}
                      muted
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: "center 55%",
                        opacity:    videoOpacity,
                        transition: "opacity 0.6s ease",
                      }}
                      disablePictureInPicture
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={mediaSrc}
                      alt={t("hero.altImage")}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* ── Voile sombre — même taille que la vidéo ── */}
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    className="absolute z-[1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/40"
                    style={{
                      width:        `${mediaWidth}px`,
                      height:       `${mediaHeight}px`,
                      maxWidth:     "100vw",
                      maxHeight:    "100vh",
                      borderRadius: mediaFullyExpanded ? 0 : "1rem",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              {/* ── Titre qui s'écarte (visible AVANT expansion complète) ── */}
              <AnimatePresence>
                {!showContent && (
                  <motion.div
                    className="flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col pointer-events-none"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h1
                      className="font-display text-4xl md:text-6xl lg:text-7xl font-light italic text-white/90 tracking-tight"
                      style={{ transform: `translateX(-${textTranslateX}vw)`, transition: "none" }}
                    >
                      {titleLine1}
                    </motion.h1>
                    <motion.h1
                      className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-gradient-gold tracking-tight"
                      style={{ transform: `translateX(${textTranslateX}vw)`, transition: "none" }}
                    >
                      {titleLine2}
                    </motion.h1>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Contenu Hero original (apparaît APRÈS expansion) ── */}
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    className="absolute inset-0 z-10 flex items-end md:items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                  >
                    <div className="w-full max-w-5xl md:mx-auto px-6 md:px-4 pb-10 md:pb-0 md:text-center md:pt-20">

                      {/* Mobile : ligne dorée + label ville */}
                      <div className="md:hidden mb-5">
                        <div className="w-7 h-px bg-gold mb-3" />
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
                          {t("hero.taglineMobile")}
                        </p>
                      </div>

                      {/* Desktop : badge pill */}
                      <motion.div
                        className="hidden md:inline-flex items-center gap-3 rounded-full px-6 py-2.5 mb-8 glass"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <div className="h-1.5 w-1.5 bg-gold rotate-45" />
                        <span className="text-xs uppercase tracking-[0.3em] text-gold/80 font-medium">
                          {t("hero.badge")}
                        </span>
                        <div className="h-1.5 w-1.5 bg-gold rotate-45" />
                      </motion.div>

                      {/* Titre principal */}
                      <motion.h1
                        className="font-display text-[2.5rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight md:leading-[1.05] mb-5 md:mb-6 text-left md:text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                      >
                        <span className="text-foreground/90 font-light italic block">{titleLine1}</span>
                        <span className="text-gradient-gold font-semibold block mt-1 md:mt-2">{titleLine2}</span>
                      </motion.h1>

                      {/* Sous-titre — desktop */}
                      <motion.p
                        className="hidden md:block text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                      >
                        <Trans i18nKey="hero.subtitle" components={{ br: <br className="hidden lg:block" /> }} />
                      </motion.p>

                      {/* Barre de réservation */}
                      <motion.div
                        className="relative z-50 w-full md:max-w-3xl md:mx-auto mb-5 md:mb-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 rounded-2xl sm:rounded-full bg-[rgba(14,16,28,0.82)] border border-white/[0.12] shadow-gold-glow pointer-events-none" />

                          <div className="relative flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 p-2">
                            <HeroAddressField
                              icon={<MapPin className="h-4 w-4 text-gold shrink-0" />}
                              label={t("hero.departure")}
                              placeholder={t("hero.departurePlaceholder")}
                              value={departure}
                              onChange={setDeparture}
                              inputId="hero-departure"
                            />
                            <div className="hidden sm:block w-px bg-white/10 my-2" />
                            <div className="block sm:hidden h-px bg-white/10 mx-4" />
                            <HeroAddressField
                              icon={<Navigation className="h-4 w-4 text-gold shrink-0" />}
                              label={t("hero.arrival")}
                              placeholder={t("hero.arrivalPlaceholder")}
                              value={arrival}
                              onChange={setArrival}
                              inputId="hero-arrival"
                            />
                            <div className="sm:ml-auto flex items-center px-2 py-2">
                              <HoverButton
                                onClick={handleEstimate}
                                circleStart="#5A7A9C"
                                circleEnd="#A3C0DC"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 text-foreground/90"
                              >
                                {t("hero.estimate")}
                                <ArrowRight className="h-4 w-4" />
                              </HoverButton>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Stats */}
                      <motion.div
                        className="relative z-10 grid grid-cols-3 mt-0 md:mt-24 md:gap-8 md:max-w-md md:mx-auto pb-0 md:pb-10 border-t border-white/[0.07] md:border-none pt-4 md:pt-0"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                      >
                        {[
                          { value: "15K+", label: t("hero.stats.rides") },
                          { value: "98%",  label: t("hero.stats.satisfaction") },
                          { value: "24/7", label: t("hero.stats.available") },
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
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Indicateur scroll (visible avant expansion) ── */}
              <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                animate={{ opacity: mediaFullyExpanded ? 0 : 1 - scrollProgress * 2 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white/50 text-xs uppercase tracking-[0.3em]">
                  {t("hero.scrollToExpand")}
                </span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
                />
              </motion.div>
            </div>

            {/* ── Contenu enfant (InfiniteMarquee, etc.) ── */}
            <motion.div
              className="flex flex-col w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sous-composant : champ d'adresse avec Google Places ─── */

const AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  componentRestrictions: { country: "fr" },
  fields: ["formatted_address"],
  types: ["geocode", "establishment"],
};

interface HeroAddressFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  inputId: string;
}

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
  const wrapperRef      = useRef<HTMLDivElement>(null);

  const handleLoad = useCallback((ac: google.maps.places.Autocomplete) => {
    autocompleteRef.current = ac;
  }, []);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) onChange(place.formatted_address);
  }, [onChange]);

  const syncPacWidth = useCallback(() => {
    if (!wrapperRef.current) return;
    const { width, left } = wrapperRef.current.getBoundingClientRect();
    document.documentElement.style.setProperty("--pac-width", `${Math.round(width)}px`);
    document.documentElement.style.setProperty("--pac-left",  `${Math.round(left + window.scrollX)}px`);
  }, []);

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
