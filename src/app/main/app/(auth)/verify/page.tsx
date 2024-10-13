import { validateVerificationToken } from "@/server/actions/auth.action";
import { AtSign, Verified } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

type Params = {
  searchParams: { token: string };
};
export default async function Page({ searchParams }: Params) {

    const token = await validateVerificationToken(searchParams.token ?? "");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="py-12 ">
        <CardContent>
          <div className="space-y-2 text-center">
            <div className="bg-accent-bg-color/5 p-2 rounded-full w-auto inline-block">
                { token.error ? <AtSign className="mx-auto " size={30} /> : <Verified className="mx-auto " size={30} />}
            </div>
            <h1 className="font-bold text-xl">{token.error ? "Your invite is expired or is invalid": ""}</h1>
          </div>

            {token.error ? (
                <p className="text-center">
                    The token is no longer valid. This normally happens if you take a long time to use the link.
                </p>
            ) : (
                <div className="flex flex-col items-center">
                    <p className="text-center">
                        Your email has been verified. You can now sign in.
                    </p>
                    
                    <Link href={"/"} className="mt-3">
                        <Button>Sign in</Button> 
                    </Link>
                </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
