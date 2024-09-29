"use client"

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
import WorkspaceModal from './workspace-modal'; 
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

interface WorkspacesData {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
}

export default function WorkspaceSwitcher({ className }: { className?: string }) {
  const workspaceModal = useWorkspaceModal(); 
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const defaultWorkspace = {
    id: '',
    siteName: 'Loading...',
  } as Workspace;

  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(defaultWorkspace);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const saveCurrentWorkspace = async (workspaceId: string) => {
    try {
      const response = await fetch('/api/workspaces/update-current-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update current workspace');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch('/api/workspaces');
        if (!response.ok) {
          throw new Error('Failed to fetch workspaces');
        }
        const data: WorkspacesData = await response.json();
        setWorkspaces(data.workspaces);

        let selectedWorkspace = defaultWorkspace;

        if (data.currentWorkspaceId) {
          const foundWorkspace = data.workspaces.find(
            (workspace) => workspace.id === data.currentWorkspaceId
          );
          if (foundWorkspace) {
            selectedWorkspace = foundWorkspace;
          }
        } else if (data.workspaces.length > 0) {
          selectedWorkspace = data.workspaces[0];
        }

        setCurrentWorkspace(selectedWorkspace);
      } catch (error) {
        console.error(error);
        setError('Failed to load workspaces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 'defaultWorkspace' can safely be excluded from the dependency array

  const formattedItems = workspaces.map((item) => ({
    label: item.siteName,
    value: item.id,
  }));

  const onWorkspaceSelect = async (workspace: { value: string; label: string }) => {
    setOpen(false);
    const selectedWorkspace = workspaces.find(
      (item) => item.id === workspace.value
    );
    if (selectedWorkspace) {
      setCurrentWorkspace(selectedWorkspace);
      await saveCurrentWorkspace(selectedWorkspace.id);
      router.refresh();
    }
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
            className={cn('w-full max-w-6xl h-12 justify-between', className)}
          >
            <WorkspaceIcon className="mr-2 h-4 w-4" />
            {currentWorkspace.siteName}
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
                          label: workspace.label || '',
                        })
                      }
                    >
                      <WorkspaceIcon className="mr-2 h-4 w-4" />
                      {workspace.label}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          currentWorkspace.id === workspace.value
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