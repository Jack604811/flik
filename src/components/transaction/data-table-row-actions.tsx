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

import { schema, Schema } from "./schema";
import ConfirmModal from "@/components/main/confirm-modal";
import { useRef } from "react";
import { toast } from "sonner";
import { deleteTransaction } from "@/server/actions/booking.action";
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const deleteRef = useRef<any>();
  const transactionId = row.getValue("id") as string;
  // const booking = row.getValue("booking")! as Schema["booking"];
  // const customer = booking!.customer!;

  const onDelete = () => {
    const deleted = deleteTransaction(transactionId);
    toast.promise(deleted, {
      loading: "Deleting transaction, please wait...",
      success: () => {
        router.refresh()
        return "Transaction deleted successfully!"
      },
      error: "There was an error deleting Transaction!",
      // description: `Transaction ${transactionId} by ${customer?.name}`,
      duration: 3000,

    })
  } 

  return (
    <>
      <ConfirmModal onConfirm={onDelete} warningText={`Do you want to DELETE this transaction? This action cannot be undone.`}>
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
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => deleteRef.current?.click()}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
