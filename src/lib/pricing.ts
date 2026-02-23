import type {
  AirportForfait,
  BookingFormData,
  PriceEstimate,
  VehicleClass,
} from "@/types";

const AIRPORT_FORFAITS: AirportForfait[] = [
  {
    name: "Aéroport Charles de Gaulle",
    keyword: "cdg",
    prices: {
      "classe-e": 70,
      "classe-s": 120,
      "classe-v": 100,
    },
  },
  {
    name: "Aéroport d'Orly",
    keyword: "orly",
    prices: {
      "classe-e": 55,
      "classe-s": 95,
      "classe-v": 80,
    },
  },
];

const BASE_PRICES: Record<VehicleClass, number> = {
  "classe-e": 35,
  "classe-s": 65,
  "classe-v": 50,
};

const HOURLY_RATES: Record<VehicleClass, number> = {
  "classe-e": 55,
  "classe-s": 95,
  "classe-v": 75,
};

function detectAirport(
  departure: string,
  arrival: string,
): AirportForfait | null {
  const combined = `${departure} ${arrival}`.toLowerCase();
  return (
    AIRPORT_FORFAITS.find(
      (f) =>
        combined.includes(f.keyword) ||
        combined.includes("roissy") ||
        (f.keyword === "cdg" && combined.includes("charles de gaulle")),
    ) ?? null
  );
}

function simulateDistance(departure: string, arrival: string): number {
  const seed = (departure.length + arrival.length) * 3.7;
  return Math.max(8, Math.round(seed % 45) + 5);
}

export function calculateEstimate(booking: BookingFormData): PriceEstimate {
  const { mode, departure, arrival, vehicleClass } = booking;

  if (mode === "mise-a-disposition") {
    const hours = 3;
    const rate = HOURLY_RATES[vehicleClass];
    const total = rate * hours;
    return {
      basePrice: rate,
      vehicleSupplement: 0,
      total,
      currency: "EUR",
      isAirportTransfer: false,
    };
  }

  const airport = detectAirport(departure, arrival);

  if (airport) {
    const forfaitPrice = airport.prices[vehicleClass];
    return {
      basePrice: forfaitPrice,
      vehicleSupplement: 0,
      total: forfaitPrice,
      currency: "EUR",
      isAirportTransfer: true,
      airportName: airport.name,
    };
  }

  const distance = simulateDistance(departure, arrival);
  const base = BASE_PRICES[vehicleClass];
  const perKmRates: Record<VehicleClass, number> = {
    "classe-e": 2.5,
    "classe-s": 4.0,
    "classe-v": 3.5,
  };
  const distanceCost = distance * perKmRates[vehicleClass];
  const total = Math.round(base + distanceCost);

  return {
    basePrice: base,
    vehicleSupplement: distanceCost,
    total,
    currency: "EUR",
    isAirportTransfer: false,
  };
}

// ---------------------------------------------------------------------------
// Tarifs par km (exportés pour le calcul avec vraie distance Google Maps)
// ---------------------------------------------------------------------------

const PER_KM_RATES: Record<VehicleClass, number> = {
  "classe-e": 2.5,
  "classe-s": 4.0,
  "classe-v": 3.5,
};

/**
 * Calcule un prix VTC à partir d'une vraie distance (Google Distance Matrix).
 *
 * Prend en compte les forfaits aéroport si détectés dans les adresses.
 * Sinon, applique : prix de base + distance * tarif/km.
 *
 * @param departure  Adresse de départ (texte Google)
 * @param arrival    Adresse d'arrivée (texte Google)
 * @param distanceKm Distance réelle en kilomètres
 * @param vehicleClass Classe de véhicule choisie
 */
export function calculatePriceFromDistance(
  departure: string,
  arrival: string,
  distanceKm: number,
  vehicleClass: VehicleClass = "classe-e",
): PriceEstimate & { distanceKm: number } {
  // Vérifier si c'est un transfert aéroport (forfait fixe)
  const airport = detectAirport(departure, arrival);

  if (airport) {
    const forfaitPrice = airport.prices[vehicleClass];
    return {
      basePrice: forfaitPrice,
      vehicleSupplement: 0,
      total: forfaitPrice,
      currency: "EUR",
      isAirportTransfer: true,
      airportName: airport.name,
      distanceKm,
    };
  }

  const base = BASE_PRICES[vehicleClass];
  const distanceCost = distanceKm * PER_KM_RATES[vehicleClass];
  const total = Math.round(base + distanceCost);

  return {
    basePrice: base,
    vehicleSupplement: distanceCost,
    total,
    currency: "EUR",
    isAirportTransfer: false,
    distanceKm,
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount);
}
