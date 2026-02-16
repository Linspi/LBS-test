import { useSearchParams } from "react-router-dom";
import { BookingForm } from "@/components/features/BookingForm";
import type { BookingMode } from "@/types";

const VALID_MODES: BookingMode[] = ["trajet", "mise-a-disposition"];

export function Reservation() {
  const [searchParams] = useSearchParams();

  const destination = searchParams.get("destination") ?? undefined;
  const rawType = searchParams.get("type");
  const mode: BookingMode | undefined = VALID_MODES.includes(
    rawType as BookingMode,
  )
    ? (rawType as BookingMode)
    : undefined;

  return (
    <section className="pt-28 pb-24">
      <div className="container">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Réservez votre <span className="text-gold">chauffeur</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Obtenez une estimation instantanée et réservez votre véhicule en
            quelques clics. Forfaits aéroport CDG et Orly disponibles.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <BookingForm initialDestination={destination} initialMode={mode} />
        </div>
      </div>
    </section>
  );
}
