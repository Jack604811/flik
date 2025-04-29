"use client";

import { Settings, Home, Calendar, Landmark, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { cn } from "@/lib/utils";

export function Docker() {
  const pathname = usePathname(); // Get the current path

  // Hide sidebar if the pathname is "/workspaces"
  if (pathname === "/workspaces" || pathname === "/create-workspace" || pathname.startsWith ("/spots/")) {
    return null;
  }

  // Function to determine if a tab is active
  const isActive = (path: string) => pathname === path;

  return (
    <div
      className="fixed bottom-2 w-full flex justify-center items-center px-4 transition-opacity duration-500 opacity-100"
    >
      <div className="flex justify-between items-center w-full max-w-[240px] border bg-black text-white rounded-full p-2 backdrop-blur-lg">
        <div className="flex space-x-1">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-transparent hover:bg-transparent",
              isActive("/dashboard") && "bg-neutral-800 rounded-full"
            )}
          >
            <Home
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isActive("/dashboard") && "text-white"
              )}
            />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
        <Link href="/calendar">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-transparent hover:bg-transparent",
              isActive("/calendar") && "bg-neutral-800 rounded-full"
            )}
          >
            <Calendar
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isActive("/calendar") && "text-white"
              )}
            />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
        <Link href="/extras">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-transparent hover:bg-transparent",
              isActive("/extras") && "bg-neutral-800 rounded-full"
            )}
          >
            <ShoppingCart
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isActive("/extras") && "text-white"
              )}
            />
            <span className="sr-only">Extras</span>
          </Button>
        </Link>
        <Link href="/spots">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-transparent hover:bg-transparent",
              isActive("/spots") && "bg-neutral-800 rounded-full"
            )}
          >
            <MapPin
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isActive("/spots") && "text-white"
              )}
            />
            <span className="sr-only">Spots</span>
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-transparent hover:bg-transparent",
              isActive("/settings") && "bg-neutral-800 rounded-full"
            )}
          >
            <Settings
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isActive("/settings") && "text-white"
              )}
            />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
        </div>
        {/* <div className="h-6 border-l border-gray-600 mx-2"></div>
        <div className="flex items-center space-x-1">
          <Link href="/account">
            <Image
              src="/assets/profile-placeholder.svg"
              alt="Profile Placeholder"
              width={28}
              height={28}
              className="rounded-full mr-3"
            />
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default Docker;
