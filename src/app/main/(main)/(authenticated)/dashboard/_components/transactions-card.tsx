"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, CartesianGrid, XAxis, Area } from "recharts"

export default function TransactionsCard() {
  const chartConfig = {
    desktop: {
      label: "Income",
      color: "hsl(var(--chart-2))",
    },
  }
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  return (
    <Card className="min-w-[460px] gap-16">
      <CardHeader>
        <CardTitle>Income</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} horizontal={false}/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex justify-between mx-0 my-4">
          <div>
            <p className="font-bold text-sm text-muted-foreground">Total Income</p>
            <p className="font-bold text-lg">$124.809.394</p>
          </div>
          <div>
          <div>
            <p className="font-bold text-sm text-muted-foreground">Average</p>
            <p className="font-bold text-lg">$304.200</p>
          </div>
          </div>
        </div>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Method</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Cash</TableCell>
                <TableCell>1,234</TableCell>
                <TableCell>$123,456</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bank Transfer</TableCell>
                <TableCell>2,345</TableCell>
                <TableCell>$78,901</TableCell>
 
              </TableRow>
              <TableRow>
                <TableCell>Stripe</TableCell>
                <TableCell>567</TableCell>
                <TableCell>$45,678</TableCell>
              
              </TableRow>
              <TableRow>
                <TableCell>Wompi</TableCell>
                <TableCell>890</TableCell>
                <TableCell>$1.934.567</TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  )
}
