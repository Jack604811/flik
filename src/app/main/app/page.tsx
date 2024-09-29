import { APP_NAME, AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { User } from "lucide-react";
import { OauthProvider } from "@/components/auth/oauth-provider";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Card, CardContent } from "@/components/ui/card";
import { auth, providers } from "@/server/auth";
import { Provider } from "next-auth/providers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  
  const authProviders = providers.map(p => ({
    name: p.name
  }))
  if (session?.user) {
    return redirect(AFTER_SIGNIN_REDIRECT_URL);
  }
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
              {authProviders &&
              	authProviders
                  //we don't want to show the email provider as we have a separate form for that
                  .filter((provider) => provider.name !== "Resend")
                  .map((provider) => (
                    <OauthProvider key={provider.name} provider={JSON.parse(JSON.stringify(provider))} />
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}