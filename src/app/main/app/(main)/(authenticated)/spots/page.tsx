import { getCurrentWorkspace } from "@/server/actions/user.action";
import { getSpotsByWorkspace } from "@/server/actions/spot.action";
import SpotList from "@/components/spots/spots-list";



export default async function Page() {
  const currentWorkspace = await getCurrentWorkspace();
  const spots = await getSpotsByWorkspace({ workspaceId: currentWorkspace!.id });

  return <SpotList initialSpots={spots} />;
}
