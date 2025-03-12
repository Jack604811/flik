"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DateFilter } from "@/components/calendar/filter/date-filter";
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
import BookingDetail from "@/components/booking-details/booking-details";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterPopover } from "@/components/calendar/filter/filter-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/main/empty-state";

interface Booking extends BaseBooking {
  isNewBooking?: boolean;
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
  refreshEvents,
}: ListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    if (bookings.length > 0 || bookings.length === 0) {
      setLoading(false);
    }
  }, [bookings]);

  
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

    const matchesSpots =
      selectedSpots.length === 0 || selectedSpots.includes(booking.spot.id);

    const matchesStatuses =
      selectedStatuses.length === 0 || selectedStatuses.includes(booking.status);

    return matchesSearch && matchesDateRange && matchesSpots && matchesStatuses;
  });

  const newBookingsCount = bookings.filter((booking) => booking.isNewBooking).length;

  const bookingsCount =
    dateRange || searchTerm || selectedSpots.length > 0 || selectedStatuses.length > 0
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
    return refreshEvents();
  }

  const handleOpenSheet = (booking: Booking) => {
    console.log("Opening sheet for booking:", booking.id);
    setSelectedBooking(booking);
    setOpen(true);
  };

  const getBookingForSheet = (bk: Booking) => ({
    id: bk.id,
    status: "Confirmed" as any,
    createdAt: new Date(bk.createdAt),
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
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="py-4 space-y-4">
        <DateFilter column={Row} title="Filter by Date" className="mb-4" />
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">{bookingsCount}</p>
          <div className="md:hidden">
            <CreateBooking workspaceId={workspaceId} refreshBookings={fetchBookings} />
          </div>
        </div>
        
        <div className="flex gap-2">
        <div className="relative w-full">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-16"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <span className="text-xs text-gray-500 border bg-muted/50 rounded px-1 py-0.5">
              ⌘ K
            </span>
          </span>
        </div>
          
          <div className="md:hidden">
            <FilterPopover
              bookings={bookings}
              onSpotSelected={(selected) => setSelectedSpots(selected)}
              onStatusSelected={(selected) => setSelectedStatuses(selected)}
            />
          </div>
        </div>
        <div className="h-[80vh] pb-24 md:pb-16 overflow-y-auto">
          <TooltipProvider>
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex w-full rounded-lg bg-muted/50 p-4 animate-pulse">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex flex-col justify-center flex-grow ml-4 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
              ) : filteredBookings.length > 0 ? (
                <>
                  {filteredBookings.map((booking) => {
                    const day = new Date(booking.startDate).getDate();
                    const month = new Date(booking.startDate).toLocaleString("en-US", {
                      month: "short",
                    });
                    const durationMs =
                      new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
                    const durationInHours = Math.round(durationMs / (1000 * 60 * 60));
                    const durationInDays = Math.floor(durationInHours / 24);
                    const duration =
                      durationInDays > 0
                        ? `${durationInDays} ${durationInDays > 1 ? "days" : "day"}`
                        : `${durationInHours} ${durationInHours > 1 ? "hours" : "hour"}`;

                    return (
                      <HoverCard key={booking.id}>
                        <HoverCardTrigger asChild>
                          <div>
                            <Sheet
                              open={open && selectedBooking?.id === booking.id}
                              onOpenChange={setOpen}
                            >
                              <SheetTrigger asChild>
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex w-full rounded-lg py-2 bg-muted/50 border cursor-pointer hover:transform"
                                  onClick={() => handleOpenSheet(booking)}
                                >
                                  <div className="flex w-full">
                                    <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg border-none p-0 text-primary">
                                      <span className="text-sm font-semibold tracking-wider">
                                        {month}
                                      </span>
                                      <span className="text-2xl font-bold">{day}</span>
                                    </div>
                                    <div className="flex flex-col justify-center flex-grow">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">
                                          {booking.customer.name}
                                        </h3>
                                        {booking.isNewBooking && (
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
                                    <RowActions booking={booking} refreshEvents={refreshEvents} />
                                  </div>
                                </motion.div>
                              </SheetTrigger>
                              <SheetContent className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]">
                                {selectedBooking && selectedBooking.id === booking.id && (
                                  <BookingDetail booking={getBookingForSheet(selectedBooking)} />
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
                            eventDateRange={`${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`}
                            eventTimeRange={`${formatTime(booking.startDate)} - ${formatTime(booking.endDate)}`}
                            spot={booking.spot.name}
                            totalPrice={booking.totalPrice}
                            startDate={booking.startDate.toString()}
                            endDate={booking.endDate.toString()}
                            isNewEvent={booking.isNewBooking}
                          />
                        </HoverCardContent>
                      </HoverCard>
                    );
                  })}
                </>
              ) : (
                <>
                <div className="h-[50vh]">
                <EmptyState
                  imageUrl="/placeholder.svg"
                  title={searchTerm ? "No results found" : "No bookings yet"}
                  description={searchTerm
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Start by adding a new booking to see your reservations here."} 
                  buttonLabel="New Booking"
                  onButtonClick={() => console.log("Create Booking")}
                  >
                  </EmptyState>
                </div>
                </>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
