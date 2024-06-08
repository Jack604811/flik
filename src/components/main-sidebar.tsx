"use client"
import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Archive, CreditCard, MapPin, Square, Star, StickyNote, Settings, Zap, Calendar } from "lucide-react";
import Image from 'next/image';

export const MainSidebar = ()  => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");
  const archived = searchParams.get("archived");
  const  pathname  = usePathname();

  return (
    <div className="flex flex-col min-w-[280px] h-screen p-4 gap-10 border-r sticky top-0">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.svg" 
            alt="logo" 
            height={32} 
            width={104} 
          />
        </div>
      </Link>
      <Command className="gap-4 bg-inherit">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Main">
              <CommandItem className="h-[32px]">
                  <Button
                  asChild
                  variant={ pathname.includes("/dashboard")? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href= "/dashboard"> 
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4 mr-0"/> 
                      <span>Dashboard</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                  <Button
                  asChild
                  variant={ pathname.includes("/transactions")? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href={{
                      pathname: "/transactions",
                      
                  }}> 
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 mr-0"/>
                      <span>Transactions</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                  <Button
                  asChild
                  variant={ pathname.includes("/bookings")? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href={{
                      pathname: "/bookings",
                      
                  }}> 
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 mr-0"/>
                      <span>Bookings</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
              <Button
                  asChild
                  variant={ pathname.includes("/spots")? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href= "/spots"> 
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 mr-0"/>
                      <span>Spots</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
              <Button
                  asChild
                  variant={ pathname.includes("/integrations")? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href= "/integrations"> 
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 mr-0"/>
                      <span>Integrations</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
              <Button
                  asChild
                  variant={ pathname.includes("/billing")? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href= "/billing"> 
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 mr-0"/>
                      <span>Billing</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
              <Button
                  asChild
                  variant={ pathname.includes("/settings")? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href= "/settings"> 
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 mr-0"/>
                      <span>Settings</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
            </CommandGroup>
            
            {(pathname === "/workflows" || pathname === "/media") && (
            <CommandGroup heading="Folders">
              <CommandItem className="h-[32px]">
                  <Button
                  asChild
                  variant={(pathname.includes("/workflows") || pathname.includes("/media")) 
                  && !(favorites || archived) ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link
                  href={{
                    pathname: pathname.includes("/workflows") ? "/workflows" : "/media"
                  }}>
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4 mr-0"/>
                      <span>All</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                  <Button
                  asChild
                  variant={favorites ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                 <Link
                  href={{
                    pathname: pathname.includes("/workflows") ? "/workflows" : "/media",
                    query: { favorites: true }
                  }}>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 mr-0"/>
                      <span>Favorites</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                  <Button
                  asChild
                  variant={archived ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link
                  href={{
                    pathname: pathname.includes("/workflows") ? "/workflows" : "/media",
                    query: { archived: true }
                  }}>
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 mr-0"/>
                      <span>Archived</span>
                    </div>
                    </Link>
                  </Button>
              </CommandItem>
            </CommandGroup>
            )}
      </CommandList>
      </Command>
    </div>
  );
};


export default MainSidebar;
