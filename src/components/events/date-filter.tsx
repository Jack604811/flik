"use client";

import * as React from "react";
import { startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
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
  const selectedValue = column?.getFilterValue() as [Date, Date] | null;

  const handleSelect = (val: DateRange | undefined) => {
    if (val?.from && !val.to) {
      column?.setFilterValue([startOfDay(val.from), endOfDay(val.from)]);
    } else if (val?.from && val?.to) {
      if (val.from.toDateString() === val.to.toDateString()) {
        column?.setFilterValue([startOfDay(val.from), endOfDay(val.from)]);
      } else {
        column?.setFilterValue([startOfDay(val.from), endOfDay(val.to)]);
      }
    } else {
      column?.setFilterValue(null);
    }
  };

  const formatDateDisplay = (date: Date, isPlaceholder = false) => {
    const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
    const monthYear = date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    return (
      <div className="flex justify center items-center space-x-2">
        <div className={cn("text-5xl font-bold", isPlaceholder ? "text-gray-500" : "text-current")}>
          {day}
        </div>
        <div className="flex flex-col">
          <div className={cn("text-md font-semibold", isPlaceholder ? "text-gray-500" : "text-current")}>
            {weekday}
          </div>
          <div className={cn("text-md", isPlaceholder ? "text-gray-500" : "text-current")}>
            {monthYear}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {/* Calendar is visible directly for larger screens */}
      <div className="hidden md:block">
        <Calendar
          mode="range"
          defaultMonth={selectedValue?.[0]}
          selected={selectedValue ? { from: selectedValue[0], to: selectedValue[1] } : undefined}
          onSelect={handleSelect}
          numberOfMonths={1}
        />
      </div>

      {/* Popover with formatted date view for smaller screens */}
      <div className="block md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <div className="flex items-center space-x-2">
                
                {selectedValue ? (
                  selectedValue[0].toDateString() === selectedValue[1].toDateString() ? (
                    formatDateDisplay(selectedValue[0])
                  ) : (
                    <div className="flex space-x-2">
                      {formatDateDisplay(selectedValue[0])}
                      <span className="text-sm font-semibold">-</span>
                      {formatDateDisplay(selectedValue[1])}
                    </div>
                  )
                ) : (
                  formatDateDisplay(new Date(), true) 
                )}
              </div>
            </div>
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
    </div>
  );
}
