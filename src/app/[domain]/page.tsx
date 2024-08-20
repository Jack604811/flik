import React, { useState } from "react";
import Link from "next/link";
import { getSiteData } from "@/server/actions/domain.action";
import Image from "next/image";
import { env } from "@/env";
import { Mountain } from "lucide-react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default async function Page({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  const siteData = await getSiteData(domain);

  
  const firstSpot = siteData?.spots[0];
  const hasSpots = siteData?.spots.length! > 1;

  return (
    <div className="min-h-screen flex flex-col">
      <header>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <div className="flex justify-between items-center h-16 w-full px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center" href="/">
            {siteData?.logo ? (
              <>
                <Image
                  width={100}
                  height={100}
                  src={`${siteData.logo}?${Date.now()}`}
                  alt={siteData.siteName!}
                  unoptimized
                />
                <span className="ml-2 text-lg font-bold">
                  {siteData?.siteName ?? ""}
                </span>
              </>
            ) : (
              <span className="ml-2 text-lg font-bold">
                {siteData?.siteName ?? ""}
              </span>
            )}
          </Link>

          <div className="flex items-center space-x-8">
          

            <ModeToggle />
          </div>
        </div>
      </header>

      {/*<section
        className={`relative w-full ${
          hasSpots ? "h-[70vh]" : "h-[90vh]"
        }`}
      >
        <Image
          alt={firstSpot?.name ?? "Hero Image"}
          className="absolute inset-0 h-full w-full object-cover"
          height="1080"
          src={firstSpot?.images[0]?.url ?? "/placeholder.svg"}
          style={{
            aspectRatio: "3840 x 2160",
            objectFit: "cover",
          }}
          width="3840"
        />
        <div className="absolute inset-0 bg-gray-900/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {firstSpot?.name ?? "Add Spot In Your Dashboard"}
          </h1>
          <p className="mt-4 text-lg line-clamp-3">{firstSpot?.description}</p>

          <div className="mt-8">
            {firstSpot ? (
              <Link
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                href={`/${firstSpot.id}`}
              >
                Explore Now
              </Link>
            ) : (
              <Link
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                href={`${
                  process.env.NODE_ENV === "production" ? "https://" : "http://"
                }${env.NEXT_PUBLIC_ROOT_DOMAIN}/spots/new`}
                target="__blank"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>*/}
      {siteData?.spots.length && (
        <section className="py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Featured Spots
              </h2>
              <p className="mt-4 text-gray-500">
                Discover our most popular spots.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {siteData?.spots.slice(0).map((spot) => (
                <div
                  className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:border-2 dark:rounded-xl"
                  key={spot.id}
                >
                  <Link href={`/${spot.path ? spot.path : spot.id}`}>
                  <Image
                    alt={spot.name}
                    className="h-64 w-full object-cover"
                    height="300"
                    src={spot.images[0].url}
                    style={{
                      aspectRatio: "16/9",
                      objectFit: "cover",
                    }}
                    width="320"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">
                      {spot.name}
                    </h3>
                    <p className="mt-2 line-clamp-3">
                      {spot.description}
                    </p>
                    <div className="mt-4">
                      <Button className="hover:scale-105">Explore</Button>
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <footer className="mt-auto py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <Link className="flex items-center" href="/">
                {siteData?.logo ? (
                  <>
                    <Image
                      width={100}
                      height={300}
                      src={`${siteData.logo}?${Date.now()}`}
                      alt={siteData.siteName!}
                    />
                    <span className="ml-2 text-lg font-bold">
                      {siteData?.siteName ?? ""}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="ml-2 text-lg font-bold">
                      {siteData?.siteName ?? ""}
                    </span>
                  </>
                )}
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-8">
              <Link className="text-gray-400 hover:text-white" href="/">
                Home
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © 2024 {siteData?.siteName} All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
