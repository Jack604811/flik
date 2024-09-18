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
import { useSearchParams } from "next/navigation";
import { parseDashboardDates } from "@/lib/utils";


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

type Params = { userId: string}

export function BookingStatus({ userId, } : Params) {
  const searchParams = useSearchParams()
  const {startDate, endDate} = parseDashboardDates(searchParams.get("from"), searchParams.get("to"));
  
  const id = "pie-interactive";
  const [activeStatus, setActiveStatus] = React.useState('confirmed');
  const { data, } = useQuery({
    queryKey: ["booking-statuses-count", startDate, endDate],
    queryFn: () => getBookingStatusGroupTotal(userId, startDate, endDate),
    select(data) {
        return data.map(s => ({...s, fill: chartConfig[s.status as keyof typeof chartConfig]?.color}))
    },
    initialData: []
  })


  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.status === activeStatus),
    [activeStatus, data]
  );



  return (
    <Card data-chart={id} className="flex flex-col min-w-[350px] ">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Booking Status</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger
            className="ml-6 h-7 w-[160px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="center" className="rounded-lg justify-center">
            {/* <SelectItem value="0" className="rounded-lg [&_span]:flex" disabled>
              Select status
            </SelectItem> */}
            {Object.entries(chartConfig).map(([key, value]) => {
              if(data.findIndex(d => d.status === key) === -1) return null;

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
        
          {
            data.length ? (
              <ChartContainer
                id={id}
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    strokeWidth={5}
                    activeIndex={activeIndex}
                    activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                      <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector
                          {...props}
                          outerRadius={outerRadius + 25}
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
                                {data[activeIndex].count.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                {chartConfig[
                                  data[activeIndex].status as keyof typeof chartConfig
                                ]?.label}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <ChartContainer
                id={"no-record"}
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[300px]"
              >
                <PieChart>
                  <Pie
                    data={[{
                      fill: "hsl(var(--chart-1))",
                      status: "",
                      count: 100
                  }]}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    strokeWidth={5}
                    activeIndex={activeIndex}
                    activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                      <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector
                          {...props}
                          outerRadius={outerRadius + 25}
                          innerRadius={outerRadius + 12}
                        />
                      </g>
                    )}>
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
                                No Record
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                    </Pie>
                </PieChart>
              </ChartContainer>
            )
          }
        
      </CardContent>
    </Card>
  );
}
