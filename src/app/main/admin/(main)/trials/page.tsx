"use client"

import { useState } from "react"
import { DataTable } from "@/components/admin/dashboard/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const data = [
  {
    id: "1",
    workspace: "Acme Corp",
    owner: "John Doe",
    trialStart: "2023-05-01",
    trialEnd: "2023-05-31",
    status: "active",
  },
  {
    id: "2",
    workspace: "Startup Inc",
    owner: "Jane Smith",
    trialStart: "2023-06-01",
    trialEnd: "2023-06-15",
    status: "expired",
  },
  // Add more dummy data as needed
]

export default function TrialsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Trials & Access Management</h1>
      <div className="mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Grant Free Trial</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Grant Free Trial</DialogTitle>
              <DialogDescription>
                Enter the workspace details to grant a free trial or extend an existing one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="workspace" className="text-right">
                  Workspace
                </Label>
                <Input id="workspace" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (days)
                </Label>
                <Input id="duration" className="col-span-3" type="number" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Grant Trial</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  )
}

