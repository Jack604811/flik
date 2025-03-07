"use client";

import React, { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExtra } from "@/server/actions/extra.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmModal from "@/components/main/confirm-modal";
function ExtraAction({ id }: { id: string }) {
    const router = useRouter();
    const deleteRef = useRef<any>();

    const onDelete = () => {
        const deleted = deleteExtra(id);
        toast.promise(deleted, {
          loading: "Deleting extra, please wait...",
          success: () => {
            router.refresh();
            return "Extra deleted successfully!";
          },
          error: "There was an error deleting extra!",
          duration: 3000,
        });
      };
  return (
    <>
    <ConfirmModal
        onConfirm={onDelete}
        warningText={`Do you want to DELETE the selected extra? This action cannot be undone.`}
      >
        <div ref={deleteRef} className="hidden">
          Delete
        </div>
      </ConfirmModal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link href={`/extras/${id}`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => deleteRef.current?.click()}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default ExtraAction;