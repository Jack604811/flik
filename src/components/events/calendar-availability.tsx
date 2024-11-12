/* eslint-disable react/no-unescaped-entities */
import { bookingSchema } from "@/schemas/booking.schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { BookingDates } from "@/lib/types";
import moment, { now } from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { DateRange, isDateRange } from "react-day-picker";
import { date, z } from "zod";
import { WORKING_HOUR_TYPE, calculateSubtotal } from "@/lib/utils";
import { endOfDay, startOfDay } from "date-fns";

type Params = {
  spot: z.infer<typeof bookingSchema>["spot"];
  bookings: BookingDates[];
  selectedDate: Date | DateRange | undefined;
  callback: (data: any) => void;
  onDateSelected: (data: {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    subTotal: number;
  }) => void;
  isDisabled?: boolean;
  btnText?: string;
};

function CalendarAvailability({
  spot,
  bookings,
  selectedDate,
  callback,
  onDateSelected,
  isDisabled,
  btnText,
}: Params) {
  const workingHours: WORKING_HOUR_TYPE[] = spot.workingHours as any;

  const isTimeslotDisabled = useCallback(
    (date: Date, timeslot: string) => {
      const dateStr = moment(date).format("YYYY-MM-DD");
      const startTime = moment(`${dateStr} ${timeslot}`, "YYYY-MM-DD hh:mm A");
      const endTime = startTime.clone().add(spot.duration, "hours");

      // Filter bookings that overlap with the selected timeslot
      const overlappingBookings = bookings.filter((booking) => {
        const bookingStartTime = moment(booking.startDate);
        const bookingEndTime = moment(booking.endDate);

        // Check for overlap condition excluding the end time as the start of the next available slot
        return (
          startTime.isBefore(bookingEndTime) &&
          endTime.isAfter(bookingStartTime)
        );
      });

      return overlappingBookings.length >= (spot.units ?? 0);
    },
    [bookings, spot]
  );

  const getAvailableTimeslots = useCallback(
    (date: Date) => {
      const dayOfWeek = moment(date).format("dddd");
      const workingHour = workingHours.find(
        (wh: { day: string }) => wh.day === dayOfWeek
      );
      const openTime = moment(workingHour?.openTime, "hh:mm A");
      const closeTime = moment(workingHour?.closeTime, "hh:mm A");

      if (closeTime.isBefore(openTime)) {
        closeTime.add(1, "days");
      }

      const timeslots = [];
      let currentTime = openTime.clone();
      const now = moment();

      while (currentTime.isBefore(closeTime)) {
        const endTime = currentTime.clone().add(spot.duration, "hours");
        if (endTime.isAfter(closeTime)) break;

        if (moment(date).isSame(now, "day") && currentTime.isBefore(now)) {
          currentTime.add(spot.duration, "hours");
          continue;
        }

        if (!isTimeslotDisabled(date, currentTime.format("hh:mm A"))) {
          timeslots.push(currentTime.format("hh:mm A"));
        }
        currentTime.add(spot.duration, "hours");
      }
      return timeslots.sort((a, b) =>
        moment(a, "hh:mm A").diff(moment(b, "hh:mm A"))
      );
    },
    [workingHours, spot, isTimeslotDisabled]
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

        // Pending disable past timeslots if the date is today

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
      return timeslots.sort((a, b) =>
        moment(a, "hh:mm A").diff(moment(b, "hh:mm A"))
      );
    },
    [workingHours, spot, isTimeslotDisabled, selectedDate]
  );

  const getStartEndDates = useCallback(
    (selectedDate: Date | DateRange | undefined) => {
      if (!selectedDate) return { startDate: null, endDate: null };
      if (
        isDateRange(selectedDate) &&
        "from" in selectedDate &&
        "to" in selectedDate
      ) {
        // For day duration type, do not add a full day to endDate
        if (spot.durationType === "day") {
          return { startDate: selectedDate.from, endDate: selectedDate.to };
        }
        return { startDate: selectedDate.from, endDate: selectedDate.to };
      }

      const startDate = selectedDate as Date;
      const endDate =
        spot.durationType === "day"
          ? moment(startDate).add(1, "day").toDate()
          : moment(startDate).add(spot.duration, "hours").toDate();

      return {
        startDate,
        endDate,
      };
    },
    [spot.duration, spot.durationType]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      const currentDate = moment().startOf("day");
      const selectedDateMoment = moment(date).startOf("day");

      // Disable dates in the past
      if (selectedDateMoment.isBefore(currentDate, "day")) {
        return true;
      }

      // Check if selectedDate is a DateRange and has `from` and `to` properties
      if (
        selectedDate &&
        isDateRange(selectedDate) &&
        selectedDate.from &&
        selectedDate.to
      ) {
        const fromDate = moment(selectedDate.from).startOf("day");
        const toDate = moment(selectedDate.to).endOf("day");

        // Block dates outside of the selected date range
        if (
          selectedDateMoment.isBefore(fromDate, "day") ||
          selectedDateMoment.isAfter(toDate, "day")
        ) {
          return true;
        }
      }


      // Check if the date has working hours defined
      const dayOfWeek = selectedDateMoment.format("dddd");
      const workingHour = workingHours.find(
        (wh: { day: string }) => wh.day === dayOfWeek
      );
      // Disable the selection of the day in a range as 'from' if the working hour doesn't have openTime
      if (
        selectedDate &&
        isDateRange(selectedDate) &&
        selectedDate.from &&
        !workingHour?.openTime &&
        selectedDateMoment.isSame(moment(selectedDate.from).startOf("day"))
      ) {
        return true;
      }
      // If no working hours, openTime is empty
      if (!workingHour?.openTime) {
        // Check if selectedDate is a DateRange and has no `to` property and closeTime is not empty
        if (selectedDate && isDateRange(selectedDate)) {
          if (!workingHour?.closeTime) {
            return true;
          }
          return false;
        }
        return true;
      }

      // Handle day duration type
      if (spot.durationType === "days") {
        // Check for overlapping bookings
        const overlappingBookings = bookings.filter((booking) => {
          const bookingStartDate = moment(booking.startDate).startOf("day");
          const bookingEndDate = moment(booking.endDate).endOf("day");

          return selectedDateMoment.isBetween(
            bookingStartDate,
            bookingEndDate,
            null,
            "[]"
          );
        });

        if (overlappingBookings.length >= (spot.units ?? 0)) {
          return true; // Block the day if fully booked
        }
      }

      // Handle hours duration type
      if (spot.durationType === "hours") {
        const timeslots = getAvailableTimeslots(date);
        if (timeslots.length === 0) {
          return true; // Block the day if no timeslots are available
        }
      }

      return false;
    },
    [
      selectedDate,
      workingHours,
      spot.durationType,
      spot.units,
      bookings,
      getAvailableTimeslots,
    ]
  );

  const updateFormData = useCallback(
    (selectedDate: DateRange | Date | undefined) => {
      if (
        isDateRange(selectedDate) &&
        selectedDate.from &&
        selectedDate.to &&
        moment(selectedDate.from).isBefore(selectedDate.to)
      ) {
        let hasDisabledDayInRange = false;
        for (
          let day = moment(selectedDate.from);
          day.isBefore(selectedDate.to);
          day.add(1, "day")
        ) {
          if (isDateDisabled(day.toDate())) {
            hasDisabledDayInRange = true;
            break;
          }
        }
        if (hasDisabledDayInRange) {
          return;
        }
      }

      const { startDate, endDate } = getStartEndDates(selectedDate);

      const subTotal = calculateSubtotal(selectedDate, workingHours);
      onDateSelected({
        startDate,
        endDate,
        subTotal,
      });
    },
    [getStartEndDates, onDateSelected, workingHours]
  );

  const getNextAvailableMonth = (): Date | undefined => {
    const today = new Date();
    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const isMonthAvailable = (date: Date): boolean => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      for (
        let day = new Date(startOfMonth);
        day <= endOfMonth;
        day.setDate(day.getDate() + 1)
      ) {
        if (!isDateDisabled(day)) {
          return true; // Month has at least one available day
        }
      }
      return false; // Month is fully booked
    };

    let nextAvailableDate = startOfCurrentMonth;

    // Keep moving to the next month until a month with availability is found
    while (!isMonthAvailable(nextAvailableDate)) {
      nextAvailableDate.setMonth(nextAvailableDate.getMonth() + 1);
      nextAvailableDate.setDate(1); // Start at the first day of the new month
    }

    return nextAvailableDate;
  };

  const defaultMonth = selectedDate
    ? isDateRange(selectedDate)
      ? selectedDate.from
      : selectedDate
    : getNextAvailableMonth();

  return (
    <div>
      <div className="grid gap-2 justify-center">
        <Calendar
          className="p-0 xl:flex [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6"
          mode={spot.durationType === "hours" ? "single" : "range"}
          numberOfMonths={1}
          defaultMonth={defaultMonth}
          onSelect={(date: DateRange | Date | undefined) => {
            updateFormData(date);
          }}
          selected={selectedDate as any}
          disabled={(date) => isDateDisabled(date)}
          
        />
      </div>
      {spot.durationType === "hours" && selectedDate && (
        <>
          <div className="max-w-md my-4 p-0 space-y-4">
            <div className="text-sm text-destructive font-bold">
              {getSelectedDayTimeslots(
                moment(selectedDate as Date).format("dddd")
              ).length > 0
                ? "Select a Time"
                : "No slots available, please select another date"}
            </div>
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
                          ? "bg-red-500 cursor-not-allowed relative dark:bg-red-300"
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
                  <div className="text-sm font-medium rounded-md dark:text-black">
                    {moment((selectedDate as DateRange).from).format("hh:mm A")}
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg w-full p-2">
                  <div className="text-xs text-muted-foreground font-medium mb-0">
                    CHECK-OUT
                  </div>
                  <div className="text-sm font-medium rounded-md dark:text-black">
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
                isDisabled ||
                !selectedDate ||
                (spot.durationType === "hours" &&
                  !getSelectedDayTimeslots(
                    moment(selectedDate as Date).format("dddd")
                  ).includes(moment(selectedDate as Date).format("hh:mm A")))
              }
              onClick={callback}
            >
              {btnText ?? "Continue"}
            </Button>
          </div>
          {/* <div className="text-sm text-gray-500 text-center dark:text-gray-400 my-2">
            You won't be charged yet
          </div> */}
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
                .format(calculateSubtotal(selectedDate, workingHours))
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

export default CalendarAvailability;
