"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import { updateCustomDomain } from "@/server/actions/workspace.action";

// 1) Import your hook
import useConfirm from "@/hooks/use-confirm";

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

  // Extract defaultValue from inputAttrs and set initial state
  const { defaultValue, ...restInputAttrs } = inputAttrs;
  const [domain, setDomain] = useState<string>(defaultValue || "");
  const [isDomainValid, setIsDomainValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [domainAdded, setDomainAdded] = useState<boolean>(!!domain);

  // 2) Destructure the hook: First item is the *component*, second is the *function*
  const [ConfirmDomainRemoval, confirmRemoval] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to remove this domain? This action cannot be undone."
  );

  useEffect(() => {
    const domainRegex = /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;
    setIsDomainValid(domainRegex.test(domain));
  }, [domain]);

  const handleFormSubmit = async () => {
    // ...same domain submit logic...
  };

  const handleRemoveDomain = async () => {
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
      console.error("Error removing custom domain:", error);
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
                className="rounded-none w-[72px] inline-flex items-center
                  px-3 rounded-l-md border border-r-0 border-background-300
                  bg-background-50 text-gray-500 dark:text-gray-300 text-sm"
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

            {/* If a domain is added, show remove button. Otherwise, show add button */}
            {domainAdded ? (
              <>
                <Button
                type="button"
                  variant="outline"
                  className="whitespace-nowrap px-3"
                  onClick={async () => {
                    // 3) Show the Credenza. Wait for user's response
                    const didConfirm = await confirmRemoval();
                    if (didConfirm) {
                      handleRemoveDomain();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* 4) Render the Credenza by placing the component in your JSX */}
                <ConfirmDomainRemoval />
              </>
            ) : (
              <Button
                variant="default"
                className="whitespace-nowrap"
                onClick={handleFormSubmit}
                disabled={!isDomainValid || isLoading}
              >
                {isLoading ? "Adding..." : "+ Add domain"}
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
