"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateCustomDomain, updateSiteSetting, updateSubdomain } from "@/server/actions/workspace.action";
import { Label } from "@radix-ui/react-label";
import DomainForm from "./domain";
import { Workspace } from "@prisma/client";


function SiteSettings({
  subdomain,
  customDomain,
  workspaceId,
  favicon
}: {
  subdomain: string;
  customDomain: string;
  workspaceId: string;
  favicon?: string | null
}) {
  const [imagePreview, setImagePreview] = useState<string>(`${favicon ?? "/assets/placeholder.svg"}?${Date.now()}`);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if(selectedFile){
      formData.append("favicon", selectedFile)
    }
    const subdomain = formData.get("subdomain") as string;
    if (!subdomain.length){
			toast.error("Enter valid subdomain");
      return false;
    }
    const promise = updateSiteSetting(workspaceId, formData);
    // const promise = updateSubdomain(userId, subdomain);
    toast.promise(promise, {
      loading: "Saving...",
      success: "Settings Updated Successfully!",
      error: "Subdomain already taken!",
    });
    return false
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row max-w-6xl py-6 gap-6 xl:gap-8">
      <div className="w-full xl:w-1/3">
        <h2 className="text-xl font-semibold">Site Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your site settings</p>
      </div>
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col gap-4">
        <Label htmlFor="siteLogo">Favicon</Label>
          <div className="flex items-center gap-4 my-2">
            <div className="w-10 h-10 relative rounded-md overflow-hidden">
              <Image
                sizes="100vw"
                src={imagePreview}
                alt="Favicon"
                fill
                unoptimized
              />
            </div>
            <input
                type="file"
                id="faviconInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            <Button variant="outline" type="button"  onClick={() => document.getElementById("faviconInput")?.click()}>Upload</Button>
          </div>
          
        </div>
        <form onSubmit={onSave}>
          <div className="flex flex-col gap-4 max-w-[600px]">
            <div className="flex flex-col space-y-2">
            
              <Label htmlFor="subdomain" className="gap-8">Subdomain</Label>
              <div className="flex flex-row items-center justify-center mt-4 ">
                <Input
                  placeholder="subdomain"
                  name="subdomain"
                  className="rounded-e-none"
                  maxLength={32}
                  defaultValue={subdomain!}
                />
                <Input
                  placeholder="process.env.NEXT_PUBLIC_ROOT_DOMAIN"
                  disabled
                  readOnly
                  value={process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                  className="rounded-s-none w-2/6 inline-flex items-center px-3 rounded-l-md border border-l-0 border-background-300 bg-background-50 text-gray-500 dark:text-gray-300 text-sm"
                />
              </div>
              {/* <p className="text-xs text-muted-foreground font-semibold">
                Please use 32 characters maximum.
              </p> */}
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
        <div className="my-4">
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
              workspaceId={workspaceId}
              handleSubmit={updateCustomDomain}
          />
        </div>
      </div>
    </div>
  );
}

export default SiteSettings;