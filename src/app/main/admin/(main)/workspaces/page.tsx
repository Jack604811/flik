
import WorkspaceTable from "./table";
import { Briefcase, CheckCircle, Clock, UserCheck, UserPlus, Users, UserX } from "lucide-react";
import { getWorkspaceSummary } from "@/server/actions/admin.action";
import StatsCard from "@/components/status-card";
import moment from "moment";

export default async function Page() {
  const data = await getWorkspaceSummary();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workspaces</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Workspaces"
          value={data.length.toString()}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Members"
          value={data.reduce((acc, workspace) => acc + workspace.teamMembers.length, 0).toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Average Age"
          value={(
            data.reduce((acc, workspace) => acc + moment().diff(moment(workspace.createdAt), 'days'), 0) / data.length
          ).toFixed(0) + ' days'}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Workspaces"
          value={data.length.toString()}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <WorkspaceTable workspaces={data} />
    </div>
  );
}


