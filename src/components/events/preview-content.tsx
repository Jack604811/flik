import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, ArrowRight, Calendar, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

type PreviewContentProps = {
  Id: string;
  customerName: string;
  customerPhone: string;
  eventDateRange: string;
  eventTimeRange: string;
  spot: string;
  amountDue: string;
  startDate: string;
  endDate: string;
};

export function PreviewContent({
  Id,
  customerName,
  customerPhone,
  eventDateRange,
  eventTimeRange,
  spot,
  amountDue,
  startDate,
  endDate,
}: PreviewContentProps) {
  // Compute date range
  const isSameDay = new Date(startDate).toDateString() === new Date(endDate).toDateString();
  const displayDateRange = isSameDay
    ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : eventDateRange;

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none text-xl">{customerName}</h4>
        <Link
          href={`https://wa.me/${customerPhone}`}
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-sm text-white/50 mt-1 dark:text-muted-foreground">{customerPhone}</p>
        </Link>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <Calendar className="h-4 w-4" />
          <div className="text-sm">{displayDateRange}</div>
        </div>
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <Clock className="h-4 w-4" />
          <div className="text-sm">{eventTimeRange}</div>
        </div>
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <MapPin className="h-4 w-4" />
          <div className="text-sm">{spot}</div>
        </div>
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <Receipt className="h-4 w-4" />
          <div className="text-sm">Amount Due: {amountDue}</div>
        </div>
      </div>
      <Link href={`/calendar/${Id}`}>
        <Button variant="outline" className="w-full mt-2 text-black dark:text-white">
          View More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
