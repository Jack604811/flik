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
import CustomFieldForm from "@/components/forms/custom-field-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  deleteCustomField,
  getCustomFields,
} from "@/server/actions/custom-field.action";
import { CustomField } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import useConfirm from "@/hooks/use-confirm";
import { toast } from "sonner";
import { set } from "lodash";

export default function CustomFields({ workspaceId }: { workspaceId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | undefined>();

  const [DeleteConfirm, confirmDelete] = useConfirm(
    "Delete Custom Field",
    "Are you sure you want to delete this custom field? This action cannot be undone."
  );
  const {
    data: customFields,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["customFields", workspaceId],
    queryFn: () => getCustomFields(workspaceId),
    refetchOnMount: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirm = await confirmDelete();
    if (confirm) {
      // delete the custom field
      const promise = deleteCustomField(id);
      toast.promise(promise, {
        loading: "Deleting custom field...",
        success: () => {
          refetch();
          return "Custom field deleted successfully";
        },
        error: "Error deleting custom field",
      });
    }
  };

  const filteredFields = customFields?.filter((field) =>
    field.fieldName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 max-w-6xl py-6">
      <DeleteConfirm />
      <div className="w-full xl:w-1/3">
        <h2 className="text-xl font-semibold mb-2">Custom Fields</h2>
        <p className="text-sm text-muted-foreground">
          Manage your custom fields
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
          {/* The CustomFieldForm already has the button to trigger */}
          <Button
            onClick={() => {
              setEditingField(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-0 md:mr-2 h-4 w-4" />{" "}
            <span className="hidden md:block">New Field</span>
          </Button>

          <CustomFieldForm
            workspaceId={workspaceId}
            editingField={editingField}
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
                      Field Name
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white">
                      Type
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white">
                      Created By
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white">
                      Date Created
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-white sr-only">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
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
                    : filteredFields?.map((field) => (
                        <TableRow
                          key={field.id}
                          className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell className="font-medium">
                            {field.fieldName}
                          </TableCell>
                          <TableCell>{field.fieldType}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {field.createdBy.name}
                              </span>
                              <span className="text-muted-foreground">
                                {field.createdBy.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {field.createdAt.toLocaleDateString()}
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
                                    handleEdit(field);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(field.id);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
