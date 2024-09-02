"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSiteSetting } from "@/server/actions/user.action";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";

function MainSettings({ user }: { user: User }) {
  const [imagePreview, setImagePreview] = useState<string>(`${user.logo ?? "/assets/placeholder.svg"}?${Date.now()}`);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(user.country ?? "");
  const [selectedCurrency, setSelectedCurrency] = useState<string>(user.currency ?? "usd");

  useEffect(() => {
    // Set USD as the default currency when the country changes and no other currency is selected
    if (selectedCountry && selectedCurrency === "") {
      setSelectedCurrency("usd");
    }
  }, [selectedCountry]);

  const onSave = async (formData: FormData) => {
    const siteName = formData.get("siteName") as string;
    if (!siteName.length) return toast.error("Site name should not be empty!");
    const aboutUs = formData.get("aboutUs") as string;
    if (!aboutUs.length) return toast.error("About us should not be empty!");
    if (selectedFile) {
      formData.append("logo", selectedFile); // Add the selected image file to the formData
    }
    const promise = updateSiteSetting(user.id, formData);
    toast.promise(promise, {
      loading: "Saving...",
      success: "Site Settings Saved Successfully!",
      error: "There was a problem saving site settings!",
    });
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
        <h2 className="text-xl font-semibold">Main Settings</h2>
        <p className="text-sm text-muted-foreground">Update your business information</p>
      </div>
      <div className="w-full xl:w-2/3">
        <form
          action={async (formData: FormData) => {
            await onSave(formData);
          }}
        >
          <div className="flex flex-col gap-4 lg:max-w-[600px]">
            <Label htmlFor="siteLogo">Custom Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative rounded-md overflow-hidden">
                <Image sizes="100vw" src={imagePreview} alt="Logo" fill unoptimized />
              </div>
              <Button variant="outline" type="button" onClick={() => document.getElementById("logoInput")?.click()}>
              <input
                type="file"
                id="logoInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
                Upload
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteName">Name</Label>
              <Input
                defaultValue={user.siteName ?? ""}
                id="siteName"
                name="siteName"
                placeholder="Enter site name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutUs">About us</Label>
              <Textarea
                defaultValue={user.aboutUs ?? ""}
                id="aboutUs"
                name="aboutUs"
                placeholder="Write something about your company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                defaultValue={user.country ?? ""}
                name="country"
                onValueChange={(value) => {
                  setSelectedCountry(value);
                  setSelectedCurrency("usd"); // Set USD as default whenever country is changed
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Where are you located?</SelectLabel>
                    <SelectItem value="united states">🇺🇸 United States</SelectItem>
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
              <Select
                value={selectedCurrency} // Bind to the selectedCurrency state
                onValueChange={setSelectedCurrency} // Update the state when currency is changed
                name="currency"
                disabled={!selectedCountry} // Disable if country is not selected
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>What currency do you want to use?</SelectLabel>
                    <SelectItem value="usd">🇺🇸 USD</SelectItem>
                    {selectedCountry === "colombia" && (
                      <SelectItem value="cop">🇨🇴 COP</SelectItem>
                    )}
                    {selectedCountry === "mexico" && (
                      <SelectItem value="mxn">🇲🇽 MXN</SelectItem>
                    )}
                    {selectedCountry === "brazil" && (
                      <SelectItem value="brl">🇧🇷 BRL</SelectItem>
                    )}
                    {selectedCountry === "peru" && (
                      <SelectItem value="pen">🇵🇪 PEN</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentmethod">Payment Method as default</Label>
              <Select defaultValue={user.defaultPaymentMethod ?? "cash"} name="defaultPaymentMethod">
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payment Method</SelectLabel>
                    <SelectItem value="cash">Cash</SelectItem>
                    {user.stripeAccountId && (
                      <SelectItem value="stripe">Stripe</SelectItem>
                    )}
                    {user.wompiAccountId && (
                      <SelectItem value="wompi">Wompi</SelectItem>
                    )}
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
