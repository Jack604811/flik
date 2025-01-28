import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Sidebar } from "@/components/admin/sidebar"
import { auth } from "@/server/admin/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/admin/main-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flik Admin Dashboard",
  description: "Admin dashboard for managing Flik booking app",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  if(!session?.user) {
    return redirect("/");
  }


  return (
    <html lang="en">
      <body className={`${inter.className}`}>
          <SidebarProvider className="flex h-screen">
            <AppSidebar />
            <SidebarInset>
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b px-4 py-2">
              <SidebarTrigger className="-ml-1 h-5 w-5" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </header>
              <main className="p-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
      </body>
    </html>
  )
}

