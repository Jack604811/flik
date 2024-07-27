"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CalendarDaysIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { bookingSchema } from "@/schemas/booking.schema";
import BookingAvailability from "@/app/[domain]/[spotId]/_components/BookingAvailability";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "@prisma/client";
import {
  getBookingsBySpot,
  updateBooking,
} from "@/server/actions/booking.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  startDate: Date | undefined;
  endDate: Date | undefined;
  spot: z.infer<typeof bookingSchema>["spot"];
  bookingId: string;
};

const formSchema = z.object({
  startDate: z.date().refine(Boolean, "Start Date is required"),
  endDate: z.date().refine(Boolean, "End Date is required"),
  subtotal: z.number().min(0, "Subtotal is required"),
});

const EditBookingDate = ({
  className,
  spot,
  startDate,
  endDate,
  bookingId,
}: Props) => {
  const router = useRouter();
  const formRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLButtonElement>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["spotBookings", spot.id],
    queryFn: () => getBookingsBySpot(spot.id),
    initialData: [] as Booking[],
  });

  const [date, setDate] = useState<DateRange | Date | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate,
      endDate,
      subtotal: 0,
    },
  });

  const onBookingDateChanged = useCallback(
    (data: {
      startDate: Date | null | undefined;
      endDate: Date | null | undefined;
      subTotal?: number;
    }) => {
      if (data.startDate) form.setValue("startDate", data.startDate);
      if (data.endDate) form.setValue("endDate", data.endDate);
      if (data.subTotal) form.setValue("subtotal", data.subTotal);

      if (spot.durationType === "hours") {
        setDate(data.startDate as Date);
      } else {
        setDate({
          from: data.startDate as Date | undefined,
          to: data.endDate as Date | undefined,
        });
      }
    },
    [form, spot.durationType]
  );

  useEffect(() => {
    if (startDate || endDate) {
      onBookingDateChanged({ startDate, endDate });
    }
  }, [startDate, endDate, onBookingDateChanged]);

  useEffect(() => {
    if (popoverOpen) {
      onBookingDateChanged({ startDate, endDate });
    }
  }, [popoverOpen, startDate, endDate, onBookingDateChanged]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updated = updateBooking({ id: bookingId, ...values });

    toast.promise(updated, {
      loading: `Updating booking dates...`,
      success() {
        form.reset();
        popoverRef.current?.click();
        router.refresh();
        return `Booking dates updated successfully!`;
      },
      error: `Failed to update booking dates`,
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <button type="submit" ref={formRef}></button>
        <div className={cn("grid gap-2", className)}>
          <Popover onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild ref={popoverRef}>
            <Button
              variant={"outline"}
              type="button"
              className={cn(
                "w-[370px] justify-start text-left font-normal border-none bg-transparent p-0 hover:bg-transparent",
                !form.getValues().startDate && "text-muted-foreground"
              )}
              disabled={form.formState.isSubmitting}
            >
              <CalendarDaysIcon className="mr-1 h-4 w-4" />

              {form.getValues().startDate ? (
                <>
                  {moment(form.getValues().startDate!).format("DD MMM YYYY hh:mm A")}
                  {spot.durationType === "hours" && form.getValues().endDate ? (
                    <>
                      {" - "}
                      {moment(form.getValues().endDate!).format("hh:mm A")}
                    </>
                  ) : (
                    form.getValues().endDate && (
                      <>
                        {" - "}
                        {moment(form.getValues().endDate!).format("DD MMM YYYY hh:mm A")}
                      </>
                    )
                  )}
                </>
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>

            <PopoverContent className="w-auto" align="start">
              <BookingAvailability
                selectedDate={date}
                onDateSelected={onBookingDateChanged}
                spot={spot}
                bookings={bookings.filter((b) => b.id !== bookingId)}
                callback={() => formRef.current?.click()}
                isDisabled={form.formState.isSubmitting}
                btnText="Save"
              />
            </PopoverContent>
          </Popover>
        </div>
      </form>
    </Form>
  );
};

export default memo(EditBookingDate);
