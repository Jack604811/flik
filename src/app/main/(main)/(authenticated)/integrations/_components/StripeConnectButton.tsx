"use client";
import { Button } from "@/components/ui/button";
import {
  connectStripeAccount,
  disconnectStripeAccount,
} from "@/server/actions/billing.action";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Loader, PlugIcon, UnplugIcon, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  accountId: string | null | undefined;
};

const StripeConnectButton = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const stripeConnect = await connectStripeAccount();
      if (stripeConnect) window.location.href = stripeConnect.url;
    } catch (error) {
      toast.error(
        "There was an error connecting Stripe Account, Kindly try again!"
      );
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const stripeDisconnect = await disconnectStripeAccount(props.accountId!);
      if (!stripeDisconnect.success) throw new Error("Disconnect Error");
      toast.success("Stripe account disconnected successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        "There was an error disconnecting Stripe Account, Kindly try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Credenza onOpenChange={setOpen} open={open}>
        <CredenzaTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center space-x-2",
              props.accountId &&
                "bg-green-400 hover:bg-green-400 text-white hover:text-white"
            )}
          >
            <span>{props.accountId ? "Connected" : "Connect"}</span>
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <div className="flex items-center space-x-2 my-4 gap-0">
              <div className="flex flex-row w-full justify-center items-center gap-2">
                <img
                  src="/placeholder.svg"
                  alt="App icon"
                  className="w-16 h-16 rounded-md"
                />
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <img
                  src="/stripe-logo.png"
                  alt="Stripe icon"
                  className="w-16 h-16 rounded-md"
                />
              </div>
            </div>
            <CredenzaTitle>
              <h3 className="text-lg font-semibold">Connect Stripe Account</h3>
            </CredenzaTitle>
            <CredenzaDescription>
              <p className="text-sm text-muted-foreground">
                The world’s most successful platforms and marketplaces including
                Shopify and DoorDash, use Stripe Connect.
              </p>
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="my-2">
            <h4 className="font-semibold py-2">Stripe would like to access</h4>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>Payment and bank information</li>
              <li>Products and services you sell</li>
              <li>Business and tax information</li>
              <li>Create and update Products</li>
            </ul>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant="outline">Close</Button>
            </CredenzaClose>

            {props.accountId ? (
              <Button
                variant="destructive"
                className="flex items-center space-x-2"
                onClick={handleDisconnect}
              >
                <UnplugIcon className="w-5 h-5" />
                <span>{loading ? "Disconnecting..." : "Disconnect"}</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={handleConnect}
                disabled={loading}
              >
                <PlugIcon className="w-5 h-5" />
                <span>{loading ? "Connecting..." : "Connect"}</span>
              </Button>
            )}
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

export default StripeConnectButton;
