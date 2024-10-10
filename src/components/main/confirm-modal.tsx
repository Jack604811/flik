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
  warningText: string;
  onConfirm: () => void;
}

function ConfirmModal({ children, onConfirm, warningText }: ConfirmModalProps) {
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
          
          <Button
            className="btn btn-secondary"
            onClick={handleConfirm}
          >
            Delete Forever
          </Button>

          <CredenzaClose asChild>
            <Button className="" variant={"outline"} data-close>Cancel</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

export default ConfirmModal;
