'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Briefcase as WorkspaceIcon,
} from 'lucide-react';
import { Workspace } from '@prisma/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { useWorkspaceModal } from '@/hooks/use-workspace-modal';
import useSWR from 'swr';

// Lazy load the workspace modal
const WorkspaceModal = dynamic(() => import('./workspace-modal'), { ssr: false });

interface WorkspacesData {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
}

// Fetcher function for SWR to load all workspaces from the API
const fetchWorkspaces = async () => {
  const response = await fetch('/api/workspaces');
  if (!response.ok) {
    throw new Error('Failed to fetch workspaces');
  }
  return response.json();
};

// Helper to store the current workspace in localStorage
const saveWorkspaceToLocalStorage = (workspace: Workspace) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
  }
};

// Helper to retrieve the current workspace from localStorage
const getWorkspaceFromLocalStorage = (): Workspace | null => {
  if (typeof window === 'undefined') return null;

  const storedWorkspace = localStorage.getItem('currentWorkspace');
  return storedWorkspace ? JSON.parse(storedWorkspace) : null;
};

// Helper to store workspaces in localStorage
const saveWorkspacesToLocalStorage = (workspaces: Workspace[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }
};

// Helper to retrieve workspaces from localStorage
const getWorkspacesFromLocalStorage = (): Workspace[] | null => {
  if (typeof window === 'undefined') return null;

  const storedWorkspaces = localStorage.getItem('workspaces');
  return storedWorkspaces ? JSON.parse(storedWorkspaces) : null;
};

export default function WorkspaceSwitcher({ className }: { className?: string }) {
  const workspaceModal = useWorkspaceModal();
  const router = useRouter();

  const { data, error, mutate } = useSWR<WorkspacesData>('/api/workspaces', fetchWorkspaces, {
    revalidateOnFocus: false,
    fallbackData: { workspaces: [], currentWorkspaceId: null },
  });

  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true); // New loading state

  // On component mount, load workspace from localStorage first (immediately)
  useEffect(() => {
    const storedWorkspace = getWorkspaceFromLocalStorage();
    const storedWorkspaces = getWorkspacesFromLocalStorage();

    // If workspaces exist in localStorage, use them
    if (storedWorkspaces && storedWorkspaces.length > 0) {
      setCurrentWorkspace(storedWorkspace || storedWorkspaces[0]);
      setIsInitialLoading(false); // Stop the initial loading state
    } else {
      // If no workspaces in localStorage, fetch from API
      mutate();
    }
  }, [mutate]);

  // When data is available, update the currentWorkspace and localStorage
  useEffect(() => {
    if (data?.workspaces && isInitialLoading) {
      const storedWorkspaceId = getWorkspaceFromLocalStorage()?.id;
      let defaultWorkspace = data.workspaces[0]; // Default to the first workspace

      if (storedWorkspaceId) {
        const foundWorkspace = data.workspaces.find(
          (workspace) => workspace.id === storedWorkspaceId
        );
        if (foundWorkspace) {
          defaultWorkspace = foundWorkspace;
        }
      }

      setCurrentWorkspace(defaultWorkspace);
      saveWorkspaceToLocalStorage(defaultWorkspace); // Save to localStorage
      saveWorkspacesToLocalStorage(data.workspaces); // Save workspaces to localStorage
      setIsInitialLoading(false); // Stop the initial loading state
    }
  }, [data, isInitialLoading]);

  const saveCurrentWorkspace = async (workspaceId: string) => {
    try {
      const selectedWorkspace = data?.workspaces.find((ws) => ws.id === workspaceId);
      if (selectedWorkspace) {
        // Save the selected workspace to localStorage and state
        setCurrentWorkspace(selectedWorkspace);
        saveWorkspaceToLocalStorage(selectedWorkspace);
        router.refresh(); // Optional: refresh the page to reflect the new workspace
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onWorkspaceSelect = async (workspace: { value: string; label: string }) => {
    setOpen(false);
    await saveCurrentWorkspace(workspace.value);
  };

  if (isInitialLoading || !data) {
    return <div>Loading workspaces...</div>;
  }

  if (error) {
    return <div>Error loading workspaces</div>;
  }

  const formattedItems = data?.workspaces.map((item) => ({
    label: item.siteName,
    value: item.id,
  })) || [];

  const workspaceName = currentWorkspace?.siteName || '';

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
            className={cn('w-full max-w-6xl h-12 justify-between', className)}
          >
            <WorkspaceIcon className="mr-2 h-4 w-4" />
            {workspaceName} {/* No more loading states */}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-1">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search workspace..." />
              {formattedItems.length === 0 ? (
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
                          label: workspace.label || '',
                        })
                      }
                    >
                      <WorkspaceIcon className="mr-2 h-4 w-4" />
                      {workspace.label}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          currentWorkspace?.id === workspace.value
                            ? 'opacity-100'
                            : 'opacity-0'
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
      />
    </>
  );
}
