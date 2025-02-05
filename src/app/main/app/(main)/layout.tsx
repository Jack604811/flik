import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { hasWorkspace } from "@/server/actions/workspace.action";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  const header = headers();
  const session = await auth();
  const currentPath = header.get("x-current-path");
  const searchParams = new URLSearchParams(header.get("x-search-params")!);

  if (!session?.user) {
    const redirectUrl = `${NON_AUTHENTICATED_REDIRECT_URL}${
      searchParams.get("invite") ? `?invite=${searchParams.get("invite")}` : ""
    }`;
    return redirect(redirectUrl);
  }
  // If email is not verified, redirect to verification
  if (!session.user.emailVerified) {
    return redirect("/verify-request");
  }
// If invited to a workspace, redirect to accept invite page
  if (searchParams.get("invite") && currentPath !== "/invite") {
    return redirect(`/invite?invite=${searchParams.get("invite")}`);
  }
  

  // If onboarding is not completed, redirect to onboarding
  const isWorkspaceExists = await hasWorkspace()
  if (!session.user.onboardingComplete && !currentPath?.startsWith("/onboarding")) {
    if(isWorkspaceExists) return redirect("/onboarding/invite-team");
    return redirect("/onboarding");
  }

  const currentWorkspace = await getCurrentWorkspace()
  if(session.user.onboardingComplete && currentPath?.includes("/onboarding")){
    if(currentWorkspace) return redirect("/dashboard");
    redirect("/workspaces")
  }

  if (!currentWorkspace && session.user.onboardingComplete && !currentPath?.startsWith("/workspaces")) {
    return redirect("/workspaces");
  }


  return (
    <>{children}</>
  );
}
