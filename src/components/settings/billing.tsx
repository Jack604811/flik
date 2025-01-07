"use client";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, DownloadIcon, PlusIcon, MinusIcon, CreditCard, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Component() {
  const [loading, setLoading] = useState(true)
  const [seats, setSeats] = useState(5)
  const seatPrice = 10 // Price per seat per month

  const currentPlan = "Pro"
  const bookingsPerMonth = 250
  const transactionsPerMonth = 1000
  const bookingsLimit = 500
  const transactionsLimit = 2000

  const plans = [
    { name: "Basic", price: "$9.99", features: ["100 bookings/month", "500 transactions/month", "2 seats included"] },
    { name: "Pro", price: "$29.99", features: ["500 bookings/month", "2000 transactions/month", "5 seats included"] },
    { name: "Enterprise", price: "Custom", features: ["Unlimited bookings", "Unlimited transactions", "Custom seats"] },
  ]

  const billingHistory = [
    { date: "2023-05-01", amount: "$29.99", status: "Paid", invoice: "INV-001" },
    { date: "2023-04-01", amount: "$29.99", status: "Paid", invoice: "INV-002" },
    { date: "2023-03-01", amount: "$29.99", status: "Paid", invoice: "INV-003" },
  ]

  const handleAddSeat = () => {
    setSeats(seats + 1)
  }

  const handleRemoveSeat = () => {
    if (seats > 5) {
      setSeats(seats - 1)
    }
  }

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-start xl:flex-row gap-4 xl:gap-6 sm:space-y-4 lg:space-y-0 max-w-6xl py-6">
      <div className="space-y-2 w-full xl:w-1/3">
        <h1 className="text-xl font-semibold">Billing plan</h1>
        <p className="text-sm text-muted-foreground mb-4">View and manage your billing plan</p>
      </div>
      <div className="flex-1 w-full items-start xl:w-2/3 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-6 sm:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg border">
          <div className="space-y-1">
            <div className="text-xl sm:text-xl font-semibold text-foreground">
              Current plan: {loading ? <Skeleton className="h-6 w-16 inline-block align-middle" /> : currentPlan}
            </div>
            <div className="text-sm text-orange-500 font-medium">
              {loading ? <Skeleton className="h-4 w-48" /> : "On trial until September 8, 2024"}
            </div>
          </div>
          <Button className="w-full sm:w-auto backdrop-blur-sm">
            Upgrade now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Current Plan: {loading ? <Skeleton className="h-6 w-16 inline-block align-middle" /> : currentPlan}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Your current billing plan and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Bookings</span>
                  <span>{loading ? <Skeleton className="h-4 w-16 inline-block" /> : `${bookingsPerMonth} / ${bookingsLimit}`}</span>
                </div>
                {loading ? (
                  <Skeleton className="h-2 w-full" />
                ) : (
                  <Progress 
                    value={(bookingsPerMonth / bookingsLimit) * 100} 
                    className="h-2"
                  />
                )}
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Transactions</span>
                  <span>{loading ? <Skeleton className="h-4 w-16 inline-block" /> : `${transactionsPerMonth} / ${transactionsLimit}`}</span>
                </div>
                {loading ? (
                  <Skeleton className="h-2 w-full" />
                ) : (
                  <Progress 
                    value={(transactionsPerMonth / transactionsLimit) * 100} 
                    className="h-2"
                  />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Payment Method</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Your current payment method on file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <CreditCard className="h-6 w-6" />
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="font-medium">Visa ending in 1234</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change Payment Method</Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  billingHistory.map((item) => (
                    <TableRow key={item.invoice}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="ml-[-10px]">
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          {item.invoice}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  )
}