"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Column } from "@tanstack/react-table"

interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  className?:string
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
  className
}: DataTableDateFilterProps<TData, TValue>) {
  const selectedValue = column?.getFilterValue() as [Date, Date] | null;

  const handleSelect = (val: DateRange | undefined) => {
    if (val && val.from && val.to && val.from.getTime() === val.to.getTime()) {
      column?.setFilterValue(null); // Clear all dates if start and end dates are the same
    } else {
      column?.setFilterValue(val ? [val.from, val.to] : val);
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
            {selectedValue?.[0] ? (
              selectedValue?.[1] ? (
                <>
                  {format(selectedValue[0], "LLL dd, y")} -{" "}
                  {format(selectedValue[1], "LLL dd, y")}
                </>
              ) : (
                format(selectedValue[0], "LLL dd, y")
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
  )
}
