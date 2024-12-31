import { APP_NAME, AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ForgottenPasswordForm } from "@/components/auth/forgotten-password-form";
import Link from "next/link";

export default async function ForgottenPassword() {
  const session = await auth();
  if (session?.user) {
    return redirect(AFTER_SIGNIN_REDIRECT_URL);
  }
  return (
    <div className="py-8 px-2 min-h-screen flex flex-col md:justify-center gap-6 ">
      <Card className="md:max-w-md mx-auto w-full py-4 md:px-8 md:py-12 border-none shadow-none">
        <CardContent>
          <div>
            <div className="space-y-2 text-center">
              {/* <div className=" p-2 rounded-full w-auto inline-block bg-primary ">
                <User className="mx-auto text-primary-foreground" size={30} />
              </div> */}
              <h1 className="font-bold text-xl text-left">Reset Password </h1>
            </div>
            <div className="mt-3">
              <ForgottenPasswordForm />
            </div>
          </div>
          <p className="text-muted-foreground text-center text-sm mt-5">Back to <Link href={"/"} className="text-primary">Login</Link> </p>
        </CardContent>
      </Card>


    </div>
  );
}