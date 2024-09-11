import { APP_NAME } from "@/app-settings";
import { User } from "lucide-react";
import { getProviders } from "next-auth/react";
import { OauthProvider } from "@/components/auth/oauth-provider";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function Page() {
  const providers = await getProviders();

  return (
    <div className="py-8 px-2  min-h-screen flex flex-col md:justify-center gap-6 ">
      <Card className="md:max-w-md  mx-auto w-full py-4  md:px-8 md:py-12 ">
        <CardContent>
          <div>
            <div className="space-y-2 text-center">
              <div className=" p-2 rounded-full w-auto inline-block bg-primary ">
                <User className="mx-auto text-primary-foreground" size={30} />
              </div>
              <h1 className="font-bold text-xl">Sign In to {APP_NAME} </h1>
            </div>
            <div className="mt-3">
              <MagicLinkForm />
            </div>
            <div className="py-3 flex items-center text-sm before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
              OR
            </div>
            <div className="space-y-2">
              {providers &&
                Object.values(providers)
                  //we don't want to show the email provider as we have a separate form for that
                  .filter((provider) => provider.id !== "email")
                  .map((provider) => (
                    <OauthProvider key={provider.id} provider={provider} />
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
