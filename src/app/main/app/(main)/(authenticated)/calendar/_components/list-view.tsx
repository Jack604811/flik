'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { DateFilter } from '@/components/events/date-filter';
import { Booking } from '@/schemas/booking.schema';
import { Column } from '@tanstack/react-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface ListViewProps {
  bookings: Booking[];
  loading?: boolean;
}

export default function ListView({ bookings, loading = false }: ListViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateRange, setDateRange] = React.useState<[Date, Date] | null>(null);

  const Row = {
    getFilterValue: () => dateRange,
    setFilterValue: (value: [Date, Date] | null) => setDateRange(value),
  } as Column<Booking, [Date, Date] | null>;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const todayBookingsCount = bookings.filter(
    (booking) => booking.createdAt >= todayStart && booking.createdAt < todayEnd
  ).length;

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.spot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange =
      dateRange === null ||
      (booking.startDate >= dateRange[0] && booking.endDate <= dateRange[1]);

    return matchesSearch && matchesDateRange;
  });

  const eventsCount =
    dateRange || searchTerm ? `Result ${filteredBookings.length}` : `Last events +${todayBookingsCount}`;

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

        <ScrollArea className="h-[100vh] pb-8">
          <TooltipProvider>
            <div className="flex flex-col gap-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex w-full rounded-lg border bg-card py-2 animate-pulse">
                    <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg bg-gray-300 p-2" />
                    <div className="flex flex-col justify-center flex-grow space-y-2">
                      <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                      <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
                      <div className="w-1/4 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const day = booking.startDate.getDate();
                  const month = booking.startDate.toLocaleString('en-US', { month: 'short' });
                  const durationMs = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
                  const durationInHours = Math.round(durationMs / (1000 * 60 * 60));
                  const durationInDays = Math.floor(durationInHours / 24);
                  const duration =
                    durationInDays > 0
                      ? `${durationInDays} ${durationInDays > 1 ? 'days' : 'day'}`
                      : `${durationInHours} ${durationInHours > 1 ? 'hours' : 'hour'}`;
                  const isNewBooking = booking.createdAt >= todayStart && booking.createdAt < todayEnd;

                  return (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex w-full rounded-lg border py-2 hover:bg-neutral-100"
                    >
                      <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg border-none p-0 text-primary ">
                        <span className="text-2xl font-bold">{day}</span>
                        <span className="text-sm font-semibold tracking-wider">{month}</span>
                      </div>
                      <div className="flex flex-col justify-center flex-grow">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{booking.customer.name}</h3>
                          {isNewBooking && (
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>New</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-0">{booking.spot.name}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <span>Duration: {duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No events found.</p>
                </div>
              )}
            </div>
          </TooltipProvider>
        </ScrollArea>
      </div>
    </div>
  );
}
