"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getBookingStatusGroupTotal } from "@/server/actions/dashboard.action";
import { useDateRange } from "./date-range-context"; // Import DateRange context
import moment from "moment";

// Chart configuration
const chartConfig = {
  confirmed: {
    label: "Approved",
    color: "hsl(var(--chart-1))",
  },
  waiting_for_payment: {
    label: "Waiting for payment",
    color: "hsl(var(--chart-2))",
  },
  in_progress: {
    label: "In progress",
    color: "hsl(var(--chart-3))",
  },
  canceled: {
    label: "Canceled",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type Params = { workspaceId?: string };

export function BookingStatus({ workspaceId }: Params) {
  const { startDate, endDate } = useDateRange(); 
  
  const id = "pie-interactive";
  const [activeStatus, setActiveStatus] = React.useState('confirmed');

  // Fetch data with loading and error state handling
  const { data = [], isLoading } = useQuery({
    queryKey: ["booking-statuses-count", workspaceId, startDate, endDate],
    queryFn: () => getBookingStatusGroupTotal(workspaceId ?? null, startDate, endDate),
    select(data) {
      return data.map(s => ({
        ...s,
        fill: chartConfig[s.status as keyof typeof chartConfig]?.color,
      }));
    },
    initialData: [],
  });

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.status === activeStatus),
    [activeStatus, data]
  );

  // Final responsive version with original visual settings retained
  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0 pb-4 sm:pb-0">
        <div className="grid gap-1">
          <CardTitle>Booking Status</CardTitle>
          <CardDescription>
            {moment(startDate).format("DD MMMM")} - {moment(endDate).format("DD MMMM")}
          </CardDescription>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger
            className="h-8 w-full sm:w-[160px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="center" className="rounded-lg justify-center">
            {Object.entries(chartConfig).map(([key, value]) => {
              if (data.findIndex(d => d.status === key) === -1) return null;

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: value.color,
                      }}
                    />
                    {value?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-full sm:max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={70}  
              strokeWidth={5}   
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 0} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 0} 
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data[activeIndex]?.count?.toLocaleString() || 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {chartConfig[
                            data[activeIndex]?.status as keyof typeof chartConfig
                          ]?.label || 'Unknown'}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
