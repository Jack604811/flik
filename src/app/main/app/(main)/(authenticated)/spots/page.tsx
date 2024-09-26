import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSpotsByWorkspace } from "@/server/actions/spot.action";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spots",
  description: "A list of spots of your place",
}

export default async function Page() {
  const currentWorkspace = await getCurrentWorkspace();
  const spots = await getSpotsByWorkspace({ workspaceId: currentWorkspace!.id });

  return (
    <>
      <div className="flex-1 p-6 pt-16 space-y-8 md:p-8 md:pt-16">
        <div className="flex items-center justify-between space-y-2">
          <div className="mt-8 mx-8">
            <h2 className="text-2xl font-bold tracking-tight">Spots</h2>
            <p className="text-muted-foreground">
              Available spots show here, and you can edit them
            </p>
          </div>
          <Link href="/spots/new">
            <Button size="sm" className="h-10 gap-1 xs:rounded-full lg:rounded-md">
              <PlusCircle className="h-5 w-5 md:h-3.5 md:w-3.5" />
              <span className="sr-only md:not-sr-only md:whitespace-nowrap">
                Add a new spot
              </span>
            </Button>
          </Link>
        </div>
        {spots.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 justify-items-start items-start">
            {spots.map((spot) => (
              <div
                className="group relative overflow-hidden rounded-xl border-solid border-1 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-2"
                key={spot.id}
              >
                <Link href={`/spots/${spot.id}`}>
                  <Image
                    alt={spot.name}
                    className="transition-all duration-300 group-hover:scale-110"
                    height={80}
                    src={spot.images[0]?.url ?? "/placeholder.svg"}
                    style={{
                      aspectRatio: "4/3",
                      objectFit: "cover",
                    }}
                    width={500}
                  />
                  <div className="p-4">
                    <div className="flex flex-row gap-2 justify-between items-center">
                      <h2 className="text-2xl font-bold mb-2 line-clamp-1">{spot.name}</h2>
                      <Badge
                        variant={
                          spot.status === "Public" ? "outline" : "outline"
                        }
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
          <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no spots
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a spot.
              </p>
              <Link href="/spots/new">
                <Button className="mt-4">Add your first spot</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
