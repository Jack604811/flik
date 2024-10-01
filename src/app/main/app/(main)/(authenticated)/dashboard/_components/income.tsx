"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, CartesianGrid, XAxis, Area, Tooltip } from "recharts";
import { useDateRange } from "./date-range-context"; // Assuming you have a date picker context
import { getIncomeMetricData } from "@/server/actions/dashboard.action"; // Adjust import based on your file structure
import moment from "moment";
import { Separator } from "@/components/ui/separator";

// Example chartConfig for chart styling
const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
};

// Number formatter for currency with thousand separators
const formatNumber = (number: number, round = false) => {
  if (round) {
    return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(Math.floor(number));
  }
  return new Intl.NumberFormat("de-DE").format(number);
};

type Params = { workspaceId?: string };

export default function Income({ workspaceId }: Params) {
  // Get startDate and endDate from the date range context
  const { startDate, endDate } = useDateRange();

  // Fetch data based on the date range and workspaceId
  const { data = { incomeMetrics: { _sum: { amount: 0 }, _avg: { amount: 0 }, _count: 0 }, paymentMethodMetrics: [], chartsPaymentMetrics: [] }, isLoading } = useQuery({
    queryKey: ["income-metrics", workspaceId, startDate, endDate],
    queryFn: () => getIncomeMetricData(workspaceId ?? null, startDate, endDate),
    enabled: !!startDate && !!endDate,
    initialData: {
      incomeMetrics: { _sum: { amount: 0 }, _avg: { amount: 0 }, _count: 0 },
      paymentMethodMetrics: [],
      chartsPaymentMetrics: [],
    },
  });

  // Format the chartsPaymentMetrics data for the chart
  const chartData = data?.chartsPaymentMetrics.map((item) => ({
    date: moment(item.paymentDate).format("DD MMMM"), // Format date
    income: item._sum.amount, // Use the summed amount as the income
    transactions: item._count, // Use the count as transactions
    paymentMethod: item.paymentMethod, // Payment method if needed
  })) || [];

  return (
    <Card className="min-w-[260px] gap-8">
      <CardHeader>
        <CardTitle>Income</CardTitle>
        <CardDescription>
          {moment(startDate).format("DD MMMM YYYY")} - {moment(endDate).format("DD MMMM YYYY")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={chartData} margin={{ left: 18, right: 18 }}>
              <CartesianGrid vertical={false} horizontal={false} />
              
              {/* Customize the Tooltip */}
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { income, transactions, date } = payload[0].payload;
                    return (
                      <div className="p-2 bg-white border dark:bg-black shadow rounded-md w-[178px]">
                      <p className="text-xs font-bold">{date}</p>
                      <Separator className="my-2" />
                      
                      {/* Income Row */}
                      <div className="flex justify-between items-center pb-1">
                        <div className="flex items-center">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] mr-2"
                            style={{ backgroundColor: chartConfig.income.color }}>
                          </div>
                          <p className="text-xs">Income:</p>
                        </div>
                        <span className="font-bold ml-2 text-xs">${formatNumber(income)}</span>
                      </div>
                    
                      {/* Transactions Row */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] mr-2"
                            style={{ backgroundColor: chartConfig.income.color }}>
                          </div>
                          <p className="text-xs">Transactions:</p>
                        </div>
                        <span className="font-bold ml-2 text-xs">{formatNumber(transactions)}</span>
                      </div>
                    </div>
                    );
                  }
                  return null;
                }}
              />
              
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-income)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="income"
                type="monotone"
                fill="url(#fillIncome)"
                fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>

          {/* Income Stats */}
          <div className="flex flex-col justify-between w-full md:w-auto min-w-[142px]">
            <div>
              <p className="font-bold text-sm text-muted-foreground">Total Income</p>
              <p className="font-bold text-lg">
                ${formatNumber(data?.incomeMetrics._sum.amount ?? 0)}
              </p>
            </div>
            <div>
              <p className="font-bold text-sm text-muted-foreground">Average Transaction</p>
              <p className="font-bold text-lg">
              ${formatNumber(data?.incomeMetrics._avg.amount ?? 0, true)}
              </p>
            </div>
            <div>
              <p className="font-bold text-sm text-muted-foreground">Total Transactions</p>
              <p className="font-bold text-lg">
                {formatNumber(data?.incomeMetrics._count ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Table */}
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Payment Method</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.paymentMethodMetrics.length ? (
              data.paymentMethodMetrics.map((pmm, key) => (
                <TableRow key={key}>
                  <TableCell>{pmm.paymentMethod}</TableCell>
                  <TableCell>{formatNumber(pmm._count)}</TableCell>
                  <TableCell>${formatNumber(pmm._sum.amount ?? 0)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground text-xs">
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
