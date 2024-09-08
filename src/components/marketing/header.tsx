import Link from "next/link";
import Image from "next/image";
import { Menu, CircleUser, AlignLeft, AlignRight, User } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ModeToggle } from "@/components/main/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { APP_NAME, APP_ROUTES, USER_ROUTES, SIDEBAR_ROUTES } from "@/app-settings";
import { LogoutButton } from "../auth/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import ShimmerButton from "../magicui/shimmer-button";
import DashboardButton from "./dashboard-button";

const navigationLinks = APP_ROUTES; 
const sidebarLinks = SIDEBAR_ROUTES;


export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 border-b w-full z-10 backdrop-blur-lg">
      <div className="flex h-16 items-center gap-4 px-4 md:px-4 w-full mx-auto justify-start">
        <nav className="relative md:flex md:flex-1 justify-between gap-6 text-lg font-medium md:items-center md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <strong className="font-extrabold tracking-tight text-xl md:text-2xl">
              {APP_NAME}
            </strong>
          </Link>
          <div className="hidden lg:flex w-full ml-36 items-center justify-center gap-6">
            {navigationLinks
              .filter((route) => route.visibleBy === "all")
              .map((link) => (
                <Link
                  href={link.path}
                  className="text-foreground transition-colors hover:text-foreground/90 capitalize"
                  key={link.path}
                >
                  {link.name}
                </Link>
              ))}
            {(session?.user?.subscriptionId || session?.user?.oneTimeProductId) &&
              navigationLinks
                .filter((route) => route.visibleBy === "subscribed")
                .map((link) => (
                  <Link
                    href={link.path}
                    className="text-foreground transition-colors hover:text-foreground/90 capitalize"
                    key={link.path}
                  >
                    {link.name}
                  </Link>
                ))}
          </div>
          <div className="hidden lg:flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <ModeToggle />
            {!session && (
              <Link href={"/signin"}>
                <span>Login</span>
              </Link>
            )}
            <DashboardButton/>
          </div>
          <div className="flex lg:hidden items-center justify-end flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="fixed top-3 right-2 z-50 p-3"
                >
                  <AlignRight className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  {navigationLinks.map((link) => (
                    <Link
                      href={link.path}
                      className="text-foreground transition-colors hover:text-foreground/90 capitalize"
                      key={link.path}
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
