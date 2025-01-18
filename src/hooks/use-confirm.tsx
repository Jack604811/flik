import React, { useState, useCallback } from "react";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";

interface ConfirmCredenzaProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmCredenza: React.FC<ConfirmCredenzaProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
}) => (
  <Credenza open={true} onOpenChange={onCancel}>
    <CredenzaContent>
      <CredenzaHeader>
        <CredenzaTitle>{title}</CredenzaTitle>
        <CredenzaDescription>{description}</CredenzaDescription>
      </CredenzaHeader>

      <CredenzaFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </CredenzaFooter>
    </CredenzaContent>
  </Credenza>
);

const useConfirm = (title: string, description: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(
    () => {}
  );

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

  const ConfirmCredenzaComponent = useCallback(() => {
    if (!isOpen) return null;
    return (
      <ConfirmCredenza
        title={title}
        description={description}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  }, [isOpen, title, description, handleConfirm, handleCancel]);

  return [ConfirmCredenzaComponent, confirm] as const;
};

export default useConfirm;
