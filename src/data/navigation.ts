import type { ServiceBlock } from "@/types";

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Trajets", href: "/trajets" },
  { label: "Mise à disposition", href: "/mise-a-disposition" },
  { label: "Excursions", href: "/excursions" },
  { label: "Événements", href: "/evenements" },
  { label: "Location", href: "/location" },
  { label: "Entreprise", href: "/entreprise" },
];

export const SERVICE_BLOCKS: ServiceBlock[] = [
  {
    title: "Trajets",
    subtitle: "Aéroports, gares & destinations",
    image: "/images/thibault-penin-a8r2KKLSntA-unsplash.jpg",
    href: "/trajets",
  },
  {
    title: "Mise à disposition",
    subtitle: "Votre chauffeur dédié à l'heure",
    image: "/images/unnamed.jpg",
    href: "/mise-a-disposition",
  },
  {
    title: "Excursions",
    subtitle: "Découvrez l'Île-de-France",
    image: "/images/Image_excursion.jpg",
    href: "/excursions",
  },
  {
    title: "Événements",
    subtitle: "Soirées, galas & occasions spéciales",
    image: "/images/rolls_royce_event.jpg",
    href: "/evenements",
  },
];
