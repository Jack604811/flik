import Image from "next/image";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { getConnectedStripe } from "@/server/actions/user.action";
import { getCurrentUser } from "@/server/auth";
import StripeConnectButton from "./_components/StripeConnectButton";

interface IntegrationCardProps {
  imageSrc: string;
  title: string;
  description: string;
  connection: string;
}

export default async function Page() {
  const currentUser = await getCurrentUser();
  const stripeConnection = await getConnectedStripe(currentUser!.id);
  return (
    <div className="flex h-screen w-full items-start justify-start p-10">
      <div className="group justify-center gap-4 group group-row">
        <div className="w-[360px]">
          <Card>
            <CardContent className="flex flex-col p-5 gap-2">
              <div className="flex w-full justify-between items-start gap-x-20">
                <div className="">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden">
                    <Image
                      sizes="100vw"
                      src="/stripe-logo.png"
                      alt="Logo"
                      fill
                    />
                  </div>
                  <h2 className="font-bold capitalize text-xl">Stripe</h2>
                </div>
                <StripeConnectButton accountId={stripeConnection} />
              </div>
              <CardDescription className="text-start">
                Stripe is the fastest and easiest way to integrate payments and
                financial services into your software platform or marketplace.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> refs/remotes/origin/main
