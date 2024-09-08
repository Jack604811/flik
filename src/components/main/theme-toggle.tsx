"use client";

import * as React from "react";
import { Sun } from "lucide-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";


export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center">
    {theme === "dark" ? (
        <Button variant="ghost" className=" bg-inherit hover:bg-transparent lg:hover:border-zinc-900 lg:bg-[#0c0c0d]" size="icon" onClick={() => setTheme("light")}>
            <MoonIcon className="w-5 h-5" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    ) : (
        <Button variant="ghost" size="icon" className="bg-inherit hover:bg-transparent lg:hover:border-zinc-100" onClick={() => setTheme("dark")}>
            <SunIcon className="w-5 h-5" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )}
</div>
  );
}
