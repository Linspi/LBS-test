import type { Experience } from "@/types";

/**
 * Catalogue des excursions et événements proposés par LBS.
 * Chaque entrée alimente la page /reservation-experience
 * via un paramètre URL (?experience=<id>).
 */
export const experiences: Experience[] = [
  // ── Excursions ────────────────────────────────────────
  {
    id: "versailles",
    category: "excursion",
    title: "Château de Versailles & Jardins",
    subtitle: "Journée royale aux portes de Paris",
    image:
      "/images/Versailles.jpg",
    description:
      "Découvrez le château le plus célèbre du monde et ses jardins à la française. Votre chauffeur vous attend sur place le temps de votre visite.",
    duration: "Journée complète (~8h)",
    inclusions: [
      "Chauffeur à disposition",
      "Eau & rafraîchissements",
      "Wi-Fi à bord",
      "Attente sur place incluse",
    ],
    estimatedPrice: 350,
  },
  {
    id: "chantilly",
    category: "excursion",
    title: "Château de Chantilly",
    subtitle: "Art, histoire et nature au nord de Paris",
    image:
      "/images/chantilly.jpg",
    description:
      "Visitez le domaine de Chantilly, son musée Condé et ses écuries majestueuses. Un joyau méconnu de l'Île-de-France.",
    duration: "Journée complète (~7h)",
    inclusions: [
      "Chauffeur à disposition",
      "Eau & rafraîchissements",
      "Wi-Fi à bord",
      "Attente sur place incluse",
    ],
    estimatedPrice: 320,
  },
  {
    id: "fontainebleau",
    category: "excursion",
    title: "Château de Fontainebleau",
    subtitle: "Résidence des rois de France",
    image:
      "/images/fontainebleau.jpg",
    description:
      "Explorez huit siècles d'histoire dans ce château classé au patrimoine mondial de l'UNESCO, entouré d'une forêt magnifique.",
    duration: "Journée complète (~7h)",
    inclusions: [
      "Chauffeur à disposition",
      "Eau & rafraîchissements",
      "Wi-Fi à bord",
      "Attente sur place incluse",
    ],
    estimatedPrice: 380,
  },
  {
    id: "chambord",
    category: "excursion",
    title: "Château de Chambord",
    subtitle: "Chef-d'œuvre de la Renaissance en Val de Loire",
    image:
      "/images/chambord.jpg",
    description:
      "Partez à la découverte du plus grand château de la Loire et de son escalier à double révolution conçu par Léonard de Vinci.",
    duration: "Journée complète (~10h)",
    inclusions: [
      "Chauffeur à disposition",
      "Eau & champagne",
      "Wi-Fi à bord",
      "Attente sur place incluse",
      "Arrêts photos en chemin",
    ],
    estimatedPrice: 550,
  },
  {
    id: "auvers-sur-oise",
    category: "excursion",
    title: "Auvers-sur-Oise — Sur les pas de Van Gogh",
    subtitle: "Balade artistique en bord de rivière",
    image:
      "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=800&q=80",
    description:
      "Marchez dans les pas du célèbre peintre : l'église d'Auvers, la maison du Docteur Gachet et le champ de blé aux corbeaux.",
    duration: "Demi-journée (~5h)",
    inclusions: [
      "Chauffeur à disposition",
      "Eau & rafraîchissements",
      "Wi-Fi à bord",
      "Attente sur place incluse",
    ],
    estimatedPrice: 250,
  },
  {
    id: "vallee-chevreuse",
    category: "excursion",
    title: "Vallée de Chevreuse",
    subtitle: "Escapade nature aux portes de Paris",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    description:
      "Découvrez les villages pittoresques, les abbayes et les châteaux de cette vallée verdoyante à seulement 30 km de Paris.",
    duration: "Demi-journée (~5h)",
    inclusions: [
      "Chauffeur à disposition",
      "Eau & rafraîchissements",
      "Wi-Fi à bord",
      "Itinéraire personnalisable",
    ],
    estimatedPrice: 250,
  },

  // ── Événements ────────────────────────────────────────
  {
    id: "mariage",
    category: "evenement",
    title: "Mariage",
    subtitle: "Un service irréprochable pour le plus beau jour",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    description:
      "Transport des mariés et des invités avec des véhicules décorés sur demande. Service de navette aller-retour inclus.",
    duration: "Sur mesure",
    inclusions: [
      "Véhicule décoré",
      "Champagne à bord",
      "Chauffeur en costume",
      "Navette invités disponible",
    ],
    estimatedPrice: null,
  },
  {
    id: "gala",
    category: "evenement",
    title: "Galas & Soirées",
    subtitle: "Arrivez avec élégance à vos événements",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    description:
      "Service de transport aller-retour pour vos soirées les plus prestigieuses. Ponctualité et discrétion garanties.",
    duration: "Soirée (~4-6h)",
    inclusions: [
      "Chauffeur à disposition",
      "Champagne à bord",
      "Attente sur place",
      "Retour garanti",
    ],
    estimatedPrice: null,
  },
  {
    id: "entreprise",
    category: "evenement",
    title: "Événements d'entreprise",
    subtitle: "Gestion de flotte pour vos séminaires",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
    description:
      "Transport coordonné pour séminaires, team buildings et conférences. Gestion de flotte multi-véhicules sur demande.",
    duration: "Sur mesure",
    inclusions: [
      "Flotte dédiée",
      "Coordination logistique",
      "Wi-Fi à bord",
      "Facturation entreprise",
    ],
    estimatedPrice: null,
  },
  {
    id: "sur-mesure",
    category: "evenement",
    title: "Événement sur mesure",
    subtitle: "Chaque occasion est unique",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    description:
      "Vous avez un besoin spécifique ? Contactez-nous pour un devis personnalisé adapté à votre événement.",
    duration: "Sur mesure",
    inclusions: [
      "Devis personnalisé",
      "Chauffeur dédié",
      "Véhicule au choix",
      "Service adaptable",
    ],
    estimatedPrice: null,
  },
];

/** Helper : récupère une expérience par son ID */
export function getExperienceById(id: string): Experience | undefined {
  return experiences.find((exp) => exp.id === id);
}

/** Helper : filtre les expériences par catégorie */
export function getExperiencesByCategory(
  category: Experience["category"]
): Experience[] {
  return experiences.filter((exp) => exp.category === category);
}
