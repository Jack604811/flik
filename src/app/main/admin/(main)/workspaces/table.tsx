"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

type Props = {
  workspaces: {
    id: string;
    siteName: string | null;
    owner: { name: string | null; image: string | null };
    createdAt: Date;
    teamMembers: { userId: string | null }[];

  }[];
};

export default function WorkspaceTable({ workspaces }: Props) {
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedWorkspaces = [...workspaces].sort((a, b) => {
    if (sortColumn) {
      if (sortColumn in a && sortColumn in b) {
        if (sortColumn in a && sortColumn in b) {
          const aValue = a[sortColumn as keyof typeof a];
          const bValue = b[sortColumn as keyof typeof b];
          if (aValue != null && bValue != null) {
            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          }
        }
      }
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            onClick={() => handleSort("siteName")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead
            onClick={() => handleSort("owner")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              Owner <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead
            onClick={() => handleSort("createdAt")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              Created At <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer"
          >
            <div className="flex items-center">
              Members
            </div>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedWorkspaces.map((workspace) => (
          <TableRow key={workspace.id}>
            <TableCell className="font-medium">{workspace.siteName}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={workspace.owner.image ?? ""}
                    alt={workspace.owner.name ?? ""}
                  />
                  <AvatarFallback>
                    {workspace.owner.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {workspace.owner.name}
              </div>
            </TableCell>
            <TableCell>
              {moment(workspace.createdAt).format("MMM D,YYYY")}
            </TableCell>
            <TableCell>{workspace.teamMembers.length.toString()}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Edit workspace</DropdownMenuItem>
                  <DropdownMenuItem>Manage members</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Delete workspace</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
