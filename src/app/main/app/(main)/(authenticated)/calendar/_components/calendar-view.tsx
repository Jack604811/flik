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
import { DayView } from "@/components/events/day-view";
import { WeekView } from "@/components/events/week-view";
import MonthView  from "@/components/events/month-view";

export default function CalendarView({ events, workspaceId }: { events: any; workspaceId: string }) {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEvents, setCurrentEvents] = useState(events);

  const fetchBookings = async () => {
    const updatedBookings = await getBookings(workspaceId);
    setCurrentEvents(updatedBookings);
  };

  const goToPrevious = () => {
    setCurrentDate((prev) =>
      viewMode === "month"
        ? addMonths(prev, -1)
        : viewMode === "week"
        ? addDays(prev, -7)
        : addDays(prev, -1)
    );
  };

  const goToNext = () => {
    setCurrentDate((prev) =>
      viewMode === "month"
        ? addMonths(prev, 1)
        : viewMode === "week"
        ? addDays(prev, 7)
        : addDays(prev, 1)
    );
  };

  const handleDaySelected = (date: Date) => {
    setCurrentDate(date); 
    setViewMode("day"); 
  };

  return (
    <>
      <header className="hidden md:flex flex-row w-full h-16 px-4 items-center justify-between gap-2 border-b">
        <div className="flex w-full items-center gap-2">
           <h1
            className={`text-lg font-semibold whitespace-nowrap ${
                viewMode === "month"
                ? "w-[140px]"
                : viewMode === "week"
                ? "w-[180px]"
                : "w-[180px]" 
            }`}
            >
            {viewMode === "month"
                ? format(currentDate, "MMMM yyyy")
                : viewMode === "week"
                ? `${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d yyyy")}`
                : format(currentDate, "MMMM d yyyy")}
          </h1>
          <Button variant="outline" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "day" | "week" | "month")}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
        <CreateEvent workspaceId={workspaceId} onEventCreated={fetchBookings} />
      </header>

      <div className="flex flex-col h-[95vh] md:flex-row flex-1 overflow-y-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex w-full h-full">
          <ResizablePanel className="hidden md:flex overflow-auto p-4 min-w-[60%] justify-center">
            <div className="w-full">
              <h2 className="text-lg font-semibold">
              {viewMode === "day" && 
                <DayView
                currentDate={currentDate}
                workspaceId={workspaceId}
                onEventCreated={fetchBookings}
                events={currentEvents}
                onDaySelected={handleDaySelected}
            />}
              {viewMode === "week" && 
                <WeekView
                currentDate={currentDate}
                workspaceId={workspaceId}
                onEventCreated={fetchBookings}
                events={currentEvents}
                onDaySelected={handleDaySelected}
            />}
              {viewMode === "month" && (
                <MonthView
                    currentDate={currentDate}
                    workspaceId={workspaceId}
                    onEventCreated={fetchBookings}
                    events={currentEvents}
                    onDaySelected={handleDaySelected}
                />
              )}
              </h2>
              {/* Render the calendar for the selected view */}
            </div>
          </ResizablePanel>
          <ResizableHandle className="hidden md:flex"/>
          <ResizablePanel className="overflow-auto px-4 min-w-[328px] md:max-w-[328px]">
            <ListView
              bookings={currentEvents.filter((booking: any) => {
                if (viewMode === "day") {
                  return (
                    booking.startDate >= new Date(currentDate.setHours(0, 0, 0, 0)) &&
                    booking.startDate < new Date(currentDate.setHours(23, 59, 59, 999))
                  );
                } else if (viewMode === "week") {
                  const startOfWeekDate = startOfWeek(currentDate);
                  const endOfWeekDate = endOfWeek(currentDate);
                  return (
                    booking.startDate >= startOfWeekDate && booking.startDate <= endOfWeekDate
                  );
                } else {
                  const startOfMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                  const endOfMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                  return (
                    booking.startDate >= startOfMonthDate && booking.startDate <= endOfMonthDate
                  );
                }
              })}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
