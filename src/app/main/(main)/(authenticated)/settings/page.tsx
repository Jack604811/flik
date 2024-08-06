import { getUser } from "@/server/actions/user.action";
import { getCurrentUser } from "@/server/auth";
import SiteSettings from "./SiteSettings";
import MainSettings from "./MainSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Setup your place from here",
};

export default async function Page() {
  const currentUser = await getCurrentUser();
  const user = await getUser(currentUser!.id);

  return (
    <div className="h-screen max-w-[800px] my-4">
      <section>
        <div className="mt-4 mx-auto px-6 md:px-8 space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <div className="flex flex-col space-y-6">
            <MainSettings user={user as any} />

            <SiteSettings
              subdomain={user!.subdomain ?? ""}
              customDomain={user!.customDomain ?? ""}
              userId={currentUser!.id}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
