import React, { useState } from "react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
  isBefore,
  differenceInCalendarDays,
  differenceInMinutes,
  max,
  min,
} from "date-fns";
import Link from "next/link";
import { PreviewContent } from "../preview-content";
import { CreateBooking } from "@/components/forms/create-booking";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BookingDetail from "@/components/booking-details/booking-details";
import { BookingStatus } from "@prisma/client"; 

type Booking = {
  id: string;
  spot: {
    name: string;
  };
  startDate: Date | string;
  endDate: Date | string;
  customer: {
    name: string;
    phone: string;
  };
  totalPrice: number;
  isNewBooking?: boolean;
};

export function WeekView({
  currentDate,
  workspaceId,
  onBookingCreated,
  bookings = [],
  onDaySelected,
}: {
  currentDate: Date;
  workspaceId: string;
  onBookingCreated: () => void;
  bookings: Booking[];
  onDaySelected: (date: Date) => void;
}) {
  const [hoveredBooking, setHoveredBooking] = useState<Booking | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // -- SHEET HANDLING
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // builds an object matching the shape required by BookingDetail
  function getBookingForSheet(bk: Booking) {
    return {
      id: bk.id,
      status: "Confirmed" as BookingStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
      spot: {
        id: "",
        name: bk.spot.name,
        units: 0,
        duration: 0,
        durationType: "",
        workingHours: [],
      },
      spotId: "",
      customer: {
        id: "TEMP_ID",
        name: bk.customer.name,
        email: "",
        phone: bk.customer.phone,
      },
      subtotal: 0,
      totalPrice: bk.totalPrice,
      startDate: new Date(bk.startDate),
      endDate: new Date(bk.endDate),
      note: "",
      customFields: [],
    };
  }

  const handleOpenSheet = (
    bk: Booking,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    setSelectedBooking(bk);
    setOpen(true);
  };
  // --------------------

  const daysToRender = React.useMemo(() => {
    const startOfCurrentWeek = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  }, [currentDate]);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  const weekBookings = bookings.filter((booking) => {
    const bookingStartDate = new Date(booking.startDate);
    const bookingEndDate = new Date(booking.endDate);
    return bookingEndDate >= weekStart && bookingStartDate <= weekEnd;
  });

  const processedBookings = processBookings(weekBookings);

  function processBookings(bookings: Booking[]) {
    const processedBookings: (Booking & { position: number })[] = [];
    const positionsByDay: { [day: string]: number } = {};

    bookings.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    bookings.forEach((booking) => {
      const bookingStartDate = new Date(booking.startDate);
      const bookingEndDate = new Date(booking.endDate);
      const bookingStart = max([bookingStartDate, weekStart]);
      const bookingEnd = min([bookingEndDate, weekEnd]);

      const startDayIndex = differenceInCalendarDays(bookingStart, weekStart);
      const endDayIndex = differenceInCalendarDays(bookingEnd, weekStart);

      let maxPositionForBooking = 0;
      for (let day = startDayIndex; day <= endDayIndex; day++) {
        const dayKey = day.toString();
        const position = positionsByDay[dayKey] || 0;
        maxPositionForBooking = Math.max(maxPositionForBooking, position);
      }
      const bookingPosition = maxPositionForBooking;

      for (let day = startDayIndex; day <= endDayIndex; day++) {
        const dayKey = day.toString();
        positionsByDay[dayKey] = bookingPosition + 1;
      }

      processedBookings.push({ ...booking, position: bookingPosition });
    });

    return processedBookings;
  }

  const maxPosition = Math.max(
    ...processedBookings.map((booking) => booking.position),
    0
  );
  const containerHeight = (maxPosition + 1) * 28;

  return (
    <div className="flex flex-col h-full">
      <div className="flex mb-0">
        {daysToRender.map((date, index) => (
          <div
            key={index}
            className={`flex-1 text-center p-2 cursor-pointer ${
              isSameDay(date, currentDate)
                ? "bg-neutral-100 dark:bg-neutral-900"
                : "bg-transparent"
            } ${
              index < 6
                ? "border-r border-neutral-200 dark:border-neutral-900"
                : ""
            }`}
            onClick={() => onDaySelected(date)}
          >
            <div className="text-xs">{format(date, "EEE")}</div>
            <div className="text-2xl font-bold">{format(date, "d")}</div>
          </div>
        ))}
      </div>

      <div className="relative flex-1 overflow-auto cursor-pointer">
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-900"
              style={{
                left: `${((index + 1) / 7) * 100}%`,
              }}
            />
          ))}
        </div>

        <div
          className="relative h-screen"
          style={{ minHeight: `${containerHeight}px` }}
        >
          {processedBookings.map((booking) => {
            const bookingStartDate = new Date(booking.startDate);
            const bookingEndDate = new Date(booking.endDate);
            const bookingStart = max([bookingStartDate, weekStart]);
            const bookingEnd = min([bookingEndDate, weekEnd]);

            const totalDays = 7;
            let bookingLeft =
              (differenceInCalendarDays(bookingStart, weekStart) / totalDays) *
              100;
            let bookingDurationDays =
              differenceInCalendarDays(bookingEnd, bookingStart) + 1;
            let bookingWidth = (bookingDurationDays / totalDays) * 100;

            const bookingTop = booking.position * 28;
            const spansMultipleDays = !isSameDay(bookingStartDate, bookingEndDate);

            if (spansMultipleDays) {
              const minutesInDay = 24 * 60;

              let startOffsetPercent = 0;
              if (isSameDay(bookingStart, bookingStartDate)) {
                const minutesSinceStartOfDay =
                  bookingStartDate.getHours() * 60 +
                  bookingStartDate.getMinutes();
                startOffsetPercent =
                  (minutesSinceStartOfDay / minutesInDay) * 100;
              }

              let endOffsetPercent = 0;
              if (isSameDay(bookingEnd, bookingEndDate)) {
                const minutesUntilEndOfDay =
                  bookingEndDate.getHours() * 60 + bookingEndDate.getMinutes();
                const endOffset = minutesUntilEndOfDay / minutesInDay;
                endOffsetPercent = (1 - endOffset) * 100;
              }

              bookingLeft += (startOffsetPercent / 100) * (100 / totalDays);
              bookingWidth -=
                (startOffsetPercent / 100) * (100 / totalDays) +
                (endOffsetPercent / 100) * (100 / totalDays);
            }

            const isContinuingBooking = isBefore(bookingStartDate, weekStart);
            const bookingBgColor = isContinuingBooking
              ? "bg-gray-500"
              : "bg-violet-500";

            return (
              <Sheet
                key={booking.id}
                open={open && selectedBooking?.id === booking.id}
                onOpenChange={setOpen}
              >
                <SheetTrigger asChild>
                  <div
                    onMouseEnter={() => setHoveredBooking(booking)}
                    onMouseLeave={() => setHoveredBooking(null)}
                    onMouseMove={(e) =>
                      setMousePosition({ x: e.clientX, y: e.clientY })
                    }
                  >
                    <div
                      className={`${bookingBgColor} absolute text-white text-sm rounded px-1 py-0.5 cursor-pointer overflow-hidden border border-background`}
                      style={{
                        top: `${bookingTop}px`,
                        left: `${bookingLeft}%`,
                        width: `${bookingWidth}%`,
                        height: `24px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSheet(booking, e);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{booking.spot.name}</span>
                        {booking.isNewBooking && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="text-xs">{booking.customer.name}</div>
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]">
                  {selectedBooking && selectedBooking.id === booking.id && (
                    <BookingDetail booking={getBookingForSheet(selectedBooking)} />
                  )}
                </SheetContent>
              </Sheet>
            );
          })}
          {hoveredBooking && (
            <div
              className="w-64 p-4 bg-black text-white rounded-lg"
              style={{
                position: "fixed",
                top: mousePosition.y + 10,
                left: mousePosition.x + 10,
                zIndex: 1000,
              }}
            >
              <PreviewContent
                Id={hoveredBooking.id}
                customerName={hoveredBooking.customer.name}
                customerPhone={hoveredBooking.customer.phone}
                eventDateRange={
                  isSameDay(
                    new Date(hoveredBooking.startDate),
                    new Date(hoveredBooking.endDate)
                  )
                    ? format(new Date(hoveredBooking.startDate), "MMM d")
                    : `${format(
                        new Date(hoveredBooking.startDate),
                        "MMM d"
                      )} - ${format(
                        new Date(hoveredBooking.endDate),
                        "MMM d"
                      )}`
                }
                eventTimeRange={`${format(
                  new Date(hoveredBooking.startDate),
                  "hh:mm a"
                )} - ${format(
                  new Date(hoveredBooking.endDate),
                  "hh:mm a"
                )}`}
                startDate={new Date(hoveredBooking.startDate).toISOString()}
                endDate={new Date(hoveredBooking.endDate).toISOString()}
                spot={hoveredBooking.spot.name}
                totalPrice={hoveredBooking.totalPrice}
                isNewEvent={hoveredBooking.isNewBooking}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
