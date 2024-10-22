import React from "react";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  siteData: {
    logo?: string;
    siteName?: string;
  };
}

export default function Footer({ siteData }: FooterProps): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="z-50 bottom-0 mt-auto py-4 bg-inherit">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <Link className="flex items-center" href="/">
              {siteData?.logo ? (
                <>
                  <Image
                    width={100}
                    height={100}
                    src={`${siteData.logo}?${Date.now()}`} 
                    alt={siteData.siteName || "Site Logo"}
                    className="max-w-[90px]"
                    unoptimized 
                  />
                </>
              ) : (
                <span className="ml-2 text-lg font-bold">
                  {siteData?.siteName ?? ""}
                </span>
              )}
            </Link>
          </div>
          <div className="flex items-center text-gray-400">
          © {currentYear} {siteData?.siteName} All rights reserved.
        </div>
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-8">
            <Link className="text-gray-400 hover:text-white" href="/">
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
