"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWorkspace } from "@/server/actions/workspace.action";
import { toast } from "sonner";

export function OnboardingWorkspaceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("/assets/placeholder.svg");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const siteName = formData.get("siteName") as string;

      if (!siteName.trim()) {
        toast.error("Workspace name is required");
        return;
      }

      const workspace = await createWorkspace(formData);
      
      if (workspace) {
        toast.success("Workspace created successfully!");
        router.push("/onboarding/invite-team");
      }
    } catch (error) {
      toast.error("Failed to create workspace");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 text-gray-600">
        <div className="space-y-2">
          <Label htmlFor="siteLogo">Workspace Logo</Label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative rounded-md overflow-hidden border">
              <Image
                src={imagePreview}
                alt="Logo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("logoInput")?.click()}
            >
              <input
                type="file"
                id="logoInput"
                className="hidden"
                accept="image/*"
                name="logo"
                onChange={handleFileChange}
              />
              Upload Logo
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteName">Workspace Name*</Label>
          <Input
            id="siteName"
            name="siteName"
            placeholder="Enter workspace name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutUs">About Workspace</Label>
          <Textarea
            id="aboutUs"
            name="aboutUs"
            placeholder="Tell us about your workspace"
            rows={4}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Workspace"}
      </Button>
    </form>
  );
}