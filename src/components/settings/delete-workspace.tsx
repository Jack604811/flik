"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Workspace } from "@prisma/client";
import { deleteWorkspace } from "@/server/actions/workspace.action";
import { validatePassword } from "@/server/actions/auth.action";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";

export function DeleteWorkspace({ workspace }: { workspace: Workspace }) {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCredenzaOpen, setIsCredenzaOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const resetInputs = () => {
    setStep(0);
    setPassword("");
    setConfirmationText("");
    setIsCredenzaOpen(false);
  };

  const handleSubmit = async () => {
    if (step === 0) {
      // Validate password
      if (!password) {
        toast.error("Password is required.");
        return;
      }

      try {
        setIsLoading(true);
        await validatePassword(workspace.ownerId, password); // Check password validity
        setStep(1); // Move to the next step
      } catch (error) {
        toast.error("Invalid password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Final confirmation step
      const expectedText = `DELETE ${workspace.siteName}`;
      if (confirmationText !== expectedText) {
        toast.error(`You must type "${expectedText}" to confirm.`);
        return;
      }

      try {
        setIsLoading(true);
        await deleteWorkspace(workspace.id, password);

        toast.success(`Workspace "${workspace.siteName}" has been deleted.`);
        resetInputs();
        router.push("/workspaces");
      } catch (error) {
        toast.error("Failed to delete workspace. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col xl:flex-row max-w-6xl py-6 gap-6 xl:gap-8">
      <div className="w-full xl:w-1/3">
        <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
        <p className="text-sm text-red-400">Delete your business data forever</p>
      </div>
      <div className="w-full xl:w-2/3">
        <Button
          variant="destructive"
          onClick={() => setIsCredenzaOpen(true)}
          className="bg-red-500 hover:bg-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Workspace
        </Button>
      </div>

      <Credenza open={isCredenzaOpen} onOpenChange={(open) => !open && resetInputs()}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>
              {step === 0 ? "Confirm Password" : "Confirm Deletion"}
            </CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>
            {step === 0 ? (
              <div className="space-y-4">
                <Label htmlFor="password">Enter your password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  ref={inputRef}
                  disabled={isLoading}
                  placeholder="Your account password"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="confirmation-text">
                  Type <strong>DELETE {workspace.siteName}</strong> to confirm
                </Label>
                <Input
                  id="confirmation-text"
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  required
                  ref={inputRef}
                  disabled={isLoading}
                  placeholder={`DELETE ${workspace.siteName}`}
                />
              </div>
            )}
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant="secondary" disabled={isLoading}>
                Cancel
              </Button>
            </CredenzaClose>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : step === 0 ? "Next" : "Delete"}
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
