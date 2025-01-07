import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import { TailwindScreen } from "@/components/main/tailwind-screen";
import ModalAndSheetProvider from "@/components/providers/ModalAndSheetProvider";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const currentWorkspace = await getCurrentWorkspace();

  if (!session?.user) {
    return redirect(NON_AUTHENTICATED_REDIRECT_URL);
  }

  if (!currentWorkspace) {
    return redirect("/workspaces");
  }

  return (
    <>
      <ModalAndSheetProvider />
      {React.cloneElement(children as React.ReactElement, {
        currentWorkspace,
      })}
      {process.env.NODE_ENV === "development" && <TailwindScreen />}
    </>
  );
}

