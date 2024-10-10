"use client";
import { Button } from "@/components/ui/button";
import { connectWompiAccount } from "@/server/actions/billing.action";
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
import {  CheckIcon, CopyIcon, ExternalLinkIcon, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { env } from "@/env";


type Props = {
  accountId: Record<string, string>;
};

const WompiConnectButton = ({accountId}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const wompiData = Object.fromEntries(formData) as Record<string, string>;
    setLoading(true);
    try {
      const wompiConnect = await connectWompiAccount(wompiData);
      if (!wompiConnect.status) {
        setErrors(wompiConnect.error);
        throw new Error("");
      }
      toast.success("Wompi account connected successfully!");
      setOpen(false);
      setLoading(false);
      setErrors(null);
      router.refresh();
    } catch (error) {
      toast.error(
        "There was an error connecting Wompi Account, Kindly try again!"
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setLoading(false);
      setErrors(null);
    }
  }, [])

  const webhookUrl = `${env.NEXT_PUBLIC_ROOT_DOMAIN}/api/webhooks/connected/wompi`;


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <>
      <Credenza onOpenChange={setOpen} open={open}>
        <CredenzaTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex items-center space-x-2",
              accountId &&
                "bg-green-100 hover:bg-green-400 text-green-500 border-none hover:text-white"
            )}
          >
            <span>{accountId ? "Connected" : "Connect"}</span>
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <form onSubmit={onSubmit}>
            <CredenzaHeader>
              <div className="flex items-center space-x-2 my-4 gap-0">
                <div className="flex flex-row w-full justify-center items-center gap-2">
                  <Image
                    src="/placeholder.svg"
                    alt="App icon"
                    className="w-16 h-16 rounded-md"
                    height={100}
                    width={100}
                  />
                  <Repeat className="h-4 w-4 text-muted-foreground" />
                  <Image
                    src="/wompi-logo.png"
                    alt="Wompi icon"
                    className="w-16 h-16 rounded-md"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
              <CredenzaTitle>
                <h3 className="text-lg font-semibold">Connect Wompi Account</h3>
              </CredenzaTitle>
              <CredenzaDescription>
                <p className="text-sm text-muted-foreground">
                  The world’s most successful platforms and marketplaces
                  including Shopify and WooCommerce, use Wompi Connect.
                </p>
                <Link
                  href="https://docs.wompi.co/docs/colombia/ambientes-y-llaves/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-flex items-center"
                >
                  Learn more about API key configuration
                  <ExternalLinkIcon className="h-3 w-3 ml-1" />
                </Link>
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody className="my-2">
              <div className="my-6 space-y-4">
              
                <div className="flex items-center space-x-2 mb-6">
                  <Switch
                    name="useSandbox" id="useSandbox" defaultChecked={accountId?.useSandbox === "on"} defaultValue={accountId?.useSandbox ?? "on"}
                  />
                  <Label htmlFor="test-mode" className="text-sm font-medium">
                    Test Mode
                  </Label>
                </div>
                    {errors?.test?.message && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {errors?.test?.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  
                  
                    <div className="space-y-2">
                      <Label htmlFor="testPublicKey">Test Public Key</Label>
                      <Input
                        name="testPublicKey"
                        id="testPublicKey"
                        defaultValue={accountId?.testPublicKey ?? ""}
                        required
                        placeholder="Enter Test Public Key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testPrivateKey">Test Private Key</Label>
                      <Input
                        name="testPrivateKey"
                        id="testPrivateKey"
                        defaultValue={accountId?.testPrivateKey ?? ""}
                        required
                        type="password"
                        placeholder="Enter Test Private Key"
                      />
                    </div>
                    {errors?.live?.message && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {errors?.live?.message}
                        </AlertDescription>
                      </Alert>
                    )}
               
                  
                    <div className="space-y-2">
                      <Label htmlFor="livePublicKey">Live Public Key</Label>
                      <Input
                        name="livePublicKey"
                        id="livePublicKey"
                        defaultValue={accountId?.livePublicKey ?? ""}
                        required
                        placeholder="Enter Live Public Key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="livePrivateKey">Live Private Key</Label>
                      <Input
                        name="livePrivateKey"
                        id="livePrivateKey"
                        defaultValue={accountId?.livePrivateKey ?? ""}
                        required
                        type="password"
                        placeholder="Enter Live Private Key"
                      />
                    </div>
                  
                    <div className="mt-8 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Events URL</h3>
                      <div className="flex items-center space-x-2">
                        <Input 
                        value={webhookUrl} 
                        readOnly disabled
                        className="bg-transparent text-black dark:text-white text-sm leading-10 ring-offset-background dark:placeholder-white/40 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-zinc-950/[0.03] disabled:text-zinc-950/80 dark:disabled:bg-white/[0.03] dark:disabled:text-white/80 focus:border-zinc-950/70 dark:focus:border-white/70"/>
                        <TooltipProvider>
                          <Tooltip open={isCopied}>
                            <TooltipTrigger asChild>
                              <Button type="button" onClick={copyToClipboard} variant="outline">
                                {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                                <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copied!</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please paste this URL into your Wompi account{" "}
                        <Link
                          href="https://comercios.wompi.co/developers"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center"
                        >
                          here
                          <ExternalLinkIcon className="h-3 w-3 ml-1" />
                        </Link>
                      </p>
                    </div>
                </div>
              </div>
            </CredenzaBody>
            <CredenzaFooter>
              <CredenzaClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </CredenzaClose>
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                type="submit"
                // onClick={handleConnect}
                disabled={loading}
              >
                {/*<PlugIcon className="w-5 h-5" />*/}
                <span>{loading ? "Connecting..." : "Connect"}</span>
              </Button>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

export default WompiConnectButton;