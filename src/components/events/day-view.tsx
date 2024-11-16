import * as React from "react";
import {
  isSameDay,
  getHours,
  getMinutes,
  format,
  setHours,
  setMinutes,
  differenceInMinutes,
  min,
} from "date-fns";
import { CreateEvent } from "@/components/forms/create-event";
import { PreviewContent } from "./preview-content";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

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
  amountDue: string; // Re-added amountDue for PreviewContent
};

// Define a ProcessedEvent type with position
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
  const [hoverYPosition, setHoverYPosition] = React.useState<number | null>(null);
  const dayViewRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dayViewRef.current) return;

    const rect = dayViewRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const dayViewHeight = rect.height;
    const totalMinutes = Math.min(24 * 60, Math.max(0, (y / dayViewHeight) * 24 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    const newDate = setMinutes(setHours(currentDate, hours), minutes);
    setHoverTime(newDate);

    // Calculate hoverYPosition relative to the root container
    const rootRect = dayViewRef.current.parentElement?.getBoundingClientRect();
    if (rootRect) {
      const hoverY = e.clientY - rootRect.top;
      setHoverYPosition(hoverY + 32); // Kept your adjustment
    }
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setHoverYPosition(null);
  };

  // Sort events by start time
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Get events for the current day
  const dayEvents = sortedEvents.filter((event) =>
    isSameDay(new Date(event.startDate), currentDate)
  );

  // Get unique spots
  const spots = Array.from(new Set(dayEvents.map((event) => event.spot.name)));

  // Process spots to calculate max overlaps and positions
  type SpotData = {
    spotName: string;
    events: ProcessedEvent[];
    maxOverlaps: number;
    width: number;
    left: number;
  };

  const eventWidth = 180; // Width of a single event
  const spotSpacing = 20; // Space between spots

  const spotsData: SpotData[] = [];
  let cumulativeLeft = 0;

  spots.forEach((spotName) => {
    const spotEvents = dayEvents.filter((event) => event.spot.name === spotName);
    const sortedSpotEvents = spotEvents.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const processedEvents = processEventsForSpot(sortedSpotEvents);

    // Calculate max overlaps for the spot
    const maxOverlaps = Math.max(...processedEvents.map((e) => e.position + 1), 1);

    const width = maxOverlaps * eventWidth;

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

  // Calculate container width based on cumulative left
  const containerWidth =
    cumulativeLeft - spotSpacing > 0 ? cumulativeLeft - spotSpacing : eventWidth;

  function processEventsForSpot(events: Event[]): ProcessedEvent[] {
    // Events should be sorted by start time
    const processedEvents: ProcessedEvent[] = [];
    const eventPositions: ProcessedEvent[] = [];

    for (const event of events) {
      const eventStart = new Date(event.startDate).getTime();
      const eventEnd = new Date(event.endDate).getTime();

      // Remove events that have ended
      eventPositions.filter((e) => new Date(e.endDate).getTime() > eventStart);

      let position = 0;
      while (eventPositions.some((e) => e.position === position && isOverlapping(e, event))) {
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
    startTime: Date,
    endTime: Date,
    spotData: SpotData,
    position: number
  ) => {
    const startMinutes = getHours(startTime) * 60 + getMinutes(startTime);
    const duration = differenceInMinutes(endTime, startTime);

    const slotWidth = eventWidth;

    const eventLeft = spotData.left + position * slotWidth;

    // Limit height to the end of the day (11:59 PM) if the event goes beyond the current day
    const maxEndTime = setHours(setMinutes(currentDate, 59), 23); // Set to 11:59 PM
    const adjustedEndTime = endTime > maxEndTime ? maxEndTime : endTime;
    const adjustedDuration = differenceInMinutes(adjustedEndTime, startTime);

    return {
      top: `${(startMinutes / (24 * 60)) * 100}%`,
      height: `${(adjustedDuration / (24 * 60)) * 100}%`,
      left: `${eventLeft}px`,
      width: `${slotWidth}px`,
      position: "absolute" as "absolute",
    };
  };

  return (
    <div className="relative h-[95vh] overflow-y-auto">
      {/* Left Panel with Hour Labels */}
      <div className="absolute left-0 w-16 top-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-[60px] text-right pr-2 text-sm text-neutral-500">
            {i === 0 ? "12 am" : `${i > 12 ? i - 12 : i} ${i >= 12 ? "pm" : "am"}`}
          </div>
        ))}
      </div>

      {/* Main Day View Area */}
      <div
        className="absolute left-16 right-0 top-8 border-t border-neutral-200 dark:border-neutral-800 cursor-pointer overflow-x-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
              const style = getEventStyle(
                eventStartTime,
                eventEndTime,
                spotData,
                event.position
              );

              return (
                <HoverCard key={event.id}>
                  <HoverCardTrigger asChild>
                    <div
                      className="bg-violet-500 rounded px-2 py-1 text-xs text-white cursor-pointer border"
                      style={style}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="font-bold">{event.customer.name}</div>
                      <div className="font-bold">{event.spot.name}</div>
                      <div className="text-xs">
                        {format(eventStartTime, "hh:mm a")} -{" "}
                        {format(eventEndTime, "hh:mm a")}
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    align="center"
                    className="w-64 p-4 bg-black text-white rounded-lg shadow-lg -ml-40"
                  >
                    <PreviewContent
                      Id={event.id}
                      customerName={event.customer.name}
                      customerPhone={event.customer.phone}
                      eventDateRange={
                        isSameDay(new Date(event.startDate), new Date(event.endDate))
                          ? format(new Date(event.startDate), "MMM d")
                          : `${format(new Date(event.startDate), "MMM d")} - ${format(
                              new Date(event.endDate),
                              "MMM d"
                            )}`
                      }
                      eventTimeRange={`${format(
                        new Date(event.startDate),
                        "hh:mm a"
                      )} - ${format(new Date(event.endDate), "hh:mm a")}`}
                      startDate={new Date(event.startDate).toISOString()}
                      endDate={new Date(event.endDate).toISOString()}
                      spot={event.spot.name}
                      amountDue={event.amountDue}
                    />
                  </HoverCardContent>
                </HoverCard>
              );
            })
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
  );
}
