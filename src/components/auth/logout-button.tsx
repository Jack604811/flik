"use client";
import { AFTER_SIGNOUT_REDIRECT_URL } from "@/app_settings";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
export function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: AFTER_SIGNOUT_REDIRECT_URL })}
      className="shrink-0 w-full flex gap-2"
    >
      <span>Logout</span>

      <LogOut size={15} />
    </Button>
  );
}
