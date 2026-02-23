import { useReducer, useMemo, useEffect } from "react";
import {
  MapPin,
  Clock,
  Car,
  ArrowRight,
  Plane,
  RotateCcw,
} from "lucide-react";
import type { BookingFormData, BookingMode, VehicleClass } from "@/types";
import { vehicles } from "@/data/vehicles";
import { calculateEstimate, formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AddressInput } from "@/components/features/AddressInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/features/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- Props ---

interface BookingFormProps {
  initialDestination?: string;
  initialMode?: BookingMode;
}

// --- Reducer ---

type BookingAction =
  | { type: "SET_MODE"; payload: BookingMode }
  | { type: "SET_DEPARTURE"; payload: string }
  | { type: "SET_ARRIVAL"; payload: string }
  | { type: "SET_DATE"; payload: Date | undefined }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_VEHICLE"; payload: VehicleClass }
  | { type: "RESET"; payload?: { destination?: string; mode?: BookingMode } };

function createInitialState(
  destination?: string,
  mode?: BookingMode,
): BookingFormData {
  return {
    mode: mode ?? "trajet",
    departure: "",
    arrival: destination ?? "",
    date: undefined,
    time: "",
    vehicleClass: "classe-e",
  };
}

function bookingReducer(
  state: BookingFormData,
  action: BookingAction,
): BookingFormData {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload, arrival: "" };
    case "SET_DEPARTURE":
      return { ...state, departure: action.payload };
    case "SET_ARRIVAL":
      return { ...state, arrival: action.payload };
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };
    case "SET_VEHICLE":
      return { ...state, vehicleClass: action.payload };
    case "RESET":
      return createInitialState(
        action.payload?.destination,
        action.payload?.mode,
      );
    default:
      return state;
  }
}

// --- Time slots ---

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

// --- Component ---

export function BookingForm({
  initialDestination,
  initialMode,
}: BookingFormProps) {
  const [state, dispatch] = useReducer(
    bookingReducer,
    undefined,
    () => createInitialState(initialDestination, initialMode),
  );

  // Réagir aux changements de props (navigation entre destinations)
  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: { destination: initialDestination, mode: initialMode },
    });
  }, [initialDestination, initialMode]);

  const estimate = useMemo(() => {
    if (!state.departure || (state.mode === "trajet" && !state.arrival)) {
      return null;
    }
    return calculateEstimate(state);
  }, [state]);

  const isFormValid =
    state.departure.trim() !== "" &&
    (state.mode === "mise-a-disposition" || state.arrival.trim() !== "") &&
    state.date !== undefined &&
    state.time !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !estimate) return;
    alert(
      `Demande de réservation envoyée !\n\nMode : ${state.mode === "trajet" ? "Trajet" : "Mise à disposition"}\nDépart : ${state.departure}\n${state.mode === "trajet" ? `Arrivée : ${state.arrival}\n` : ""}Véhicule : ${vehicles.find((v) => v.id === state.vehicleClass)?.name}\nEstimation : ${formatPrice(estimate.total)}`,
    );
  };

  return (
    <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-foreground flex items-center gap-3">
          <Car className="h-6 w-6 text-gold" />
          Réserver votre chauffeur
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode toggle */}
          <div className="space-y-2">
            <Label>Type de service</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "trajet", label: "Trajet" },
                  { value: "mise-a-disposition", label: "Mise à disposition" },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    dispatch({ type: "SET_MODE", payload: value })
                  }
                  className={cn(
                    "h-11 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                    state.mode === value
                      ? "bg-gold text-primary-foreground shadow-md"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-anthracite",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Departure */}
          <div className="space-y-2">
            <Label htmlFor="departure">
              <MapPin className="inline h-3.5 w-3.5 mr-1 text-gold" />
              Adresse de départ
            </Label>
            <AddressInput
              id="departure"
              placeholder="Ex : 1 Avenue des Champs-Élysées, Paris"
              value={state.departure}
              onChange={(value) =>
                dispatch({ type: "SET_DEPARTURE", payload: value })
              }
            />
          </div>

          {/* Arrival (only for trajet mode) */}
          {state.mode === "trajet" && (
            <div className="space-y-2">
              <Label htmlFor="arrival">
                <MapPin className="inline h-3.5 w-3.5 mr-1 text-gold" />
                Adresse d'arrivée
              </Label>
              <AddressInput
                id="arrival"
                placeholder="Ex : Aéroport CDG Terminal 2"
                value={state.arrival}
                onChange={(value) =>
                  dispatch({ type: "SET_ARRIVAL", payload: value })
                }
              />
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker
                date={state.date}
                onDateChange={(d) =>
                  dispatch({ type: "SET_DATE", payload: d })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>
                <Clock className="inline h-3.5 w-3.5 mr-1 text-gold" />
                Heure
              </Label>
              <Select
                value={state.time}
                onValueChange={(v) =>
                  dispatch({ type: "SET_TIME", payload: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'heure" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vehicle selection */}
          <div className="space-y-2">
            <Label>Véhicule</Label>
            <div className="grid grid-cols-3 gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() =>
                    dispatch({ type: "SET_VEHICLE", payload: v.id })
                  }
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md border p-3 text-sm transition-all duration-200 cursor-pointer",
                    state.vehicleClass === v.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border bg-secondary text-muted-foreground hover:border-gold/30 hover:text-foreground",
                  )}
                >
                  <span className="font-medium">{v.name}</span>
                  <span className="text-xs opacity-70">{v.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price estimate */}
          {estimate && (
            <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimation du prix
                </span>
                <span className="text-2xl font-bold text-gold">
                  {formatPrice(estimate.total)}
                </span>
              </div>
              {estimate.isAirportTransfer && estimate.airportName && (
                <div className="flex items-center gap-2 text-xs text-gold/80">
                  <Plane className="h-3.5 w-3.5" />
                  <span>Forfait {estimate.airportName}</span>
                </div>
              )}
              {state.mode === "mise-a-disposition" && (
                <p className="text-xs text-muted-foreground">
                  Tarif pour 3 heures de mise à disposition
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={!isFormValid}
            >
              Demander un devis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                dispatch({
                  type: "RESET",
                  payload: {
                    destination: initialDestination,
                    mode: initialMode,
                  },
                })
              }
              title="Réinitialiser"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
