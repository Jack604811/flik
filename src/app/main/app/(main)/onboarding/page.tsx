import { Button } from "@/components/ui/button";
import { OnboardingWorkspaceForm } from "@/components/forms/onboarding-workspace-form";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Create Your Workspace</h1>
          <p className="text-sm text-muted-foreground text-gray-600">
            Set up your workspace to start managing your business
          </p>
        </div>

        <OnboardingWorkspaceForm />
      </div>
    </div>
  );
}
