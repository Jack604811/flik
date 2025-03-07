import { Button } from "@/components/ui/button";
import { OnboardingWorkspaceForm } from "@/components/forms/onboarding-workspace-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const BACK_BUTTON_URL = `/dashboard`;

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen relative">
      <div className="absolute top-4 left-4">
        <Button size="sm" variant="outline" asChild>
          <Link href={BACK_BUTTON_URL}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
    <div className="flex items-center justify-center w-full h-full px-4 md:px-0">
      <div className="mx-auto grid max-w-sm w-full gap-6">
        <div className="flex flex-col gap-4 text-start">
          <h1 className="text-2xl font-semibold">Create Your Workspace</h1>
          <p className="text-muted-foreground text-sm">
            Set up your workspace to start managing your business
          </p>
        </div>

        <OnboardingWorkspaceForm />
      </div>
    </div>
    </section>
  );
}
