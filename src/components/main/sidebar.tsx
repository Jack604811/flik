"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Square, Calendar, MapPin, Settings } from "lucide-react";
import { APP_NAME } from "@/app-settings";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarProfileDropdown from "./sidebar-profile-dropdown";

export const Sidebar = () => {
  const pathname = usePathname();

  // Hide sidebar if the pathname is "/workspaces"
  if (pathname === "/workspaces") {
    return null;
  }

  return (
    <div>
      <div className="hidden lg:flex flex-col min-w-[248px] h-screen p-0 gap-12 border-r sticky top-0">
        <Link href="/workspaces" className="flex items-center gap-2 text-lg font-semibold md:text-base mt-4 ml-4">
          <strong className="font-extrabold tracking-tight text-xl md:text-2xl">
            {APP_NAME}
          </strong>
        </Link>

        <div className="mx-4">
          {/* <WorkspaceSwitcher /> */}
        </div>

        <Command className="gap-4 bg-inherit">
          <CommandList>
            <CommandGroup>
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/dashboard") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]"
                >
                  <Link href="/dashboard" prefetch={true}>
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4 mr-0" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>

              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/calendar") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]"
                >
                  <Link href="/calendar" prefetch={true}>
                    <div className="flex w-full justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 mr-0" />
                        <span>Calendar</span>
                      </div>
                    </div>
                  </Link>
                </Button>
              </CommandItem>

              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/spots") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]"
                >
                  <Link href="/spots" prefetch={true}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 mr-0" />
                      <span>Spots</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>

              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/settings") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]"
                >
                  <Link href="/settings" prefetch={true}>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 mr-0" />
                      <span>Settings</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>

        <SidebarProfileDropdown />
      </div>
    </div>
  );
};

export default Sidebar;
