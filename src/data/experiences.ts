import type { Experience } from "@/types";

/**
 * Catalogue des excursions et événements proposés par BLS.
 *
 * Les textes (title, subtitle, description, duration, inclusions)
 * sont externalisés dans les dictionnaires i18n sous la clé
 * `experienceData.<id>.*`.
 *
 * Seules les données structurelles (id, catégorie, image, prix)
 * restent ici.
 */
export const experiences: Experience[] = [
  // ── Excursions ────────────────────────────────────────
  { id: "versailles",      category: "excursion",  image: "/images/Versailles.jpg",      inclusionCount: 4, estimatedPrice: null },
  { id: "chantilly",       category: "excursion",  image: "/images/chantilly.jpg",        inclusionCount: 4, estimatedPrice: null },
  { id: "fontainebleau",   category: "excursion",  image: "/images/fontainebleau.jpg",    inclusionCount: 4, estimatedPrice: null },
  { id: "chambord",        category: "excursion",  image: "/images/chambord.jpg",         inclusionCount: 5, estimatedPrice: null },
  { id: "auvers-sur-oise", category: "excursion",  image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=800&q=80", inclusionCount: 4, estimatedPrice: null },
  { id: "vallee-chevreuse", category: "excursion", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", inclusionCount: 4, estimatedPrice: null },

  // ── Événements ────────────────────────────────────────
  { id: "mariage",    category: "evenement", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", inclusionCount: 4, estimatedPrice: null },
  { id: "gala",       category: "evenement", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", inclusionCount: 4, estimatedPrice: null },
  { id: "entreprise", category: "evenement", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80", inclusionCount: 4, estimatedPrice: null },
  { id: "sur-mesure", category: "evenement", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80", inclusionCount: 4, estimatedPrice: null },
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
