"use client";

import { useState, useEffect, use } from "react";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import useSWR from "swr";
import { getWorkspaces } from "@/server/actions/workspace.action";
import { updateCurrentWorkspace } from "@/server/actions/user.action";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
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

export default function WorkspaceSwitcher({ className }: { className?: string }) {
  const { data: session } = useSession();

  const [cachedWorkspaces, setCachedWorkspaces] = useState<WorkspacesData | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceData | null>(null);
  const [open, setOpen] = useState(false);

  // 1) Load from localStorage (client-side) on mount
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

  // 2) Fetch only if cachedWorkspaces is null
  const { data, isLoading, error } = useSWR<WorkspacesData>(
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
        // Write the result to localStorage so subsequent loads skip the fetch
        if (fetchedData && typeof window !== "undefined") {
          const { workspaces, currentWorkspaceId } = fetchedData;

          const newCurrentWorkspace =
            workspaces.find((ws) => ws.id === currentWorkspaceId) ||
            workspaces[0] ||
            null;

          const cacheData: WorkspacesData = {
            workspaces,
            currentWorkspaceId: newCurrentWorkspace?.id ?? null,
          };

          window.localStorage.setItem("workspaceCache", JSON.stringify(cacheData));
          setCachedWorkspaces(cacheData);
          setCurrentWorkspace(newCurrentWorkspace);
        }
      },
    }
  );

  // 3) Update user’s current workspace in DB
  const saveCurrentWorkspace = async (workspaceId: string) => {
    if (!session?.user?.id) return;
    try {
      const response = await updateCurrentWorkspace(session.user.id, workspaceId);
      if (!response) {
        throw new Error("Failed to update current workspace");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4) Prepare the items to display in the list
  const formattedItems =
    cachedWorkspaces?.workspaces.map((ws) => ({
      label: ws.siteName || "Untitled Workspace",
      value: ws.id,
      logo: ws.logo,
    })) || [];

  // 5) Handle workspace selection
  const onWorkspaceSelect = async (item: {
    value: string;
    label: string;
    logo: string | null;
  }) => {
    setOpen(false);

    const selected = cachedWorkspaces?.workspaces.find((ws) => ws.id === item.value);
    if (!selected || typeof window === "undefined") return;

    // Update the cached currentWorkspaceId
    const updatedCache: WorkspacesData = {
      ...cachedWorkspaces!,
      currentWorkspaceId: selected.id,
    };
    window.localStorage.setItem("workspaceCache", JSON.stringify(updatedCache));
    setCachedWorkspaces(updatedCache);
    setCurrentWorkspace(selected);

    // Save to DB and refresh
    await saveCurrentWorkspace(selected.id);
    window.location.reload();
  };

  // 6) Skeleton placeholders
  const renderSkeletons = () => (
    <CommandGroup heading="Workspaces">
      {[...Array(5)].map((_, idx) => (
        <CommandItem key={idx} className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </CommandItem>
      ))}
    </CommandGroup>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a workspace"
          className={cn("w-full max-w-6xl h-12 justify-between", className)}
        >
          {currentWorkspace?.logo ? (
            <Image
              src={currentWorkspace.logo}
              alt="Workspace Logo"
              width={24}
              height={24}
              className="mr-2 h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <Image
              src="/assets/placeholder.svg"
              alt="Placeholder Logo"
              width={24}
              height={24}
              className="mr-2 h-8 w-8 rounded-full object-cover"
            />
          )}
          {currentWorkspace?.siteName || "Select a workspace"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-1 bg-background">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search workspace..." />
            {isLoading ? (
              renderSkeletons()
            ) : formattedItems.length === 0 ? (
              <CommandEmpty>No workspace found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Workspaces">
                {formattedItems.map((workspace) => (
                  <CommandItem
                    key={workspace.value}
                    onSelect={() =>
                      onWorkspaceSelect({
                        value: workspace.value,
                        label: workspace.label || "",
                        logo: workspace.logo,
                      })
                    }
                    className="cursor-pointer text-sm"
                  >
                    {workspace.logo ? (
                      <Image
                        src={workspace.logo}
                        alt="Workspace Logo"
                        width={24}
                        height={24}
                        className="mr-2 h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/assets/placeholder.svg"
                        alt="Placeholder Logo"
                        width={24}
                        height={24}
                        className="mr-2 h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    {workspace.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentWorkspace?.id === workspace.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <Link href="/create-workspace" className="no-underline">
                <CommandItem className="cursor-pointer">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Workspace
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
