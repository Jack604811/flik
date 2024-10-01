import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import ModalAndSheetProvider from "@/components/providers/ModalAndSheetProvider";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

/** This layout makes sure all routes inside the authenticated are protected against non authenticated users   */

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    return redirect(NON_AUTHENTICATED_REDIRECT_URL);
  }

  if (session.user) {
    return (
      <>
        <ModalAndSheetProvider />
        {children}
      </>
    );
  }

  return null;
}
