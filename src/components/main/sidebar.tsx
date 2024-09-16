"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Archive, CreditCard, MapPin, Square, Star, Settings, Zap, Calendar, Landmark, ShoppingCart, Menu, AlignLeft, AlignRight } from "lucide-react";
import Image from 'next/image';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { APP_NAME } from '@/app-settings';
import { ModeToggle } from './theme-toggle';
import  SidebarProfileDropdown from './sidebar-profile-dropdown';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");
  const archived = searchParams.get("archived");
  const pathname = usePathname();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";
  
  const handleLinkClick = () => {
    setIsOpen(false); 
  };


  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col min-w-[248px] h-screen p-0 gap-14 border-r sticky top-0">
          <Link href={rootDomain} className="flex items-center gap-2 text-lg font-semibold md:text-base mt-4 ml-4">
            <strong className="font-extrabold tracking-tight text-xl md:text-2xl">
              {APP_NAME}
            </strong>
          </Link>
        <Command className="gap-4 bg-inherit">
          {/*<CommandInput placeholder="Search..." />*/}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup //heading="Main"
            >
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/dashboard") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/dashboard">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4 mr-0" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/bookings") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/bookings">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 mr-0" />
                      <span>Bookings</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/transactions") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/transactions">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-4 w-4 mr-0" />
                      <span>Transactions</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/extras") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/extras">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 mr-0" />
                      <span>Extras</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/spots") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/spots">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 mr-0" />
                      <span>Spots</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
              {/* <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/integrations") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/integrations">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 mr-0" />
                      <span>Integrations</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
              {process.env.NODE_ENV === 'development' && 
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/billing") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/billing">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 mr-0" />
                      <span>Billing</span>
                    </div>
                  </Link>
                </Button>
              </CommandItem>
              } */}
              <CommandItem className="h-[32px]">
                <Button
                  asChild
                  variant={pathname.includes("/settings") ? "secondary" : "ghost"}
                  className="justify-start px-2 w-full h-[32px]">
                  <Link href="/settings">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 mr-0" />
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
                        <Square className="h-4 w-4 mr-0" />
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
                        <Star className="h-4 w-4 mr-0" />
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
                        <Archive className="h-4 w-4 mr-0" />
                        <span>Archived</span>
                      </div>
                    </Link>
                  </Button>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <SidebarProfileDropdown/>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="lg"
            className="lg:hidden fixed top-3 right-2 z-50 p-4"
          >
            <AlignRight className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger> */}
        <SheetContent side="right" className="p-0">
          <div className="flex flex-col gap-10">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base mt-4 ml-4">
            <strong className="font-extrabold tracking-tight text-xl md:text-2xl">
              {APP_NAME}
            </strong>
          </Link>
            <Command className="gap-0 bg-inherit">
              {/*<CommandInput placeholder="Search..." />*/}
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup //heading="Main"//
                >
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/dashboard") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                      onClick={handleLinkClick}>
                      <Link href="/dashboard">
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4 mr-0" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/bookings") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                        onClick={handleLinkClick}>
                      <Link href="/bookings">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 mr-0" />
                          <span>Bookings</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/transactions") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                      onClick={handleLinkClick}>
                      <Link href="/transactions">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 mr-0" />
                          <span>Transactions</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/extras") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                      onClick={handleLinkClick}>
                      <Link href="/extras">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 mr-0" />
                          <span>Extras</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/spots") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                      onClick={handleLinkClick}>
                      <Link href="/spots">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 mr-0" />
                          <span>Spots</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/integrations") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                      onClick={handleLinkClick}>
                      <Link href="/integrations">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 mr-0" />
                          <span>Integrations</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                  {process.env.NODE_ENV === 'development' &&
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/billing") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                      onClick={handleLinkClick}>
                      <Link href="/billing">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 mr-0" />
                          <span>Billing</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                  }
                  <CommandItem className="h-[32px]">
                    <Button
                      asChild
                      variant={pathname.includes("/settings") ? "secondary" : "ghost"}
                      className="justify-start px-2 w-full h-[32px]"
                      onClick={handleLinkClick}>
                      <Link href="/settings">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 mr-0" />
                          <span>Settings</span>
                        </div>
                      </Link>
                    </Button>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
         
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
