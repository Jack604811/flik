"use client";

import { motion } from "framer-motion";
import { Booking } from "@/schemas/booking.schema";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { RowActions } from "@/components/calendar/row-actions";

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
  showActions?: boolean;
  isNew?: boolean;
}

export function BookingCard({ booking, onClick, showActions = false, isNew = false }: BookingCardProps) {
  const day = new Date(booking.startDate).getDate();
  const month = new Date(booking.startDate).toLocaleString("en-US", { month: "short" });

  const durationMs = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
  const durationInHours = Math.round(durationMs / (1000 * 60 * 60));
  const durationInDays = Math.floor(durationInHours / 24);
  const duration = durationInDays > 0
    ? `${durationInDays} ${durationInDays > 1 ? "days" : "day"}`
    : `${durationInHours} ${durationInHours > 1 ? "hours" : "hour"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full rounded-lg py-2 bg-muted/50 border cursor-pointer hover:transform"
      onClick={onClick}
    >
      <div className="flex w-full">
        <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg border-none p-0 text-primary">
          <span className="text-sm font-semibold tracking-wider">{month}</span>
          <span className="text-2xl font-bold">{day}</span>
        </div>
        <div className="flex flex-col justify-center flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{booking.customer.name}</h3>
            {isNew && (
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
          <p className="text-sm text-muted-foreground mb-0">{booking.spot.name}</p>
          <div className="flex items-center gap-1 text-sm">
            <span>Duration: {duration}</span>
          </div>
        </div>
      </div>
      {showActions && (
        <div className="mr-2">
          <RowActions booking={booking} refreshEvents={function (): Promise<void> {
                      throw new Error("Function not implemented.");
                  } } />
        </div>
      )}
    </motion.div>
  );
}
