import { getCurrentWorkspace } from "@/server/actions/user.action";
import { getExtrasByWorkspace } from "@/server/actions/extra.action";
import ExtrasList from "@/components/extras/extras-list";

export default async function Page() {
  const currentWorkspace = await getCurrentWorkspace();
  const extras = await getExtrasByWorkspace({ workspaceId: currentWorkspace!.id });

  return <ExtrasList extras={extras} />;
}
