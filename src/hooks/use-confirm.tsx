import React, { useState, useCallback } from 'react';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, description, onConfirm, onCancel }) => (
    <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle> {title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={onConfirm}>Confirm</Button>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

const useConfirm = (title: string, description: string) => {
    const [isOpen, setIsOpen] = useState(false);
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});

    const confirm = useCallback(() => {
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        resolvePromise(true);
    }, [resolvePromise]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        resolvePromise(false);
    }, [resolvePromise]);

    const ConfirmDialogComponent = useCallback(() => {
        if (!isOpen) return null;
        return (
            <ConfirmDialog
                title={title}
                description={description}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
    }, [isOpen, title, description, handleConfirm, handleCancel]);

    return [ConfirmDialogComponent, confirm] as const;
};

export default useConfirm;