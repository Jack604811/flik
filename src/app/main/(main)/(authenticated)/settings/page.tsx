import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUser } from "@/server/actions/user.action";
import { getCurrentUser } from "@/server/auth";
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
  const currentUser = await getCurrentUser();
  const user = await getUser(currentUser!.id);

  return (
    <div className="flex-1 pt-4 space-y-8 gap-8 p-4 md:p-8 md:pt-6">
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
        <TabsContent 
        value="main" 
        >
          <MainSettings user={user as any} />
          <SiteSettings
              subdomain={user!.subdomain ?? ""}
              customDomain={user!.customDomain ?? ""}
              userId={currentUser!.id}
              favicon={user?.favicon}
            />
        </TabsContent>
        <TabsContent value="team">
          <TeamManagement/>
        </TabsContent>
        <TabsContent value="integrations">
          <Integrations/>
        </TabsContent>
        <TabsContent value="fields">
          <CustomFields/>
        </TabsContent>
        <TabsContent value="billing">
          <Billing/>
        </TabsContent>
      </Tabs>
     
    </div>
  );
}
