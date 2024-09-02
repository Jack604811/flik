import Image from "next/image";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { getConnectWompi, getConnectedStripe } from "@/server/actions/user.action";
import { getCurrentUser } from "@/server/auth";
import StripeConnectButton from "./_components/StripeConnectButton";
import WompiConnectButton from "./_components/WompiConnectButton";
import { User } from "@prisma/client";
import { Metadata } from "next";

interface IntegrationCardProps {
  imageSrc: string;
  title: string;
  description: string;
  connection: string;
}

export const metadata: Metadata = {
  title: "Integrations",
  description: "Connect your favorite apps to boost your business!",
}

export default async function Page() {
  const currentUser = await getCurrentUser();
  const stripeConnection = await getConnectedStripe(currentUser!.id);
  const wompiConnection = await getConnectWompi(currentUser!.id);

  return (
    <div className="flex-1 p-6 pt-4 space-y-8 md:p-8 md:pt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your favorite apps to boost your business!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-5xl justify-start items-start">
        <Card className="flex flex-col pt-6 md:w-full xs:max-w-[400px]">
          <CardContent className="flex flex-col gap-2 items-center">
            <div className="flex w-full justify-between items-start">
              <div className="">
                <div className="w-10 h-10 relative rounded-md overflow-hidden">
                  <Image
                    sizes="100vw"
                    src="/stripe-logo.png"
                    alt="Logo"
                    fill
                  />
                </div>
                <h2 className="font-bold capitalize text-xl mt-4">Stripe</h2>
              </div>
              <StripeConnectButton accountId={stripeConnection} />
            </div>
            <CardDescription className="text-start">
              Stripe is the fastest and easiest way to integrate payments and
              financial services into your software platform or marketplace.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col pt-6 md:w-full xs:max-w-[400px]">
          <CardContent className="flex flex-col gap-2 items-center">
            <div className="flex w-full justify-between items-start">
              <div className="">
                <div className="w-10 h-10 relative rounded-md overflow-hidden">
                  <Image
                    sizes="100vw"
                    src="/wompi-logo.png"
                    alt="Logo"
                    fill
                  />
                </div>
                <h2 className="font-bold capitalize text-xl mt-4">Wompi</h2>
              </div>
              <WompiConnectButton accountId={wompiConnection as any} />
            </div>
            <CardDescription className="text-start">
              Wompi is the fastest and easiest way to integrate payments and
              financial services into your software platform or marketplace.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
