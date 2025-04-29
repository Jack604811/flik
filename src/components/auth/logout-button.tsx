"use client";
import { AFTER_SIGNOUT_REDIRECT_URL } from "@/app-settings";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
export function LogoutButton() {
  return (
    <Button
  variant="ghost"
  onClick={() => signOut({ callbackUrl: AFTER_SIGNOUT_REDIRECT_URL })}
  className="flex justify-start items-center gap-2 w-full py-0 px-3 text-red-500 hover:bg-red-50 hover:text-red-500 dark:bg-background">

  <LogOut size={15} className="text-red-500" />
  <span>Logout</span>
</Button>
  );
}
