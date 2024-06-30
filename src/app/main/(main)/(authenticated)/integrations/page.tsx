import Image from "next/image";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { getConnectWompi, getConnectedStripe } from "@/server/actions/user.action";
import { getCurrentUser } from "@/server/auth";
import StripeConnectButton from "./_components/StripeConnectButton";
import WompiConnectButton from "./_components/WompiConnectButton";

interface IntegrationCardProps {
  imageSrc: string;
  title: string;
  description: string;
  connection: string;
}

export default async function Page() {
  const currentUser = await getCurrentUser();
  const stripeConnection = await getConnectedStripe(currentUser!.id);
  const wompiConnection = await getConnectWompi(currentUser!.id);

  return (
    <div className="flex h-screen w-full gap-4 items-start justify-start p-10">
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
                  <h2 className="font-bold capitalize text-xl mt-2">Stripe</h2>
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
      <div className="group justify-center gap-4 group group-row">
        <div className="w-[360px]">
          <Card>
            <CardContent className="flex flex-col p-5 gap-2">
              <div className="flex w-full justify-between items-start gap-x-20">
                <div className="">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden">
                    <Image
                      sizes="100vw"
                      src="/wompi-logo.png"
                      alt="Logo"
                      fill
                    />
                  </div>
                  <h2 className="font-bold capitalize text-xl mt-2">Wompi</h2>
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
    </div>
  );
}
