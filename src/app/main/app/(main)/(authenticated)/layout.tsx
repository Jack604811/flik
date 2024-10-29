import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import { TailwindScreen } from "@/components/main/tailwind-screen";
import ModalAndSheetProvider from "@/components/providers/ModalAndSheetProvider";
import { acceptWorkspaceInvite } from "@/server/actions/workspace.action";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** This layout makes sure all routes inside the authenticated are protected against non authenticated users   */

export default async function Layout({
  children,
  searchParams
}: Readonly<{ children: React.ReactNode, searchParams: { invite?:string } }>) {
  const header = headers()
  const session = await auth();
  if (!session?.user) {
    return redirect(`${NON_AUTHENTICATED_REDIRECT_URL}${searchParams.invite ? `?invite=${searchParams.invite}`:''}`);
  }

  // if(searchParams?.invite) {
  //   await acceptWorkspaceInvite(searchParams.invite, session.user.id);
  //   redirect(header.get("x-current-path")!);
  // }

  return (
    <>
      <ModalAndSheetProvider />
      {children}
      {process.env.NODE_ENV === 'development' && <TailwindScreen />}
    </>
  );
}
