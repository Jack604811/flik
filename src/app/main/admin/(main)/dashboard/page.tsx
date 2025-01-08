import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Clock } from 'lucide-react'
import { DataTable } from "@/components/admin/dashboard/data-table"
import { recentUsersColumns, recentWorkspacesColumns } from "@/components/admin/dashboard/columns"

const recentUsers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", joinDate: "2023-06-01" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", joinDate: "2023-06-02" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", joinDate: "2023-06-03" },
]

const recentWorkspaces = [
  { id: "1", name: "Project X", owner: "Alice Johnson", createdDate: "2023-06-01" },
  { id: "2", name: "Startup Y", owner: "Bob Smith", createdDate: "2023-06-02" },
  { id: "3", name: "Team Z", owner: "Charlie Brown", createdDate: "2023-06-03" },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workspaces</CardTitle>
            <Briefcase size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Clock size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
          <DataTable columns={recentUsersColumns} data={recentUsers} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Workspaces</h2>
          <DataTable columns={recentWorkspacesColumns} data={recentWorkspaces} />
        </div>
      </div>
    </div>
  )
}

