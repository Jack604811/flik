"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import { updateCustomDomain } from "@/server/actions/workspace.action";
import { Label } from "../ui/label";

interface DomainFormProps {
  workspaceId: string;
  title: string;
  description: string;
  helpText: string;
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  handleSubmit: (workspaceId: string, value: string) => Promise<any>;
}

export default function DomainForm({
  workspaceId,
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
}: DomainFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const { pending } = useFormStatus();

  // Extract defaultValue from inputAttrs and set initial state
  const { defaultValue, ...restInputAttrs } = inputAttrs;
  const [domain, setDomain] = useState<string>(defaultValue || "");

  const [isDomainValid, setIsDomainValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [domainAdded, setDomainAdded] = useState<boolean>(!!domain);

  useEffect(() => {
    // Improved domain validation
    const domainRegex = /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;
    setIsDomainValid(domainRegex.test(domain));
  }, [domain]);

  const handleFormSubmit = async () => {
    if (!isDomainValid) {
      toast.error("Please enter a valid domain");
      return;
    }

    setIsLoading(true);
    toast.loading("Adding domain...");
    try {
      const res = await handleSubmit(workspaceId, domain);

      if (res && res.error) {
        toast.error(res.error);
      } else {
        await update();
        router.refresh();
        toast.success("Successfully added Custom Domain!");
        setDomainAdded(true);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleRemoveDomain = async () => {
    setIsDialogOpen(false);

    setIsLoading(true);
    toast.loading("Removing domain...");

    try {
      const res = await updateCustomDomain(workspaceId, "");

      if ("error" in res) {
        toast.error(res.error);
      } else {
        setDomain("");
        setDomainAdded(false);
        setIsDomainValid(false);
        toast.success("Successfully removed the Custom Domain.");
      }
    } catch (error) {
      console.error("Error in removing custom domain:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  return (
    <form className="max-w-[600px]">
      <div className="space-y-2">
        <Label htmlFor="siteName">Custom Domain</Label>

        {inputAttrs.name === "customDomain" ? (
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex w-full">
              <Input
                placeholder="https://"
                disabled
                readOnly
                value="https://"
                className="rounded-none w-[72px] inline-flex items-center px-3 rounded-l-md border border-r-0 border-background-300 bg-background-50 text-gray-500 dark:text-gray-300 text-sm"
              />
              <Input
                {...restInputAttrs}
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={domainAdded}
                className="rounded-l-none"
              />
              {domainAdded && (
                <div className="absolute right-3 flex h-full items-center">
                  <DomainStatus domain={domain} />
                </div>
              )}
            </div>

            {/* Submit or Remove Button */}
            {domainAdded ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="whitespace-nowrap px-3">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove this domain? This action cannot
                      be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="default" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleRemoveDomain}>
                      Remove
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
  variant="default"
  className="whitespace-nowrap"
  onClick={handleFormSubmit}
  disabled={!isDomainValid || isLoading}
>
  {isLoading ? (
    <>
      <span className="md:hidden">...</span>
      <span className="hidden md:inline">{/* Medium screens and up */}
        Adding...
      </span>
    </>
  ) : (
    <>
      <span className="md:hidden">+</span>
      <span className="hidden md:inline">{/* Medium screens and up */}
        + Add domain
      </span>
    </>
  )}
</Button>

            )}
          </div>
        ) : (
          <Input {...restInputAttrs} required className="w-full" />
        )}
      </div>

      {domainAdded && <DomainConfiguration domain={domain} />}
    </form>
  );
}