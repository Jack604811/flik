import { Button, ButtonProps } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { twMerge } from "tailwind-merge";

interface Props extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({ isLoading, children, ...props }: Props) {
  return (
    <Button
      {...props}
      disabled={isLoading}
      className={twMerge(props.className)}
    >
      {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
      {children}
    </Button>
  );
}
