"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

import {
  getExtrasByBooking,
  addExtrasToBooking,
  removeExtraFromBooking,
  updateBookingExtra,
} from "@/server/actions/booking.action";
import { getExtrasBySpotId } from "@/server/actions/extra.action";

import { ScrollArea } from "../ui/scroll-area";
import { EmptyState } from "../main/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
} from "@/components/ui/credenza";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

type BookingExtrasProps = {
  bookingId: string;
  spotId: string;
};

export default function BookingExtras({ bookingId, spotId }: BookingExtrasProps) {
  const queryClient = useQueryClient();
  const bookingExtrasKey = ["bookingExtras", bookingId] as const;

  // 1) Query booking extras
  const {
    data: bookingExtras = [],
    isLoading: isBookingExtrasLoading,
  } = useQuery({
    queryKey: bookingExtrasKey,
    queryFn: () => getExtrasByBooking(bookingId),
    initialData: [],
  });

  // 2) Query all extras
  const {
    data: extras = [],
    isLoading: isExtrasLoading,
  } = useQuery({
    queryKey: ["extras", spotId],
    queryFn: () => getExtrasBySpotId(spotId),
    initialData: [],
  });

  const isLoading = isBookingExtrasLoading || isExtrasLoading;

  // Convert null → undefined
  const normalizedExtras = extras.map((extra: any) => ({
    ...extra,
    category: extra.category ?? undefined,
    subCategory: extra.subCategory ?? undefined,
  }));

  /**
   * ==================== Optimistic Update Helpers =====================
   */
  const optimisticUpdateExtra = async (
    bookingExtraId: string,
    newData: { description?: string; price?: number; quantity?: number }
  ) => {
    await queryClient.cancelQueries({ queryKey: bookingExtrasKey });
    const prevData = queryClient.getQueryData<any[]>(bookingExtrasKey);

    // Optimistically update local data
    queryClient.setQueryData<any[]>(bookingExtrasKey, (old = []) =>
      old.map((ex) => (ex.id === bookingExtraId ? { ...ex, ...newData } : ex))
    );

    try {
      await updateBookingExtra(bookingExtraId, newData);
      await queryClient.invalidateQueries({ queryKey: bookingExtrasKey });
    } catch (err) {
      // Revert on error
      queryClient.setQueryData(bookingExtrasKey, prevData);
      throw err;
    }
  };

  const optimisticAdd = async (extraData: {
    extraId: string;
    price: number;
    quantity: number;
    name: string;
    description: string;
  }) => {
    await queryClient.cancelQueries({ queryKey: bookingExtrasKey });
    const prevData = queryClient.getQueryData<any[]>(bookingExtrasKey);

    const tempId = `temp-${Date.now()}`;
    const newItem = {
      id: tempId,
      extraId: extraData.extraId,
      quantity: extraData.quantity,
      price: extraData.price,
      // Notice we set both item.description and item.extra.description
      // but item.description is the actual field in bookingExtras
      description: extraData.description,
      extra: {
        id: extraData.extraId,
        name: extraData.name,
        description: extraData.description,
        images: [],
      },
    };
    queryClient.setQueryData<any[]>(bookingExtrasKey, (old = []) => [...old, newItem]);

    try {
      await addExtrasToBooking({ bookingId, extras: [extraData] });
      await queryClient.invalidateQueries({ queryKey: bookingExtrasKey });
    } catch (err) {
      queryClient.setQueryData(bookingExtrasKey, prevData);
      throw err;
    }
  };

  const optimisticRemove = async (bookingExtraId: string) => {
    await queryClient.cancelQueries({ queryKey: bookingExtrasKey });
    const prevData = queryClient.getQueryData<any[]>(bookingExtrasKey);

    queryClient.setQueryData<any[]>(bookingExtrasKey, (old = []) =>
      old.filter((ex) => ex.id !== bookingExtraId)
    );

    try {
      await removeExtraFromBooking(bookingExtraId);
    } catch (err) {
      queryClient.setQueryData(bookingExtrasKey, prevData);
      throw err;
    }
  };

  const optimisticQuantity = async (bookingExtraId: string, quantity: number) => {
    if (quantity < 1) quantity = 1; // enforce min=1
    await queryClient.cancelQueries({ queryKey: bookingExtrasKey });
    const prevData = queryClient.getQueryData<any[]>(bookingExtrasKey);

    queryClient.setQueryData<any[]>(bookingExtrasKey, (old = []) =>
      old.map((ex) => (ex.id === bookingExtraId ? { ...ex, quantity } : ex))
    );

    try {
      await updateBookingExtra(bookingExtraId, { quantity });
    } catch (err) {
      queryClient.setQueryData(bookingExtrasKey, prevData);
      throw err;
    }
  };

  // =============== Handlers (Add/Remove/Update) =====================
  const onAdd = (extra: {
    extraId: string;
    price: number;
    quantity: number;
    description: string;
    name: string;
  }) => {
    const promise = optimisticAdd(extra);
    toast.promise(promise, {
      loading: `Adding ${extra.name} to booking...`,
      success: `${extra.name} added successfully!`,
      error: `Failed to add ${extra.name} to booking`,
    });
  };

  const onRemove = (bookingExtraId: string, name: string) => {
    const promise = optimisticRemove(bookingExtraId);
    toast.promise(promise, {
      loading: `Deleting ${name}...`,
      success: `Deleted ${name} successfully!`,
      error: `Failed to delete ${name}`,
    });
  };

  const onPlus = (id: string, currentQty: number) => {
    optimisticQuantity(id, currentQty + 1).catch(() => {});
  };
  const onMinus = (id: string, currentQty: number) => {
    optimisticQuantity(id, currentQty > 1 ? currentQty - 1 : 1).catch(() => {});
  };

  // We'll call this for typed changes
  const onChangeTypedQuantity = (id: string, newValue: string) => {
    // We'll parse only on blur or "Enter" => we need a subcomponent
  };

  // =============== Subcomponent: LocalQuantityInput ===============
  function LocalQuantityInput({
    itemId,
    initialQty,
    onChangeFinal,
  }: {
    itemId: string;
    initialQty: number;
    onChangeFinal: (itemId: string, finalQty: number) => void;
  }) {
    const [localValue, setLocalValue] = useState<string>(String(initialQty));

    const commitQuantity = (raw: string) => {
      let parsed = parseInt(raw || "1", 10);
      if (isNaN(parsed) || parsed < 1) parsed = 1;
      onChangeFinal(itemId, parsed);
      setLocalValue(String(parsed));
    };

    return (
      <Input
        type="number"
        className="w-4 text-center p-0 bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        onBlur={() => commitQuantity(localValue)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
      />
    );
  }

  // ==================== Render UI ====================
  return (
    <div className="grid">
      {/* Main list of added extras */}
      <div className="flex flex-col space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-2 bg-muted/50 p-4 rounded-md"
              >
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1 space-y-2 justify-around">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : bookingExtras.length > 0 ? (
          bookingExtras.map((item: any) => {
            const displayDescription =
              item.description?.trim() !== "" ? item.description : item.extra.description;

            return (
              <div
                key={item.id}
                className="flex justify-between items-center gap-0 bg-muted/50 border p-4 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <Image
                    alt={item.extra.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    height="60"
                    src={item.extra.images[0]?.url ?? "/placeholder.svg"}
                    width="60"
                  />
                  <div className="flex-1 justify-center items-center">
                    <p className="font-semibold">{item.extra.name}</p>

                    {/* Editable description (fallback above) */}
                    <Input
                      type="text"
                      defaultValue={displayDescription}
                      className="text-gray-500 line-clamp-1 h-5 bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none p-0"
                      onBlur={(e) => {
                        const newDesc = e.target.value.trim();
                        if (newDesc !== item.description) {
                          optimisticUpdateExtra(item.id, { description: newDesc });
                        }
                      }}
                    />

                    <p className="font-bold text-sm">
                      $
                      <Input
                        type="number"
                        defaultValue={new Intl.NumberFormat("de-DE").format(
                          item.price * item.quantity
                        )}
                        className="inline-block w-16 h-5 bg-transparent border-none text-sm font-bold focus-visible:ring-0 focus-visible:outline-none p-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        onBlur={(e) => {
                          const newPrice = parseFloat(e.target.value);
                          if (
                            !isNaN(newPrice) &&
                            newPrice > 0 &&
                            newPrice !== item.price
                          ) {
                            optimisticUpdateExtra(item.id, { price: newPrice });
                          }
                        }}
                      />
                    </p>
                  </div>
                </div>

                {/* Quantity Manager + Remove */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 border h-[32px] px-2 rounded-md">
                    <Button
                      variant="ghost"
                      className="p-1 hover:bg-transparent"
                      onClick={() => onMinus(item.id, item.quantity)}
                    >
                      <MinusIcon size={16} />
                    </Button>
                    <LocalQuantityInput
                      itemId={item.id}
                      initialQty={item.quantity}
                      onChangeFinal={(id, finalQty) =>
                        optimisticQuantity(id, finalQty)
                      }
                    />
                    <Button
                      variant="ghost"
                      className="p-1 hover:bg-transparent"
                      onClick={() => onPlus(item.id, item.quantity)}
                    >
                      <PlusIcon size={16} />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="p-2"
                    onClick={() => onRemove(item.id, item.extra.name)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            title="No Extras Found"
            description="This booking has no extras. Add one below."
            imageUrl="/placeholder.svg"
            buttonLabel="Add Extras"
          />
        )}
      </div>

      {/* Add Extra Popover */}
      <Credenza>
        <CredenzaTrigger asChild>
          <Button
            className="gap-2 w-full h-12 my-4 flex items-center"
            size="sm"
            variant="ghost"
          >
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
              <CommandInput placeholder="Search extras..." />
              <ScrollArea className="max-h-[600px] py-4">
                <CommandGroup>
                  {normalizedExtras.map((extra: any) => {
                    const existingItem = bookingExtras.find(
                      (bex: any) => bex.extraId === extra.id
                    );
                    return (
                      <CommandItem key={extra.id} value={extra.name}>
                        <div className="flex items-center justify-between w-full bg-muted/50 border p-4 rounded-md">
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
                                $
                                {new Intl.NumberFormat("de-DE").format(extra.price)}
                              </p>
                            </div>
                          </div>
                          {existingItem ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2 border h-[32px] px-2 rounded-md">
                                <Button
                                  variant="ghost"
                                  className="p-1 hover:bg-transparent"
                                  onClick={() =>
                                    onMinus(existingItem.id, existingItem.quantity)
                                  }
                                >
                                  <MinusIcon size={16} />
                                </Button>
                                <LocalQuantityInput
                                  itemId={existingItem.id}
                                  initialQty={existingItem.quantity}
                                  onChangeFinal={(id, finalQty) =>
                                    optimisticQuantity(id, finalQty)
                                  }
                                />
                                <Button
                                  variant="ghost"
                                  className="p-1 hover:bg-transparent"
                                  onClick={() =>
                                    onPlus(existingItem.id, existingItem.quantity)
                                  }
                                >
                                  <PlusIcon size={16} />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                className="p-1"
                                onClick={() =>
                                  onRemove(existingItem.id, extra.name)
                                }
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="default"
                              onClick={() =>
                                onAdd({
                                  extraId: extra.id,
                                  price: extra.price,
                                  quantity: 1,
                                  name: extra.name,
                                  description: extra.description,
                                })
                              }
                            >
                              Add Item
                            </Button>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
