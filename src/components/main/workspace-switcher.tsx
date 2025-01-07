"use client";

import { useState, useEffect } from "react";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Image as LogoIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WorkspaceModal from "./workspace-modal";
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
import { useRouter } from "next/navigation";
import { useWorkspaceModal } from "@/hooks/use-workspace-modal";
import useSWR from "swr";
import { mutate } from "swr";
import { getWorkspaces } from "@/server/actions/workspace.action";
import { updateCurrentWorkspace } from "@/server/actions/user.action";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

interface WorkspaceData {
  id: string;
  siteName: string | null;
  logo: string | null; 
}

interface WorkspacesData {
  workspaces: WorkspaceData[];
  currentWorkspaceId: string | null;
}

export default function WorkspaceSwitcher({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const workspaceModal = useWorkspaceModal();
  const router = useRouter();

  const [cachedWorkspaces, setCachedWorkspaces] = useState<WorkspacesData | null>(
    () => JSON.parse(localStorage.getItem("workspaceCache") || "null")
  );

  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceData | null>(
    cachedWorkspaces
      ? cachedWorkspaces.workspaces.find(
          (ws) => ws.id === cachedWorkspaces.currentWorkspaceId
        ) || cachedWorkspaces.workspaces[0]
      : null
  );

  const [open, setOpen] = useState<boolean>(false);

  const { data, isLoading, error, mutate } = useSWR<WorkspacesData>(
    cachedWorkspaces ? null : "workspaces",
    async () => {
      const fetchedData = await getWorkspaces();
      return {
        ...fetchedData,
        workspaces: fetchedData.workspaces.map((workspace) => ({
          id: workspace.id,
          siteName: workspace.siteName,
          logo: workspace.logo || null, 
        })),
      };
    },
    {
      onSuccess: (fetchedData) => {
        if (fetchedData) {
          const { workspaces, currentWorkspaceId } = fetchedData;
          const newCurrentWorkspace =
            workspaces.find((ws) => ws.id === currentWorkspaceId) ||
            workspaces[0];

          const cacheData: WorkspacesData = {
            workspaces,
            currentWorkspaceId: newCurrentWorkspace?.id || null,
          };
          localStorage.setItem("workspaceCache", JSON.stringify(cacheData));
          setCachedWorkspaces(cacheData);
          setCurrentWorkspace(newCurrentWorkspace);
        }
      },
    }
  );

  const saveCurrentWorkspace = async (workspaceId: string) => {
    try {
      const response = await updateCurrentWorkspace(
        session?.user.id!,
        workspaceId
      );
      if (!response) {
        throw new Error("Failed to update current workspace");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formattedItems =
    cachedWorkspaces?.workspaces.map((item) => ({
      label: item.siteName || "Untitled Workspace",
      value: item.id,
      logo: item.logo, 
    })) || [];

  const onWorkspaceSelect = async (workspace: {
    value: string;
    label: string;
    logo: string | null;
  }) => {
    setOpen(false);
    const selectedWorkspace = cachedWorkspaces?.workspaces.find(
      (item) => item.id === workspace.value
    );
    if (selectedWorkspace) {
      // Update local cache
      const updatedCache: WorkspacesData = {
        ...cachedWorkspaces!,
        currentWorkspaceId: selectedWorkspace.id,
      };
      localStorage.setItem("workspaceCache", JSON.stringify(updatedCache));
      setCachedWorkspaces(updatedCache);
      setCurrentWorkspace(selectedWorkspace);

      // Save to server and reload the page
      await saveCurrentWorkspace(selectedWorkspace.id);
      window.location.reload(); // Trigger full page reload
    }
  };

  const handleCache = () => {
    setCachedWorkspaces(null); // Clear cache on creation
    mutate(); // Refetch workspaces
  };

  const handlePopoverOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setCachedWorkspaces(null);
      mutate(); // Refetch workspaces when the popover is opened
    }
  };

  if (error) return <div>Error loading workspaces</div>;


  const renderSkeletons = () => (
    <CommandGroup heading="Workspaces">
      {[...Array(5)].map((_, index) => (
        <CommandItem key={index} className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </CommandItem>
      ))}
    </CommandGroup>
  );

  return (
    <>
      <Popover open={open} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a workspace"
            onClick={handleCache}
            className={cn("w-full max-w-6xl h-12 justify-between", className)}
          >
            {currentWorkspace?.logo ? (
              <Image
                src={currentWorkspace.logo}
                alt="Workspace Logo"
                className="mr-2 h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <Image
                src="/assets/placeholder.svg" 
                alt="Placeholder Logo"
                className="mr-2 h-8 w-8 rounded-full object-cover"
              />
            )}
            {currentWorkspace?.siteName || "Select a workspace"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-1 bg-background `">
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
                      className="text-sm cursor-pointer"
                      key={workspace.value}
                      onSelect={() =>
                        onWorkspaceSelect({
                          value: workspace.value,
                          label: workspace.label || "",
                          logo: workspace.logo,
                        })
                      }
                    >
                      {workspace.logo ? (
                        <Image
                          src={workspace.logo}
                          alt="Workspace Logo"
                          width={24} 
                          height={24} 
                          className="mr-2 h-6 w-6 rounded-full"
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
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => {
                    setOpen(false);
                    workspaceModal.onOpen();
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Workspace
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <WorkspaceModal
        isOpen={workspaceModal.isOpen}
        onClose={workspaceModal.onClose}
        onCreate={handleCache}
      />
    </>
  );
}
