"use client"
import { getSiteSpotData } from "@/server/actions/domain.action";
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { statuses } from "@/schemas/booking.schema" 
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableDateFilter } from "./data-table-date-filter"
import Link from "next/link"
import { PlusCircle } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  
  

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search booking..."
          value={(table.getColumn("guest")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("guest")?.setFilterValue(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[250px]"
        />
        
        {table.getColumn("startDate") && (
          <DataTableDateFilter
            column={table.getColumn("startDate")}
            title="Start Date"
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-2 lg:px-3"
          >
            <span className="sr-only md:not-sr-only md:whitespace-nowrap">
              Reset
            </span>
            <Cross2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-row gap-4">
        
      <Link href="/extras/new">
          <Button size="sm" className="h-10 gap-1 xs:rounded-full lg:rounded-md">
            <PlusCircle className="h-5 w-5 md:h-3.5 md:w-3.5" />
            <span className="sr-only md:not-sr-only md:whitespace-nowrap">
              New Booking
            </span>
          </Button>
        </Link>

      <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}