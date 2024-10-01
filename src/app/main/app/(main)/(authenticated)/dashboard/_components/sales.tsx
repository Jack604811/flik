"use client";

import * as React from "react";
import { CartesianGrid, Area, AreaChart, XAxis, YAxis, ReferenceLine, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query"; // For data fetching
import { getTotalSalesByDateRange } from "@/server/actions/dashboard.action"; // Import the server action
import { useDateRange } from "./date-range-context"; // Import DateRange context
import moment from "moment";

// Chart configuration
const chartConfig: ChartConfig = {
  sales: {
    label: "Bookings",
    color: "hsl(var(--chart-1))", 
  },
};

// Define the component props
type SalesProps = { 
  userId: string; 
  workspaceId?: string; 
};

export function Sales({ userId, workspaceId }: SalesProps) {
  // Get startDate and endDate from DateRange context
  const { startDate, endDate } = useDateRange();

  // Fetch booking data using React Query
  const { data: bookingsData = [], isLoading } = useQuery({
    queryKey: ["sales-metrics", userId, workspaceId, startDate, endDate],
    queryFn: () => getTotalSalesByDateRange(userId, workspaceId ?? null, startDate, endDate),
    initialData: [],
  });

  // Calculate the average sales
  const averageSales = bookingsData.length > 0 
    ? bookingsData.reduce((acc, curr) => acc + curr.sales, 0) / bookingsData.length 
    : 0;

  return (
    <Card className="2xl:col-span-2 xl:col-span-3 xs:max-w-[300px] md:w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartConfig.sales.label}</CardTitle>
          <CardDescription>
            {/* Display the selected date range */}
            {moment(startDate).format("DD MMMM YYYY")} - {moment(endDate).format("DD MMMM YYYY")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 xs:px-0 sm:p-6">
        {/* Chart Container */}
        <ChartContainer config={chartConfig} className="w-full max-h-[350px]">
          <AreaChart
            data={bookingsData} // Use dynamic data fetched from the server
            margin={{ left: 12, right: 12 }}
          >
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={true} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            
            {/* Chart Tooltip */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="sales"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />

            {/* Area Chart */}
            <Area
              dataKey="sales"
              type="monotone"
              stroke={chartConfig.sales.color ?? "#000"}
              fill="url(#fillSales)"
              strokeWidth={2}
              dot={false}
            />
            
            {/* ReferenceLine for Average Sales */}
            <ReferenceLine
              y={averageSales}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomRight"
                value="Average Bookings:"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopRight"
                value={`${Math.round(averageSales)}`}
                className="text-2xl"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
