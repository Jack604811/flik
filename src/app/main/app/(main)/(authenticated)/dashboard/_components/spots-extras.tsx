"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { parseDashboardDates } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getSpotsAndExtrasMetrics } from "@/server/actions/dashboard.action"

const chartConfig = {
  spots: {
    label: "Spots",
  },
  extras: {
    label: "Extras",
  },
}

type Params = { userId: string, workspaceId?: string };
export function SpotsAndExtras({userId, workspaceId}: Params) {
  const searchParams = useSearchParams()
  const {startDate, endDate} = parseDashboardDates(searchParams.get("from"), searchParams.get("to"));

  const { data, isLoading } = useQuery({
    queryKey: ["spots-extras",userId, workspaceId, startDate.toLocaleString(), endDate.toLocaleString()],
    queryFn: () => getSpotsAndExtrasMetrics(userId, workspaceId??null, startDate, endDate),
    enabled: !!startDate && !!endDate,
    initialData: { spots: [], extras: [], total: { spots: 0, extras: 0 } }
  });

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("spots")


  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-6 sm:py-6">
          <CardTitle>{activeChart === "spots" ? "Spots Overview" : "Extras Overview"}</CardTitle>
          <CardDescription>
            Showing data based on the selected tab
          </CardDescription>
        </div>
        <div className="flex">
          {["spots", "extras"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-8 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-8"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ${(data?.total?.[chart] ?? 0).toFixed(2)}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {activeChart === "spots" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>OR</TableHead>
                <TableHead>CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.spots?.map((spot, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Image
                      alt="Spot Image"
                      className="aspect-square rounded-md object-cover hidden sm:table-column"
                      height="64"
                      src={spot.image || "/placeholder.svg"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell>{spot.product}</TableCell>
                  <TableCell>{spot.bookings}</TableCell>
                  <TableCell>{spot.revenue}</TableCell>
                  <TableCell>{spot.visits}</TableCell>
                  <TableCell>{spot.occupancyRate}</TableCell>
                  <TableCell>{spot.clickThroughRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.extras?.map((extra, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Image
                      alt="Extra Image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={extra.image || "/placeholder.svg"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell>{extra.product}</TableCell>
                  <TableCell>{extra.totalSales}</TableCell>
                  <TableCell>{extra.revenue}</TableCell>
                  <TableCell>{extra.clickThroughRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
