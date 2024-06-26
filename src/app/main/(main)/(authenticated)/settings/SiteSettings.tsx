"use client";
import React, { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSiteSetting } from "@/server/actions/user.action";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

function SiteSettings({
  userId,
  siteName,
}: {
  userId: string;
  siteName: string | null | undefined;
}) {
  const onSave = async (formData: FormData) => {
    const siteName = formData.get("siteName") as string;
    if (!siteName.length) return toast.error("Site name should not be empty!");
    const promise = updateSiteSetting(userId, formData);
    toast.promise(promise, {
      loading: "Saving...",
      success: "Site Settings Saved Successfully!",
      error: "There was a problem saving site settings!",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md">
        <form
          action={async (formData: FormData) => {
            await onSave(formData);
          }}
        >
          <CardHeader>
            <h2 className="text-2xl">Site Settings</h2>
            <CardDescription>Update your site information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">App Name</Label>
              <Input
                defaultValue={siteName ?? ""}
                id="siteName"
                name="siteName"
                placeholder="Enter site name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" name="logo" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <Input id="favicon" name="favicon" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteName">Payment Method as default</Label>
              <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Method</SelectLabel>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="wompi">Wompi</SelectItem>
                  <SelectItem value="epayco">Epayco</SelectItem>
                  <SelectItem value="mercadopago">Mercadopago</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
      
    </div>
  );
}

export default SiteSettings;
