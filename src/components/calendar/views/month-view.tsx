import React, { useState } from 'react';
import {
  format,
  addDays,
  startOfMonth,
  getDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { CreateBooking } from '@/components/forms/create-booking';
import { PreviewContent } from '../preview-content';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

export default function MonthView({
  currentDate,
  workspaceId,
  onBookingCreated,
  onDaySelected,
  bookings = [],
}: {
  currentDate: Date;
  workspaceId: string;
  onBookingCreated: () => void;
  onDaySelected: (date: Date) => void;
  bookings: Booking[];
}) {
  const startDate = startOfMonth(currentDate);
  const firstDayOfWeek = getDay(startDate);
  const daysToRender = Array.from({ length: 35 }, (_, i) =>
    addDays(startDate, i - firstDayOfWeek)
  );

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

  const handleOpenSheet = (bk: Booking) => {
    setSelectedBooking(bk);
    setOpen(true);
  };
  // -----------------

  return (
    <TooltipProvider>
      <div className="flex justify-center w-full">
        <div className="h-full w-full">
          <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 max-h-[240px]">
            {daysToRender.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const isCurrentMonth = isSameMonth(date, currentDate);

              const bookingsForDate = bookings.filter((booking) =>
                isSameDay(new Date(booking.startDate), date)
              );

              const displayBookings = bookingsForDate.slice(0);
              const remainingBookingsCount = bookingsForDate.length - 5;

              return (
                <div
                  key={index}
                  className={`relative flex flex-col max-h-[240px] max-w-[240px] min-w-full aspect-square border border-neutral-200 dark:border-neutral-800 rounded-md p-1 group cursor-pointer ${
                    isToday ? 'bg-muted' : ''
                  } ${
                    !isCurrentMonth ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => onDaySelected(date)}
                >
                  <time
                    dateTime={format(date, 'yyyy-MM-dd')}
                    className="text-xs font-semibold m-1"
                  >
                    {format(date, 'd')}
                  </time>

                  <div className="flex flex-col justify-between h-full">
                    <div className="mt-1 space-y-1 text-xs overflow-y-auto flex-grow">
                      {displayBookings.map((booking) => {
                        const bookingStartDate = new Date(booking.startDate).toISOString();
                        const bookingEndDate = new Date(booking.endDate).toISOString();

                        const bookingDateRange =
                          new Date(booking.startDate).toDateString() ===
                          new Date(booking.endDate).toDateString()
                            ? format(new Date(booking.startDate), 'MMM d')
                            : `${format(
                                new Date(booking.startDate),
                                'MMM d'
                              )} - ${format(new Date(booking.endDate), 'MMM d')}`;

                        const bookingTimeRange = `${format(
                          new Date(booking.startDate),
                          'hh:mm a'
                        )} - ${format(new Date(booking.endDate), 'hh:mm a')}`;

                        return (
                          <Tooltip key={booking.id}>
                            <TooltipTrigger asChild>
                              <div>
                                {/* --- SHEET FOR THIS BOOKING --- */}
                                <Sheet
                                  open={open && selectedBooking?.id === booking.id}
                                  onOpenChange={setOpen}
                                >
                                  <SheetTrigger asChild>
                                    <div
                                      className="truncate bg-violet-500 text-white rounded px-1 py-0.5 mb-1 cursor-pointer flex items-center justify-between gap-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenSheet(booking);
                                      }}
                                    >
                                      {booking.spot.name}
                                      {booking.isNewBooking && (
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>New</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </SheetTrigger>
                                  <SheetContent className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]">
                                    {selectedBooking &&
                                      selectedBooking.id === booking.id && (
                                        <BookingDetail
                                          booking={getBookingForSheet(selectedBooking)}
                                        />
                                      )}
                                  </SheetContent>
                                </Sheet>
                                {/* --------------------------------- */}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              align="center"
                              className="w-64 p-4 bg-black text-white rounded-lg"
                            >
                              <PreviewContent
                                Id={booking.id}
                                customerName={booking.customer.name}
                                customerPhone={booking.customer.phone}
                                eventDateRange={bookingDateRange}
                                eventTimeRange={bookingTimeRange}
                                startDate={bookingStartDate}
                                endDate={bookingEndDate}
                                spot={booking.spot.name}
                                totalPrice={booking.totalPrice}
                                isNewEvent={booking.isNewBooking}
                              />
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>

                    {remainingBookingsCount > 0 && (
                      <div className="flex justify-center mt-1">
                        <button className="text-xs text-gray-400">
                          +{remainingBookingsCount} more
                        </button>
                      </div>
                    )}
                  </div>

                  {bookingsForDate.length === 0 && (
                    <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900/90 flex items-center justify-center p-2">
                      {/* <CreateBooking
                        workspaceId={workspaceId}
                        onBookingCreated={onBookingCreated} 
                      /> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
