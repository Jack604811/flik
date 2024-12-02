import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import { TailwindScreen } from "@/components/main/tailwind-screen";
import ModalAndSheetProvider from "@/components/providers/ModalAndSheetProvider";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** This layout makes sure all routes inside the authenticated are protected against non authenticated users */

export default async function Layout({
  children,
  searchParams
}: Readonly<{ children: React.ReactNode, searchParams: { invite?: string } }>) {
  const header = headers();
  const session = await auth();

  // Redirect if the user is not authenticated
  if (!session?.user) {
    const redirectUrl = `${NON_AUTHENTICATED_REDIRECT_URL}${
      searchParams?.invite ? `?invite=${searchParams.invite}` : ""
    }`;
    return redirect(redirectUrl);
  }

  // Optionally handle workspace invite
  // if (searchParams?.invite) {
  //   await acceptWorkspaceInvite(searchParams.invite, session.user.id);
  //   redirect(header.get("x-current-path")!);
  // }

  // Fetch the current workspace
  const currentWorkspace = await getCurrentWorkspace();

  // Redirect to /workspaces if no workspace is selected
  if (!currentWorkspace) {
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
