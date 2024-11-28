import React from 'react';
import {
  format,
  addDays,
  startOfMonth,
  getDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { CreateEvent } from '@/components/forms/create-event';
import { PreviewContent } from './preview-content';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

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

export default function MonthView({
  currentDate,
  workspaceId,
  onEventCreated,
  onDaySelected,
  events = [],
}: {
  currentDate: Date;
  workspaceId: string;
  onEventCreated: () => void;
  onDaySelected: (date: Date) => void;
  events: Event[];
}) {
  const startDate = startOfMonth(currentDate);
  const firstDayOfWeek = getDay(startDate);
  const daysToRender = Array.from({ length: 35 }, (_, i) =>
    addDays(startDate, i - firstDayOfWeek)
  );

  return (
    <TooltipProvider>
      <div className="flex justify-center w-full">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysToRender.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const isCurrentMonth = isSameMonth(date, currentDate);

              const eventsForDate = events.filter((event) =>
                isSameDay(new Date(event.startDate), date)
              );

              const displayEvents = eventsForDate.slice(0);
              const remainingEventsCount = eventsForDate.length - 5;

              return (
                <div
                  key={index}
                  className={`relative flex flex-col aspect-square border border-neutral-200 dark:border-neutral-800 p-1 group cursor-pointer ${
                    isToday ? 'bg-neutral-100 dark:bg-neutral-900' : ''
                  } ${!isCurrentMonth ? 'bg-neutral-100 dark:bg-neutral-900' : ''}`}
                  onClick={() => {
                    if (eventsForDate.length > 0) onDaySelected(date);
                  }}
                >
                  <time
                    dateTime={format(date, 'yyyy-MM-dd')}
                    className="text-xs font-semibold"
                  >
                    {format(date, 'd')}
                  </time>

                  <div className="flex flex-col justify-between h-full">
                    <div className="mt-1 space-y-1 text-xs overflow-y-auto flex-grow">
                      {displayEvents.map((event) => {
                        const eventStartDate = new Date(event.startDate).toISOString();
                        const eventEndDate = new Date(event.endDate).toISOString();

                        const eventDateRange =
                          new Date(event.startDate).toDateString() ===
                          new Date(event.endDate).toDateString()
                            ? format(new Date(event.startDate), 'MMM d')
                            : `${format(
                                new Date(event.startDate),
                                'MMM d'
                              )} - ${format(new Date(event.endDate), 'MMM d')}`;

                        const eventTimeRange = `${format(
                          new Date(event.startDate),
                          'hh:mm a'
                        )} - ${format(new Date(event.endDate), 'hh:mm a')}`;

                        return (
                          <Tooltip key={event.id}>
                            <TooltipTrigger asChild>
                              <div>
                                <div
                                  className="truncate bg-violet-500 text-white rounded px-1 py-0.5 mb-1 cursor-pointer flex items-center justify-between gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {event.spot.name}
                                  {event.isNewEvent && (
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
                              </div>
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
                                totalPrice={event.totalPrice} 
                                isNewEvent={event.isNewEvent}                              />
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>

                    {remainingEventsCount > 0 && (
                      <div className="flex justify-center mt-1">
                        <button className="text-xs text-gray-400">
                          +{remainingEventsCount} more
                        </button>
                      </div>
                    )}
                  </div>

                  {eventsForDate.length === 0 && (
                    <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900/90 flex items-center justify-center p-2">
                      {/* <CreateEvent
                        workspaceId={workspaceId}
                        onEventCreated={onEventCreated} 
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
