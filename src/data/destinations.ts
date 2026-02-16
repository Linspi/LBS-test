import type { Destination, DestinationCategory } from "@/types";

export const destinations: Destination[] = [
  // --- Aéroports ---
  {
    id: "cdg",
    name: "Aéroport Charles de Gaulle",
    category: "aeroports",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80",
    startingPrice: 70,
    prices: { "classe-e": 70, "classe-s": 120, "classe-v": 100 },
  },
  {
    id: "orly",
    name: "Aéroport d'Orly",
    category: "aeroports",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80",
    startingPrice: 55,
    prices: { "classe-e": 55, "classe-s": 95, "classe-v": 80 },
  },
  {
    id: "beauvais",
    name: "Aéroport de Beauvais",
    category: "aeroports",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&q=80",
    startingPrice: 130,
    prices: { "classe-e": 130, "classe-s": 200, "classe-v": 170 },
  },
  {
    id: "le-bourget",
    name: "Aéroport du Bourget",
    category: "aeroports",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80",
    startingPrice: 65,
    prices: { "classe-e": 65, "classe-s": 110, "classe-v": 90 },
  },

  // --- Gares ---
  {
    id: "gare-du-nord",
    name: "Gare du Nord",
    category: "gares",
    image: "https://images.unsplash.com/photo-1587019158091-1a4a3f901e47?w=800&q=80",
    startingPrice: 35,
    prices: { "classe-e": 35, "classe-s": 65, "classe-v": 50 },
  },
  {
    id: "gare-de-lyon",
    name: "Gare de Lyon",
    category: "gares",
    image: "https://images.unsplash.com/photo-1597931188884-7590735e2e69?w=800&q=80",
    startingPrice: 35,
    prices: { "classe-e": 35, "classe-s": 65, "classe-v": 50 },
  },
  {
    id: "gare-montparnasse",
    name: "Gare Montparnasse",
    category: "gares",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
    startingPrice: 35,
    prices: { "classe-e": 35, "classe-s": 65, "classe-v": 50 },
  },
  {
    id: "gare-de-lest",
    name: "Gare de l'Est",
    category: "gares",
    image: "https://images.unsplash.com/photo-1568625365131-079e026a927d?w=800&q=80",
    startingPrice: 35,
    prices: { "classe-e": 35, "classe-s": 65, "classe-v": 50 },
  },
  {
    id: "gare-saint-lazare",
    name: "Gare Saint-Lazare",
    category: "gares",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80",
    startingPrice: 35,
    prices: { "classe-e": 35, "classe-s": 65, "classe-v": 50 },
  },

  // --- Châteaux ---
  {
    id: "versailles",
    name: "Château de Versailles",
    category: "chateaux",
    image: "https://images.unsplash.com/photo-1590099543325-b5d6fe22db4d?w=800&q=80",
    startingPrice: 80,
    prices: { "classe-e": 80, "classe-s": 140, "classe-v": 110 },
  },
  {
    id: "fontainebleau",
    name: "Château de Fontainebleau",
    category: "chateaux",
    image: "https://images.unsplash.com/photo-1589115222893-7b9eca0bcc06?w=800&q=80",
    startingPrice: 120,
    prices: { "classe-e": 120, "classe-s": 190, "classe-v": 160 },
  },
  {
    id: "vaux-le-vicomte",
    name: "Château de Vaux-le-Vicomte",
    category: "chateaux",
    image: "https://images.unsplash.com/photo-1597073642928-48c0971d5e25?w=800&q=80",
    startingPrice: 110,
    prices: { "classe-e": 110, "classe-s": 180, "classe-v": 150 },
  },
  {
    id: "chantilly",
    name: "Château de Chantilly",
    category: "chateaux",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
    startingPrice: 100,
    prices: { "classe-e": 100, "classe-s": 170, "classe-v": 140 },
  },

  // --- Parcs ---
  {
    id: "disneyland",
    name: "Disneyland Paris",
    category: "parcs",
    image: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=800&q=80",
    startingPrice: 90,
    prices: { "classe-e": 90, "classe-s": 150, "classe-v": 120 },
  },
  {
    id: "parc-asterix",
    name: "Parc Astérix",
    category: "parcs",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=800&q=80",
    startingPrice: 100,
    prices: { "classe-e": 100, "classe-s": 165, "classe-v": 135 },
  },
  {
    id: "france-miniature",
    name: "France Miniature",
    category: "parcs",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    startingPrice: 75,
    prices: { "classe-e": 75, "classe-s": 130, "classe-v": 105 },
  },
];

export function getDestinationsByCategory(
  category: DestinationCategory,
): Destination[] {
  return destinations.filter((d) => d.category === category);
}
