import Link from "next/link";
import Image from "next/image";
import { Menu, CircleUser, AlignLeft, AlignRight, User } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ModeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { APP_NAME, APP_ROUTES, USER_ROUTES, SIDEBAR_ROUTES } from "@/app_settings";
import { LogoutButton } from "../auth/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import ShimmerButton from "../magicui/shimmer-button";

const navigationLinks = APP_ROUTES; 
const sidebarLinks = SIDEBAR_ROUTES;


export async function MarketingHeader() {
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
            {session?.user ? (
              <Link href={"/dashboard"}>
                <ShimmerButton>
                  <span className="text-sm text-background dark:text-primary">Dashboard</span>
                </ShimmerButton>
              </Link>
            ) : (
              <Link href={"/signin"}>
                <ShimmerButton>
                  <span className="text-sm text-background dark:text-primary">Get started</span>
                </ShimmerButton>
              </Link>
            )}
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

export async function MainHeader() {
  const session = await getServerSession(authOptions);
  


  return (
    <header className="lg:fixed top-0 left-0 z-50 border-none ">
      <div className="flex h-16 items-center justify-end gap-4 px-6 md:px-8 w-full mx-auto">
        <nav className="flex w-full justify-between lg:justify-end items-center gap-2">
          <Link href="/" className="lg:hidden flex items-center gap-2 text-lg font-semibold md:text-base">
            <strong className="font-extrabold tracking-tight text-xl md:text-2xl">
              {APP_NAME}
            </strong>
          </Link>
          <div className="flex gap-2">
            <ModeToggle />
         
            {/* <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
            >
              <AlignRight className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button> */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {USER_ROUTES.filter((e) => e.path !== "/dashboard").map(
                    (link) => (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        asChild
                        key={link.path}
                      >
                        <Link href={link.path}>{link.name}</Link>
                      </DropdownMenuItem>
                    )
                  )}
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href={"/signin"}>Get Started</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
