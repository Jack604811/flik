"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseDashboardDates } from "@/lib/utils";
import { getIncomeMetricData } from "@/server/actions/dashboard.action";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { AreaChart, CartesianGrid, XAxis, Area, ReferenceLine, Label } from "recharts";

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


type Params = {  userId: string };

export default function Income({userId} : Params) {
  const searchParams = useSearchParams()
  const {startDate, endDate} = parseDashboardDates(searchParams.get("from"), searchParams.get("to"));

  const { data } = useQuery({
    queryKey: ["income-metrics"],
    queryFn: () => getIncomeMetricData(userId, startDate, endDate),
  })


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
              <p className="font-bold text-lg">${data?.incomeMetrics._sum.amount ?? "0.00"}</p>
            </div>
            <div>
              <p className="font-bold text-sm text-muted-foreground">Average Transaction</p>
              <p className="font-bold text-lg">${data?.incomeMetrics._avg.amount ?? "0.00"}</p>
            </div>
            <div>
              <p className="font-bold text-sm text-muted-foreground">Total Transactions</p>
              <p className="font-bold text-lg">{data?.incomeMetrics._count}</p>
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
            {
              data?.paymentMethodMetrics.length ? 
              data?.paymentMethodMetrics.map((pmm, key) => (
                <TableRow key={key}>
                  <TableCell>{pmm.paymentMethod}</TableCell>
                  <TableCell>{pmm._count}</TableCell>
                  <TableCell>${pmm._sum.amount}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground text-xs">No Record found.</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
