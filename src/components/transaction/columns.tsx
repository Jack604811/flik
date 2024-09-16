"use client";

import { ColumnDef } from "@tanstack/react-table";
import { statuses, Schema } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import moment from "moment";
import { BookingDetailButton } from "@/hooks/use-booking-detail";
import AddTransactionButton from "@/components/forms/AddTransactionButton";
import { Booking } from "@/schemas/booking.schema";

export const columns: ColumnDef<Schema>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const customer = (row.original.booking as Booking).customer;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{customer?.name}</span>
          <span className="text-muted-foreground">{customer?.email}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const customer = (row.original.booking as Booking).customer;
      value = value.toLowerCase();
      return (
        customer?.email?.toLowerCase().includes(value) ||
        customer?.name?.toLowerCase().includes(value) ||
        (row.original.id as string).includes(value) ||
        (row.original.booking as Booking).spot.name.includes(value)
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>${new Intl.NumberFormat('de-DE').format(row.getValue("amount")).replace(',', '.')}</span>
        </div>
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
      const booking = row.original.booking as Booking
      return (
        <BookingDetailButton booking={booking}>
          <div className="flex flex-col p-0 text-left text-sky-600">
            <span>{booking?.spot.name}</span>
            <span className="text-muted-foreground">
            Outstandig: ${new Intl.NumberFormat('de-DE').format(booking.totalPrice).replace(',', '.')}
            </span>
          </div>
        </BookingDetailButton>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue("paymentMethod")}</span>
        </div>
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
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {moment(row.getValue("paymentDate")).format("MM/DD/YYYY hh:mm A")}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction ID" />
    ),
    cell: ({ row, table }) => {
      // const transaction = {
      //   id: row.original.id,
      //   status: row.original.status,
      //   amount: row.original.amount.toString(),
      //   paymentType: row.original.paymentType,
      //   date: row.original.paymentDate,
      //   description: row.original.description,
      // };

      // return (
      //   <AddTransactionButton
      //     bookingId={row.original.booking.id}
      //     defaultTransaction={transaction}
      //     callback={() => table.reset()}
      //   >
      //     <div className="w-[80px] truncate text-sky-600">
      //       {row.getValue("id")}
      //     </div>
      //   </AddTransactionButton>
      // );

      return <div className="">{row.getValue("id")}</div>;
    },
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      const rowId = row.original.id as string;
      return rowId.includes(value);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: false,
    enableHiding: true,
    
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];