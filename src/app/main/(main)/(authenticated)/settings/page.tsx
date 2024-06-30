import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSubdomain, getUser } from "@/server/actions/user.action";
import { getCurrentUser } from "@/server/auth";
import Subdomain from "./Subdomain";
import { Label } from "@/components/ui/label";
import SiteSettings from "./SiteSettings";

export default async function Page() {
  const currentUser = await getCurrentUser();
  const user = await getUser(currentUser!.id);

  return (
    <div className="h-screen max-w-[800px] my-4">
      <section>
        <div className="mt-4 mx-auto px-6 md:px-8 space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <div className="flex flex-col space-y-6">
            <SiteSettings user={user as any} />
            <Subdomain subdomain={user!.subdomain ?? ""} userId={currentUser!.id} />
            {/*<Card className="w-full px-5">
              <CardHeader>
                <h2 className="text-2xl">Custom Domain</h2>
                <CardDescription>
                  The custom domain for your spots site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex columns-2 items-center justify-center">
                  <Input placeholder="yourdomain.com" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground font-bold">
                  Please enter a valid domain
                </p>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>*/}

          </div>
        </div>
      </section>
    </div>
  );
}
