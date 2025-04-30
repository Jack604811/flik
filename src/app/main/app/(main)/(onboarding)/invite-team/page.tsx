import { getCurrentWorkspace } from "@/server/actions/user.action";
import React from "react";
import CompleteOnboardingButton from "./CompleteOnboardingButton";
import TeamManagement from "@/components/settings/team-management";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function Page() {
  const BACK_BUTTON_URL = `/create-workspace`;
  const currentWorkspace = await getCurrentWorkspace();
  if (!currentWorkspace) {
    return (
      <div className="flex-1 pt-4 space-y-8 gap-8 p-6 md:p-8 md:pt-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            No Workspace Selected
          </h2>
          <p className="text-muted-foreground">
            Please select a workspace to view settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen relative">
      <div className="absolute top-4 left-4">
        <Button size="sm" variant="outline">
          <Link href={BACK_BUTTON_URL} className="flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center h-full px-4 md:px-0">
        <div className="mx-auto grid max-w-sm gap-6">
          <div className="flex flex-col gap-4 text-start">
            <h1 className="text-2xl font-semibold">Invite your team</h1>
            <p className="text-muted-foreground text-sm">
              This is a simple page in your Next.js application. Customize it as
              needed to suit your requirements.
            </p>
            <div>
              <TeamManagement
                isOnboarding={true}
                workspaceId={currentWorkspace.id}
              />
              <CompleteOnboardingButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
