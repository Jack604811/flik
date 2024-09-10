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

type Params = { startDate: Date; endDate: Date; userId: string };

export function BookingList({ startDate, endDate, userId }: Params) {
  const { data, isLoading } = useQuery({
    queryKey: ["bookings", startDate, endDate],
    queryFn: () => getBookingsByDates(userId, startDate, endDate),
    initialData: [],
  });

  return (
    <Card
      className="xl:col-span-2 min-w-[420px]"
      x-chunk="dashboard-01-chunk-4"
    >
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Bookings</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/bookings" prefetch={false}>
            View All
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="">Start Date</TableHead>
              <TableHead className="">End Date</TableHead>
              <TableHead className="">Outstanding</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? data.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{booking.guest?.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {booking.guest?.email}
                  </div>
                </TableCell>
                <TableCell className="">
                  {moment(booking.startDate).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell className="">
                  {moment(booking.endDate).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell className="">${(booking.subtotal +
                    booking.bookingExtras.reduce(
                      (acc, ex) => acc + ex.price * ex.quantity,
                      0
                    )) - (booking.transactions.reduce((acc, tr) => acc + tr.amount ,0))}</TableCell>
                <TableCell className="text-right">
                  ${booking.subtotal +
                    booking.bookingExtras.reduce(
                      (acc, ex) => acc + ex.price * ex.quantity,
                      0
                    )}
                </TableCell>
              </TableRow>
            )): (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground text-xs">No Record found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
