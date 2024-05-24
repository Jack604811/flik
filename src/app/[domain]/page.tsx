import React from "react";
import Link from "next/link";
import { getSiteData } from "@/server/actions/domain.action";
import Image from "next/image";
import { env } from "@/env";
import { Mountain } from "lucide-react";

export default async function Page({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  const siteData = await getSiteData(domain);

  const firstSpot = siteData?.spots[0];
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <section className="relative h-[70vh] w-full">
        <Image
          alt={firstSpot?.name ?? "Hero Image"}
          className="absolute inset-0 h-full w-full object-cover"
          height="1080"
          src={firstSpot?.images[0]?.url ?? "/placeholder.svg"}
          style={{
            aspectRatio: "1920/1080",
            objectFit: "cover",
          }}
          width="1920"
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
      </section>
      {siteData?.spots?.length! > 1 && (
        <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Featured Spots
              </h2>
              <p className="mt-4 text-gray-500">
                Discover our most popular spots.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {siteData?.spots.slice(0).map((spot) => (
                <div
                  className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  key={spot.id}
                >
                  <Image
                    alt={spot.name}
                    className="h-64 w-full object-cover"
                    height="300"
                    src={spot.images[0].url}
                    style={{
                      aspectRatio: "400/300",
                      objectFit: "cover",
                    }}
                    width="400"
                  />
                  <div className="bg-white p-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {spot.name}
                    </h3>
                    <p className="mt-2 text-gray-500 line-clamp-3">
                      {spot.description}
                    </p>
                    <div className="mt-4">
                      <Link
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        href={`/${spot.id}`}
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* <footer className="bg-gray-900 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <Link className="flex items-center" href="#">
                <Mountain className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-lg font-bold">Travel</span>
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-8">
              <Link className="text-gray-400 hover:text-white" href="#">
                Home
              </Link>
              <Link className="text-gray-400 hover:text-white" href="#">
                Destinations
              </Link>
              <Link className="text-gray-400 hover:text-white" href="#">
                About
              </Link>
              <Link className="text-gray-400 hover:text-white" href="#">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © 2024 Travel. All rights reserved.
          </div>
        </div>
      </footer> */}
    </div>
  );
}
