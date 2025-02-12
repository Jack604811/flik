"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_ROUTES } from "@/app-settings";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavUser } from "./nav-user";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarRail 
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AppSidebar() {
  const pathname = usePathname();

  // Hide sidebar on specific pages
  if (pathname === "/workspaces" || pathname === "/create-workspace") {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      
      {/* Sidebar Header */}
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>

      {/* Sidebar Navigation */}
      <SidebarContent className="mt-10">
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_ROUTES.map((item) => (
              <SidebarMenuItem key={item.name} className="group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      href={item.path} 
                      className={`flex items-center h-[32px] text-sm gap-2 px-4 rounded-md w-full transition-all group-data-[state=collapsed]:px-2
                        ${pathname.includes(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent"}
                      `}
                    >
                      {/* Icon (Always Visible) */}
                      <item.icon className="h-4 w-4" />

                      {/* Name (Hidden when Collapsed) */}
                      <span className="group-data-[state=collapsed]:hidden transition-all">
                        {item.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    className="group-data-[state=collapsed]:block hidden"
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="absolute bottom-1 left-0 w-full flex justify-center p-2">
        <NavUser />
      </SidebarFooter>

      {/* Sidebar Rail (Handles auto-collapse behavior) */}
      <SidebarRail />
    </Sidebar>
  );
}
