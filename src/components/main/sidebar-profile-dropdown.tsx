"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronRight, User, HelpCircle, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { LogoutButton } from "../auth/logout-button";

export default function SidebarProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession(); // Fetch session data

  // Fallback data if no session is found or the user is not logged in
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@example.com";
  const userImage = session?.user?.image || "/assets/profile-placeholder.svg";


  if (status === "loading") {
    return <div></div>;
  }

  const handleButtonClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative lg:bottom-0 m-4 w-auto lg:border rounded-xl bg-gradient-to-r from-white to-gray-50 dark:bg-gradient-to-tr dark:from-transparent dark:to-transparent">
      <div
        className="flex items-center justify-between p-0 lg:p-2 w-full hover:opacity-90 transition-all cursor-pointer border-none lg:border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 py-2">
          <Image 
            src="/assets/profile-placeholder.svg" 
            alt="Profile Placeholder" 
            width={32} 
            height={32} 
            className="rounded-full"
          />
          <div className="hidden lg:flex flex-col whitespace-nowrap w-32">
            <p className="font-semibold text-sm text-ellipsis overflow-hidden">{userName}</p> 
            <p className="text-muted-foreground text-xs text-ellipsis overflow-hidden">{userEmail}</p> 
          </div>
        </div>
        <ChevronRight className="hidden lg:block w-5 h-5 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute right-0 lg:bottom-0 lg:left-full mt-2 lg:ml-4 w-48 border-6 border-white/10 rounded-xl shadow-lg">
          <div className="p-2 gap-2 border rounded-xl bg-white dark:bg-black">
            <Link href="/profile">
              <Button
                className="w-full h-8 px-4 py-2 flex items-center justify-start text-left"
                variant="ghost"
                onClick={handleButtonClick} 
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </Button>
            </Link>
            <Button 
              className="w-full h-8 px-4 py-2 flex items-center justify-start"
              variant="ghost"
              onClick={handleButtonClick} 
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              Help
            </Button>
            <Button
              className="w-full h-8 px-4 py-2 flex items-center justify-start text-left"
              variant="ghost"
              onClick={handleButtonClick} 
            >
              <FileText className="w-5 h-5 mr-3" />
              Docs
            </Button>
            <div className="my-2 border-t"></div>
            <Button 
              className="w-full h-8 px-2 py-2 flex items-center justify-start text-left whitespace-nowrap"
              variant="ghost"
              onClick={handleButtonClick} 
            >
              <LogoutButton />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
