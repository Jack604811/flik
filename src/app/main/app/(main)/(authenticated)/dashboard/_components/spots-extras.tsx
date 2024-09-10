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

interface SpotData {
  product: string;
  bookings: string;
  revenue: string;
  visits: string;
  occupancyRate: string;
  clickThroughRate: string;
}

const spotsData: SpotData[] = [
  { product: "Luxury Suite", bookings: "1,234", revenue: "$123,456", visits: "1,000", occupancyRate: "16%", clickThroughRate: "30%" },
  { product: "Standard Room", bookings: "2,345", revenue: "$780,901", visits: "1,000", occupancyRate: "19%", clickThroughRate: "60%" },
  { product: "Family Suite", bookings: "567", revenue: "$45,678", visits: "1,000", occupancyRate: "7%", clickThroughRate: "10%" },
  { product: "Deluxe Room", bookings: "890", revenue: "$34,567", visits: "1,000", occupancyRate: "25%", clickThroughRate: "24%" },
];

interface ExtrasData {
  product: string;
  totalSales: string;
  revenue: string;
  clickThroughRate: string;
}

const extrasData: ExtrasData[] = [
  { product: "Brunch", totalSales: "1,234", revenue: "$123,456", clickThroughRate: "30%" },
  { product: "Red Wine", totalSales: "2,345", revenue: "$78,901", clickThroughRate: "60%" },
  { product: "Picnic Day", totalSales: "567", revenue: "$45,678", clickThroughRate: "10%" },
  { product: "Extra People", totalSales: "890", revenue: "$34,567", clickThroughRate: "24%" },
];

// Calculate the total revenue for spots and extras
const totalSpotsRevenue = spotsData.reduce((sum, spot) => sum + parseFloat(spot.revenue.replace(/[^0-9.-]+/g, "")), 0);
const totalExtrasRevenue = extrasData.reduce((sum, extra) => sum + parseFloat(extra.revenue.replace(/[^0-9.-]+/g, "")), 0);

const chartConfig = {
  spots: {
    label: "Spots",
  },
  extras: {
    label: "Extras",
  },
}

export function SpotsAndExtras() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("spots")

  const total = {
    spots: totalSpotsRevenue,
    extras: totalExtrasRevenue,
  }

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
                  ${total[chart].toLocaleString()}
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
              {spotsData.map((spot, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Image
                      alt="Spot Image"
                      className="aspect-square rounded-md object-cover hidden sm:table-column"
                      height="64"
                      src="/placeholder.svg"
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
              {extrasData.map((extras, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Image
                      alt="Extras Image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src="/placeholder.svg"
                      width="64"
                    />
                  </TableCell>
                  <TableCell>{extras.product}</TableCell>
                  <TableCell>{extras.totalSales}</TableCell>
                  <TableCell>{extras.revenue}</TableCell>
                  <TableCell>{extras.clickThroughRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
