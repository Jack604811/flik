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
        <Card x-chunk="dashboard-07-chunk-1" className="m-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="space-y-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 m-3">
              {spots.map((spot) => (
                <div
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                  key={spot.id}
                >
                  <Link href={`/spots/${spot.id}`}>
                    <div className="relative">
                      <Image
                        alt={spot.name}
                        className="w-full h-64 object-cover"
                        height={500}
                        src="/placeholder.svg"
                        style={{
                          aspectRatio: "800/500",
                          objectFit: "cover",
                        }}
                        width={800}
                      />
                      <Badge
                        variant={
                          spot.status === "Active"
                            ? "default"
                            : spot.status === "Draft"
                            ? "secondary"
                            : "destructive"
                        }
                        className="absolute bottom-4 right-4 px-4 py-2 rounded-md"
                      >
                        {spot.status}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">{spot.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {spot.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
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
              <Button className="mt-4">Add a new spot</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
