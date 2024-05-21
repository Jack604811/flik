import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSpotsByUser } from "@/server/actions/spot.action";
import { getCurrentUser } from "@/server/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const currentUser = await getCurrentUser();
  const spots = await getSpotsByUser({ userId: currentUser!.id });
  return (
    <div>
      {spots.length ? (
        <Card x-chunk="dashboard-07-chunk-1" className="m-4 border-none shadow-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="space-y-4">
                <CardTitle>Spots</CardTitle>
                <CardDescription>
                  Available spots shows here and you can edit them
                </CardDescription>
              </div>
              <Link href="/spots/new">
                <Button className="mt-4">Add a new spot</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
          <div className="container mx-auto p-0">
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-start dark: border-white">
    {spots.map((spot) => (
      <div
        className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
        key={spot.id}>
        <Link href={`/spots/${spot.id}`}>
          <div>
            <Image
              alt={spot.name}
              className="transition-all duration-300 group-hover:scale-110"
              height={80}
              src={spot.images[0]?.url ?? "/placeholder.svg"}
              style={{
                aspectRatio: "4/3",
                objectFit: "cover",
              }}
              width={500}/>
                    </div>
                  <div className="p-4">
                    <div className="flex flex-row gap-2 justify-between items-center">
                      <h2 className="text-2xl font-bold mb-2 line-clamp-1">{spot.name}</h2>
                      <Badge
                        variant={
                          spot.status === "Public"
<<<<<<< Updated upstream
                            ? "default"
                            : spot.status === "Private"
                            ? "secondary"
                            : "destructive"
=======
                            ? "outline"
                            : spot.status === "Private"
                            ? "outline"
                            : "outline"
>>>>>>> Stashed changes
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
            </div>
          </CardContent>
          
        </Card>
        
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
  );
}
