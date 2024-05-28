"use client"
import { useState } from "react";
import BookingInfo from "./info";

export default function Page({
  params,
}: {
  params: { spotId: string; bookingId: string };
}) {
  const [completed, setCompleted] = useState(false);
  return (
    <>
      
      {!completed ? (<BookingInfo onCompleted={setCompleted} />) : (
        <div>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Thank you for booking!
                </h1>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                  We appreciate your trust in us and look forward to providing
                  you with an exceptional experience.
                </p>
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
                      <span>June 15, 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Time:
                      </span>
                      <span>7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Location:
                      </span>
                      <span>123 Main St, Anytown USA</span>
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
                      <span>$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Method:
                      </span>
                      <span>Visa ending in 1234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Transaction ID:
                      </span>
                      <span>ABC123456789</span>
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
                      <span>John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Email:
                      </span>
                      <span>john@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Phone:
                      </span>
                      <span>+1 (555) 555-5555</span>
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
