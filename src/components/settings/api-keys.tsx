"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  deleteApiKey,
  getApiKeys,
} from "@/server/actions/api-key.action";
import { useQuery } from "@tanstack/react-query";
import useConfirm from "@/hooks/use-confirm";
import { toast } from "sonner";
import APIKeyForm from "@/components/forms/api-key-form";
import { Badge } from "@/components/ui/badge";

export default function APIKeys({ workspaceId }: { workspaceId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);


  const [DeleteConfirm, confirmDelete] = useConfirm(
    "Delete Custom Field",
    "Are you sure you want to delete this API Key? This action cannot be undone."
  );
  
  const {
    data: apiKeys,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["api-keys", workspaceId],
    queryFn: () => getApiKeys(workspaceId),
    refetchOnMount: false,
  });

  const [searchQuery, setSearchQuery] = useState("");



  const handleDelete = async (id: string) => {
    const confirm = await confirmDelete();
    if (confirm) {
      const promise = deleteApiKey(id);
      toast.promise(promise, {
        loading: "Deleting API Key...",
        success: () => {
          refetch();
          return "API Key deleted successfully";
        },
        error: "Error deleting API Key",
      });
    }
  };

  const filteredAPIKeys = apiKeys?.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 max-w-6xl py-6">
      <DeleteConfirm />
      <div className="w-full xl:w-1/3">
        <h2 className="text-xl font-semibold mb-2">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Manage your API Keys generated for your workspace.  API Keys are used to authenticate with the API.
        </p>
      </div>
      <div className="w-full xl:w-2/3">
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-4 py-2 w-64"
          />
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-0 md:mr-2 h-4 w-4" />{" "}
            <span className="hidden md:block">Create API Key</span>
          </Button>

          <APIKeyForm
            workspaceId={workspaceId}
            editingField={undefined}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </div>
        <div className="w-full">
          <div className="bg-transparent rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-900 dark:text-white">
                      Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white">
                      Token
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white">
                      Permission
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white">
                      Last Used
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white">
                      Date Created
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white sr-only"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700"
                      >
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredAPIKeys && filteredAPIKeys.length > 0 ? (
                    filteredAPIKeys.map((apiKey) => (
                      <TableRow
                        key={apiKey.id}
                        className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell className="font-medium">
                          {apiKey.name}
                        </TableCell>
                        <TableCell className="truncate">
                          <Badge className="w-24 bg-slate-900 text-white hover:bg-slate-950">
                            <p className="truncate"> {apiKey.key} </p>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {apiKey.permission.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          {apiKey.lastUsedAt?.toLocaleDateString() ?? "N/A"}
                        </TableCell>
                        <TableCell>
                          {apiKey.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(apiKey.id);
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
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 gap-24">
                        <p className="text-muted-foreground mb-6">
                          No API Keys found. Create your first API Key to get started.
                        </p>
                        <Button onClick={() => setDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create API Key
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
