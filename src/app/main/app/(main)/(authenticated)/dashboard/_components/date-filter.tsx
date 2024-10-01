"use client";

import { format, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDateRange } from "./date-range-context";

export function DateFilter({ title, className }: { title?: string; className?: string }) {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange();

  const handleSelect = (val: DateRange | undefined) => {
    if (val?.from && !val.to) {
      const start = startOfDay(val.from);
      const end = endOfDay(val.from);
      setStartDate(start);
      setEndDate(end);
    } else if (val?.from && val?.to) {
      const start = startOfDay(val.from);
      const end = endOfDay(val.to);
      setStartDate(start);
      setEndDate(end);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              startDate.toDateString() === endDate.toDateString() ? (
                format(startDate, "LLL dd y")
              ) : (
                <>
                  {format(startDate, "LLL dd y")} - {format(endDate, "LLL dd y")}
                </>
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={startDate}
            selected={startDate && endDate ? { from: startDate, to: endDate } : undefined}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
