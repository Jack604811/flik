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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Spot Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Min. Guest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spots.map((spot) => (
                  <TableRow key={spot.id}>
                    <TableCell className="font-semibold">
                      <Link href={`/spots/${spot.id}`} className="text-primary">
                      {spot.name}
                      </Link>
                    </TableCell>
                    <TableCell>{spot.status}</TableCell>
                    <TableCell>{spot.minGuest} guest(s)</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
