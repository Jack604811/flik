"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { bookingSchema } from "../data/schema";
import BookingAvailability from "@/app/[domain]/[spotId]/_components/BookingAvailability";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  startDate: Date | undefined;
  endDate: Date | undefined;
  spot: z.infer<typeof bookingSchema>["spot"];
};

const formSchema = z.object({
  startDate: z.date().nullable().refine(Boolean, "Start Date is required"),
  endDate: z.date().nullable().refine(Boolean, "End Date is required"),
  subtotal: z.number().min(0, "Subtotal is required"),
  totalPrice: z.number().min(0, "Total Price is required"),
});

const EditBookingDate = ({ className, spot, startDate, endDate }: Props) => {
  const [date, setDate] = useState<Date | DateRange | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // useEffect(() => {
  //   if (spot.durationType === "hours") {
  //     setDate(startDate);
  //   } else {
  //     setDate({
  //       from: startDate,
  //       to: endDate,
  //     });
  //   }
  // }, [spot.durationType, startDate, endDate]);

  const updateDates = (dates: DateRange|Date|undefined) => setDate(dates);

  const selectedDate = useMemo(() => date, [date])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className={cn("grid gap-2", className)}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal border-none bg-transparent p-0 hover:bg-transparent",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date && "from" in date && "to" in date && date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y hh:mm A")} -{" "}
                      {format(date.to, "LLL dd, y hh:mm A")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y hh:mm A")
                  )
                ) : date ? (
                  format(date as Date, "LLL dd, y hh:mm A")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align="start">
              <BookingAvailability
                selectedDate={selectedDate}
                setSelectedDate={updateDates as any}
                spot={spot}
                bookings={[]}
                callback={() => {}}
              />
            </PopoverContent>
          </Popover>
        </div>
      </form>
    </Form>
  );
};

export default memo(EditBookingDate);
