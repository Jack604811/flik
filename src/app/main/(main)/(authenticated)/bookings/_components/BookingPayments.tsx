import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddTransactionButton from "@/components/forms/AddTransactionButton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsByBooking } from "@/server/actions/booking.action";
import { Transaction } from "@prisma/client";
import moment from "moment";
import { statuses } from "../../transactions/data/data";

function BookingPayments({ bookingId }: { bookingId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["bookingPayments", bookingId],
    queryFn: () => getTransactionsByBooking(bookingId),
    initialData: [] as Transaction[],
  });

  const totalOutstandingPayments = data
  .filter((item) => item.status === "Pending")
  .reduce((total, item) => total + item.amount, 0).toFixed(2);
  const totalPaidPayments = data
  .filter((item) => item.status === "Paid")
  .reduce((total, item) => total + item.amount, 0).toFixed(2);
  const totalPayment = data.reduce((total, item) => total + item.amount, 0).toFixed(2);
  return (
    <div className="grid gap-3">
      <div className="font-semibold">Payment Resume</div>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Payments</span>
          <span>${totalPaidPayments}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Outstanding</span>
          <span>${totalOutstandingPayments}</span>
        </li>
        <li className="flex items-center justify-between font-semibold">
          <span className="text-muted-foreground">Total</span>
          <span>${totalPayment}</span>
        </li>
      </ul>
      <Separator className="my-4" />
      <div className="font-semibold">Payment History</div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? "Loading..." :data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{moment(item.paymentDate).format("MMM DD, YYYY")}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.paymentType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{statuses.find(i => i.value === item.status)?.label}</Badge>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4}>
                <AddTransactionButton bookingId={bookingId}>
                  <Button className="gap-1 w-full" size="sm" variant="ghost">
                    Add Manual Transaction
                  </Button>
                </AddTransactionButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default BookingPayments;
