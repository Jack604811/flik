import { hasWorkspace } from "@/server/actions/workspace.action";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/main/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers";
import Docker from "@/components/main/docker";
import { TailwindScreen } from "@/components/main/tailwind-screen";
import ModalAndSheetProvider from "@/components/providers/ModalAndSheetProvider";


export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode;}>) {
  const session = await auth();
  const isWorkspaceExists = await hasWorkspace();
  // If user hasn't finished onboarding...
  if (
    !session?.user.onboardingComplete
  ) {
    
    if (isWorkspaceExists) {
      return redirect("/invite-team");
    } else {
      return redirect("/create-workspace");
    }
  }

  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      {/* Sidebar */}
      <SidebarProvider className="flex h-screen">
        <AppSidebar />
         <SidebarInset>
      {/* Main Content */}
      <div className="flex flex-col w-full overflow-y-scroll pb-16 lg:pb-0">
        <ModalAndSheetProvider />
        {children}
        {process.env.NODE_ENV === "development" && <TailwindScreen />}
      </div>

      {/* Docker */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 lg:hidden">
        <Docker />
      </div>

        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
