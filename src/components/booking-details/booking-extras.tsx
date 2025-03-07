import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  addExtrasToBooking,
  getExtrasByBooking,
  removeExtraFromBooking,
  updateBookingExtra,
} from "@/server/actions/booking.action";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CirclePlus, MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import { getExtrasBySpotId } from "@/server/actions/extra.action";
import { categorizeExtras } from "@/lib/utils";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../main/empty-state";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
} from "@/components/ui/credenza";

function BookingExtras({
  bookingId,
  spotId,
}: {
  bookingId: string;
  spotId: string;
}) {
  const {
    data: bookingExtras = [],
    isLoading: isBookingExtrasLoading,
    refetch: refetchBookingExtras,
  } = useQuery({
    queryKey: ["bookingExtras", bookingId],
    queryFn: () => getExtrasByBooking(bookingId),
    initialData: [],
  });

  const {
    data: extras = [],
    isLoading: isExtrasLoading,
  } = useQuery({
    queryKey: ["extras", spotId],
    queryFn: () => getExtrasBySpotId(spotId),
  });

  const normalizedExtras = extras.map((extra) => ({
    ...extra,
    category: extra.category ?? undefined,  // Convert null to undefined
    subCategory: extra.subCategory ?? undefined,  // Convert null to undefined
  }));

  
  const categorizedExtras = categorizeExtras(normalizedExtras);


  // Loading state based on API fetching
  const isLoading = isBookingExtrasLoading || isExtrasLoading;

  const onAdd = (extra: {
    extraId: string;
    price: number;
    quantity: number;
    description: string;
    name: string;
  }) => {
    const promise = addExtrasToBooking({ bookingId, extras: [extra] });
    toast.promise(promise, {
      loading: `Adding ${extra.name} to booking...`,
      success() {
        refetchBookingExtras();
        return `${extra.name} added to booking successfully!`;
      },
      error: `Failed to add ${extra.name} to booking`,
    });
  };

  const onRemove = (bookingExtraId: string, name: string) => {
    const promise = removeExtraFromBooking(bookingExtraId);
    toast.promise(promise, {
      loading: `Deleting ${name} from booking...`,
      success() {
        refetchBookingExtras();
        return `Deleted ${name} successfully!`;
      },
      error: `Failed to delete ${name} from booking`,
    });
  };

  const onQuantityUpdate = async (bookingExtraId: string, quantity: number) => {
    updateBookingExtra(bookingExtraId, { quantity })
      .then(() => {
        refetchBookingExtras();
      })
      .catch(() => {});
  };

  return (
    <div className="grid">
      <div className="flex flex-col space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-0 bg-muted/50 p-4 rounded-md"
              >
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : bookingExtras.length > 0 ? (
          bookingExtras.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center gap-0 bg-muted/50 p-4 rounded-md"
            >
              <div className="flex items-center gap-4">
                <Image
                  alt={item.extra.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  height="60"
                  src={item.extra.images[0]?.url ?? "/placeholder.svg"}
                  width="60"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.extra.name}</p>
                  <p className="text-gray-500 line-clamp-1">{item.extra.description}</p>
                  <p className="font-bold text-sm">
                    ${new Intl.NumberFormat("de-DE").format(item.price)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => onRemove(item.id, item.extra.name)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No Extras Found"
            description="This booking has no extras. Add an extra to see it here."
            imageUrl="/placeholder.svg"
            buttonLabel="Add Extras"
          />
        )}
      </div>

      {/* Add Extra Popover */}
      <Credenza>
        <CredenzaTrigger asChild>
          <Button className="gap-2 w-full h-12 my-4 flex items-center" size="sm" variant="ghost">
            <CirclePlus className="h-4 w-4" />
            Add Extras
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Select Extras</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>
            <Command>
              <CommandEmpty>No extras found.</CommandEmpty>
              <CommandInput placeholder="Search extras..." />
              <ScrollArea className="max-h-[400px]">
                <CommandGroup>
                  <Accordion type="multiple">
                    {Object.entries(categorizedExtras).map(([category, subs]) => (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger>{category}</AccordionTrigger>
                        <AccordionContent>
                          {Object.entries(subs).map(([sub, extras]) => (
                            <div key={sub}>
                              <p className="text-black/50 font-semibold mb-2">{sub}</p>
                              {extras.map((extra) => (
                                <CommandItem key={extra.id} value={extra.name}>
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                      <Image
                                        alt={extra.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                        height="60"
                                        src={extra.images[0]?.url ?? "/placeholder.svg"}
                                        width="60"
                                      />
                                      <div>
                                        <p className="font-semibold">{extra.name}</p>
                                        <p className="text-gray-500 text-sm line-clamp-1">
                                          {extra.description}
                                        </p>
                                        <p className="font-bold text-sm">
                                          ${new Intl.NumberFormat("de-DE").format(extra.price)}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="default"
                                      type="button"
                                      onClick={() => onAdd({ extraId: extra.id, price: extra.price, quantity: 1, name: extra.name, description: extra.description })}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </CommandItem>
                              ))}
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CommandGroup>
              </ScrollArea>
            </Command>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}

export default BookingExtras;
