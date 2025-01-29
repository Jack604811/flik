// page.tsx
import { Metadata } from "next";
import { getBookings } from "@/server/actions/booking.action";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import CalendarView from "./_components/calendar-view";
import BookingSection from "@/app/[domain]/[spotId]/_components/BookingSection";

export const metadata: Metadata = {
  title: "Calendar",
  description: "A booking tracker for your spots",
};

export default async function Page() {
  const currentWorkspace = await getCurrentWorkspace();
  const bookings = currentWorkspace ? await getBookings(currentWorkspace.id) : [];

  if (!currentWorkspace) {
    return (
      <div className="flex-1 pt-4 space-y-8 gap-8 p-6 md:p-8 md:pt-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">No Workspace Selected</h2>
          <p className="text-muted-foreground">
            Please select a workspace to view settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <CalendarView 
        bookings={bookings} 
        workspaceId={currentWorkspace.id}
      />
    </div>
  );
}
