import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import BookingInfo from "../../booking/[bookingId]/info";
import moment from "moment";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addBooking } from "@/server/actions/booking.action";
import { Booking, Spot, SpotImages, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { BookingDates } from "@/lib/types";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().nonempty("Email is required").email("Enter a valid email address"),
  phone: z.string().nonempty("Phone is required"),
  dni: z.string().nonempty("DNI is required"),
  address: z.string().nonempty("Address is required"),
  startDate: z.date().nullable().refine(Boolean, "Start Date is required"),
  endDate: z.date().nullable().refine(Boolean, "End Date is required"),
  subtotal: z.number().min(0, "Subtotal is required"),
  totalPrice: z.number().min(0, "Total Price is required"),
  note: z.string().optional(),
});

type Params = {
  spot: Spot & { bookings: BookingDates[]; owner: User; images: SpotImages[] };
};

type ProgressKey = 'check_availability' | 'personal_info';

const progresses: Record<ProgressKey, { value: number; title: string; description: string }> = {
  check_availability: {
    value: 33,
    title: "Check Availability",
    description: "Select available booking spots below to continue",
  },
  personal_info: {
    value: 50,
    title: "Personal Details",
    description: "Enter your personal details to create a booking.",
  },
};

function BookingSection({ spot }: Params) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [progress, setProgress] = useState<ProgressKey>("check_availability");
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | DateRange | undefined>();
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);

  const workingHours = spot.workingHours as any;
  const bookings = spot.bookings;

  const calculateDays = (date: Date | DateRange | undefined): number => {
    if (!date) return 0;
    if ("from" in date && "to" in date) {
      return moment(date.to).diff(moment(date.from), "days") + 1;
    }
    return 1; // Single date
  };

  const getDatesArray = (date: Date | DateRange | undefined): Date[] => {
    if (!date) return [];
    if ("from" in date && "to" in date) {
      const startDate = moment(date.from);
      const endDate = moment(date.to);
      const days: Date[] = [];
      for (let d = startDate; d.isSameOrBefore(endDate); d.add(1, "day")) {
        days.push(d.toDate());
      }
      return days;
    }
    return [date as Date]; // Single date
  };

  const getSelectedDayTimeslots = useCallback((day: string) => {
    const workingHour = workingHours.find((wh: { day: string; }) => wh.day === day);
    const time1 = moment(workingHour?.openTime, "hh:mm A");
    const time2 = moment(workingHour?.closeTime, "hh:mm A");

    if (time2.isBefore(time1)) {
      time2.add(1, "days");
    }

    const timeslots = [];
    let currentTime = time1.clone();
    while (currentTime.isBefore(time2)) {
      const endTime = currentTime.clone().add(spot.duration, "hours");
      if (endTime.isAfter(time2)) break;
      timeslots.push(currentTime.format("hh:mm A"));
      currentTime.add(spot.duration, "hours");
    }
    return timeslots;
  }, [workingHours, spot]);

  const getPriceForDay = (day: string): number => {
    const workingHour = workingHours.find((wh: { day: string; }) => wh.day === day);
    return workingHour ? workingHour.price : 0;
  };

  const calculateSubtotal = useCallback((date: Date | DateRange | undefined): number => {
    const days = getDatesArray(date);
    return days.reduce((total, d) => total + getPriceForDay(moment(d).format("dddd")), 0);
  }, []);

  const getStartEndDates = useCallback((date: Date | DateRange | undefined) => {
    if (!date) return { startDate: null, endDate: null };
    if ("from" in date && "to" in date) {
      const startDate = moment(date.from).set({
        hour: moment(workingHours.find((wh: { day: string; }) => wh.day === moment(date.from).format("dddd"))?.openTime, "hh:mm A").hours(),
        minute: moment(workingHours.find((wh: { day: string; }) => wh.day === moment(date.from).format("dddd"))?.openTime, "hh:mm A").minutes(),
      }).toDate();

      const endDate = date.to ? moment(date.to).set({
        hour: moment(workingHours.find((wh: { day: string; }) => wh.day === moment(date.to).format("dddd"))?.closeTime, "hh:mm A").hours(),
        minute: moment(workingHours.find((wh: { day: string; }) => wh.day === moment(date.to).format("dddd"))?.closeTime, "hh:mm A").minutes(),
      }).toDate() : null;

      return { startDate, endDate };
    }

    return {
      startDate: moment(date as Date).set({
        hour: moment(workingHours.find((wh: { day: string; }) => wh.day === moment(date as Date).format("dddd"))?.openTime, "hh:mm A").hours(),
        minute: moment(workingHours.find((wh: { day: string; }) => wh.day === moment(date as Date).format("dddd"))?.openTime, "hh:mm A").minutes(),
      }).toDate(),
      endDate: null,
    };
  }, [spot, workingHours]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const booking = await addBooking({ ...values, spotId: spot.id });
      router.push(`/booking/${booking.id}`);
    } catch (error: any) {
      toast.error(`There was an error proceeding with the request, ${error.message}`);
    }
  };

  const isDateDisabled = useCallback((date: Date) => {
    const dayOfWeek = moment(date).format("dddd");
    const dateStr = moment(date).format("YYYY-MM-DD");

    // Check if the date is before today
    if (date < moment().startOf('day').toDate()) return true;

    // Check if the day is available in the working hours
    const workingHour = workingHours.find((wh: { day: string; }) => wh.day === dayOfWeek);
    if (!workingHour || !workingHour.openTime || !workingHour.closeTime || !workingHour.price) return true;

    // Check if the date is booked as a start date
    const bookingsOnDate = bookings.filter(
      (booking) => moment(booking.startDate).format("YYYY-MM-DD") === dateStr
    );
    return bookingsOnDate.length >= (spot.units ?? 0);
  }, [bookings, spot.units, workingHours]);

  const isTimeslotDisabled = (date: Date, timeslot: string) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    const bookingsOnTimeslot = bookings.filter(
      (booking) =>
        moment(booking.startDate).format("YYYY-MM-DD hh:mm A") <= `${dateStr} ${timeslot}` &&
        moment(booking.endDate).format("YYYY-MM-DD hh:mm A") >= `${dateStr} ${timeslot}`
    );

    return bookingsOnTimeslot.length >= (spot.units ?? 0);
  };

  const isEndDateDisabled = useCallback((endDate: Date) => {
    if (!selectedDate || !("from" in selectedDate)) return true;
    const startDate = selectedDate.from;
    if (!startDate || endDate <= startDate) return true;
    const daysBetween = moment(endDate).diff(moment(startDate), "days") + 1;

    for (let i = 0; i < daysBetween; i++) {
      const dateToCheck = moment(startDate).add(i, "days").toDate();
      if (isDateDisabled(dateToCheck)) {
        return true;
      }
    }
    return false;
  }, [isDateDisabled, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const { startDate, endDate } = getStartEndDates(selectedDate);
      form.setValue("startDate", startDate);
      form.setValue("endDate", endDate);
      const total = calculateSubtotal(selectedDate);
      form.setValue("subtotal", total);
      form.setValue("totalPrice", total);
    }
  }, [selectedDate, form, calculateSubtotal, getStartEndDates]);

  const { startDate, endDate } = getStartEndDates(selectedDate);

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-center">
          <div>
            <h2 className="text-2xl font-bold">{progresses[progress].title}</h2>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-2 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {progress === "check_availability" && (
              <div>
                <div className="grid gap-2 justify-center">
                  <Calendar
                    className="p-0 xl:flex [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6"
                    mode={spot.durationType === "hours" ? "single" : "range"}
                    numberOfMonths={1}
                    defaultMonth={(selectedDate as DateRange)?.from}
                    onSelect={(date: React.SetStateAction<Date | DateRange | undefined>) => {
                      if (
                        date &&
                        "from" in date &&
                        "to" in date &&
                        date.from?.getTime() === date.to?.getTime()
                      ) {
                        setSelectedDate(undefined); // Clear the start date if the same date is selected as end date
                        setSelectedTimeslot(null);
                      } else {
                        setSelectedDate(date);
                        setSelectedTimeslot(null); // Reset timeslot on date change
                      }
                    }}
                    selected={selectedDate as any}
                    disabled={(date) => isDateDisabled(date)}
                  />
                </div>
                {spot.durationType === "hours" && selectedDate && (
                <>
                  <div className="max-w-md my-4 p-0 space-y-4">
                    <h2 className="text-md font-bold">
                      {getSelectedDayTimeslots(moment(selectedDate as Date).format("dddd")).length > 0
                        ? "Select a Time Slot"
                        : "No time slots available, please select another date"}
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      {getSelectedDayTimeslots(moment(selectedDate as Date).format("dddd")).map((timeslot, key) => (
                        <button
                          key={key}
                          type="button"
                          className={`text-sm bg-gray-100 hover:bg-slate-600 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors ${
                            selectedTimeslot === timeslot
                              ? "bg-slate-600 hover:bg-slate-800 text-white"
                              : ""
                          }`}
                          onClick={() => setSelectedTimeslot(timeslot)}
                        >
                          {timeslot}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
                {selectedDate && (spot.durationType === "hours" ? selectedTimeslot : endDate) ? (
                  <div className="flex flex-col my-4">
                    {spot.durationType !== "hours" && (
                      <div className="flex flex-col justify-center rounded-lg mx-4 mb-2">
                        <div className="flex flex-row justify-between items-center gap-2">
                          <div className="bg-gray-100 rounded-lg w-full p-2">
                            <div className="text-xs text-muted-foreground font-medium mb-0">CHECK-IN</div>
                            <div className="text-sm font-medium rounded-md">{moment(startDate).format("hh:mm A")}</div>
                          </div>
                          <div className="bg-gray-100 rounded-lg w-full p-2">
                            <div className="text-xs text-muted-foreground font-medium mb-0">CHECK-OUT</div>
                            <div className="text-sm font-medium rounded-md">{endDate ? moment(endDate).format("hh:mm A") : ""}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        className="w-full h-12 my-3"
                        size="lg"
                        disabled={!selectedDate || (spot.durationType === "hours" && !selectedTimeslot)}
                        onClick={() => setProgress("personal_info")}
                      >
                        Continue
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 text-center dark:text-gray-400 my-2">You won't be charged yet</div>
                    <Separator />
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-semibold">
                        Total {spot.durationType === "hours" ? `for ${spot.duration} ${spot.duration === 1 ? "hour" : "hours"}` : ""}
                      </div>
                      <div>${new Intl.NumberFormat('de-DE').format(form.getValues().totalPrice).replace(',', '.')}</div>
                    </div>
                  </div>
                ) : (
                  spot.durationType !== "hours" && selectedDate && !endDate && (
                    <div className="flex justify-center p-2 my-4">
                      Please select a check-out date
                    </div>
                  )
                )}
              </div>
            )}
            {progress === "personal_info" && (
              <BookingInfo form={form} onPrev={() => setProgress("check_availability")} />
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BookingSection;
