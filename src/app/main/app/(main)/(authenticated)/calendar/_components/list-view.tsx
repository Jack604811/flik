// list-view.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DateFilter } from "@/components/calendar/date-filter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { PreviewContent } from "@/components/calendar/preview-content";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { RowActions } from "@/components/calendar/row-actions";
import { Booking as BaseBooking } from "@/schemas/booking.schema";
import { CreateBooking } from "@/components/forms/create-booking";
import BookingDetail from "@/components/calendar/booking-details";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Booking extends BaseBooking {
  isNewEvent?: boolean;
}

interface ListViewProps {
  bookings: Booking[];
  workspaceId: string;
  loading?: boolean;
  refreshEvents: () => Promise<void>;
}

export default function ListView({
  bookings,
  workspaceId,
  loading = false,
  refreshEvents,
}: ListViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateRange, setDateRange] = React.useState<[Date, Date] | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const Row = {
    getFilterValue: () => dateRange,
    setFilterValue: (value: [Date, Date] | null) => setDateRange(value),
  } as any;

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.spot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange =
      dateRange === null ||
      (new Date(booking.startDate) >= dateRange[0] &&
        new Date(booking.startDate) <= dateRange[1]);

    return matchesSearch && matchesDateRange;
  });

  const newBookingsCount = bookings.filter((booking) => booking.isNewEvent).length;

  const bookingsCount =
    dateRange || searchTerm
      ? `Result ${filteredBookings.length}`
      : `Last bookings ${newBookingsCount > 0 ? `+${newBookingsCount}` : ""}`;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  function fetchBookings(): Promise<void> {
    throw new Error("Function not implemented.");
  }

  const handleOpenSheet = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <div className="py-4 space-y-4">
          <DateFilter column={Row} title="Filter by Date" className="mb-4" />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">{bookingsCount}</p>
            <div className="md:hidden">
              <CreateBooking
                workspaceId={workspaceId}
                refreshBookings={fetchBookings}
              />
            </div>
          </div>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="h-[80vh] pb-8 md:pb-16 overflow-y-auto">
            <TooltipProvider>
              <div className="flex flex-col gap-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex w-full rounded-lg border bg-card py-8 animate-pulse"
                    ></div>
                  ))
                ) : filteredBookings.length > 0 ? (
                  <>
                    {filteredBookings.map((booking) => {
                      const day = new Date(booking.startDate).getDate();
                      const month = new Date(booking.startDate).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                        }
                      );
                      const durationMs =
                        new Date(booking.endDate).getTime() -
                        new Date(booking.startDate).getTime();
                      const durationInHours = Math.round(
                        durationMs / (1000 * 60 * 60)
                      );
                      const durationInDays = Math.floor(durationInHours / 24);
                      const duration =
                        durationInDays > 0
                          ? `${durationInDays} ${
                              durationInDays > 1 ? "days" : "day"
                            }`
                          : `${durationInHours} ${
                              durationInHours > 1 ? "hours" : "hour"
                            }`;

                      return (
                        <HoverCard key={booking.id}>
                          <HoverCardTrigger asChild>
                            <div>
                              <Sheet open={open && selectedBooking?.id === booking.id} onOpenChange={setOpen}>
                                <SheetTrigger asChild>
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex w-full rounded-lg border py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                                    onClick={() => handleOpenSheet(booking)}
                                  >
                                    <div className="flex w-full">
                                      <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg border-none p-0 text-primary">
                                        <span className="text-sm font-semibold tracking-wider">
                                          {month}
                                        </span>
                                        <span className="text-2xl font-bold">
                                          {day}
                                        </span>
                                      </div>
                                      <div className="flex flex-col justify-center flex-grow">
                                        <div className="flex items-center gap-2">
                                          <h3 className="font-semibold">
                                            {booking.customer.name}
                                          </h3>
                                          {booking.isNewEvent && (
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>New</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-0">
                                          {booking.spot.name}
                                        </p>
                                        <div className="flex items-center gap-1 text-sm">
                                          <span>Duration: {duration}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mr-2">
                                      <RowActions
                                        booking={booking}
                                        refreshEvents={refreshEvents}
                                      />
                                    </div>
                                  </motion.div>
                                </SheetTrigger>
                                <SheetContent
                                  className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]"
                                >
                                  {selectedBooking && selectedBooking.id === booking.id && (
                                    <BookingDetail booking={selectedBooking} />
                                  )}
                                </SheetContent>
                              </Sheet>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent
                            align="center"
                            side="right"
                            className="w-64 p-4 bg-black text-white rounded-lg"
                          >
                            <PreviewContent
                              Id={booking.id}
                              customerName={booking.customer.name}
                              customerPhone={booking.customer.phone}
                              eventDateRange={`${formatDate(
                                booking.startDate
                              )} - ${formatDate(booking.endDate)}`}
                              eventTimeRange={`${formatTime(
                                booking.startDate
                              )} - ${formatTime(booking.endDate)}`}
                              spot={booking.spot.name}
                              totalPrice={booking.totalPrice}
                              startDate={booking.startDate.toString()}
                              endDate={booking.endDate.toString()}
                              isNewEvent={booking.isNewEvent}
                            />
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No bookings.</p>
                  </div>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
}
