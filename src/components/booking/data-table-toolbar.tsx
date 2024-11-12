"use client";
import { CrossIcon, Filter, Bell, Dot } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableDateFilter } from "./data-table-date-filter";
import { DataTableSpotFilter } from "./data-table-spot-filter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { statuses } from "@/schemas/booking.schema";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.some((filter) => filter.id !== "startDate");
  const [spots, setSpots] = useState<{ id: string; name: string }[]>([]);

  return (
    <div className="flex flex-col space-y-4">
      {/* First Column: Calendar */}
      <div className="w-full">
        {table.getColumn("startDate") && (
          <DataTableDateFilter
            column={table.getColumn("startDate")}
            title="Start Date"
          />
        )}
      </div>

      {/* Second Row: Search, Popover for Filters, and New Booking Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 md:gap-0">
        {/* Search Bar */}
        <Input
          placeholder="Search booking..."
          value={(table.getColumn("customer")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("customer")?.setFilterValue(event.target.value)}
          className="h-10 w-[80vh] max-w-[200px] sm:max-w-[350px]"
        />

        {/* Popover with Spot, Status, and Other Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 sm:flex items-center gap- lg:hidden ">
              <span className="hidden md:inline">Filters</span>
              <Filter className="h-4 w-4 md:hidden" />
              {/* {isFiltered && <Dot className="h-4 w-4 text-red-500" />}  */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col mr-6 md:mr-8 min-w-[220px] w-auto p-4 space-y-4 bg-background">
            {/* Spot Filter */}
            {table.getColumn("spot") && (
              <DataTableSpotFilter
                column={table.getColumn("spot")}
                title="Spot"
                spots={spots}
              />
            )}

            {/* Status Filter */}
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={statuses}
              />
            )}

            {/* Reset Button */}
            {/* {isFiltered && (
              <Button
                variant="outline"
                onClick={() => table.resetColumnFilters()}
                className="h-10 px-2 lg:px-3"
              >
                <span className="sr-only md:not-sr-only md:whitespace-nowrap">
                  Reset
                </span>
                <CrossIcon className="h-4 w-4" />
              </Button>
            )} */}
          </PopoverContent>
        </Popover>

        {/* New Booking Button */}
        {/* <div className="flex justify-end w-auto">
          <Link href="/bookings">
            <Button size="sm" className="h-10 gap-1 xs:rounded-full lg:rounded-md">
              <Plus className="h-5 w-5 md:h-3.5 md:w-3.5" />
              <span className="hidden md:inline">New Event</span>
            </Button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
