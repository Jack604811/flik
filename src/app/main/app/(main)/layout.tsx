import Sidebar from "@/components/main/sidebar";
import {Header} from "@/components/main/header";
import { Docker } from "@/components/main/docker"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      <Sidebar />
      <div className="flex flex-col w-full overflow-y-scroll">
        <Header />
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 lg:hidden">
         <Docker/>
      </div>
    </div>
  );
}
