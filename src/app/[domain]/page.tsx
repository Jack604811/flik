import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSiteData } from "@/server/actions/domain.action";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import CardList from "./_components/card-list";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  const siteData = await getSiteData(domain);

  
  const firstSpot = siteData?.spots[0];
  const hasSpots = siteData?.spots.length! > 1;

  return (
    <div className="flex flex-col min-h-screen items-center justify-start">

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
       <section className="w-full py-12 md:py-16 lg:py-20">
       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         <div className="mb-8 text-center">
           <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
             Featured Spots
           </h2>
           <p className="mt-4 text-gray-500">Discover our exclusive selection of spots</p>
         </div>
         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
           {siteData?.spots
             ?.map((spot: {
               id: string;
               path?: string;
               name: string;
               images: { url: string }[];
               description: string;
             }) => (
               <div
                 className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:border-2 dark:rounded-xl"
                 key={spot.id}
               >
                 <Link href={`/${spot.path ? spot.path : spot.id}`}>
                   <div className="relative h-64 w-full">
                     <Image
                       alt={spot.name}
                       className="h-full w-full object-cover"
                       src={spot.images.length > 0 ? spot.images[0].url : "/placeholder.svg"}
                       width={640}
                       height={360}
                       style={{
                         aspectRatio: "16/9",
                         objectFit: "cover",
                       }}
                     />
                   </div>
                   <div className="p-4">
                     <h3 className="text-xl font-bold">{spot.name}</h3>
                     <p className="mt-2 line-clamp-3">{spot.description}</p>
                     <div className="mt-4">
                     <Button
                       variant={"outline"}
                        className="hover:scale-105 py-2 px-4 rounded-sm"
                      >
                        Explore
                      </Button>
                     </div>
                   </div>
                 </Link>
               </div>
             ))}
         </div>
       </div>
     </section>
      )}
        
    </div>
  );
}
