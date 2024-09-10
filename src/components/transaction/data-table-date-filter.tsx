"use client";

import * as React from "react";
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
import { Column } from "@tanstack/react-table";

interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  className?: string;
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
  className,
}: DataTableDateFilterProps<TData, TValue>) {
  const selectedValue = column?.getFilterValue() as [Date, Date] | null;

  const handleSelect = (val: DateRange | undefined) => {
    if (val?.from && !val.to) {
      // When only 'from' date is selected, set the range for the whole day
      column?.setFilterValue([startOfDay(val.from), endOfDay(val.from)]);
    } else if (val?.from && val?.to) {
      if (val.from.toDateString() === val.to.toDateString()) {
        // When 'from' and 'to' dates are the same, set the range for the whole day
        column?.setFilterValue([startOfDay(val.from), endOfDay(val.from)]);
      } else {
        // Set the range for the selected dates
        column?.setFilterValue([startOfDay(val.from), endOfDay(val.to)]);
      }
    } else {
      // Clear the filter value if no dates are selected
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
            defaultMonth={selectedValue?.[0]}
            selected={selectedValue ? { from: selectedValue[0], to: selectedValue[1] } : undefined}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
