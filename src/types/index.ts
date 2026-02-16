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
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

/** Type d'expérience : excursion (journée) ou événement (soirée/occasion) */
export type ExperienceCategory = "excursion" | "evenement";

/** Données structurées pour une excursion ou un événement */
export interface Experience {
  id: string;
  category: ExperienceCategory;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  duration: string;
  inclusions: string[];
  /** Prix estimé en euros — null = "Devis sur demande" */
  estimatedPrice: number | null;
}
