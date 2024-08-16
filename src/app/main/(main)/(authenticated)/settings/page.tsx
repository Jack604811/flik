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
        <div className="my-4 mx-6 space-y-6">
          <div className="flex flex-col">
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
