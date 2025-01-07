import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  getConnectWompi,
  getConnectedStripe,
} from "@/server/actions/workspace.action";
import StripeConnectButton from "./_components/StripeConnectButton";
import WompiConnectButton from "./_components/WompiConnectButton";
import { getCurrentWorkspace } from "@/server/actions/user.action";


export default async function Integrations() {
  const currentWorkspace = await getCurrentWorkspace();
  const stripeConnection = await getConnectedStripe(currentWorkspace!.id);
  const wompiConnection = await getConnectWompi(currentWorkspace!.id);

  return (
    <div>
      <div className="flex flex-col xl:flex-row max-w-6xl py-6 gap-6 xl:gap-8">
        <div className="w-full xl:w-1/3">
          <h2 className="text-xl font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Boost your business connecting with other apps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-5xl justify-start items-start xl:w-2/3">
          <Card className="flex flex-col pt-6 md:w-full xs:max-w-[400px]">
            <CardContent className="flex flex-col gap-2 items-center">
              <div className="flex w-full justify-between items-start">
                <div className="">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden">
                    <Image sizes="" src="/stripe-logo.png" alt="Logo" fill />
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
                    <Image sizes="" src="/wompi-logo.png" alt="Logo" fill />
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
    </div>
  );
}
