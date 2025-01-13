"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export interface WorkspaceFormValues {
  siteName?: string;
  aboutUs?: string;
  logo?: string | null;
  country?: string | null;
  currency?: string | null;
  defaultPaymentMethod?: string | null;
}

interface WorkspaceFormProps {
  initialValues: WorkspaceFormValues;
  onSubmit: (formData: FormData) => Promise<void> | void;
  submitLabel?: string;
  onFileChange?: (file: File) => void;
}

export function WorkspaceForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Changes",
  onFileChange,
}: WorkspaceFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(
    initialValues.logo ?? "/assets/placeholder.svg"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialValues.country ?? ""
  );
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    initialValues.currency ?? "usd"
  );

  useEffect(() => {
    setImagePreview(
      initialValues.logo ? `${initialValues.logo}?${Date.now()}` : "/assets/placeholder.svg"
    );
  }, [initialValues.logo]);

  useEffect(() => {
    if (selectedCountry && !selectedCurrency) {
      setSelectedCurrency("usd");
    }
  }, [selectedCountry, selectedCurrency]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileChange?.(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const siteName = formData.get("siteName") as string;
    if (!siteName.trim().length) {
      alert("Site name should not be empty!");
      return;
    }
    const aboutUs = formData.get("aboutUs") as string;
    if (!aboutUs.trim().length) {
      alert("About us should not be empty!");
      return;
    }
    if (selectedFile) {
      formData.append("logo", selectedFile);
    }
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log("FormData submitted:", Object.fromEntries(formData.entries()));
        await handleSubmit(formData);
      }}
    >
      <div className="flex flex-col gap-4 lg:max-w-[600px]">
        <Label htmlFor="siteLogo">Custom Logo</Label>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative rounded-md overflow-hidden">
            <Image
              sizes="100vw"
              src={imagePreview}
              alt="Logo"
              fill
              unoptimized
            />
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => document.getElementById("logoInput")?.click()}
          >
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

        <Label htmlFor="siteName">Name</Label>
        <Input
          defaultValue={initialValues.siteName ?? ""}
          id="siteName"
          name="siteName"
          placeholder="Enter site name"
        />

        <Label htmlFor="aboutUs">About us</Label>
        <Textarea
          defaultValue={initialValues.aboutUs ?? ""}
          id="aboutUs"
          name="aboutUs"
          placeholder="Write something about your workspace"
        />

        <Label htmlFor="country">Country</Label>
        <Select
          defaultValue={initialValues.country ?? ""}
          name="country"
          onValueChange={(value) => {
            setSelectedCountry(value);
            setSelectedCurrency("usd");
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

        <Label htmlFor="currency">Currency</Label>
        <Select
          value={selectedCurrency}
          onValueChange={setSelectedCurrency}
          name="currency"
          disabled={!selectedCountry}
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

        <Label htmlFor="defaultPaymentMethod">Default Payment Method</Label>
        <Select
          defaultValue={initialValues.defaultPaymentMethod ?? "cash"}
          name="defaultPaymentMethod"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Payment Method</SelectLabel>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex justify-end">
          <Button type="submit">{submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
