"use client";
import { Button } from "@/components/ui/button";
import {
  connectStripeAccount,
  disconnectStripeAccount,
} from "@/server/actions/billing.action";
import { Loader, PlugIcon, UnplugIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  accountId: string | null | undefined;
};

const StripeConnectButton = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    </>
  );
};

export default StripeConnectButton;
