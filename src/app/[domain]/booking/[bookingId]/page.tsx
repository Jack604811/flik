import moment from "moment";
import BookingInfo from "./info";
import { getSpotBooking } from "@/server/actions/domain.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { domain: string; bookingId: string };
}) {
  const booking = await getSpotBooking(params.domain, params.bookingId);
  return (
    <>
      {!booking?.customerId ? (
        <section className="w-full h-screen bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center justify-center flex-col h-screen space-y-4">
            <h1 className="text-8xl font-bold text-red-600">404</h1>
            <h1 className="text-4xl font-bold">Booking not found</h1>
            <Link href={"/"}><Button size="lg">Go Home</Button></Link>
          </div>
        </section>
      ) : (
        <div>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Thank you for booking!
                </h1>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl dark:text-gray-400 pb-4">
                  We appreciate your trust in us and look forward to providing
                  you with an exceptional experience.
                </p>
                <Link href="/">
                  <Button>Go to home</Button>
                </Link>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-lg shadow-sm dark:bg-gray-950 p-6 space-y-4">
                  <div className="text-lg font-semibold">Booking Details</div>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Date:
                      </span>
                      <span>
                        {moment(booking.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Time:
                      </span>
                      <span>{moment(booking.createdAt).format("hh:mm A")}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Spot:
                      </span>
                      <span className="text-right">{booking.spot.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Guests:
                      </span>
                      <span>2</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm dark:bg-gray-950 p-6 space-y-4">
                  <div className="text-lg font-semibold">Payment Details</div>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Total:
                      </span>
                      <span>${booking.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Method:
                      </span>
                      <span>{booking.status}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Transaction ID:
                      </span>
                      <span className="uppercase">{booking.id}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm dark:bg-gray-950 p-6 space-y-4">
                  <div className="text-lg font-semibold">
                    Contact Information
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Name:
                      </span>
                      <span>{booking.customer?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Email:
                      </span>
                      <span>{booking.customer?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Phone:
                      </span>
                      <span>{booking.customer?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Address:
                      </span>
                      <span className="text-right">
                        {booking.customer?.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
