"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignRight } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/main/theme-toggle";
import DashboardButton from "./dashboard-button";
import { APP_NAME, APP_ROUTES, APP_DOMAIN } from "@/app-settings";

const navigationLinks = APP_ROUTES;

export default function Header() {
  const pathname = usePathname(); // Get the current path using Next.js usePathname hook
  const [activePath, setActivePath] = useState("");
  const [activeHash, setActiveHash] = useState("");
  
  // NEW: State to ensure client-side rendering of icons
  const [isClient, setIsClient] = useState(false);

  // Update the current path and hash when the route changes
  useEffect(() => {
    setActivePath(pathname);
    setActiveHash(window.location.hash);

    // NEW: Ensure this is only run on the client after hydration
    setIsClient(true);
  }, [pathname]);

  const isActive = (path: string) => {
    const [linkPath, linkHash] = path.split("#");
    const currentHash = activeHash || "#"; // Handle case where there is no hash
    return (
      activePath === linkPath &&
      (linkHash ? currentHash === `#${linkHash}` : currentHash === "#")
    );
  };

  return (
    <header className="sticky top-0 border-b w-full z-10 backdrop-blur-lg">
      <div className="flex h-14 md:h-16 items-center gap-4 px-4 md:px-4 w-full mx-auto justify-start">
        <nav className="relative md:flex md:flex-1 justify-between gap-6 text-lg font-medium md:items-center md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <strong className="font-bold tracking-tight text-xl md:text-2xl">
              {APP_NAME}
            </strong>
          </Link>
          <div className="hidden lg:flex w-full ml-36 items-center justify-center gap-6">
            {navigationLinks
              .filter((route) => route.visibleBy === "all")
              .map((link) => (
                <Link
                  href={link.path}
                  key={link.path}
                  className={`font-semibold text-foreground transition-colors hover:text-foreground/90 capitalize ${
                    isActive(link.path) ? "bg-black text-white dark:bg-white dark:text-black hover:text-white rounded-md px-2" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </div>
          <div className="hidden lg:flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            {isClient && <ModeToggle />} 
            <Link href={`//app.${APP_DOMAIN}/`}>
              <span>Login</span>
            </Link>
            <DashboardButton />
          </div>
          <div className="flex lg:hidden items-center justify-end flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="fixed mb-[27px] md:mb-[1px] right-2 z-50 p-3"
                >
                  {isClient && <AlignRight className="h-5 w-5" />} 
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  {navigationLinks.map((link) => (
                    <Link
                      href={link.path}
                      key={link.path}
                      className={`text-foreground transition-colors hover:text-foreground/90 capitalize ${
                        isActive(link.path) ? "bg-black text-white dark:bg-white dark:text-black hover:text-white rounded-md px-2" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
