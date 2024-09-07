import React from "react";
import { getSiteData } from "@/server/actions/domain.action";
import { ModeToggle } from "@/components/main/theme-toggle";
import Link from "next/link";
import Image from "next/image";


interface HeaderProps {
    siteData: {
      logo?: string;
      siteName?: string;
    };
  }
 
  export default function Header({ siteData }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 bg-inherit">
      <div className="flex justify-between items-center w-full h-16 px-4 sm:px-6 lg:px-8">
        <Link className="" href="/">
          {siteData?.logo ? (
            <Image
              width={100}
              height={100}
              src={`${siteData.logo}?${Date.now()}`} 
              alt={siteData.siteName || "Site Logo"}
              unoptimized
              className="max-w-[90px]"
            />
          ) : (
            <span className="ml-2 text-lg font-bold">
              {siteData?.siteName || "Site Name"} 
            </span>
          )}
        </Link>

        <div className="flex items-center space-x-8">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
