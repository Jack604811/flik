"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import  CustomFieldForm  from "@/components/forms/CustomFieldForm"
import { Credenza, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle } from '@/components/ui/credenza'

interface CustomField {
  id: string
  name: string
  conditional: 'Applied' | 'Not Applied'
  dateCreated: string
}

const customFields: CustomField[] = [
  { id: '1', name: 'Customer Type', conditional: 'Applied', dateCreated: '2023-06-01' },
  { id: '2', name: 'Purchase Frequency', conditional: 'Not Applied', dateCreated: '2023-06-15' },
  { id: '3', name: 'Loyalty Score', conditional: 'Applied', dateCreated: '2023-07-01' },
]

export default function CustomFields() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<CustomField | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleOpenDialog = (field: CustomField) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedField(null)
  }

  const handleEdit = (field: CustomField) => {
    handleOpenDialog(field)
  }

  const handleDelete = (id: string) => {
    console.log(`Delete field ${id}`)
    // Implement your logic to delete the field
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Save changes', selectedField)
    // Implement your logic to save the changes
    handleCloseDialog()
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 max-w-6xl py-6">
      <div className="w-full xl:w-1/3">
        <h2 className="text-xl font-semibold mb-2">Custom Fields</h2>
        <p className="text-sm text-muted-foreground">Manage your app's custom fields</p>
      </div>
      <div className="w-full xl:w-2/3">
        <div className="bg-transparent rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-900 dark:text-white">Field Name</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Conditionals</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Date Created</TableHead>
                <TableHead className="text-gray-900 dark:text-white sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customFields.map((field) => (
                <TableRow 
                  key={field.id} 
                  className="border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleOpenDialog(field)}
                >
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      field.conditional === 'Applied' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {field.conditional}
                    </span>
                  </TableCell>
                  <TableCell>{field.dateCreated}</TableCell>
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
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(field)
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(field.id)
                        }}>
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

      <Credenza open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      
        <CredenzaContent className="p-6">
        <CredenzaHeader className="space-y-0">
            <CredenzaTitle className="text-xl font-bold">{isCreating ? 'Create New Custom Field' : 'Edit Custom Field'}</CredenzaTitle>
            <CredenzaDescription className="text-muted-foreground">
              {isCreating ? 'Add a new custom field to your app.' : 'Make changes to your custom field here.'} Click save when you're done.
            </CredenzaDescription>
          </CredenzaHeader>
          <CustomFieldForm/>
        </CredenzaContent>
      </Credenza>
    </div>
  )
}