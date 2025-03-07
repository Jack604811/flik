import React from "react";
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
import { Transaction, TransactionStatus } from "@prisma/client";
import moment from "moment";
import { statuses } from "../transaction/schema";
import { CirclePlus, Edit } from "lucide-react";
import _ from "lodash"

function BookingPayments({ bookingId, bookingPrice=0 }: { bookingId: string, bookingPrice: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["bookingPayments", bookingId],
    queryFn: () => getTransactionsByBooking(bookingId),
    initialData: [] as Transaction[],
  });


  const totalPayment = data.filter(item => item.status === TransactionStatus.Approved).reduce((total, item) => total + item.amount, 0);
  const totalOutstandingPayments = data.length === 0 ? bookingPrice : bookingPrice - totalPayment;

  return (
    <div className="grid gap-3">
      <div className="font-semibold">Payment Resume</div>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Payments</span>
          <span>${new Intl.NumberFormat('de-DE').format(totalPayment).replace(',', '.')}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Amount Due</span>
          <span>${new Intl.NumberFormat('de-DE').format(totalOutstandingPayments).replace(',', '.')}</span>
        </li>
        <li className="flex items-center justify-between font-semibold">
          <span className="text-muted-foreground">Total</span>
          <span>${new Intl.NumberFormat('de-DE').format(bookingPrice).replace(',', '.')}</span>
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
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? "Loading..." :data.map((item) => (
              <TableRow key={item.id}  className="h-16">
                <TableCell>{moment(item.paymentDate).format("DD MMM YYYY")}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${new Intl.NumberFormat('de-DE').format(item.amount).replace(',', '.')}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.paymentMethod}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{statuses.find(i => i.value === item.status)?.label}</Badge>
                </TableCell>
                <TableCell>
                  <AddTransactionButton bookingId={bookingId} defaultTransaction={{...item, amount: String(item.amount), date: item.paymentDate}}>
                    <Edit size={14} className="p-0 m-0 cursor-pointer" />
                  </AddTransactionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddTransactionButton bookingId={bookingId}>
        <Button className="gap-2 w-full h-12" size="sm" variant="ghost">
          <CirclePlus className="h-4 w-4"/> Add a Transaction
        </Button>
      </AddTransactionButton>
      </div>
    </div>
  );
}

export default BookingPayments;