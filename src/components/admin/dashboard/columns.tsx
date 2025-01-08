"use client"

import { ColumnDef } from "@tanstack/react-table"

export const recentUsersColumns: ColumnDef<{
  id: string
  name: string
  email: string
  joinDate: string
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
  },
]

export const recentWorkspacesColumns: ColumnDef<{
  id: string
  name: string
  owner: string
  createdDate: string
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
  },
]

