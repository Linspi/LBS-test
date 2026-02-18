import type { Vehicle } from "@/types";

export const vehicles: Vehicle[] = [
  {
    id: "classe-e",
    name: "Classe E",
    subtitle: "Business",
    description:
      "L'élégance pour vos déplacements professionnels. Confort et discrétion assurés dans une berline Mercedes Classe E.",
    passengers: 3,
    luggage: 3,
    services: [
      "Wi-Fi à bord",
      "Eau minérale offerte",
      "Chargeurs universels",
      "Presse du jour",
      "Bonbons",
      "Serviettes rafraîchissantes",
    ],
    image: "/images/classe-e.jpg",
    pricePerKm: 2.5,
  },
  {
    id: "classe-v",
    name: "Classe V",
    subtitle: "Van",
    description:
      "L'espace et le confort pour vos groupes. Idéal pour les transferts aéroport en famille ou les événements d'entreprise.",
    passengers: 7,
    luggage: 7,
    services: [
      "Wi-Fi à bord",
      "Espace généreux",
      "Eau minérale offerte",
      "Prises USB individuelles",
      "Configuration modulable",
      "Bonbons",
      "Serviettes rafraîchissantes",
    ],
    image: "/images/classe-v.jpg",
    pricePerKm: 3.5,
  },
  {
    id: "classe-s",
    name: "Classe S",
    subtitle: "Luxe",
    description:
      "Le summum du raffinement. La Mercedes Classe S offre une expérience de voyage incomparable pour vos occasions les plus prestigieuses.",
    passengers: 3,
    luggage: 3,
    services: [
      "Wi-Fi haut débit",
      "Eau minérale offerte",
      "Bonbons",
      "Serviettes rafraîchissantes",
      "Presse internationale",
      "Ambiance lumineuse personnalisée",
    ],
    image: "/images/classe-s.jpg",
    pricePerKm: 4.0,
  },
];
