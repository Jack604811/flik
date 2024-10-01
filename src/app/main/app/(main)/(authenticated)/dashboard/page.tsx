import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getCurrentUser } from "@/server/auth";
import { DateFilter } from "./_components/date-filter";
import { TopCards } from "./_components/top-cards";
import { Traffic } from "./_components/traffic";
import { BookingStatus } from "./_components/booking-status";
import { Sales } from "./_components/sales";
import { BookingsPerMonth } from "./_components/bookings-montly";
import Income from "./_components/income";
import { SpotsAndExtras } from "./_components/spots-extras";
import { BookingList } from "./_components/booking-list";
import { BookingsSource } from "./_components/bookings-source";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import React from "react";
import { DateRangeProvider } from "./_components/date-range-context";

export default async function Dashboard() {
  const currentWorkspace = await getCurrentWorkspace();


  return (
    <DateRangeProvider>
    <div className="flex-1 p-4 pt-4 space-y-8 md:p-8 md:pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex justify-between">
          <div className="flex w-full items-center justify-between space-x-2">
            <DateFilter />
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div>
            <TopCards workspaceId={currentWorkspace?.id} />
            <div className="grid gap-4 xs:max-w-[300px] md:w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2">
              {/* <Sales userId={currentUser?.id!} workspaceId={currentWorkspace?.id}/> */}
              <BookingList workspaceId={currentWorkspace?.id} />
              <BookingStatus workspaceId={currentWorkspace?.id}  />
              <Income workspaceId={currentWorkspace?.id} />
              <BookingsPerMonth workspaceId={currentWorkspace?.id} />
             {/* <BookingsSource userId={currentUser?.id!} workspaceId={currentWorkspace?.id} />
             
              
             
             
              <SpotsAndExtras userId={currentUser?.id!} workspaceId={currentWorkspace?.id} />
              <Traffic userId={currentUser?.id!} workspaceId={currentWorkspace?.id}/> */}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </DateRangeProvider>
  );
}
