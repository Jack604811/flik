import MainSidebar from "@/components/main-sidebar";
import { MainHeader } from "@/components/header";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      <MainSidebar />
      <div className="flex flex-col w-full overflow-y-scroll">
        <MainHeader />
        <Suspense>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
