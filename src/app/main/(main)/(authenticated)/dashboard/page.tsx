import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/server/auth";
import { DateFilter } from "./_components/date-filter";
import { TopCards } from "./_components/top-cards";
import { Traffic } from "./_components/traffic";
import { BookingStatus } from "./_components/booking-status";
import { Sales } from "./_components/sales";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { BookingsPerMonth } from "./_components/bookings-montly";
import Income from "./_components/income";
import { SpotsAndExtras } from "./_components/spots-extras";
import { BookingList } from "./_components/booking-list";
import { BookingsSource }from "./_components/bookings-source";

export default async function Dashboard() {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex-1 p-4 pt-4 space-y-8 md:p-8 md:pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex justify-between">
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Bookings
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Transactions
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Analytics
            </TabsTrigger>
          </TabsList> */}
          <div className="flex w-full items-center justify-between space-x-2">
            <DateFilter />
            <Button>Download</Button>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
        <div className="flex-1 space-y-4 p-0 pt-0">
          <TopCards  userId={currentUser?.id!} startDate={new Date()} endDate={new Date()}/>
          <div className="grid gap-4 xs:max-w-[300px] md:w-full sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2">
            <Sales/>
            <BookingsSource/>
            <BookingStatus userId={currentUser?.id!} startDate={new Date()} endDate={new Date()} /> 
            <BookingList userId={currentUser?.id!} startDate={new Date()} endDate={new Date()} />
            <Income userId={currentUser?.id!} startDate={new Date()} endDate={new Date()}/>
            <BookingsPerMonth/> 
            <SpotsAndExtras/>
            <Traffic/>
          </div>
        </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
