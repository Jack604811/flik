import React from "react";
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
import { PreviewContent } from "./preview-content";
import { CreateBooking } from "@/components/forms/create-booking";

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
};

export function WeekView({
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
  const [hoveredEvent, setHoveredEvent] = React.useState<Event | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const daysToRender = React.useMemo(() => {
    const startOfCurrentWeek = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  }, [currentDate]);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  const weekEvents = events.filter((event) => {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
    return eventEndDate >= weekStart && eventStartDate <= weekEnd;
  });

  const processedEvents = processEvents(weekEvents);

  function processEvents(events: Event[]) {
    const processedEvents: (Event & { position: number })[] = [];
    const positionsByDay: { [day: string]: number } = {};

    events.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    events.forEach((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      const eventStart = max([eventStartDate, weekStart]);
      const eventEnd = min([eventEndDate, weekEnd]);

      const startDayIndex = differenceInCalendarDays(eventStart, weekStart);
      const endDayIndex = differenceInCalendarDays(eventEnd, weekStart);

      let maxPositionForEvent = 0;
      for (let day = startDayIndex; day <= endDayIndex; day++) {
        const dayKey = day.toString();
        const position = positionsByDay[dayKey] || 0;
        maxPositionForEvent = Math.max(maxPositionForEvent, position);
      }
      const eventPosition = maxPositionForEvent;

      for (let day = startDayIndex; day <= endDayIndex; day++) {
        const dayKey = day.toString();
        positionsByDay[dayKey] = eventPosition + 1;
      }

      processedEvents.push({ ...event, position: eventPosition });
    });

    return processedEvents;
  }

  const maxPosition = Math.max(
    ...processedEvents.map((event) => event.position),
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
          {processedEvents.map((event) => {
            const eventStartDate = new Date(event.startDate);
            const eventEndDate = new Date(event.endDate);
            const eventStart = max([eventStartDate, weekStart]);
            const eventEnd = min([eventEndDate, weekEnd]);

            const totalDays = 7;
            let eventLeft =
              (differenceInCalendarDays(eventStart, weekStart) / totalDays) *
              100;
            let eventDurationDays =
              differenceInCalendarDays(eventEnd, eventStart) + 1;
            let eventWidth = (eventDurationDays / totalDays) * 100;

            const eventTop = event.position * 28;

            const spansMultipleDays = !isSameDay(eventStartDate, eventEndDate);

            if (spansMultipleDays) {
              const minutesInDay = 24 * 60;

              let startOffsetPercent = 0;
              if (isSameDay(eventStart, eventStartDate)) {
                const minutesSinceStartOfDay =
                  eventStartDate.getHours() * 60 +
                  eventStartDate.getMinutes();
                startOffsetPercent =
                  (minutesSinceStartOfDay / minutesInDay) * 100;
              }

              let endOffsetPercent = 0;
              if (isSameDay(eventEnd, eventEndDate)) {
                const minutesUntilEndOfDay =
                  eventEndDate.getHours() * 60 + eventEndDate.getMinutes();
                const endOffset = minutesUntilEndOfDay / minutesInDay;
                endOffsetPercent = (1 - endOffset) * 100;
              }

              eventLeft += (startOffsetPercent / 100) * (100 / totalDays);
              eventWidth -=
                (startOffsetPercent / 100) * (100 / totalDays) +
                (endOffsetPercent / 100) * (100 / totalDays);
            }

            const isContinuingEvent = isBefore(eventStartDate, weekStart);
            const eventBgColor = isContinuingEvent
              ? "bg-gray-500"
              : "bg-violet-500";

            return (
              <div
                key={event.id}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onMouseMove={(e) =>
                  setMousePosition({ x: e.clientX, y: e.clientY })
                }
              >
                <Link href={`/calendar/${event.id}`}>
                  <div
                    className={`${eventBgColor} absolute text-white text-sm rounded px-1 py-0.5 cursor-pointer overflow-hidden border border-background`}
                    style={{
                      top: `${eventTop}px`,
                      left: `${eventLeft}%`,
                      width: `${eventWidth}%`,
                      height: `24px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between">
                      <span>{event.spot.name}</span>
                      {event.isNewEvent && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="text-xs">{event.customer.name}</div>
                  </div>
                </Link>
              </div>
            );
          })}
          {hoveredEvent && (
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
    </div>
  );
}
