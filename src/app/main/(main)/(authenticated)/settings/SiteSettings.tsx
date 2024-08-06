"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateCustomDomain, updateSubdomain } from "@/server/actions/user.action";
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
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="min-w-[300px]">
        <h2 className="text-2xl">Site Settings</h2>
        <p>Manage your frontend settings here.</p>
      </div>
      <div className="w-full min-w-[300px] gap-8">
        <div>
          <Label htmlFor="favicon">Favicon</Label>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative rounded-md overflow-hidden">
              <Image
                sizes="100vw"
                src="/assets/placeholder.svg"
                alt="Logo"
                fill
              />
            </div>
            <Button variant="outline">Upload</Button>
          </div>
        </div>

        <form action={onSave}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
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
              <p className="text-xs text-muted-foreground font-semibold">
                Please use 32 characters maximum.
              </p>
            </div>
            {/*<div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" name="logo" type="file" placeholder="Picture" />
            </div>*/}
            {/*<div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <Input id="favicon" name="favicon" type="file" />
            </div>*/}

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
    /* <Card className="w-full px-5">
      <form action={onSave}>
        <CardHeader>
          <h2 className="text-2xl">Subdomain</h2>
          <CardDescription>The subdomain for your spots site</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground font-bold">
            Please use 32 characters maximum.
          </p>
          <Button>Save Changes</Button>
        </CardFooter>
      </form>
    </Card>*/
  );
}

export default SiteSettings;
