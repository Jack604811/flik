import Link from "next/link";
import Image from "next/image";
import { Menu, CircleUser } from "lucide-react";
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
import { LogoutButton } from "./auth/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { CustomerPortalLink } from "@/components/store/customer-portal-link";

const navigationLinks = APP_ROUTES; // or custom ones if you prefer

export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 border-b bg-background w-full z-10">
      <div className="flex h-16 items-center gap-4 px-4 md:px-12 w-full mx-auto   ">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ">
          <ModeToggle />
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Image
              src={"/assets/logo.svg"}
              width={300}
              height={300}
              alt={`${APP_NAME} logo`}
              className="max-w-[90px]"
            />

            <span className="sr-only">{APP_NAME}</span>
          </Link>
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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <ModeToggle />
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
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4  justify-end">
          {/** show user menu only if there is a user on the session */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {USER_ROUTES.map((link) => (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    asChild
                    key={link.path}
                  >
                    <Link href={link.path}>{link.name}</Link>
                  </DropdownMenuItem>
                ))}
                <CustomerPortalLink className="w-full text-left flex justify-start text-foreground font-normal hover:no-underline outline-none ring-0 border-none text-sm px-2 hover:bg-accent py-2 rounded">
                  Customer
                </CustomerPortalLink>
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
      </div>
    </header>
  );
}

export async function MainHeader() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 border-b bg-background w-full z-10">
      <div className="flex h-16 items-center justify-end gap-4 px-4 w-full mx-auto">
        <nav className="font-medium flex items-center gap-5 text-sm">
          <ModeToggle />
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4  justify-end">
            {/** show user menu only if there is a user on the session */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
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
