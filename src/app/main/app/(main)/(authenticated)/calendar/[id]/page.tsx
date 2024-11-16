// app/[id]/page.tsx
import Link from "next/link";
import { getBookingById } from "@/server/actions/booking.action";

export default async function BookingDetailsPage({ params }: { params: { id: string } }) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-gray-500">The requested booking does not exist.</p>
        <Link href="/calendar">
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Back to Calendar</button>
        </Link>
      </div>
    );
  }

  const formatDate = (date: Date | null): string => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/calendar">
        <button className="mb-6 px-4 py-2 bg-blue-500 text-white rounded">Back to Calendar</button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <div className="space-y-4">
        <p><strong>Spot Name:</strong> {booking.spot?.name || "N/A"}</p>
        <p><strong>Customer:</strong> {booking.customer?.name || "No customer assigned"}</p>
        <p><strong>Phone:</strong> {booking.customer?.phone || "N/A"}</p>
        <p>
          <strong>Date Range:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
        </p>
        <p><strong>Amount Due:</strong> ${booking.totalPrice?.toFixed(2) || "N/A"}</p>
      </div>
    </div>
  );
}
