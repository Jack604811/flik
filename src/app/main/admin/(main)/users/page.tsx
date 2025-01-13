
import UserTable from "./table";
import { UserCheck, UserPlus, Users, UserX } from "lucide-react";
import { getUsersSummary } from "@/server/actions/admin.action";
import StatsCard from "@/components/status-card";

export default async function Page() {
  const data = await getUsersSummary();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={data.length.toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Users"
          value={data.filter((user) => user.emailVerified).length.toString()}
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Inactive Users"
          value={data.filter((user) => !user.emailVerified).length.toString()}
          icon={<UserX className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="New Users (Last 30 days)"
          value={data.filter((user) => new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length.toString()}
          icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <UserTable users={data} />
    </div>
  );
}


