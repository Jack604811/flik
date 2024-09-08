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
  className="text-red-500 w-full h-8 flex items-center gap-2 bg-inherit hover:bg-transparent hover:text-red-500 justify-start text-left"
>
  <LogOut size={15} className="text-red-500" />
  <span>Logout</span>
</Button>
  );
}
