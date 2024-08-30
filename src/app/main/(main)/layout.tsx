import Sidebar from "@/components/sidebar";
import { MainHeader } from "@/components/marketing/header";
import { Docker } from "@/components/docker"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      <Sidebar />
      <div className="flex flex-col w-full overflow-y-scroll">
        <MainHeader />
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 lg:hidden">
         <Docker/>
      </div>
    </div>
  );
}
