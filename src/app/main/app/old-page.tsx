import { APP_NAME, AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { User } from "lucide-react";
import { OauthProvider } from "@/components/auth/oauth-provider";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Card, CardContent } from "@/components/ui/card";
import { auth, providers } from "@/server/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form-old";
import Link from "next/link";

type Params = {
  searchParams: { invite?: string };
};
export default async function Page({ searchParams }: Params) {
  const session = await auth();
  
  const authProviders = providers.map(p => ({
    name: p.id
  })).filter(p => p.name === "google");

  if (session?.user) {
    return redirect(AFTER_SIGNIN_REDIRECT_URL);
  }
  return (
    <div className="py-8 px-2 min-h-screen flex flex-col md:justify-center gap-6 ">
      <Card className="md:max-w-md  mx-auto w-full py-4  md:px-8 md:py-12 border-none shadow-none">
        <CardContent>
          <div>
            <div className="space-y-2 text-center">
              {/* <div className=" p-2 rounded-full w-auto inline-block bg-primary ">
                <User className="mx-auto text-primary-foreground" size={30} />
              </div> */}
              <h1 className="font-bold text-xl text-left">Welcome back</h1>
            </div>
            <div className="mt-3">
              <LoginForm />
            </div>
            <div className="py-3 flex items-center text-sm before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
              OR
            </div>
            <div className="space-y-2">
              {authProviders &&
              	authProviders
                  .filter((provider) => provider.name !== "Resend")
                  .map((provider) => (
                    <OauthProvider key={provider.name} provider={JSON.parse(JSON.stringify(provider))} prefix="Sign in" callbackUrl={`${AFTER_SIGNIN_REDIRECT_URL}${searchParams.invite ? `?invite=${searchParams.invite}`:''}`} />
                  ))}
            </div>
          </div>
          <p className="text-muted-foreground text-center text-sm mt-5">Don&apos;t have an account? <Link href={`/signup${searchParams.invite ? `?invite=${searchParams.invite}`:''}`} className="text-primary">Sign up</Link> </p>
        </CardContent>
      </Card>


    </div>
  );
}