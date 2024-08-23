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
      <div className="h-full flex-1 flex-col space-y-8 my-8 mx-6 md:flex">
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
