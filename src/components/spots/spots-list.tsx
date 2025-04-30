"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/main/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";

interface Spot {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  status: string;
}

export default function SpotList({ initialSpots }: { initialSpots: Spot[] }) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (initialSpots.length > 0 || initialSpots.length === 0) {
      setSpots(initialSpots);
      setLoading(false);
    }
  }, [initialSpots]);

  const filteredSpots = spots.filter((spot) =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-10 hidden md:flex flex-row w-full h-16 bg-background px-4 items-center justify-between gap-2 border-b">
        <div className="flex w-full items-center gap-2 py-5">
          <SidebarTrigger className="-ml-1 h-4 w-5 text-muted-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold whitespace-nowrap">Spots</h1>
        </div>
        <div className="relative w-[460px]">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-16"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <span className="text-xs text-gray-500 border bg-muted/50 rounded px-1 py-0.5">
              ⌘ K
            </span>
          </span>
        </div>
        <Link href="/spots/new">
          <Button variant="add" className="h-10 gap-1 xs:rounded-full lg:rounded-md">
            Add Spot
          </Button>
        </Link>
      </header>
      <div className="flex justify-start mx-4 mt-16 py-2">
      {loading ? (
        <div className="flex justify-start">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="relative overflow-hidden rounded-xl bg-muted/50 p-4">
                <Skeleton className="h-48 w-full rounded-lg aspect-video" />
                <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="absolute top-2 right-2">
                    <Skeleton className="h-6 w-12 rounded-md" />
                </div>
                </div>
            ))}
            </div>
        </div>
        ) : filteredSpots.length > 0 ? (
          <div className="grid w-full gap-8 sm:grid-cols-1 lg:grid-cols-[repeat(auto-fit,_minmax(320px,_320px))] justify-start">
            {filteredSpots.map((spot) => (
              <div
                className="group relative overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                key={spot.id}
              >
                <Link href={`/spots/${spot.id}`}>
                <Image
                  alt={spot.name}
                  src={spot.images[0]?.url ?? "/placeholder.svg"}
                  width={320}
                  height={240}
                  className="w-full aspect-[4/3] object-cover transition-all duration-300 group-hover:scale-110"
                  />
                  <div className="p-4">
                    <div className="flex flex-row gap-2 justify-between items-center">
                      <h2 className="text-2xl font-bold mb-2 line-clamp-1">{spot.name}</h2>
                      <Badge
                        variant={spot.status === "Public" ? "outline" : "outline"}
                        className="h-6 mb-2 px-2 py-0 rounded-2xl"
                      >
                        {spot.status}
                      </Badge>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-1">
                        {spot.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[80vh]">
            <EmptyState
              title={searchTerm ? "No results found" : "No spots found"}
              description={searchTerm ? "Try adjusting your search or filters." : "Start by adding a new spot to see it here."}
              imageUrl="/placeholder.svg"
              buttonLabel="Add Spot"
              onButtonClick={() => window.location.href = "/spots/new"}
            />
          </div>
        )}
      </div>
    </>
  );
}
