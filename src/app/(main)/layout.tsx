import MainSidebar from "@/components/main-sidebar";
import { MainHeader } from "@/components/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-row">
      <MainSidebar />
      <div className="flex-auto">
        <MainHeader />
        {children}
      </div>
    </div>
  );
}
