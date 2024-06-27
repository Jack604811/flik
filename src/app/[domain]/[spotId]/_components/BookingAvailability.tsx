/* eslint-disable react/no-unescaped-entities */
import { bookingSchema } from "@/app/main/(main)/(authenticated)/bookings/data/schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { BookingDates } from "@/lib/types";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

type Params = {
  spot: z.infer<typeof bookingSchema>["spot"];
  bookings: BookingDates[];
  selectedDate: Date | DateRange | undefined;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<Date | DateRange | undefined>
  >;
  callback: (data: any) => void;
};

function BookingAvailability({
  spot,
  bookings,
  selectedDate,
  setSelectedDate,
  callback,
}: Params) {
  const form = useFormContext();
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

  const getDatesArray = useCallback(
    (selectedDate: Date | DateRange | undefined): Date[] => {
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
    },
    []
  );

  const isTimeslotDisabled = useCallback(
    (date: Date, timeslot: string) => {
      const dateStr = moment(date).format("YYYY-MM-DD");
      const bookingsOnTimeslot = bookings.filter(
        (booking) =>
          moment(booking.startDate).format("YYYY-MM-DD hh:mm A") <=
            `${dateStr} ${timeslot}` &&
          moment(booking.endDate).format("YYYY-MM-DD hh:mm A") >=
            `${dateStr} ${timeslot}`
      );

      return bookingsOnTimeslot.length >= (spot.units ?? 0);
    },
    [spot, bookings]
  );

  const getSelectedDayTimeslots = useCallback(
    (day: string) => {
      const workingHour = workingHours.find(
        (wh: { day: string }) => wh.day === day
      );
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
        if (
          !isTimeslotDisabled(
            selectedDate! as Date,
            currentTime.format("hh:mm A")
          )
        ) {
          timeslots.push(currentTime.format("hh:mm A"));
        }
        currentTime.add(spot.duration, "hours");
      }
      return timeslots;
    },
    [workingHours, spot, isTimeslotDisabled, selectedDate]
  );

  const getPriceForDay = useCallback(
    (day: string): number => {
      const workingHour = workingHours?.find((wh) => wh.day === day);
      return workingHour ? workingHour.price : 0;
    },
    [workingHours]
  );

  const calculateSubtotal = useCallback(
    (selectedDate: Date | DateRange | undefined): number => {
      const days = getDatesArray(selectedDate);
      return days.reduce((total, date) => {
        const dayOfWeek = moment(date).format("dddd");
        return total + getPriceForDay(dayOfWeek);
      }, 0);
    },
    [getDatesArray, getPriceForDay]
  );

  const getStartEndDates = useCallback(
    (selectedDate: Date | DateRange | undefined) => {
      if (!selectedDate) return { startDate: null, endDate: null };
      if (selectedDate && "from" in selectedDate && "to" in selectedDate)
        return { startDate: selectedDate.from!, endDate: selectedDate.to! };

      return {
        startDate: selectedDate as Date,
        endDate: moment(selectedDate as Date)
          .add(spot.duration, "hours")
          .toDate(),
      };
    },
    [spot.duration]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      const dayOfWeek = moment(date).format("dddd");
      const dateStr = moment(date).format("YYYY-MM-DD");
      if (date < moment().toDate()) return true;

      if (spot.durationType === "hours") {
        const timeslots = getSelectedDayTimeslots(dayOfWeek);
        const availableTimeslots = timeslots.filter((timeslot) => {
          const bookingsOnTimeslot = bookings.filter(
            (booking) =>
              moment(booking.startDate).format("YYYY-MM-DD hh:mm A") <=
                dateStr + " " + timeslot &&
              moment(booking.endDate).format("YYYY-MM-DD hh:mm A") >=
                dateStr + " " + timeslot
          );
          return bookingsOnTimeslot.length < (spot.units ?? 0);
        });
        return availableTimeslots.length === 0;
      }
      const bookingsOnDate = bookings.filter(
        (booking) =>
          moment(booking.startDate).format("YYYY-MM-DD") <= dateStr &&
          moment(booking.endDate).format("YYYY-MM-DD") >= dateStr
      );
      return bookingsOnDate.length >= (spot.units ?? 0);
    },
    [bookings, getSelectedDayTimeslots, spot]
  );

  const updateFormData = useCallback(
    (selectedDate: DateRange | Date | undefined) => {
      if (selectedDate) {
        const { startDate, endDate } = getStartEndDates(selectedDate);
        form.setValue("startDate", startDate);
        form.setValue("endDate", endDate);
        const total = calculateSubtotal(selectedDate);
        form.setValue("subtotal", total);
        form.setValue("totalPrice", total);
      }
    },
    [form, calculateSubtotal, getStartEndDates]
  );

  return (
    <div>
      <div className="grid gap-2 justify-center">
        <Calendar
          className="p-0 xl:flex [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6"
          mode={spot.durationType === "hours" ? "single" : "range"}
          numberOfMonths={1}
          defaultMonth={(selectedDate as DateRange)?.from}
          onSelect={(date: DateRange | Date | undefined) => {
            setSelectedDate(date);
            updateFormData(date);
          }}
          selected={selectedDate as any}
          disabled={(date) => isDateDisabled(date)}
        />
      </div>
      {spot.durationType === "hours" && selectedDate && (
        <>
          <div className="max-w-md my-4 p-0 space-y-4">
            <h2 className="text-md font-bold">
              {getSelectedDayTimeslots(
                moment(selectedDate as Date).format("dddd")
              ).length > 0
                ? "Select a Time Slot"
                : "No time slots available, please select another date"}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {getSelectedDayTimeslots(
                moment(selectedDate as Date).format("dddd")
              ).map(
                (timeslot, key) =>
                  !isTimeslotDisabled(selectedDate as Date, timeslot) && (
                    <button
                      key={key}
                      type="button"
                      className={`text-sm bg-gray-100 rounded-md py-1 px-2 transition-colors relative ${
                        isTimeslotDisabled(selectedDate as Date, timeslot)
                          ? "bg-red-500 cursor-not-allowed relative"
                          : moment(selectedDate as Date).format("hh:mm A") ===
                            timeslot
                          ? "bg-slate-600 hover:bg-slate-800 text-white"
                          : "hover:bg-slate-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        if (
                          !isTimeslotDisabled(selectedDate as Date, timeslot)
                        ) {
                          const date = moment(
                            `${moment(selectedDate as Date).format(
                              "YYYY-MM-DD"
                            )} ${
                              moment(selectedDate as Date).format("hh:mm A") ===
                              timeslot
                                ? "00:00"
                                : timeslot
                            }`,
                            "YYYY-MM-DD hh:mm A"
                          ).toDate();
                          setSelectedDate(date);
                          updateFormData(date);
                        }
                      }}
                    >
                      {timeslot}
                    </button>
                  )
              )}
            </div>
          </div>
        </>
      )}
      {selectedDate &&
      (spot.durationType === "hours"
        ? getSelectedDayTimeslots(
            moment(selectedDate as Date).format("dddd")
          ).includes(moment(selectedDate as Date).format("hh:mm A"))
        : (selectedDate as DateRange).to) ? (
        <div className="flex flex-col my-4">
          {spot.durationType !== "hours" && (
            <div className="flex flex-col justify-center rounded-lg mx-4 mb-2">
              <div className="flex flex-row justify-between items-center gap-2">
                <div className="bg-gray-100 rounded-lg w-full p-2">
                  <div className="text-xs text-muted-foreground font-medium mb-0">
                    CHECK-IN
                  </div>
                  <div className="text-sm font-medium rounded-md">
                    {moment((selectedDate as DateRange).from).format("hh:mm A")}
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg w-full p-2">
                  <div className="text-xs text-muted-foreground font-medium mb-0">
                    CHECK-OUT
                  </div>
                  <div className="text-sm font-medium rounded-md">
                    {(selectedDate as DateRange).to
                      ? moment((selectedDate as DateRange).to).format("hh:mm A")
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <Button
              type="button"
              className="w-full h-12 my-3"
              size="lg"
              disabled={
                !selectedDate ||
                (spot.durationType === "hours" &&
                  !getSelectedDayTimeslots(
                    moment(selectedDate as Date).format("dddd")
                  ).includes(moment(selectedDate as Date).format("hh:mm A")))
              }
              onClick={callback}
            >
              Continue
            </Button>
          </div>
          <div className="text-sm text-gray-500 text-center dark:text-gray-400 my-2">
            You won't be charged yet
          </div>
          <Separator />
          <div className="flex justify-between items-center mt-4">
            <div className="font-semibold">
              Total{" "}
              {spot.durationType === "hours"
                ? `for ${spot.duration} ${
                    spot.duration === 1 ? "hour" : "hours"
                  }`
                : ""}
            </div>
            <div>
              $
              {new Intl.NumberFormat("de-DE")
                .format(form.getValues().totalPrice)
                .replace(",", ".")}
            </div>
          </div>
        </div>
      ) : (
        spot.durationType !== "hours" &&
        selectedDate &&
        !(selectedDate as DateRange).to && (
          <div className="flex justify-center p-2 my-4">
            Please select a check-out date
          </div>
        )
      )}
    </div>
  );
}

export default BookingAvailability;
