"use client";

import { useState, useEffect } from "react";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Briefcase as WorkspaceIcon,
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
import { getWorkspaces } from "@/server/actions/workspace.action";
import { updateCurrentWorkspace } from "@/server/actions/user.action";
import { useSession } from "next-auth/react";

interface WorkspaceData {
  id: string;
  siteName: string | null;
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
    async () => await getWorkspaces(),
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
    })) || [];

  const onWorkspaceSelect = async (workspace: { value: string; label: string }) => {
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

  const handleWorkspaceCreation = () => {
    setCachedWorkspaces(null); // Clear cache on creation
    mutate(); // Refetch workspaces
  };

  if (error) return <div>Error loading workspaces</div>;

  return (
    <>
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
            <WorkspaceIcon className="mr-2 h-4 w-4" />
            {currentWorkspace?.siteName || "Select a workspace"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-1">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search workspace..." />
              {isLoading ? (
                <CommandEmpty>Loading...</CommandEmpty>
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
                        })
                      }
                    >
                      <WorkspaceIcon className="mr-2 h-4 w-4" />
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
        onCreate={handleWorkspaceCreation}
      />
    </>
  );
}
