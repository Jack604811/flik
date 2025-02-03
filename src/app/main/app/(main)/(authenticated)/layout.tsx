import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import { TailwindScreen } from "@/components/main/tailwind-screen";
import ModalAndSheetProvider from "@/components/providers/ModalAndSheetProvider";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  searchParams,
}: Readonly<{ children: React.ReactNode; searchParams: { invite?: string } }>) {
  const header = headers();
  const session = await auth();
  const currentPath = header.get("x-current-path");

  if (!session?.user) {
    const redirectUrl = `${NON_AUTHENTICATED_REDIRECT_URL}${
      searchParams?.invite ? `?invite=${searchParams.invite}` : ""
    }`;
    return redirect(redirectUrl);
  }
  // If email is not verified, redirect to verification
  if (!session.user.emailVerified) {
    return redirect("/verify-request");
  }
  // If onboarding is not completed, redirect to onboarding
  if (!session.user.onboardingComplete && !currentPath?.startsWith("/onboarding")) {
    return redirect("/onboarding");
  }

  const currentWorkspace = await getCurrentWorkspace().catch((err) => {
    console.error("Error fetching workspace:", err);
    return null;
  });

  if (session.user.onboardingComplete && !currentWorkspace && !currentPath?.startsWith("/workspaces")) {
    return redirect("/workspaces");
  }

  return (
    <>
      <ModalAndSheetProvider />
      {children}
      {process.env.NODE_ENV === "development" && <TailwindScreen />}
    </>
  );
}
