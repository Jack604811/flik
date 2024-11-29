"use client";

import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking } from "@/schemas/booking.schema";
import ConfirmModal from "@/components/main/confirm-modal";
import { useRef } from "react";
import { toast } from "sonner";
import { deleteBooking } from "@/server/actions/booking.action";
import { BookingDetailButton } from "@/hooks/use-booking-detail";
import { Edit, Trash2, } from "lucide-react";

interface RowActionsProps<TData> {
  booking: Booking;
  refreshEvents: () => Promise<void>;
}

export function RowActions<TData>({
  booking,
  refreshEvents,
}: RowActionsProps<TData>) {
  const deleteRef = useRef<HTMLDivElement>(null);

  const onDelete = () => {
    const deleted = deleteBooking(booking.id);
    toast.promise(deleted, {
      loading: "Deleting booking, please wait...",
      success: async () => {
        await refreshEvents();
        return "Booking deleted successfully!";
      },
      error: "There was an error deleting booking!",
      description: (
        <>
          Booking by <span className="font-bold text-red-500">{booking.customer.name}</span>
        </>
      ),
      duration: 3000,
    });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()} 
      style={{ cursor: "pointer" }} 
    >
      <ConfirmModal
        onConfirm={onDelete}
        warningText={
          <>
            Do you want to DELETE the booking by{" "}
            <span className="font-bold text-red-500">{booking.customer.name}</span>? This action cannot be undone.
          </>
        }
        confirmButtonText="Delete Forever"
        confirmButtonClassName="bg-red-500 text-white hover:bg-red-600"
        cancelButtonText="Cancel"
        cancelButtonClassName="border-gray-300 text-gray-500 hover:bg-gray-100"
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
            <DotsVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>
            <BookingDetailButton booking={booking}>
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4" /> 
                Edit
              </div>
            </BookingDetailButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation(); 
              deleteRef.current?.click();
            }}
            className="cursor-pointer bg-transparent hover:bg-red-100 focus:bg-red-50 active:bg-red-50 hover:text-red-500 transition-all"
          >
            <div className="flex items-center gap-2">
              <Trash2  className="h-4 w-4 text-red-500" /> 
              <span className="text-red-500">Delete</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
