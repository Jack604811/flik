"use client";
import { ColumnDef } from "@tanstack/react-table";
import { statuses } from "@/schemas/booking.schema";
import { Booking } from "@/schemas/booking.schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import moment from "moment";
import { Calendar, ExternalLink } from "lucide-react";
import { BookingDetailButton } from "@/hooks/use-booking-detail";
import { Checkbox } from "@/components/ui/checkbox";


export const columns: ColumnDef<Booking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] ml-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "guest",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      return (
        <BookingDetailButton booking={row.original}>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.guest?.name}</span>
          <span className="text-muted-foreground">
            {row.original.guest?.email}
          </span>
        </div>
        </BookingDetailButton>
      );
    },
    filterFn: (row, id, value) => {
      const guest = row.getValue("guest") as Booking["guest"];
      const bookingId = row.getValue("id") as string;
      return (
        guest?.email?.toLowerCase().includes(value) ||
        guest?.name?.toLowerCase().includes(value) ||
        bookingId.includes(value)
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      return (
        <BookingDetailButton booking={row.original}>
        <div className=" flex-col text-start items-center">
          <div className="flex flex-row items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col gap-0">
            <div>
              {moment(row.getValue("startDate")).format("DD MMM YYYY hh:mm A")}
            </div>
          </div>
          </div>
        </div>
        </BookingDetailButton>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length !== 2) {
        return true; // Don't filter if the filter value is not set or invalid
      }
      const start = filterValue[0].getTime();
      const end = filterValue[1].getTime();
      const rowDate = new Date(row.original.startDate).getTime();
      return rowDate >= start && rowDate <= end;
    },
    enableSorting: false,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      return (
        <BookingDetailButton booking={row.original}>
        <div className=" flex-col text-start items-center">
          <div className="flex flex-row items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col gap-0">
            <div>
              {moment(row.getValue("endDate")).format("DD MMM YYYY hh:mm A")}
            </div>
          </div>
          </div>
        </div>
        </BookingDetailButton>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "spot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Spot" />
    ),
    cell: ({ row }) => {
      return (
        <BookingDetailButton booking={row.original}>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.spot?.name}</span>
          <span className="text-muted-foreground">
          Outstandig: ${new Intl.NumberFormat('de-DE').format(row.original.subtotal).replace(',', '.')}
          </span>
        </div>
        </BookingDetailButton>
      );
    },
    enableSorting: false,
  },
  
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <BookingDetailButton booking={row.original}>
        <div className="flex items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
        </BookingDetailButton>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  /*{
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Added Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {moment(row.getValue("createdAt")).format("DD-MMMM-YYYY hh:mm A")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value
        ? moment(row.getValue(id)).isBetween(value?.[0], value?.[1])
        : true;
    },
    enableSorting: false,
  },*/
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];