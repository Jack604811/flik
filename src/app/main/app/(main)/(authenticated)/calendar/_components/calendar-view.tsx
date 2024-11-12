"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { format, addDays, addMonths, startOfWeek, endOfWeek } from "date-fns";
import ListView from "./list-view";
import { CreateEvent } from "@/components/forms/create-event";
import { getBookings } from "@/server/actions/booking.action";

export default function CalendarView({ bookings, workspaceId }: { bookings: any; workspaceId: string }) {
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentBookings, setCurrentBookings] = useState(bookings);

  const fetchBookings = async () => {
    const updatedBookings = await getBookings(workspaceId);
    setCurrentBookings(updatedBookings);
  };

  const goToPrevious = () => {
    setCurrentDate((prev) =>
      viewMode === "month" ? addMonths(prev, -1) : addDays(prev, -7)
    );
  };

  const goToNext = () => {
    setCurrentDate((prev) =>
      viewMode === "month" ? addMonths(prev, 1) : addDays(prev, 7)
    );
  };

  return (
    <>
      <header className="hidden md:flex flex-row w-full h-16 px-4 items-center justify-between gap-2 border-b">
        <div className="flex w-full items-center gap-2">
          <h1 className="text-lg font-semibold">
            {viewMode === "month"
              ? format(currentDate, "MMMM yyyy")
              : `Week of ${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`}
          </h1>
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "week" | "month")}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
        <CreateEvent workspaceId={workspaceId} onEventCreated={fetchBookings} />
      </header>

      <div className="flex flex-col h-[95vh] md:flex-row flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex w-full h-full">
          <ResizablePanel className="hidden md:flex overflow-auto p-4 min-w-[60%]">
            <div>
              <h2 className="text-lg font-semibold">{viewMode === "month" ? "Month View: Calendar" : "Week View: Calendar"}</h2>
              {/* Render the calendar for the selected view */}
            </div>
          </ResizablePanel>
          <ResizableHandle className="hidden md:flex"/>
          <ResizablePanel className="overflow-auto px-4 min-w-[328px] md:max-w-[328px]">
            <ListView bookings={currentBookings} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
