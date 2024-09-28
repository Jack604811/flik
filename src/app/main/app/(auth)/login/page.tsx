import { APP_NAME } from "@/app-settings";
import { User } from "lucide-react";
import { OauthProvider } from "@/components/auth/oauth-provider";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Card, CardContent } from "@/components/ui/card";
import { providers } from "@/server/auth";

export default async function Login() {
  // Create a list of providers, excluding the resend provider
  const authProviders = providers.filter((p) => p.name.toLowerCase() !== "resend");

  return (
    <div className="py-8 px-2 min-h-screen flex flex-col md:justify-center gap-6">
      <Card className="md:max-w-md mx-auto w-full py-4 md:px-8 md:py-12 border-none shadow-none">
        <CardContent>
          <div>
            <div className="space-y-2 text-center">
              <div className="p-2 rounded-full w-auto inline-block bg-primary">
                <User className="mx-auto text-primary-foreground" size={30} />
              </div>
              <h1 className="font-bold text-xl">Sign In to {APP_NAME}</h1>
            </div>
            <div className="mt-3">
              <MagicLinkForm />
            </div>
            <div className="py-3 flex items-center text-sm before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
              OR
            </div>
            <div className="space-y-2">
              {authProviders.length > 0 &&
                authProviders.map((provider) => (
                  <OauthProvider key={provider.name} provider={provider} />
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
