"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Booking } from "@/schemas/booking.schema";
import ConfirmModal from "@/components/confirm-modal";
import { useRef } from "react";
import { toast } from "sonner";
import { deleteBooking } from "@/server/actions/booking.action";
import { useRouter } from "next/navigation";
import { BookingDetailButton } from "@/hooks/use-booking-detail";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const deleteRef = useRef<any>();
  const bookingId = row.getValue("id") as string;
  const guestName = row.getValue("guest") as Booking["guest"];

  const onDelete = () => {
    const deleted = deleteBooking(bookingId);
    toast.promise(deleted, {
      loading: "Deleting booking, please wait...",
      success: () => {
        router.refresh();
        return "Booking deleted successfully!";
      },
      error: "There was an error deleting booking!",
      description: `Booking ${bookingId} by ${guestName?.name}`,
      duration: 3000,
    });
  };

  return (
    <>
      <ConfirmModal
        onConfirm={onDelete}
        warningText={`Do you want to DELETE the booking by ${guestName?.name}? This action cannot be undone.`}
      >
        <div ref={deleteRef} className="hidden">
          Delete
        </div>
      </ConfirmModal>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem className="h-8"> <BookingDetailButton booking={row.original as Booking}>Edit</BookingDetailButton></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => deleteRef.current?.click()}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}