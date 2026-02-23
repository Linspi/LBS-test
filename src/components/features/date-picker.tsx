import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Sélectionner une date",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-11 border-border bg-input hover:bg-input hover:border-gold",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4 text-gold" />
          {date
            ? format(date, "d MMMM yyyy", { locale: fr })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={(d) => {
            onDateChange(d);
            setOpen(false);
          }}
          disabled={{ before: new Date() }}
          locale={fr}
          classNames={{
            root: "p-3 bg-card",
            month_caption: "flex justify-center pt-1 relative items-center text-sm font-medium text-foreground mb-2",
            nav: "flex items-center gap-1",
            button_previous: "absolute left-1 top-0 h-7 w-7 bg-transparent text-muted-foreground hover:text-foreground inline-flex items-center justify-center",
            button_next: "absolute right-1 top-0 h-7 w-7 bg-transparent text-muted-foreground hover:text-foreground inline-flex items-center justify-center",
            weekdays: "flex",
            weekday: "text-muted-foreground w-9 font-normal text-[0.8rem]",
            week: "flex w-full mt-1",
            day: "h-9 w-9 text-center text-sm relative flex items-center justify-center rounded-md transition-colors hover:bg-secondary cursor-pointer",
            selected: "!bg-gold !text-primary-foreground font-semibold",
            today: "text-gold font-bold",
            disabled: "text-muted-foreground/30 cursor-not-allowed hover:bg-transparent",
            outside: "text-muted-foreground/30",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
