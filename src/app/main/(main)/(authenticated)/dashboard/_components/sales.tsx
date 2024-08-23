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

const chartData = [
   { date: "2024-04-01", sales: 222, income: 150 },
  { date: "2024-04-02", sales: 97, income: 180 },
  { date: "2024-04-03", sales: 167, income: 120 },
  { date: "2024-04-04", sales: 242, income: 260 },
  { date: "2024-04-05", sales: 373, income: 290 },
  { date: "2024-04-06", sales: 301, income: 340 },
  { date: "2024-04-07", sales: 245, income: 180 },
  { date: "2024-04-08", sales: 409, income: 320 },
  { date: "2024-04-09", sales: 59, income: 110 },
  { date: "2024-04-10", sales: 261, income: 190 },
  { date: "2024-04-11", sales: 327, income: 350 },
  { date: "2024-04-12", sales: 292, income: 210 },
  { date: "2024-04-13", sales: 342, income: 380 },
  { date: "2024-04-14", sales: 137, income: 220 },
  { date: "2024-04-15", sales: 120, income: 170 },
  { date: "2024-04-16", sales: 138, income: 190 },
  { date: "2024-04-17", sales: 446, income: 360 },
  { date: "2024-04-18", sales: 364, income: 410 },
  { date: "2024-04-19", sales: 243, income: 180 },
  { date: "2024-04-20", sales: 89, income: 150 },
  { date: "2024-04-21", sales: 137, income: 200 },
  { date: "2024-04-22", sales: 224, income: 170 },
  { date: "2024-04-23", sales: 138, income: 230 },
  { date: "2024-04-24", sales: 387, income: 290 },
  { date: "2024-04-25", sales: 215, income: 250 },
  { date: "2024-04-26", sales: 75, income: 130 },
  { date: "2024-04-27", sales: 383, income: 420 },
  { date: "2024-04-28", sales: 122, income: 180 },
  { date: "2024-04-29", sales: 315, income: 240 },
  { date: "2024-04-30", sales: 454, income: 380 },
  { date: "2024-05-01", sales: 165, income: 220 },
  { date: "2024-05-02", sales: 293, income: 310 },
  { date: "2024-05-03", sales: 247, income: 190 },
  { date: "2024-05-04", sales: 385, income: 420 },
  { date: "2024-05-05", sales: 481, income: 390 },
  { date: "2024-05-06", sales: 498, income: 520 },
  { date: "2024-05-07", sales: 388, income: 300 },
  { date: "2024-05-08", sales: 149, income: 210 },
  { date: "2024-05-09", sales: 227, income: 180 },
  { date: "2024-05-10", sales: 293, income: 330 },
  { date: "2024-05-11", sales: 335, income: 270 },
  { date: "2024-05-12", sales: 197, income: 240 },
  { date: "2024-05-13", sales: 197, income: 160 },
  { date: "2024-05-14", sales: 448, income: 490 },
  { date: "2024-05-15", sales: 473, income: 380 },
  { date: "2024-05-16", sales: 338, income: 400 },
  { date: "2024-05-17", sales: 499, income: 420 },
  { date: "2024-05-18", sales: 315, income: 350 },
  { date: "2024-05-19", sales: 235, income: 180 },
  { date: "2024-05-20", sales: 177, income: 230 },
  { date: "2024-05-21", sales: 82, income: 140 },
  { date: "2024-05-22", sales: 81, income: 120 },
  { date: "2024-05-23", sales: 252, income: 290 },
  { date: "2024-05-24", sales: 294, income: 220 },
  { date: "2024-05-25", sales: 201, income: 250 },
  { date: "2024-05-26", sales: 213, income: 170 },
  { date: "2024-05-27", sales: 420, income: 460 },
  { date: "2024-05-28", sales: 233, income: 190 },
  { date: "2024-05-29", sales: 78, income: 130 },
  { date: "2024-05-30", sales: 340, income: 280 },
  { date: "2024-05-31", sales: 178, income: 230 },
  { date: "2024-06-01", sales: 178, income: 200 },
  { date: "2024-06-02", sales: 470, income: 410 },
  { date: "2024-06-03", sales: 103, income: 160 },
  { date: "2024-06-04", sales: 439, income: 380 },
  { date: "2024-06-05", sales: 88, income: 140 },
  { date: "2024-06-06", sales: 294, income: 250 },
  { date: "2024-06-07", sales: 323, income: 370 },
  { date: "2024-06-08", sales: 385, income: 320 },
  { date: "2024-06-09", sales: 438, income: 480 },
  { date: "2024-06-10", sales: 155, income: 200 },
  { date: "2024-06-11", sales: 92, income: 150 },
  { date: "2024-06-12", sales: 492, income: 420 },
  { date: "2024-06-13", sales: 81, income: 130 },
  { date: "2024-06-14", sales: 426, income: 380 },
  { date: "2024-06-15", sales: 307, income: 350 },
  { date: "2024-06-16", sales: 371, income: 310 },
  { date: "2024-06-17", sales: 475, income: 520 },
  { date: "2024-06-18", sales: 107, income: 170 },
  { date: "2024-06-19", sales: 341, income: 290 },
  { date: "2024-06-20", sales: 408, income: 450 },
  { date: "2024-06-21", sales: 169, income: 210 },
  { date: "2024-06-22", sales: 317, income: 270 },
  { date: "2024-06-23", sales: 480, income: 530 },
  { date: "2024-06-24", sales: 132, income: 180 },
  { date: "2024-06-25", sales: 141, income: 190 },
  { date: "2024-06-26", sales: 434, income: 380 },
  { date: "2024-06-27", sales: 448, income: 490 },
  { date: "2024-06-28", sales: 149, income: 200 },
  { date: "2024-06-29", sales: 103, income: 160 },
  { date: "2024-06-30", sales: 446, income: 400 },
];

const chartConfig: ChartConfig = {
  sales: {
    label: "Bookings",
    color: "hsl(var(--chart-1))", 
  },
};

// Calculate average bookings
const averageSales = chartData.reduce((acc, curr) => acc + curr.sales, 0) / chartData.length;

export function Sales() {
  return (
    <Card className="xl:col-span-2 min-w-[420px]">
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartConfig.sales.label}</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="w-full max-h-[350px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={true} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
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
            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />
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
            <Area
              dataKey="sales"
              type="monotone"
              stroke={chartConfig.sales.color ?? "#000"}
              fill="url(#fillSales)"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              y={averageSales}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-green-200">
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
              </div>
            </ReferenceLine>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
