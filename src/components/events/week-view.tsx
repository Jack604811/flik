import React from "react";
import { addDays, isSameDay, startOfWeek, format } from "date-fns";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { PreviewContent } from "./preview-content";
import { CreateEvent } from "@/components/forms/create-event";

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
  amountDue: string;
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
  const daysToRender = React.useMemo(() => {
    const startOfCurrentWeek = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  }, [currentDate]);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Week Days Header */}
        <div className="flex mb-0">
          {daysToRender.map((date, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-2 cursor-pointer ${
                isSameDay(date, currentDate) ? "bg-neutral-100 dark:bg-neutral-900" : "bg-transparent"
              } ${index < 6 ? "border-r border-neutral-200 dark:border-neutral-900" : ""}`}
              onClick={() => onDaySelected(date)}
            >
              <div className="text-xs">{format(date, "EEE")}</div>
              <div className="text-2xl font-bold">{format(date, "d")}</div>
            </div>
          ))}
        </div>

        {/* Events Section */}
        <div className="flex-1 overflow-auto cursor-pointer">
          <div className="grid grid-cols-7 gap-0 h-screen border-t border-neutral-200 dark:border-neutral-900">
            {daysToRender.map((date, index) => {
              const dayEvents = events.filter((event) => isSameDay(new Date(event.startDate), date));

              return (
                <div
                  key={index}
                  className={`flex flex-col h-full ${index < 6 ? "border-r border-neutral-200 dark:border-neutral-900" : ""}`}
                  onClick={() => onDaySelected(date)}
                >
                  <div className="flex-1 overflow-auto p-1 relative">
                    {dayEvents.map((event) => {
                      const eventStartDate = new Date(event.startDate).toISOString();
                      const eventEndDate = new Date(event.endDate).toISOString();

                      const eventDateRange =
                        new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString()
                          ? format(new Date(event.startDate), "MMM d")
                          : `${format(new Date(event.startDate), "MMM d")} - ${format(
                              new Date(event.endDate),
                              "MMM d"
                            )}`;

                      const eventTimeRange = `${format(new Date(event.startDate), "hh:mm a")} - ${format(
                        new Date(event.endDate),
                        "hh:mm a"
                      )}`;

                      return (
                        <Tooltip key={event.id}>
                          <TooltipTrigger asChild>
                            <Link href={`/calendar/${event.id}`}>
                              <div
                                className="h-6 items-center truncate bg-violet-500 text-white text-sm rounded px-1 py-0.5 mb-1 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {event.spot.name}
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            align="center"
                            className="w-64 p-4 bg-black text-white rounded-lg"
                          >
                            <PreviewContent
                              Id={event.id}
                              customerName={event.customer.name}
                              customerPhone={event.customer.phone}
                              eventDateRange={eventDateRange}
                              eventTimeRange={eventTimeRange}
                              startDate={eventStartDate}
                              endDate={eventEndDate}
                              spot={event.spot.name}
                              amountDue={event.amountDue}
                            />
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                    {dayEvents.length === 0 && (
                      <div
                        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900/90 flex items-center justify-center p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CreateEvent workspaceId={workspaceId} onEventCreated={onEventCreated} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
