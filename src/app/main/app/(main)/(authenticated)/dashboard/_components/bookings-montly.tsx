"use client";

import { Bar, BarChart, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDateRange } from "./date-range-context";
import { useQuery } from "@tanstack/react-query";
import { getBookingsGroupedByMonth } from "@/server/actions/dashboard.action";
import moment from "moment";

const chartConfig = {
  confirmed: {
    label: "Approved",
    color: "hsl(var(--chart-1))",
  },
  
  in_progress: {
    label: "In progress",
    color: "hsl(var(--chart-4))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
  waiting_for_payment: {
    label: "Waiting payment",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Params = { workspaceId?: string };

export function BookingsPerMonth({ workspaceId }: Params) {
  const { startDate, endDate } = useDateRange();

  // Handle single-day selections
  const isSingleDaySelection = startDate?.toDateString() === endDate?.toDateString();

  // Adjust for period or single day range
  const selectedPeriodStart = isSingleDaySelection
    ? moment(startDate).startOf("day").toDate()
    : startDate
    ? moment(startDate).startOf("day").toDate()
    : new Date();
  const selectedPeriodEnd = isSingleDaySelection
    ? moment(endDate).endOf("day").toDate()
    : endDate
    ? moment(endDate).endOf("day").toDate()
    : new Date();

  // Fetch data for the same period last year
  const previousPeriodStart = moment(selectedPeriodStart).subtract(1, "year").toDate();
  const previousPeriodEnd = moment(selectedPeriodEnd).subtract(1, "year").toDate();

  // Fetch data for the current year
  const selectedYearStart = moment(startDate).startOf("year").toDate();
  const selectedYearEnd = moment(startDate).endOf("year").toDate();

  const { data: currentYearData } = useQuery({
    queryKey: ["booking-status-metrics", workspaceId, selectedYearStart, selectedYearEnd],
    queryFn: async () => getBookingsGroupedByMonth(workspaceId ?? null, selectedYearStart, selectedYearEnd),
    initialData: [],
  });

  const { data: previousPeriodData } = useQuery({
    queryKey: ["booking-status-metrics-previous-year", workspaceId, previousPeriodStart, previousPeriodEnd],
    queryFn: async () => getBookingsGroupedByMonth(workspaceId ?? null, previousPeriodStart, previousPeriodEnd),
    initialData: [],
  });

  // Calculate the total bookings for the selected period (current year)
  const currentPeriodBookings = currentYearData
    ?.filter((item) => {
      const monthStart = moment(selectedYearStart).month(item.month).startOf("month").toDate();
      const monthEnd = moment(selectedYearStart).month(item.month).endOf("month").toDate();
      return monthStart >= selectedPeriodStart && monthEnd <= selectedPeriodEnd;
    })
    .reduce((acc, month) => acc + month.confirmed + month.cancelled + month.waiting_for_payment + month.in_progress, 0) || 0;

  // Calculate total bookings for the previous period
  const previousPeriodBookings = previousPeriodData?.reduce((acc, month) => acc + month.confirmed + month.cancelled + month.waiting_for_payment + month.in_progress, 0) || 0;

  // Calculate trend percentage
  let trendingDifference = 0;
  if (previousPeriodBookings > 0) {
    trendingDifference = ((currentPeriodBookings - previousPeriodBookings) / previousPeriodBookings) * 100;
  } else if (currentPeriodBookings > 0) {
    trendingDifference = 100;
  }

  // Handle no bookings case
  const hasData = currentPeriodBookings > 0 || previousPeriodBookings > 0;
  const trendMessage = trendingDifference === 0
    ? "No change this period compared with last year"
    : trendingDifference > 0
    ? `Trending up by ${trendingDifference.toFixed(1)}% this period`
    : `Trending down by ${Math.abs(trendingDifference).toFixed(1)}% this period`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings by Month</CardTitle>
        <CardDescription>
          January - December {moment(startDate).format("YYYY")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={currentYearData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Bar
              dataKey="confirmed"
              stackId="a"
              fill="var(--color-confirmed)"
              radius={[4, 4, 4, 4]}  // Rounded corners at both top and bottom
            />
            <Bar
              dataKey="cancelled"
              stackId="a"
              fill="var(--color-cancelled)"
              radius={[4, 4, 4, 4]}  // Rounded corners at both top and bottom
            />
            <Bar
              dataKey="waiting_for_payment"
              stackId="a"
              fill="var(--color-waiting_for_payment)"
              radius={[4, 4, 4, 4]}  // Rounded corners at both top and bottom
            />
            <Bar
              dataKey="in_progress"
              stackId="a"
              fill="var(--color-in_progress)"
              radius={[4, 4, 4, 4]}  // Rounded corners at both top and bottom
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[200px]"
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={{
                          "--color-bg": `var(--color-${name})`,
                        } as React.CSSProperties}
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">events</span>
                      </div>
                    </>
                  )}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {hasData ? (
          <div className="flex gap-2 font-medium leading-none">
            {trendMessage} compared with last year.
            <TrendingUp className="h-4 w-4" />
          </div>
        ) : (
          <div className="text-muted-foreground">No data available for this period.</div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing total bookings, cancellations, and other statuses for the selected period.
        </div>
      </CardFooter>
    </Card>
  );
}
