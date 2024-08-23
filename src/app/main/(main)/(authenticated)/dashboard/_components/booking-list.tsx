import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

interface Transaction {
  customer: string;
  email: string;
  startDate: string;
  endDate: string;
  status: string;
  outstanding: string;
  amount: string;
}

const transactions: Transaction[] = [
  { customer: "Liam Johnson", email: "liam@example.com", outstanding: "$1.000", status: "Approved", startDate: "2023-06-23", endDate: "2023-06-23", amount: "$250.00" },
  { customer: "Olivia Smith", email: "olivia@example.com", outstanding: "$200", status: "Declined", startDate: "2023-06-24", endDate: "2023-06-23", amount: "$150.00" },
  { customer: "Noah Williams", email: "noah@example.com", outstanding: "$0", status: "Approved", startDate: "2023-06-25", endDate: "2023-06-23", amount: "$350.00" },
  { customer: "Emma Brown", email: "emma@example.com", outstanding: "$0", status: "Approved", startDate: "2023-06-26", endDate: "2023-06-23", amount: "$450.00" },
  { customer: "Liam Johnson", email: "liam@example.com", outstanding: "$364", status: "Approved", startDate: "2023-06-27", endDate: "2023-06-23", amount: "$550.00" },
];

export function BookingList() {
  return (
    <Card className="xl:col-span-2 min-w-[420px]" x-chunk="dashboard-01-chunk-4">
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
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{transaction.customer}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">{transaction.email}</div>
                </TableCell>
                <TableCell className="">{transaction.startDate}</TableCell>
                <TableCell className="">{transaction.endDate}</TableCell>
                <TableCell className="">{transaction.outstanding}</TableCell>
                <TableCell className="text-right">{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
