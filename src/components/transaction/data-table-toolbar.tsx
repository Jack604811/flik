"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { statuses } from "./schema"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableDateFilter } from "./data-table-date-filter"
import AddTransactionButton from "@/components/forms/AddTransactionButton"
import { Span } from "next/dist/trace"
import { DataTableSpotFilter } from "./data-table-spot-filter"
import { useState } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [spots, setSpots] = useState<{ id: string; name: string }[]>([]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter transactions..."
          value={(table.getColumn("customer")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customer")?.setFilterValue(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[250px]"
        />
        
        {table.getColumn("createdAt") && (
          <DataTableDateFilter
            column={table.getColumn("createdAt")}
            title="Booking Date"
          />
        )}
        {table.getColumn("spot") && (
          <DataTableSpotFilter
            column={table.getColumn("spot")}
            title="Spot"
            spots={spots}
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
      <DataTableViewOptions table={table} />

      {/* <div className="ml-2">
          <AddTransactionButton>
            <Button>Add Transaction</Button>
          </AddTransactionButton>
      </div> */}
    </div>
  )
}
