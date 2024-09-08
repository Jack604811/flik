import { Metadata } from "next"
import { getBookings } from "@/server/actions/booking.action"
import { getCurrentUser } from "@/server/auth"
import { QueryClient } from "@tanstack/react-query"
import BookingListing from "./BookingListing"

export const metadata: Metadata = {
  title: "Bookings",
  description: "A booking tracker for your spots",
}


export default async function Page() {
  const currentUser = await getCurrentUser()
  const bookings: any = await getBookings(currentUser!.id)

  return (
    <>
      <div className="flex-1 p-4 pt-4 space-y-8 md:p-8 md:pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your spots&apos; bookings so far!
            </p>
          </div>
        </div>
          <BookingListing bookings={bookings} userId={currentUser?.id!} />
      </div>
    </>
  )
}
