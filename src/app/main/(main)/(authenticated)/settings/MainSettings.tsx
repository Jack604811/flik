"use client";
import React, { FormEvent } from "react";
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSiteSetting } from "@/server/actions/user.action";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@prisma/client";


function MainSettings({
  user
}: {
  user: User
}) {
  const onSave = async (formData: FormData) => {
    const siteName = formData.get("siteName") as string;
    if (!siteName.length) return toast.error("Site name should not be empty!");
    const aboutUs = formData.get("aboutUs") as string;
    if (!aboutUs.length) return toast.error("About us should not be empty!");
    const promise = updateSiteSetting(user.id, formData);
    toast.promise(promise, {
      loading: "Saving...",
      success: "Site Settings Saved Successfully!",
      error: "There was a problem saving site settings!",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="min-w-[300px]">
       <h2 className="text-2xl">Main Settings</h2>
       <p>Update your site information.</p>
       </div>
       <div className="w-full min-w-[300px] gap-8">
       <form
          action={async (formData: FormData) => {
            await onSave(formData);
          }}>   
          <div className="flex flex-col gap-2">
          <Label htmlFor="siteLogo">Custom Logo</Label>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 relative rounded-md overflow-hidden">
              <Image
                sizes="100vw"
                src="/assets/placeholder.svg"
                alt="Logo"
                fill
              />
            </div>
            <Button variant="outline" type="button">Upload</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteName">Name</Label>
              <Input
                defaultValue={user.siteName?? ""}
                id="siteName"
                name="siteName"
                placeholder="Enter site name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutUs">About us</Label>
              <Textarea
                defaultValue={user.aboutUs?? ""}
                id="aboutUs"
                name="aboutUs"
                placeholder="Write something about your company"
              />
            </div>
            {/*<div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" name="logo" type="file" placeholder="Picture" />
            </div>*/}
            {/*<div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <Input id="favicon" name="favicon" type="file" />
            </div>*/}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue={user.country??""} name="country">
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Where are you located?</SelectLabel>
                  <SelectItem value="colombia">🇨🇴 Colombia</SelectItem>
                  <SelectItem value="mexico">🇲🇽 Mexico</SelectItem>
                  <SelectItem value="brazil">🇧🇷 Brazil</SelectItem>
                  <SelectItem value="peru">🇵🇪 Perú</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue={user.currency??""} name="currency">
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>What currency do you use?</SelectLabel>
                  <SelectItem value="usd">🇺🇸 USD</SelectItem>
                  <SelectItem value="cop">🇨🇴 COP</SelectItem>
                  <SelectItem value="mxn">🇲🇽 MXN</SelectItem>
                  <SelectItem value="brl">🇧🇷 BRL</SelectItem>
                  <SelectItem value="pen">🇵🇪 PEN</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentmethod">Payment Method as default</Label>
              <Select defaultValue={user.defaultPaymentMethod??"cash"} name="defaultPaymentMethod">
              <SelectTrigger className="">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Method</SelectLabel>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="wompi">Wompi</SelectItem>
                  <SelectItem value="epayco">Epayco</SelectItem>
                  <SelectItem value="mercadopago">Mercadopago</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
       </div>
    </div>
  );
}

export default MainSettings;
