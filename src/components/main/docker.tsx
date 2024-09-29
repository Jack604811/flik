"use client";
import { Moon, Sun, Settings, Home, Search, Bell, Calendar, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export function Docker() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="fixed bottom-2 w-full flex justify-center items-center px-4 transition-opacity duration-500 opacity-100"
    >
      <div className="flex justify-between items-center w-full max-w-[260px] border bg-black text-white rounded-full p-2 backdrop-blur-lg">
        <div className="flex space-x-1">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
              <Home className="h-5 w-5 text-white" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
              <Calendar className="h-5 w-5 text-white" />
              <span className="sr-only">Bookings</span>
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
              <Landmark className="h-5 w-5 text-white" />
              <span className="sr-only">Transactions</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
              <Settings className="h-5 w-5 text-white" />
              <span className="sr-only">Open settings</span>
            </Button>
          </Link>
        </div>
        <div className="h-6 border-l border-gray-600 mx-2"></div>
        <div className="flex items-center space-x-1">
          <Link href="/profile">
            <Image
              src="/assets/profile-placeholder.svg"
              alt="Profile Placeholder"
              width={28}
              height={28}
              className="rounded-full mr-3"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Docker;
