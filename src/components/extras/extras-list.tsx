"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/main/empty-state";
import Link from "next/link";
import ExtraAction from "./extra-action";
import { SidebarTrigger } from "../ui/sidebar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "../ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Extra {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  status: string;
  price: number;
}

export default function ExtrasList({ extras }: { extras: Extra[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (extras.length > 0 || extras.length === 0) {
      setLoading(false);
    }
  }, [extras]); 

  const filteredExtras = extras.filter((extra) =>
    extra.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-10 hidden md:flex flex-row w-full h-16 bg-background px-4 items-center justify-between gap-2 border-b">
        <div className="flex w-full items-center gap-2 py-5">
          <SidebarTrigger className="-ml-1 h-4 w-5 text-muted-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold whitespace-nowrap">Extras</h1>
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
        <Link href="/extras/new">
          <Button 
          variant="add"
          className="h-10 gap-1 xs:rounded-full lg:rounded-md"
          >
            Add Product
          </Button>
        </Link>
      </header>
      <div className="mx-4 my-16 max-h-[85vh] overflow-auto">
        {loading ? (
        <div className="space-y-4">
        {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center bg-muted/50 my-2 p-2 rounded-lg">
        <div className="flex flex-row gap-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex flex-col justify-center space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            </div>
            </div>
            <Skeleton className="h-6 w-10" />
            </div>
         ))}
        </div>
        ) : filteredExtras.length > 0 ? (
          <ScrollArea>
            <Table>
              <TableBody>
                {filteredExtras.map((extra) => (
                  <TableRow key={extra.id} className="border-none hover:bg-inherit cursor-pointer">
                    <Link href={`/extras/${extra.id}`}>
                      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center bg-muted/50 border my-2 p-2 rounded-lg">
                        <div className="flex flex-row">
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt={extra.name}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={extra.images[0]?.url ?? "/placeholder.svg"}
                              width="64"
                            />
                          </TableCell>
                          <div className="flex flex-col justify-center">
                            <TableCell className="font-medium py-0">{extra.name}</TableCell>
                            <TableCell className="text-muted-foreground py-0">{extra.description}</TableCell>
                            <TableCell className="font-medium hidden md:table-cell py-0">
                              ${new Intl.NumberFormat("de-DE").format(extra.price)}
                            </TableCell>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <TableCell>
                            <Badge variant="outline">{extra.status}</Badge>
                          </TableCell>
                        </div>
                        <TableCell>
                          <ExtraAction id={extra.id} />
                        </TableCell>
                      </div>
                    </Link>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
        <div className="h-[80vh]">
          <EmptyState
            title={searchTerm ? "No results found" : "No products found"}
            description={searchTerm ? "Try adjusting your search or filters." : "Start by adding a new product to see it here."}
            imageUrl="/placeholder.svg"
            buttonLabel="Add Product"
            onButtonClick={() => window.location.href = "/extras/new"}
          />
        </div>
        )}
      </div>
    </>
  );
}
