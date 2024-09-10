"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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

const chartData = [
  { source: "Google", bookings: 186 },
  { source: "Facebook", bookings: 305 },
  { source: "Instagram", bookings: 237 },
  { source: "TikTok", bookings: 190 },
  { source: "Twitter", bookings: 209 },
  { source: "LinkedIn", bookings: 214 },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function BookingsSource() {
  return (
    <Card className="flex flex-col justify-between min-w-[350px]">
      <CardHeader>
        <CardTitle>Bookings Source</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer 
        config={chartConfig}
        className="max-h-[300px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid vertical={false} horizontal={false} />
            <YAxis
              dataKey="source"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="bookings" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="bookings"
              layout="horizontal"
              fill="var(--color-bookings)"
              radius={4}
            >
              <LabelList
                dataKey="source"
                position="insideLeft"
                offset={8}
                className="font-bold fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="bookings"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total bookings by source for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
