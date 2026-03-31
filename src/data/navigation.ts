import type { ServiceBlock } from "@/types";

export interface NavLink {
  label: string;
  href: string;
}

/** Les labels sont des clés i18n (ex: "nav.home") résolues via t() dans le composant */
export const NAV_LINKS: NavLink[] = [
  { label: "nav.home", href: "/" },
  { label: "nav.trips", href: "/trajets" },
  { label: "nav.chauffeur", href: "/mise-a-disposition" },
  { label: "nav.excursions", href: "/excursions" },
  { label: "nav.events", href: "/evenements" },
  { label: "nav.rental", href: "/location" },
  { label: "nav.corporate", href: "/entreprise" },
];

/** Les labels sont des clés i18n résolues via t() dans le composant */
export const SERVICE_BLOCKS: ServiceBlock[] = [
  {
    titleKey: "home.serviceBlocks.trips.title",
    subtitleKey: "home.serviceBlocks.trips.subtitle",
    image: "/images/trajet_services.jpg",
    href: "/trajets",
  },
  {
    titleKey: "home.serviceBlocks.chauffeur.title",
    subtitleKey: "home.serviceBlocks.chauffeur.subtitle",
    image: "/images/unnamed.jpg",
    href: "/mise-a-disposition",
  },
  {
    titleKey: "home.serviceBlocks.excursions.title",
    subtitleKey: "home.serviceBlocks.excursions.subtitle",
    image: "/images/Image_excursion.jpg",
    href: "/excursions",
  },
  {
    titleKey: "home.serviceBlocks.events.title",
    subtitleKey: "home.serviceBlocks.events.subtitle",
    image: "/images/rolls_royce_event.jpg",
    href: "/evenements",
  },
];
