import * as React from "react";
import {
  isSameDay,
  getHours,
  getMinutes,
  format,
  setHours,
  setMinutes,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  max as maxDate,
  min as minDate,
} from "date-fns";
import { PreviewContent } from "../preview-content";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BookingDetail from "@/components/calendar/booking-details";
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
  createdAt: Date | string;
};

type ProcessedBooking = Booking & {
  position: number;
};

export function DayView({
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
  const [hoverTime, setHoverTime] = React.useState<Date | null>(null);
  const [hoverYPosition, setHoverYPosition] = React.useState<number | null>(
    null
  );
  const [hoveredBooking, setHoveredBooking] = React.useState<Booking | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [open, setOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);

  const dayViewRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dayViewRef.current) return;

    const rect = dayViewRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const dayViewHeight = rect.height;
    const totalMinutes = Math.min(
      24 * 60,
      Math.max(0, (y / dayViewHeight) * 24 * 60)
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    const newDate = setMinutes(setHours(currentDate, hours), minutes);
    setHoverTime(newDate);

    const rootRect = dayViewRef.current.parentElement?.getBoundingClientRect();
    if (rootRect) {
      const hoverY = e.clientY - rootRect.top;
      setHoverYPosition(hoverY + 32);
    }
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setHoverYPosition(null);
  };

  const sortedBookings = [...bookings].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const dayBookings = sortedBookings.filter((booking) => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    return bookingStart < dayEnd && bookingEnd > dayStart;
  });

  const spots = Array.from(new Set(dayBookings.map((booking) => booking.spot.name)));

  type SpotData = {
    spotName: string;
    bookings: ProcessedBooking[];
    maxOverlaps: number;
    width: number;
    left: number;
  };

  const eventWidth = 180;
  const spotSpacing = 20;

  const spotsData: SpotData[] = [];
  let cumulativeLeft = 0;

  spots.forEach((spotName) => {
    const spotBookings = dayBookings.filter((booking) => booking.spot.name === spotName);
    const sortedSpotBookings = spotBookings.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const processedBookings = processBookingsForSpot(sortedSpotBookings);

    const maxOverlaps = Math.max(
      ...processedBookings.map((b) => b.position + 1),
      1
    );

    // Adjust the width to include gaps between overlapping bookings
    const eventGap = 4; // Gap between overlapping bookings
    const width = maxOverlaps * eventWidth + (maxOverlaps - 1) * eventGap;

    const spotData: SpotData = {
      spotName,
      bookings: processedBookings,
      maxOverlaps,
      width,
      left: cumulativeLeft,
    };

    spotsData.push(spotData);

    cumulativeLeft += width + spotSpacing;
  });

  const containerWidth =
    cumulativeLeft - spotSpacing > 0 ? cumulativeLeft - spotSpacing : eventWidth;

  function processBookingsForSpot(bookings: Booking[]): ProcessedBooking[] {
    const processedBookings: ProcessedBooking[] = [];
    const bookingPositions: ProcessedBooking[] = [];

    for (const booking of bookings) {
      const bookingStart = new Date(booking.startDate).getTime();
      const bookingEnd = new Date(booking.endDate).getTime();

      bookingPositions.filter((b) => new Date(b.endDate).getTime() > bookingStart);

      let position = 0;
      while (
        bookingPositions.some(
          (b) => b.position === position && isOverlapping(b, booking)
        )
      ) {
        position++;
      }

      const processedBooking: ProcessedBooking = { ...booking, position };
      processedBookings.push(processedBooking);
      bookingPositions.push(processedBooking);
    }

    return processedBookings;
  }

  function isOverlapping(bookingA: Booking, bookingB: Booking): boolean {
    const startA = new Date(bookingA.startDate).getTime();
    const endA = new Date(bookingA.endDate).getTime();
    const startB = new Date(bookingB.startDate).getTime();
    const endB = new Date(bookingB.endDate).getTime();

    return startA < endB && startB < endA;
  }

  const getBookingStyle = (
    booking: Booking,
    spotData: SpotData,
    position: number
  ) => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    const adjustedStartTime = maxDate([bookingStart, dayStart]);
    const adjustedEndTime = minDate([bookingEnd, dayEnd]);

    const startMinutes =
      (getHours(adjustedStartTime) * 60 + getMinutes(adjustedStartTime)) %
      (24 * 60);
    const duration = differenceInMinutes(adjustedEndTime, adjustedStartTime);

    const eventGap = 4; // Gap between overlapping bookings
    const slotWidth = eventWidth;

    const bookingLeft =
      spotData.left +
      position * (slotWidth + eventGap);

    return {
      top: `${(startMinutes / (24 * 60)) * 100}%`,
      height: `${(duration / (24 * 60)) * 100}%`,
      left: `${bookingLeft}px`,
      width: `${slotWidth}px`,
      position: "absolute" as "absolute",
    };
  };

  // ---- SHEET DATA BUILDER ----
  function getBookingForSheet(bk: Booking) {
    return {
      id: bk.id,
      status: "Confirmed" as BookingStatus,
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
    };
  }
  const handleOpenSheet = (bk: Booking, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedBooking(bk);
    setOpen(true);
  };
  // ----------------------------

  return (
    <TooltipProvider>
      <div className="relative h-[95vh] overflow-y-auto">
        {/* Left Panel with Hour Labels */}
        <div className="absolute left-0 w-16 top-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="h-[60px] text-right pr-2 text-sm text-neutral-500"
            >
              {i === 0
                ? "12 am"
                : `${i > 12 ? i - 12 : i} ${i >= 12 ? "pm" : "am"}`}
            </div>
          ))}
        </div>

        {/* Main Day View Area */}
        <div
          className="absolute left-16 right-0 top-8 border-t border-neutral-200 dark:border-neutral-800 cursor-pointer overflow-x-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          // We keep onClick for selecting the day, if needed
          onClick={() => onDaySelected(currentDate)}
        >
          <div
            ref={dayViewRef}
            className="relative h-full overflow-y-auto min-w-full"
            style={{ minWidth: "100%", width: `${containerWidth}px` }}
          >
            {/* Time Slots */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="h-[60px] border-b border-neutral-200 dark:border-neutral-800"
                style={{ width: "100%" }}
              />
            ))}

            {/* Bookings */}
            {spotsData.flatMap((spotData) =>
              spotData.bookings.map((booking) => {
                const bookingStartTime = new Date(booking.startDate);
                const bookingEndTime = new Date(booking.endDate);
                const style = getBookingStyle(booking, spotData, booking.position);

                const isContinuingBooking = isBefore(
                  bookingStartTime,
                  startOfDay(currentDate)
                );

                const bookingBgColor = isContinuingBooking
                  ? "bg-neutral-200 dark:bg-neutral-800 mr-2"
                  : "bg-violet-500";

                const textColor = isContinuingBooking
                  ? "text-black dark:text-neutral-300"
                  : "text-white";

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
                        {/* We keep this Link but override click with a sheet open */}
                        <div
                          className={`${bookingBgColor} ${textColor} rounded px-2 py-1 text-xs cursor-pointer border gap-2 relative`}
                          style={style}
                          onClick={(e) => handleOpenSheet(booking, e)}
                        >
                          <div className="font-bold flex items-center gap-1">
                            {booking.customer.name}
                            {booking.isNewBooking && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className={`${textColor} w-2 h-2 rounded-full`}></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>New</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="font-bold">{booking.spot.name}</div>
                          <div className="text-xs">
                            {format(bookingStartTime, "hh:mm a")} -{" "}
                            {format(bookingEndTime, "hh:mm a")}
                          </div>
                        </div>
                      </div>
                    </SheetTrigger>

                    <SheetContent className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]">
                      {selectedBooking && selectedBooking.id === booking.id && (
                        <BookingDetail booking={getBookingForSheet(booking)} />
                      )}
                    </SheetContent>
                  </Sheet>
                );
              })
            )}

            {/* Hovered Booking Preview */}
            {hoveredBooking && (
              <div
                className="w-64 p-4 bg-black text-white rounded-lg shadow-lg"
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
                  )} - ${format(new Date(hoveredBooking.endDate), "hh:mm a")}`}
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

        {/* Hover Time Indicator */}
        {hoverTime && hoverYPosition !== null && (
          <div
            className="absolute left-0 right-0 pointer-events-none z-50"
            style={{
              top: `${hoverYPosition}px`,
            }}
          >
            <div className="absolute left-0 -top-2 rounded border text-white bg-black px-1.5 text-xs font-medium">
              {format(hoverTime, "hh:mm a")}
            </div>
            <div className="border-t border-current bg-current h-0.5 w-full"></div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
