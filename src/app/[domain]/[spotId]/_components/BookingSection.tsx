/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import BookingInfo from "../../booking/[bookingId]/info";
import moment from "moment";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addBooking } from "@/server/actions/booking.action";
import { Spot, SpotImages, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";

type Params = {
  spot: Spot & { owner: User; images: SpotImages[] };
};
const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Enter a valid email address"),
  phone: z.string({ required_error: "Phone is required" }),
  dni: z.string({ required_error: "DNI is required" }),
  address: z.string({ required_error: "Address is required" }),
  startDate: z.date({ required_error: "Start Date is required" }).nullable(),
  endDate: z.date({ required_error: "End Date is required" }).nullable(),
  subtotal: z.number({ required_error: "Subtotal is required" }),
  totalPrice: z.number({ required_error: "Total Price is required" }),
  note: z.string().optional(),
});

function BookingSection({ spot }: Params) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const progresses: Record<
    string,
    { value: number; title: string; description?: string }
  > = {
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
  const [progress, setProgress] = useState("check_availability");
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<
    Date | DateRange | undefined
  >();

  const workingHours: {
    day: string;
    price: number;
    openTime: string;
    closeTime: string;
  }[] = spot.workingHours as any;

  const calculateDays = (
    selectedDate: Date | DateRange | undefined
  ): number => {
    if (!selectedDate) return 0;

    if ("from" in selectedDate && "to" in selectedDate) {
      return (
        moment(selectedDate.to).diff(moment(selectedDate.from), "days") + 1
      );
    }

    return 1; // If it's a single date
  };

  const getDatesArray = (
    selectedDate: Date | DateRange | undefined
  ): Date[] => {
    if (!selectedDate) return [];

    if ("from" in selectedDate && "to" in selectedDate) {
      const startDate = moment(selectedDate.from);
      const endDate = moment(selectedDate.to);
      const days: Date[] = [];
      for (
        let date = startDate;
        date.isSameOrBefore(endDate);
        date.add(1, "day")
      ) {
        days.push(date.toDate());
      }
      return days;
    }

    return [selectedDate as Date]; // If it's a single date
  };

  const getSelectedDayTimeslots = (day: string) => {
    const workingHour = workingHours?.find((wh) => wh.day === day);
    const time1 = moment(workingHour?.openTime, "HH:mm");
    const time2 = moment(workingHour?.closeTime, "HH:mm");

    // Check if the second time is on the next day
    if (time2.isBefore(time1)) {
      time2.add(1, "days");
    }
    const hoursDifference = time2.diff(time1, "hours");
    // Generate timeslots
    const timeslots = [];
    let currentTime = time1.clone();

    while (currentTime.isBefore(time2)) {
      let endTime = currentTime.clone().add(spot.duration, "hours");
      if (endTime.isAfter(time2)) {
        break;
      }
      timeslots.push(currentTime.format("HH:mm"));
      currentTime.add(spot.duration, "hours");
    }
    return timeslots;
  };

  const getPriceForDay = (day: string): number => {
    const workingHour = workingHours?.find((wh) => wh.day === day);
    return workingHour ? workingHour.price : 0;
  };

  const calculateSubtotal = useCallback(
    (selectedDate: Date | DateRange | undefined): number => {
      const days = getDatesArray(selectedDate);
      return days.reduce((total, date) => {
        const dayOfWeek = moment(date).format("dddd");
        return total + getPriceForDay(dayOfWeek);
      }, 0);
    },
    []
  );

  const getStartEndDates = (selectedDate: Date | DateRange | undefined) => {
    if (!selectedDate) return { startDate: null, endDate: null };
    if (selectedDate && "from" in selectedDate && "to" in selectedDate)
      return { startDate: selectedDate.from!, endDate: selectedDate.to! };

    return { startDate: selectedDate as Date, endDate: selectedDate as Date };
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const booking = await addBooking({ ...values, spotId: spot.id });
      router.push(`/booking/${booking.id}`);
    } catch (error: any) {
      toast.error(
        `There was an error procceding with the request, ${error.message}`
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const { startDate, endDate } = getStartEndDates(selectedDate);
      form.setValue("startDate", startDate);
      form.setValue("endDate", endDate);
      const total = calculateSubtotal(selectedDate);
      form.setValue("subtotal", total);
      form.setValue("totalPrice", total);
    }, 1000);
  }, [selectedDate, form, calculateSubtotal]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Progress className="w-full" value={progresses[progress].value} />
        </div>

        <div className="flex gap-2 justify-between">
          <div>
            <h2 className="text-2xl font-bold">{progresses[progress].title}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your personal details to create a booking.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="border border-gray-300 w-8 h-8"
              variant="outline"
              type="button"
            >
              {`<`}
            </Button>
            <Button
              className="border border-gray-300 w-8 h-8"
              variant="outline"
              type="button"
            >
              {`>`}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {progress === "check_availability" && (
              <div>
                <div className="grid gap-2 justify-center">
                  <Calendar
                    className="p-0 xl:flex [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6"
                    mode={spot.durationType === "hours" ? "single" : "range"}
                    numberOfMonths={1}
                    defaultMonth={(selectedDate as DateRange)?.from}
                    onSelect={setSelectedDate}
                    selected={selectedDate as any}
                    disabled={{ from: new Date(1970), to: new Date() }}
                  />
                </div>
                {spot.durationType === "hours" && selectedDate && (
                  <>
                    <div className="max-w-md my-4 p-0 space-y-4">
                      <h2 className="text-md font-bold">Select a Time Slot</h2>
                      <div className="grid grid-cols-3 gap-2">
                        {getSelectedDayTimeslots(
                          moment(selectedDate as Date).format("dddd")
                        ).map((timeslot, key) => (
                          <button
                            key={key}
                            type="button"
                            className={`text-sm bg-gray-100 hover:bg-slate-600 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md py-1 px-2 transition-colors ${
                              moment(selectedDate as Date).format("HH:mm") ===
                              timeslot
                                ? "bg-slate-600 hover:bg-slate-800 text-white"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedDate(
                                moment(
                                  `${moment(selectedDate as Date).format(
                                    "YYYY-MM-DD"
                                  )} ${
                                    moment(selectedDate as Date).format(
                                      "HH:mm"
                                    ) === timeslot
                                      ? "00:00"
                                      : timeslot
                                  }`,
                                  "YYYY-MM-DD HH:mm"
                                ).toDate()
                              )
                            }
                          >
                            {timeslot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <Button
                    type="button"
                    className="w-full h-12 my-3"
                    size="lg"
                    disabled={!selectedDate}
                    onClick={() => setProgress("personal_info")}
                  >
                    Continue
                  </Button>
                </div>
                <div className="text-sm text-gray-500 text-center dark:text-gray-400">
                  You won't be charged yet
                </div>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center my-4">
                    <div className="text-gray-500 dark:text-gray-400">
                      Subtotal for {calculateDays(selectedDate)} day(s)
                    </div>
                    <div>${form.getValues().subtotal}</div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Total before taxes</div>
                  <div>${form.getValues().totalPrice}</div>
                </div>
              </div>
            )}

            {progress === "personal_info" && (
              <BookingInfo
                form={form}
                onPrev={() => setProgress("check_availability")}
              />
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PersonalInfo() {
  return <></>;
}

export default BookingSection;
