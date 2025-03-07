"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronsUpDown, Plus } from "lucide-react";
import useSWR from "swr";
import { getWorkspaces } from "@/server/actions/workspace.action";
import { updateCurrentWorkspace } from "@/server/actions/user.action";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface WorkspaceData {
  id: string;
  siteName: string | null;
  logo: string | null;
}

interface WorkspacesData {
  workspaces: WorkspaceData[];
  currentWorkspaceId: string | null;
}

export function WorkspaceSwitcher() {
  const { data: session } = useSession();

  const [cachedWorkspaces, setCachedWorkspaces] = useState<WorkspacesData | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceData | null>(null);

  // Load cached workspaces from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCache = window.localStorage.getItem("workspaceCache");
      if (savedCache) {
        const parsedCache: WorkspacesData = JSON.parse(savedCache);
        setCachedWorkspaces(parsedCache);

        const matchedWorkspace =
          parsedCache.workspaces.find((ws) => ws.id === parsedCache.currentWorkspaceId) ||
          parsedCache.workspaces[0] ||
          null;

        setCurrentWorkspace(matchedWorkspace);
      }
    }
  }, []);

  // Fetch workspaces if not cached
  const { data, isLoading } = useSWR<WorkspacesData>(
    cachedWorkspaces ? null : "workspaces",
    async () => {
      const fetchedData = await getWorkspaces();
      return {
        ...fetchedData,
        workspaces: fetchedData.workspaces.map((workspace) => ({
          id: workspace.id,
          siteName: workspace.siteName,
          logo: workspace.logo ?? null,
        })),
      };
    },
    {
      onSuccess: (fetchedData) => {
        if (fetchedData && typeof window !== "undefined") {
          const newCurrentWorkspace =
            fetchedData.workspaces.find((ws) => ws.id === fetchedData.currentWorkspaceId) ||
            fetchedData.workspaces[0] ||
            null;

          const cacheData: WorkspacesData = {
            workspaces: fetchedData.workspaces,
            currentWorkspaceId: newCurrentWorkspace?.id ?? null,
          };

          window.localStorage.setItem("workspaceCache", JSON.stringify(cacheData));
          setCachedWorkspaces(cacheData);
          setCurrentWorkspace(newCurrentWorkspace);
        }
      },
    }
  );

  // Handle workspace selection
  const onWorkspaceSelect = async (workspace: WorkspaceData) => {
    if (!workspace || typeof window === "undefined") return;

    setCurrentWorkspace(workspace);
    const updatedCache: WorkspacesData = {
      ...cachedWorkspaces!,
      currentWorkspaceId: workspace.id,
    };

    window.localStorage.setItem("workspaceCache", JSON.stringify(updatedCache));
    setCachedWorkspaces(updatedCache);

    // Update in database
    await updateCurrentWorkspace(session?.user?.id!, workspace.id);
    window.location.reload();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-background data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Logo using ShadCN Avatar */}
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentWorkspace?.logo || ""} alt={currentWorkspace?.siteName || "Workspace"} />
                <AvatarFallback className="rounded-lg">
                  {currentWorkspace?.siteName?.charAt(0).toUpperCase() || "W"}
                </AvatarFallback>
              </Avatar>

              {/* Name & Plan (Hidden when collapsed) */}
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[state=collapsed]:hidden">
                <span className="truncate font-semibold">
                  {currentWorkspace?.siteName || ""}
                </span>
                <p className="text-xs text-muted-foreground font-semibold">
                Premium
                </p>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="right"
            sideOffset={16}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>

            {/* Workspaces List */}
            {cachedWorkspaces?.workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => onWorkspaceSelect(workspace)}
                className="gap-2 p-2"
              >
                <Avatar className="h-6 w-6 rounded-lg">
                  <AvatarImage src={workspace.logo || ""} alt={workspace.siteName || "Workspace"} />
                  <AvatarFallback className="rounded-lg">
                    {workspace.siteName?.charAt(0).toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>
                {workspace.siteName}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Add New Workspace */}
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4 text-muted-foreground" />
              </div>
              <Link href="/create-new-workspace" className="font-medium text-muted-foreground">
                Add workspace
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
