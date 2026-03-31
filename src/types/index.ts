export type VehicleClass = "classe-e" | "classe-s" | "classe-v";

export type BookingMode = "trajet" | "mise-a-disposition";

export interface Vehicle {
  id: VehicleClass;
  name: string;
  subtitle: string;
  description: string;
  passengers: number;
  luggage: number;
  services: string[];
  image: string;
  pricePerKm: number;
}

export interface BookingFormData {
  mode: BookingMode;
  departure: string;
  arrival: string;
  date: Date | undefined;
  time: string;
  vehicleClass: VehicleClass;
}

export interface PriceEstimate {
  basePrice: number;
  vehicleSupplement: number;
  total: number;
  currency: string;
  isAirportTransfer: boolean;
  airportName?: string;
}

export interface AirportForfait {
  name: string;
  keyword: string;
  prices: Record<VehicleClass, number>;
}

export type DestinationCategory = "aeroports" | "gares" | "chateaux" | "parcs";

export interface Destination {
  id: string;
  name: string;
  category: DestinationCategory;
  image: string;
  startingPrice: number;
  prices: Record<VehicleClass, number>;
}

export interface ServiceBlock {
  /** Clé i18n pour le titre (ex: "home.serviceBlocks.trips.title") */
  titleKey: string;
  /** Clé i18n pour le sous-titre */
  subtitleKey: string;
  image: string;
  href: string;
}

/** Type d'expérience : excursion (journée) ou événement (soirée/occasion) */
export type ExperienceCategory = "excursion" | "evenement";

/**
 * Données structurelles d'une excursion ou d'un événement.
 * Les textes (title, subtitle, description, duration, inclusions)
 * sont externalisés dans les dictionnaires i18n sous la clé
 * `experienceData.<id>.*`.
 */
export interface Experience {
  id: string;
  category: ExperienceCategory;
  image: string;
  /** Nombre d'inclusions — permet de boucler sur les clés i18n `inclusions.0`, `inclusions.1`… */
  inclusionCount: number;
  /** Prix estimé en euros — null = "Devis sur demande" */
  estimatedPrice: number | null;
}
