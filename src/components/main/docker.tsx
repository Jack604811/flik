"use client";
import { Moon, Sun, Settings, Home, Search, Bell, Calendar, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export function Docker() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isVisible, setIsVisible] = useState(true);
  let scrollTimeout: NodeJS.Timeout | null = null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Function to handle scroll events and hide the Docker after inactivity
  const handleScroll = () => {
    // Show the Docker when the user starts scrolling
    setIsVisible(true);

    // Clear any existing timeout to avoid hiding the Docker while still scrolling
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set a timeout to hide the Docker after 1 second of no scroll activity
    scrollTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  };

  // Attach the scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  return (
    <div
      className={`fixed bottom-2 w-full flex justify-center items-center px-4 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex justify-between items-center w-full max-w-[260px] border bg-black text-white rounded-full p-2 backdrop-blur-lg">
        <div className="flex space-x-1">
        <Link href="/dashboard">
        <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
            <Home className="h-5 w-5 text-white"/>
            <span className="sr-only">Home</span>
          </Button>
          </Link>
          <Link href="/bookings">
          <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
            <Calendar className="h-5 w-5 text-white"/>
            <span className="sr-only">Bookings</span>
          </Button>
          </Link>
          <Link href="/transactions">
          <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
            <Landmark className="h-5 w-5 text-white"/>
            <span className="sr-only">Transactions</span>
          </Button>
          </Link>
          <Link href="/settings">
          <Button variant="ghost" size="icon" className="text-white bg-transparent hover:bg-transparent">
            <Settings className="h-5 w-5 text-white"/>
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
