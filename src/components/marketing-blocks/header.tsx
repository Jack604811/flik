import Link from "next/link";
import Image from "next/image";
import { Menu, CircleUser, AlignLeft } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { APP_NAME, APP_ROUTES, USER_ROUTES } from "@/app_settings";
import { LogoutButton } from "../auth/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import ShimmerButton from "../magicui/shimmer-button";

const navigationLinks = APP_ROUTES; // or custom ones if you prefer

export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 border-b bg-background w-full z-10">
      <div className="flex h-16 items-center gap-4 px-4 md:px-12 w-full mx-auto justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <strong className="font-extrabold tracking-tight text-base md:text-2xl">
              {APP_NAME}
            </strong>
          </Link>
        <nav className="hidden absolute inset-x-0 md:flex md:flex-1 justify-center gap-6 text-lg font-medium md:items-center md:text-sm lg:gap-6">
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
        </nav>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
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
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="lg:hidden fixed top-3 left-2 z-50 p-3"
            >
              <AlignLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Image
                  src={"/assets/logo.svg"}
                  width={100}
                  height={100}
                  alt={`${APP_NAME} logo`}
                />
                <span className="sr-only">{APP_NAME}</span>
              </Link>
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
        </Sheet> */}

        
      </div>
    </header>
  );
}

export async function MainHeader() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 border-b bg-background w-full z-10">
      <div className="flex h-16 items-center justify-end gap-4 px-4 w-full mx-auto">
        <nav className="flex-1 font-medium flex justify-center items-center gap-5 text-sm">
          <ModeToggle />
          <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="lg:hidden fixed top-3 left-2 z-50 p-3"
                  >
                    <AlignLeft className="h-5 w-5" />
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
