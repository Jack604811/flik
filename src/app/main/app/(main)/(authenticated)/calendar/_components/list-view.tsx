// list-view.tsx

'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { DateFilter } from '@/components/calendar/date-filter';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { PreviewContent } from '@/components/calendar/preview-content';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import Link from 'next/link';

interface Event {
  id: string;
  status: 'In_progress' | 'Confirmed' | 'Cancelled' | 'Waiting_for_payment';
  spot: {
    name: string;
    units: number;
    workingHours: any[];
    duration: number;
    durationType: string;
    id: string;
  };
  customer: {
    name: string;
    phone: string;
  };
  startDate: Date | string;
  endDate: Date | string;
  createdAt: Date | string;
  amountDue: string;
  isNewEvent?: boolean;
  // Include other properties as needed
}

interface ListViewProps {
  events: Event[];
  loading?: boolean;
}

export default function ListView({ events, loading = false }: ListViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateRange, setDateRange] = React.useState<[Date, Date] | null>(null);

  const Row = {
    getFilterValue: () => dateRange,
    setFilterValue: (value: [Date, Date] | null) => setDateRange(value),
  } as any;

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.spot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange =
      dateRange === null ||
      (new Date(event.startDate) >= dateRange[0] &&
        new Date(event.startDate) <= dateRange[1]);

    return matchesSearch && matchesDateRange;
  });

  const eventsCount =
    dateRange || searchTerm ? `Result ${filteredEvents.length}` : `Last events`;

  // Helper functions for formatting
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="py-4 space-y-4">
        <DateFilter column={Row} title="Filter by Date" className="mb-4" />
        <p className="text-lg font-semibold">{eventsCount}</p>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <div className="h-[80vh] pb-8 overflow-y-auto">
          <TooltipProvider>
            <div className="flex flex-col gap-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex w-full rounded-lg border bg-card py-2 animate-pulse"
                  >
                    {/* ... loading skeleton */}
                  </div>
                ))
              ) : filteredEvents.length > 0 ? (
                <>
                  {filteredEvents.map((event) => {
                    const day = new Date(event.startDate).getDate();
                    const month = new Date(event.startDate).toLocaleString(
                      'en-US',
                      {
                        month: 'short',
                      }
                    );
                    const durationMs =
                      new Date(event.endDate).getTime() -
                      new Date(event.startDate).getTime();
                    const durationInHours = Math.round(
                      durationMs / (1000 * 60 * 60)
                    );
                    const durationInDays = Math.floor(durationInHours / 24);
                    const duration =
                      durationInDays > 0
                        ? `${durationInDays} ${
                            durationInDays > 1 ? 'days' : 'day'
                          }`
                        : `${durationInHours} ${
                            durationInHours > 1 ? 'hours' : 'hour'
                          }`;

                    return (
                      <HoverCard key={event.id}>
                        <HoverCardTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex w-full rounded-lg border py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                          >
                            <Link href={`/calendar/${event.id}`} className="flex w-full">
                              <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg border-none p-0 text-primary ">
                                <span className="text-2xl font-bold">{day}</span>
                                <span className="text-sm font-semibold tracking-wider">
                                  {month}
                                </span>
                              </div>
                              <div className="flex flex-col justify-center flex-grow">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">
                                    {event.customer.name}
                                  </h3>
                                  {event.isNewEvent && (
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
                                  {event.spot.name}
                                </p>
                                <div className="flex items-center gap-1 text-sm">
                                  <span>Duration: {duration}</span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        </HoverCardTrigger>
                        <HoverCardContent align="center" side="right" className="w-64 p-4 bg-black text-white rounded-lg">
                          <PreviewContent
                            Id={event.id}
                            customerName={event.customer.name}
                            customerPhone={event.customer.phone}
                            eventDateRange={`${formatDate(event.startDate)} - ${formatDate(
                              event.endDate
                            )}`}
                            eventTimeRange={`${formatTime(event.startDate)} - ${formatTime(
                              event.endDate
                            )}`}
                            spot={event.spot.name}
                            amountDue={event.amountDue}
                            startDate={event.startDate.toString()}
                            endDate={event.endDate.toString()}
                            isNewEvent={event.isNewEvent}
                          />
                        </HoverCardContent>
                      </HoverCard>
                    );
                  })}
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No events found.</p>
                </div>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
