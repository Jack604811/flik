import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWorkspaceModal } from '@/hooks/use-workspace-modal';
import { useState } from 'react';
import { createWorkspace } from '@/server/actions/workspace.action'; 

export default function WorkspaceModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [workspaceName, setWorkspaceName] = useState('');

  const handleCreateWorkspace = async () => {
    // Close the modal immediately before the creation
    onClose();

    try {
      await createWorkspace(workspaceName);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>Enter the name of your new workspace</DialogDescription>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Workspace Name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateWorkspace}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
