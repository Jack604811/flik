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

type Event = {
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
  isNewEvent?: boolean;
  createdAt: Date | string;
};

type ProcessedEvent = Event & {
  position: number;
};

export function DayView({
  currentDate,
  workspaceId,
  onEventCreated,
  events = [],
  onDaySelected,
}: {
  currentDate: Date;
  workspaceId: string;
  onEventCreated: () => void;
  events: Event[];
  onDaySelected: (date: Date) => void;
}) {
  const [hoverTime, setHoverTime] = React.useState<Date | null>(null);
  const [hoverYPosition, setHoverYPosition] = React.useState<number | null>(
    null
  );
  const [hoveredEvent, setHoveredEvent] = React.useState<Event | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [open, setOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

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

  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const dayEvents = sortedEvents.filter((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    return eventStart < dayEnd && eventEnd > dayStart;
  });

  const spots = Array.from(new Set(dayEvents.map((event) => event.spot.name)));

  type SpotData = {
    spotName: string;
    events: ProcessedEvent[];
    maxOverlaps: number;
    width: number;
    left: number;
  };

  const eventWidth = 180;
  const spotSpacing = 20;

  const spotsData: SpotData[] = [];
  let cumulativeLeft = 0;

  spots.forEach((spotName) => {
    const spotEvents = dayEvents.filter((event) => event.spot.name === spotName);
    const sortedSpotEvents = spotEvents.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const processedEvents = processEventsForSpot(sortedSpotEvents);

    const maxOverlaps = Math.max(
      ...processedEvents.map((e) => e.position + 1),
      1
    );

    // Adjust the width to include gaps between overlapping events
    const eventGap = 4; // Gap between overlapping events
    const width = maxOverlaps * eventWidth + (maxOverlaps - 1) * eventGap;

    const spotData: SpotData = {
      spotName,
      events: processedEvents,
      maxOverlaps,
      width,
      left: cumulativeLeft,
    };

    spotsData.push(spotData);

    cumulativeLeft += width + spotSpacing;
  });

  const containerWidth =
    cumulativeLeft - spotSpacing > 0 ? cumulativeLeft - spotSpacing : eventWidth;

  function processEventsForSpot(events: Event[]): ProcessedEvent[] {
    const processedEvents: ProcessedEvent[] = [];
    const eventPositions: ProcessedEvent[] = [];

    for (const event of events) {
      const eventStart = new Date(event.startDate).getTime();
      const eventEnd = new Date(event.endDate).getTime();

      eventPositions.filter((e) => new Date(e.endDate).getTime() > eventStart);

      let position = 0;
      while (
        eventPositions.some(
          (e) => e.position === position && isOverlapping(e, event)
        )
      ) {
        position++;
      }

      const processedEvent: ProcessedEvent = { ...event, position };
      processedEvents.push(processedEvent);
      eventPositions.push(processedEvent);
    }

    return processedEvents;
  }

  function isOverlapping(eventA: Event, eventB: Event): boolean {
    const startA = new Date(eventA.startDate).getTime();
    const endA = new Date(eventA.endDate).getTime();
    const startB = new Date(eventB.startDate).getTime();
    const endB = new Date(eventB.endDate).getTime();

    return startA < endB && startB < endA;
  }

  const getEventStyle = (
    event: Event,
    spotData: SpotData,
    position: number
  ) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    const adjustedStartTime = maxDate([eventStart, dayStart]);
    const adjustedEndTime = minDate([eventEnd, dayEnd]);

    const startMinutes =
      (getHours(adjustedStartTime) * 60 + getMinutes(adjustedStartTime)) %
      (24 * 60);
    const duration = differenceInMinutes(adjustedEndTime, adjustedStartTime);

    const eventGap = 4; // Gap between overlapping events
    const slotWidth = eventWidth;

    const eventLeft =
      spotData.left +
      position * (slotWidth + eventGap);

    return {
      top: `${(startMinutes / (24 * 60)) * 100}%`,
      height: `${(duration / (24 * 60)) * 100}%`,
      left: `${eventLeft}px`,
      width: `${slotWidth}px`,
      position: "absolute" as "absolute",
    };
  };

  // ---- SHEET DATA BUILDER ----
  function getBookingForSheet(evt: Event) {
    return {
      id: evt.id,
      status: "Confirmed" as BookingStatus,
      createdAt: new Date(evt.createdAt),
      updatedAt: new Date(),
      spot: {
        id: "",
        name: evt.spot.name,
        units: 0,
        duration: 0,
        durationType: "",
        workingHours: [],
      },
      spotId: "",
      customer: {
        id: "TEMP_ID",
        name: evt.customer.name,
        email: "",
        phone: evt.customer.phone,
      },
      subtotal: 0,
      totalPrice: evt.totalPrice,
      startDate: new Date(evt.startDate),
      endDate: new Date(evt.endDate),
      note: "",
      customFields: [],
    };
  }
  const handleOpenSheet = (evt: Event, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedEvent(evt);
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

            {/* Events */}
            {spotsData.flatMap((spotData) =>
              spotData.events.map((event) => {
                const eventStartTime = new Date(event.startDate);
                const eventEndTime = new Date(event.endDate);
                const style = getEventStyle(event, spotData, event.position);

                const isContinuingEvent = isBefore(
                  eventStartTime,
                  startOfDay(currentDate)
                );

                const eventBgColor = isContinuingEvent
                  ? "bg-neutral-200 dark:bg-neutral-800 mr-2"
                  : "bg-violet-500";

                const textColor = isContinuingEvent
                  ? "text-black dark:text-neutral-300"
                  : "text-white";

                return (
                  <Sheet
                    key={event.id}
                    open={open && selectedEvent?.id === event.id}
                    onOpenChange={setOpen}
                  >
                    <SheetTrigger asChild>
                      <div
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        onMouseMove={(e) =>
                          setMousePosition({ x: e.clientX, y: e.clientY })
                        }
                      >
                        {/* We keep this Link but override click with a sheet open */}
                 
                          <div
                            className={`${eventBgColor} ${textColor} rounded px-2 py-1 text-xs cursor-pointer border gap-2 relative`}
                            style={style}
                            onClick={(e) => handleOpenSheet(event, e)}
                          >
                            <div className="font-bold flex items-center gap-1">
                              {event.customer.name}
                              {event.isNewEvent && (
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
                            <div className="font-bold">{event.spot.name}</div>
                            <div className="text-xs">
                              {format(eventStartTime, "hh:mm a")} -{" "}
                              {format(eventEndTime, "hh:mm a")}
                            </div>
                          </div>
                   
                      </div>
                    </SheetTrigger>

                    <SheetContent className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]">
                      {selectedEvent && selectedEvent.id === event.id && (
                        <BookingDetail booking={getBookingForSheet(event)} />
                      )}
                    </SheetContent>
                  </Sheet>
                );
              })
            )}

            {/* Hovered Event Preview */}
            {hoveredEvent && (
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
                  Id={hoveredEvent.id}
                  customerName={hoveredEvent.customer.name}
                  customerPhone={hoveredEvent.customer.phone}
                  eventDateRange={
                    isSameDay(
                      new Date(hoveredEvent.startDate),
                      new Date(hoveredEvent.endDate)
                    )
                      ? format(new Date(hoveredEvent.startDate), "MMM d")
                      : `${format(
                          new Date(hoveredEvent.startDate),
                          "MMM d"
                        )} - ${format(
                          new Date(hoveredEvent.endDate),
                          "MMM d"
                        )}`
                  }
                  eventTimeRange={`${format(
                    new Date(hoveredEvent.startDate),
                    "hh:mm a"
                  )} - ${format(new Date(hoveredEvent.endDate), "hh:mm a")}`}
                  startDate={new Date(hoveredEvent.startDate).toISOString()}
                  endDate={new Date(hoveredEvent.endDate).toISOString()}
                  spot={hoveredEvent.spot.name}
                  totalPrice={hoveredEvent.totalPrice}
                  isNewEvent={hoveredEvent.isNewEvent}
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
