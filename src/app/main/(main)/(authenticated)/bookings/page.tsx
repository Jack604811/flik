import { Metadata } from "next"

import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { getBookings } from "@/server/actions/booking.action"
import { getCurrentUser } from "@/server/auth"
import { Booking } from "./data/schema"

export const metadata: Metadata = {
  title: "Bookings",
  description: "A booking tracker for your spots",
}


export default async function TaskPage() {
  const currentUser = await getCurrentUser()
  const bookings = await getBookings(currentUser!.id) as any

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your spots&apos; bookings so far!
            </p>
          </div>
        </div>
        <DataTable data={bookings} columns={columns} />
      </div>
    </>
  )
}
