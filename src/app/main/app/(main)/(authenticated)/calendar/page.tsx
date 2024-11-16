// page.tsx
import { Metadata } from "next";
import { getBookings } from "@/server/actions/booking.action";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import CalendarView from "./_components/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
  description: "A booking tracker for your spots",
};

export default async function Page() {
  const currentWorkspace = await getCurrentWorkspace();
  const events = await getBookings(currentWorkspace!.id);

  return (
    <div className="flex-1">
      <CalendarView 
      events={events} 
      workspaceId={currentWorkspace!.id} 
      />
    </div>
  );
}
