"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBookingsByDates } from "@/server/actions/dashboard.action";
import moment from "moment";
import { useDateRange } from "./date-range-context"; 


const formatNumber = (number: number) => {
  return new Intl.NumberFormat("de-DE").format(number);
};

type Params = { workspaceId?: string };

export function BookingList({ workspaceId }: Params) {
  const { startDate, endDate } = useDateRange();

  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings", workspaceId, startDate, endDate],
    queryFn: async () => getBookingsByDates(workspaceId ?? null, startDate, endDate),
    initialData: [],
  });

  return (
    <Card className="xl:col-span-2 min-w-[260px] x-chunk='dashboard-01-chunk-4'">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="grid gap-2">
          <CardTitle className="">Bookings</CardTitle>
          <CardDescription>
            {moment(startDate).format("DD MMMM")} - {moment(endDate).format("DD MMMM")}
          </CardDescription>
        </div>
        <Button size="sm" className="hidden w-full sm:w-auto ml-auto sm:ml-0 gap-1">
          <Link href="/bookings" prefetch={false} className="flex justify-center">
            View All
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((booking, index) => (
                <TableRow key={index} className="whitespace-nowrap">
                  <TableCell>
                    <div className="font-medium">{booking.customer?.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {booking.customer?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {moment(booking.startDate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {moment(booking.endDate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    $
                    {formatNumber(
                      booking.subtotal +
                      booking.bookingExtras.reduce(
                        (acc, ex) => acc + ex.price * ex.quantity,
                        0
                      ) -
                      booking.transactions.reduce(
                        (acc, tr) => acc + tr.amount,
                        0
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    $
                    {formatNumber(
                      booking.subtotal +
                      booking.bookingExtras.reduce(
                        (acc, ex) => acc + ex.price * ex.quantity,
                        0
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground text-xs"
                >
                  No Record found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
