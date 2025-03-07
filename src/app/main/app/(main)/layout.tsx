import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { hasWorkspace } from "@/server/actions/workspace.action";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // 1) Pull custom headers
  const header = headers();

  // 2) Try to get the session from your custom auth() function
  const session = await auth();

  // 3) Retrieve "x-current-path" and "x-search-params" from headers (set via middleware or server code)
  const currentPath = header.get("x-current-path");
  const searchParamsString = header.get("x-search-params") || "";
  const searchParams = new URLSearchParams(searchParamsString);

  // ========================= 2) AUTH CHECKS ============================
  // 2a. If user isn't authenticated
  if (!session?.user) {
    const inviteParam = searchParams.get("invite");
    const redirectUrl = `${NON_AUTHENTICATED_REDIRECT_URL}${
      inviteParam ? `?invite=${inviteParam}` : ""
    }`;
    return redirect(redirectUrl);
  }

  // 2b. If email isn't verified, redirect to /verify-request
  if (!session.user.emailVerified) {
    return redirect(
      `/verify-request${
        searchParams.get("invite") ? `?invite=${searchParams.get("invite")}` : ""
      }`
    );
  }

  // 2c. If there's an invite param but we're not on /invite, go to /invite
  if (searchParams.get("invite") && currentPath !== "/invite") {
    return redirect(`/invite?invite=${searchParams.get("invite")}`);
  }

  // ==================== 3) ONBOARDING CHECKS =========================
  const isWorkspaceExists = await hasWorkspace();

  // If user hasn't finished onboarding...
  if (
    !session.user.onboardingComplete &&
    currentPath !== "/create-workspace" &&
    currentPath !== "/invite-team"
  ) {
    if (isWorkspaceExists) {
      return redirect("/invite-team");
    } else {
      return redirect("/create-workspace");
    }
  }

  // ===================== 4) ALREADY ONBOARDED? =======================
  const currentWorkspace = await getCurrentWorkspace();

  // 4a. If user is done onboarding but is currently visiting /create-workspace or /invite-team
  if (
    session.user.onboardingComplete &&
    (currentPath === "/create-workspace" || currentPath === "/invite-team")
  ) {
    if (currentWorkspace) {
      return redirect("/dashboard");
    }
    return redirect("/workspaces");
  }

  // 4b. If they are onboarded but have no current workspace & not on /workspaces
  if (
    !currentWorkspace &&
    session.user.onboardingComplete &&
    currentPath !== "/workspaces"
  ) {
    return redirect("/workspaces");
  }

  // ===================== 5) EVERYTHING OK ============================
  return <>{children}</>;
}
