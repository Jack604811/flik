"use client";

import * as React from "react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn, parseDashboardDates } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import moment from "moment";

interface DateFilterProps<TData, TValue> {
  className?: string;
}

export function DateFilter<TData, TValue>({
  className,
}: DateFilterProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const {startDate, endDate} = parseDashboardDates(searchParams.get("from"), searchParams.get("to"));
  const dates: [Date, Date] = [startDate, endDate];


  const updateDateState = (startDate: Date, endDate: Date) => {
    const query = `?from=${moment(startDate).format("MM/DD/YYYY")}&to=${moment(endDate).format("MM/DD/YYYY")}`;
    const newURI = `${pathname}${query}`;
    window.history.pushState({}, "", newURI);
    // router.push(newURI, { scroll: true });
  };

  const handleSelect = (val: DateRange | undefined) => {
    if (val?.from && !val.to) {
      const range: [Date, Date] = [startOfDay(val.from), endOfDay(val.from)];
      updateDateState(range[0], range[1]);
    } else if (val?.from && val?.to) {
      updateDateState(val.from, val.to);
    } else {
      updateDateState(new Date(), new Date());
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
              !dates && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dates ? (
              dates[0].toDateString() === dates[1].toDateString() ? (
                format(dates[0], "LLL dd y")
              ) : (
                <>
                  {format(dates[0], "LLL dd y")} - {format(dates[1], "LLL dd y")}
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
            defaultMonth={dates?.[0] || dates[0]}
            selected={dates ? { from: dates[0], to: dates[1] } : undefined}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
