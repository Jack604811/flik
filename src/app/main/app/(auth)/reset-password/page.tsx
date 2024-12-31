import { validatePasswordResetToken } from "@/server/actions/auth.action";
import { AtSign, User, Verified } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { notFound } from "next/navigation";
import { APP_NAME } from "@/app-settings";

type Params = {
  searchParams: { token: string };
};
export default async function Page({ searchParams }: Params) {
    const token = searchParams.token??""
    const response = await validatePasswordResetToken(token);

    if(response.error) return notFound();

    return (
      <div className="py-8 px-2  min-h-screen flex flex-col md:justify-center gap-6 ">
        <Card className="md:max-w-md mx-auto w-full py-4 md:px-8 md:py-12 border-none shadow-none">
          <CardContent>
            <div>
              <div className="space-y-2 text-center">
                {/* <div className=" p-2 rounded-full w-auto inline-block bg-primary ">
                  <User className="mx-auto text-primary-foreground" size={30} />
                </div> */}
                <h1 className="font-bold text-xl text-left">Reset Password</h1>
              </div>
              <div className="mt-3">
                <ResetPasswordForm token={token} />
              </div>
            </div>
            <p className="text-muted-foreground text-center text-sm mt-5">Back to <Link href={"/"} className="text-primary">Login</Link> </p>
          </CardContent>
        </Card>
  
  
      </div>
    );
}
