"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, DownloadIcon, PlusIcon, MinusIcon, CreditCard, ArrowRight } from "lucide-react"

export default function Component() {
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

  return (
    <div className="flex flex-col items-start xl:flex-row gap-4 xl:gap-6 sm:space-y-4 lg:space-y-0 max-w-6xl py-6">
      {/* Billing Plan Header */}
      <div className="space-y-2 w-full xl:w-1/3">
        <h1 className="text-xl font-semibold">Billing plan</h1>
        <p className="text-sm text-muted-foreground mb-4">View and manage your billing plan</p>
      </div>
      <div className="flex-1 w-full items-start xl:w-2/3 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-6 sm:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg border">
        <div className="space-y-1">
        <div className="text-xl sm:text-xl font-semibold text-foreground">Current plan: {currentPlan}</div>
        <div className="text-sm text-orange-500 font-medium">On trial until September 8, 2024</div>
        </div>
        <Button className="w-full sm:w-auto backdrop-blur-sm">
        Upgrade now
        <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Current Plan: {currentPlan}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Your current billing plan and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Bookings</span>
                <span>{bookingsPerMonth} / {bookingsLimit}</span>
              </div>
              <Progress 
              value={(bookingsPerMonth / bookingsLimit) * 100} 
              className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Transactions</span>
                <span>{transactionsPerMonth} / {transactionsLimit}</span>
              </div>
              <Progress 
              value={(transactionsPerMonth / transactionsLimit) * 100} 
              className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Payment Method</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Your current payment method on file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-6 w-6" />
              <div>
                <p className="font-medium">Visa ending in 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Change Payment Method</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Add-ons */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Add-ons</CardTitle>
          <CardDescription>Customize your plan with additional features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Additional Seats</h3>
              <p className="text-sm text-muted-foreground">Add more seats to your plan</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handleRemoveSeat} disabled={seats <= 5}>
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold">{seats}</span>
              <Button variant="outline" size="icon" onClick={handleAddSeat}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <span>Additional cost:</span>
            <span>${(seats - 5) * seatPrice}/month</span>
          </div>
        </CardFooter>
      </Card> */}

      {/* Upgrade Plans */}
      {/* <div>
        <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <CardDescription>{plan.price}/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {plan.name === currentPlan ? "Current Plan" : "Upgrade"}
                  {plan.name !== currentPlan && <ArrowUpIcon className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div> */}

      {/* Billing History */}
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
              {billingHistory.map((item) => (
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
              ))}
            </TableBody>
          </Table>
        </Card>
        </div>
      </div>
    </div>
  )
}