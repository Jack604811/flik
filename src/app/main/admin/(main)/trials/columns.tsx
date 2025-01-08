"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Trial = {
  id: string
  workspace: string
  owner: string
  trialStart: string
  trialEnd: string
  status: "active" | "expired"
}

export const columns: ColumnDef<Trial>[] = [
  {
    accessorKey: "workspace",
    header: "Workspace",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "trialStart",
    header: "Trial Start",
  },
  {
    accessorKey: "trialEnd",
    header: "Trial End",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : "destructive"}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trial = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(trial.id)}>
              Copy trial ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View trial details</DropdownMenuItem>
            <DropdownMenuItem>Extend trial</DropdownMenuItem>
            <DropdownMenuItem>Convert to lifetime access</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

