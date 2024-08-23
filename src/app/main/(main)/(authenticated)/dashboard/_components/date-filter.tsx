"use client";

import * as React from "react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
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
import { Column } from "@tanstack/react-table";

interface DateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  className?: string;
}

export function DateFilter<TData, TValue>({
  column,
  title,
  className,
}: DateFilterProps<TData, TValue>) {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [selectedValue, setSelectedValue] = React.useState<[Date, Date] | null>([
    currentMonthStart,
    currentMonthEnd
  ]);

  const handleSelect = (val: DateRange | undefined) => {
    if (val?.from && !val.to) {
      const range: [Date, Date] = [startOfDay(val.from), endOfDay(val.from)];
      setSelectedValue(range);
      column?.setFilterValue(range);
    } else if (val?.from && val?.to) {
      const range: [Date, Date] = [startOfDay(val.from), endOfDay(val.to)];
      setSelectedValue(range);
      column?.setFilterValue(range);
    } else {
      setSelectedValue(null);
      column?.setFilterValue(null);
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
              !selectedValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedValue ? (
              selectedValue[0].toDateString() === selectedValue[1].toDateString() ? (
                format(selectedValue[0], "LLL dd y")
              ) : (
                <>
                  {format(selectedValue[0], "LLL dd y")} - {format(selectedValue[1], "LLL dd y")}
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
            defaultMonth={selectedValue?.[0] || currentMonthStart}
            selected={selectedValue ? { from: selectedValue[0], to: selectedValue[1] } : undefined}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
