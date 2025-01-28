import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsByBooking } from "@/server/actions/booking.action";
import { Clock, MapPin, ArrowRight, Calendar, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Transaction, TransactionStatus } from "@prisma/client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import BookingDetail from "@/components/calendar/booking-details";
import { BookingStatus } from "@prisma/client";

type PreviewContentProps = {
  Id: string;
  customerName: string;
  customerPhone: string;
  eventDateRange: string;
  eventTimeRange: string;
  spot: string;
  totalPrice: number;
  startDate: string;
  endDate: string;
  isNewEvent?: boolean;
};

export function PreviewContent({
  Id,
  customerName,
  customerPhone,
  eventDateRange,
  eventTimeRange,
  spot,
  totalPrice,
  startDate,
  endDate,
  isNewEvent,
}: PreviewContentProps) {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["transactionsByBooking", Id],
    queryFn: () => getTransactionsByBooking(Id),
    initialData: [],
  });

  const totalPayments = transactions
    .filter((transaction) => transaction.status === TransactionStatus.Approved)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const amountDue = totalPrice - totalPayments;

  const isSameDay =
    new Date(startDate).toDateString() === new Date(endDate).toDateString();
  const displayDateRange = isSameDay
    ? new Date(startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : eventDateRange;

  const [open, setOpen] = useState(false);

  // Adjust to fill in whatever defaults are needed for your booking shape:
  const bookingForSheet = {
    id: Id,
    status: "Confirmed" as BookingStatus, 
    createdAt: new Date(),
    updatedAt: new Date(),
    spot: {
      id: "",
      name: spot,
      units: 0,
      duration: 0,
      durationType: "",
      workingHours: [],
    },
    spotId: "",
    customer: {
      id: "TEMP_ID",
      name: customerName,
      email: "",
      phone: customerPhone,
    },
    subtotal: 0,
    totalPrice,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    note: "",
    customFields: [],
  };

  return (
    <TooltipProvider>
      <div className="grid gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium leading-none text-xl">{customerName}</h4>
            {isNewEvent && (
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
          <Link
            href={`https://wa.me/${customerPhone}`}
            passHref
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-sm text-white/50 mt-1 dark:text-muted-foreground">
              {customerPhone}
            </p>
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
            <div className="text-sm">Amount Due: ${Intl.NumberFormat("de-DE").format(amountDue?? 0 )}</div>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full mt-2 text-black dark:text-white"
            >
              View More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]">
            <BookingDetail booking={bookingForSheet} />
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
