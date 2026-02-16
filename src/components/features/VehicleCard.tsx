import { Users, Briefcase, CheckCircle } from "lucide-react";
import type { Vehicle } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onSelect?: (id: Vehicle["id"]) => void;
}

export function VehicleCard({ vehicle, isSelected, onSelect }: VehicleCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5 cursor-pointer",
        isSelected && "border-gold shadow-lg shadow-gold/10",
      )}
      onClick={() => onSelect?.(vehicle.id)}
    >
      {/* Gold accent line */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-300",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-foreground">
              {vehicle.name}
            </CardTitle>
            <CardDescription className="text-gold font-medium text-base mt-1">
              {vehicle.subtitle}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5" title="Passagers">
              <Users className="h-4 w-4 text-gold" />
              <span className="text-sm">{vehicle.passengers}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Bagages">
              <Briefcase className="h-4 w-4 text-gold" />
              <span className="text-sm">{vehicle.luggage}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {vehicle.description}
        </p>

        <ul className="space-y-2">
          {vehicle.services.map((service) => (
            <li key={service} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-3.5 w-3.5 text-gold shrink-0" />
              <span className="text-secondary-foreground">{service}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
