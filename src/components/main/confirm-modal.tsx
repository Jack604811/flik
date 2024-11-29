import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "../ui/button";

interface ConfirmModalProps {
  children: React.ReactNode;
  warningText: React.ReactNode;
  onConfirm: () => void;
  confirmButtonText?: string; // Customizable button text
  confirmButtonClassName?: string; // Customizable button className
  cancelButtonText?: string; // Customizable cancel button text
  cancelButtonClassName?: string; // Customizable cancel button className
}

function ConfirmModal({
  children,
  onConfirm,
  warningText,
  confirmButtonText = "Delete Forever", // Default text
  confirmButtonClassName = "btn btn-secondary", // Default className
  cancelButtonText = "Cancel", // Default text for cancel
  cancelButtonClassName = "", // Default className for cancel
}: ConfirmModalProps) {
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (onConfirm) {
      onConfirm();
      // Close the modal after confirming
      const closeButton = document.querySelector('[data-close]') as HTMLElement;
      if (closeButton) closeButton.click();
    }
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Are you sure?</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <CredenzaDescription>{warningText}</CredenzaDescription>
        </CredenzaBody>
        <CredenzaFooter className="flex md:ml-auto gap-2 md:flex-row-reverse justify-end">
          {/* Confirm Button */}
          <Button
            className={confirmButtonClassName}
            onClick={handleConfirm}
          >
            {confirmButtonText}
          </Button>

          {/* Cancel Button */}
          <CredenzaClose asChild>
            <Button className={cancelButtonClassName} variant={"outline"} data-close>
              {cancelButtonText}
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

export default ConfirmModal;
