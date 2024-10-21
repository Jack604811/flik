// app/settings/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import SiteSettings from "./site-settings";
import MainSettings from "./main-settings";
import { Metadata } from "next";
import TeamManagement from "./team-management";
import Billing from "./billing";
import CustomFields from "./custom-fields";
import Integrations from "./integrations/page";

export const metadata: Metadata = {
  title: "Settings",
  description: "Setup your place from here",
};

export default async function Page() {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return (
      <div className="flex-1 pt-4 space-y-8 gap-8 p-6 md:p-8 md:pt-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">No Workspace Selected</h2>
          <p className="text-muted-foreground">
            Please select a workspace to view settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-4 space-y-8 gap-8 p-6 md:p-8 md:pt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Setup your business like a boss.
        </p>
      </div>
      <Tabs defaultValue="main">
        <div className="overflow-x-auto space-y-8">
          <TabsList className="min-w-full md:min-w-[300px]">
            <TabsTrigger value="main">Main</TabsTrigger>
            <TabsTrigger value="site">Website</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="main">
          <MainSettings workspace={currentWorkspace} />
        </TabsContent>
        <TabsContent value="site">
          <SiteSettings
            subdomain={currentWorkspace.subdomain ?? ""}
            customDomain={currentWorkspace.customDomain ?? ""}
            workspaceId={currentWorkspace.id}
            favicon={currentWorkspace.favicon}
          />
        </TabsContent>
        <TabsContent value="team">
          <TeamManagement workspaceId={currentWorkspace.id} />
        </TabsContent>
        <TabsContent value="integrations">
          <Integrations />
        </TabsContent>
        <TabsContent value="fields">
          <CustomFields workspaceId={currentWorkspace.id} />
        </TabsContent>
        <TabsContent value="billing">
          <Billing />
        </TabsContent>
      </Tabs>
    </div>
  );
}
