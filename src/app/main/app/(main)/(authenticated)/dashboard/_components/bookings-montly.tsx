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
import { useSearchParams } from "next/navigation";
import { parseDashboardDates } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getBookingsGroupedByMonth } from "@/server/actions/dashboard.action";


const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-1))",
  },
  cancellations: {
    label: "Canceled",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type Params = {
  userId: string
}
export function BookingsPerMonth({userId}: Params) {
  const searchParams = useSearchParams();
  const {startDate, endDate} = parseDashboardDates(searchParams.get("from"), searchParams.get("to"));

  const { data } = useQuery({
    queryKey: ["sales-metrics"],
    queryFn: async () => getBookingsGroupedByMonth(userId, startDate, endDate),
    initialData: []
  })


  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings vs Cancellations</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Bar
              dataKey="bookings"
              stackId="a"
              fill="var(--color-bookings)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="cancellations"
              stackId="a"
              fill="var(--color-cancellations)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[180px]"
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          events
                        </span>
                      </div>
                      {index === 1 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                          Total
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {item.payload.bookings + item.payload.cancellations}
                            <span className="font-normal text-muted-foreground">
                              events
                            </span>
                          </div>
                        </div>
                      )}
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
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total bookings and cancellations
        </div>
      </CardFooter>
    </Card>
  );
}
