"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateCustomDomain, updateSubdomain, updateSiteSetting } from "@/server/actions/user.action";
import { Label } from "@radix-ui/react-label";
import DomainForm from "@/components/domain";

function SiteSettings({
  subdomain,
  customDomain,
  userId,
}: {
  subdomain: string;
  customDomain: string;
  userId: string;
}) {
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    // Set the initial favicon URL
    setFaviconUrl("/assets/placeholder.svg"); // Assuming you fetch and set the actual favicon URL here.
  }, []);

  const onSave = async (formData: FormData) => {
    const subdomain = formData.get("subdomain") as string;
    if (!subdomain.length) return toast.error("Enter valid subdomain");
    const promise = updateSubdomain(userId, subdomain);
    toast.promise(promise, {
      loading: "Saving...",
      success: "Settings Updated Successfully!",
      error: "Subdomain already taken!",
    });
  };

  const handleFaviconUploadClick = () => {
    if (faviconInputRef.current) {
      faviconInputRef.current.click();
    }
  };

  const handleFaviconFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("favicon", file);

      const promise = updateSiteSetting(userId, formData);
      toast.promise(promise, {
        loading: "Uploading favicon...",
        success: "Favicon uploaded successfully!",
        error: "There was a problem uploading the favicon!",
      });

      // Update the favicon preview immediately
      promise.then(() => {
        const newFaviconUrl = URL.createObjectURL(file);
        setFaviconUrl(newFaviconUrl);
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="min-w-[300px]">
        <h2 className="text-2xl font-bold tracking-tight">Site Settings</h2>
        <p className="text-muted-foreground">Manage your frontend settings here.</p>
      </div>
      <div className="w-full min-w-[300px] space-y-4">
        <div className="space-y-2">
          <Label htmlFor="favicon">Favicon</Label>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative rounded-md overflow-hidden">
              <Image
                sizes="100vw"
                src={faviconUrl || "/assets/placeholder.svg"}
                alt="Favicon"
                fill
              />
            </div>
            <Button variant="outline" type="button" onClick={handleFaviconUploadClick}>
              Upload
            </Button>
            <Input
              ref={faviconInputRef}
              id="favicon"
              name="favicon"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFaviconFileChange}
            />
          </div>
        </div>

        <form action={onSave}>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex columns-2 items-center justify-center">
                <Input
                  placeholder="subdomain"
                  name="subdomain"
                  className="rounded-e-none"
                  maxLength={32}
                  defaultValue={subdomain!}
                />
                <Input
                  placeholder="localhost:3000"
                  disabled
                  readOnly
                  value={process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                  className="rounded-s-none w-4/6 inline-flex items-center px-3 rounded-l-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                />
              </div>
              {/*<p className="text-xs text-muted-foreground font-semibold">
                Please use 32 characters maximum.
              </p>*/}
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
        <div className="my-3">
          <DomainForm
              title="Custom Domain"
              description="The custom domain for your site."
              helpText="Please enter a valid domain."
              inputAttrs={{
                name: "customDomain",
                type: "text",
                defaultValue: customDomain!,
                placeholder: "yourdomain.com",
                maxLength: 64,
                pattern: "^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$",
              }}
              userId={userId}
              handleSubmit={updateCustomDomain}
          />
        </div>
      </div>
    </div>
  );
}

export default SiteSettings;
