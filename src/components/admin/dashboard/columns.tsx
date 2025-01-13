"use client"

import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"

export const recentUsersColumns: ColumnDef<{
  id: string
  name: string | null
  email: string | null
  createdAt: Date
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
    accessorKey: "createdAt",
    header: "Join Date",
    cell: (props) => moment(props.row.original.createdAt).format("MMM DD, YYYY"),
  },
]

export const recentWorkspacesColumns: ColumnDef<{
  id: string
  siteName: string | null
  owner: { name: string | null; image: string | null }
  createdAt: Date
}>[] = [
  {
    accessorKey: "siteName",
    header: "Name",
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: (props) => props.row.original.owner.name,
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: (props) => moment(props.row.original.createdAt).format("MMM DD, YYYY"),
  },
]

