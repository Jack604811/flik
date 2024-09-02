import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUser } from "@/server/actions/user.action";
import { getCurrentUser } from "@/server/auth";
import SiteSettings from "./site-settings";
import MainSettings from "./main-settings";
import { Metadata } from "next";
import TeamManagement from "./team-management";
import Billing from "./billing";
import CustomFields from "./custom-fields";

export const metadata: Metadata = {
  title: "Settings",
  description: "Setup your place from here",
};

export default async function Page() {
  const currentUser = await getCurrentUser();
  const user = await getUser(currentUser!.id);

  return (
    <div className="flex-1 pt-4 space-y-8 gap-8 p-6 md:p-8 md:pt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Setup your business like a boss.
        </p>
      </div>
      <Tabs defaultValue="main">
        <TabsList>
          <TabsTrigger value="main">Main</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
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
