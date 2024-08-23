"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, CartesianGrid, XAxis, Area, ReferenceLine, Label } from "recharts";

export default function Income() {
  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartData = [
    { month: "January", income: 186, transactions: 80 },
    { month: "February", income: 305, transactions: 200 },
    { month: "March", income: 237, transactions: 120 },
    { month: "April", income: 73, transactions: 190 },
    { month: "May", income: 209, transactions: 130 },
    { month: "June", income: 214, transactions: 140 },
  ];

  return (
    <Card className="min-w-[460px] gap-16">
      <CardHeader>
        <CardTitle>Income</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} horizontal={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="income"
                type="natural"
                fill="url(#fillIncome)"
                fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
          <div className="flex flex-col justify-between min-w-[142px] mr-6 my-4">
            <div>
              <p className="font-bold text-sm text-muted-foreground">Total Income</p>
              <p className="font-bold text-lg">$1,824,809.39</p>
            </div>
            <div>
              <p className="font-bold text-sm text-muted-foreground">Average Transaction</p>
              <p className="font-bold text-lg">$304,200</p>
            </div>
            <div>
              <p className="font-bold text-sm text-muted-foreground">Total Transactions</p>
              <p className="font-bold text-lg">3,000</p>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Method</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cash</TableCell>
              <TableCell>1,234</TableCell>
              <TableCell>$123,456</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bank Transfer</TableCell>
              <TableCell>2,345</TableCell>
              <TableCell>$78,901</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Stripe</TableCell>
              <TableCell>567</TableCell>
              <TableCell>$45,678</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Wompi</TableCell>
              <TableCell>890</TableCell>
              <TableCell>$1,934,567</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
