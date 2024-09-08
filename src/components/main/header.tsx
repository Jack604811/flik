import Link from "next/link";
import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/main/theme-toggle";
import { APP_NAME, USER_ROUTES } from "@/app-settings";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogoutButton } from "../auth/logout-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import Image from "next/image";
import SidebarProfileDropdown from "./sidebar-profile-dropdown";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-none bg-transparent w-full z-50 mb-0 lg:mb-[-68px]">
      <div className="flex h-16 items-center justify-end gap-4 px-4 md:px-8 w-full mx-auto">
        <nav className="flex w-full justify-between lg:justify-end items-center gap-2">
          <Link href="/" className="lg:hidden flex items-center gap-2 text-lg font-semibold md:text-base">
            <strong className="font-extrabold tracking-tight text-xl md:text-2xl">
              {APP_NAME}
            </strong>
          </Link>
          <div className="flex gap-2">
            {/* <ModeToggle />
            <div className="lg:hidden">
            <SidebarProfileDropdown/>
            </div> */}
            {/* {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden lg:flex bg-transparent">
                  <Image 
                      src="/assets/profile-placeholder.svg" 
                      alt="Profile Placeholder" 
                      width={32} 
                      height={32} 
                      className="rounded-full"
                    />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {USER_ROUTES.filter((e) => e.path !== "/dashboard").map((link) => (
                    <DropdownMenuItem className="cursor-pointer" asChild key={link.path}>
                      <Link href={link.path}>{link.name}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu> 
            ) : (
              <Button asChild>
                <Link href={"/signin"}>Get Started</Link>
              </Button>
            )} */}
          </div>
        </nav>
      </div>
    </header>
  );
}
