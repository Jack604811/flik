import Image from "next/image"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { getCurrentUser } from "@/server/auth"
import { getExtrasByUser } from "@/server/actions/extra.action"
import moment from "moment"
import ExtraAction from "./extra-action"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Extras",
  description: "Upsells",
}

export default async function Page() {
  const currentUser = await getCurrentUser();
  const extras = await getExtrasByUser({ userId: currentUser!.id });
  return (
    <Card className="p-0 border-none shadow-none">
      <div className="mt-8 mx-8">
        <h2 className="text-2xl font-bold tracking-tight">Extras</h2>
        <p className="text-muted-foreground">
        Manage your extras and view their sales performance.
        </p>
      </div>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
        <Input
          placeholder="Search extras..."
          className="h-10 w-[150px] lg:w-[250px]"
        />
        <Link href="/extras/new">
          <Button size="sm" className="h-10 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </Link>
        </div>
      </CardHeader>
      <CardContent>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extras.map(extra => (
              <TableRow key={extra.id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={extra.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={extra.images[0].url}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/extras/${extra.id}`}>{extra.name}</Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{extra.status}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">${extra.price}</TableCell>
              <TableCell className="hidden md:table-cell">{extra._count.bookingExtras}</TableCell>
              <TableCell className="hidden md:table-cell">
                {moment(extra.createdAt).format("MM/DD/YYYY hh:mm A")}
              </TableCell>
              <TableCell>
                <ExtraAction id={extra.id} />
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  )
}
