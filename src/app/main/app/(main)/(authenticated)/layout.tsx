import { AppSidebar } from "@/components/main/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers";
import Docker from "@/components/main/docker";
import { TailwindScreen } from "@/components/main/tailwind-screen";
import ModalAndSheetProvider from "@/components/providers/ModalAndSheetProvider";


export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode;}>) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state")?.value;


  let defaultOpen = true;
  if (sidebarState) {
    defaultOpen = sidebarState === "true";
  }

  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      {/* Sidebar */}
      <SidebarProvider className="flex h-screen">
        <AppSidebar />
         <SidebarInset>
      {/* Main Content */}
      <div className="flex flex-col w-full overflow-y-scroll pb-16 lg:pb-0">
        {/* <ModalAndSheetProvider /> */}
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
