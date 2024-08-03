import React from "react";
import { Separator } from "@/components/ui/separator";
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
import _ from "lodash";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CirclePlus, MinusIcon, PlusIcon, X } from "lucide-react";
import { getExtrasBySpotId } from "@/server/actions/extra.action";
import { categorizeExtras } from "@/app/[domain]/[spotId]/_components/util";
import { toast } from "sonner";

function BookingExtras({
  bookingId,
  spotId,
}: {
  bookingId: string;
  spotId: string;
}) {
  const {
    data: bookingExtras,
    isLoading: isBookingExtrasLoading,
    refetch: refetchBookingExtras,
  } = useQuery({
    queryKey: ["bookingExtras", bookingId],
    queryFn: () => getExtrasByBooking(bookingId),
    initialData: [],
  });
  const extrasQuery = useQuery({
    queryKey: ["extras", spotId],
    queryFn: () => getExtrasBySpotId(spotId),
  });

  const categorizedExtras = categorizeExtras(extrasQuery.data as any);

  const onAdd = (extra: {
    extraId: string;
    price: number;
    quantity: number;
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

  const onRemove = (bookingExtraId: string, name: string) =>  {
    const promise = removeExtraFromBooking(bookingExtraId);
    toast.promise(promise, {
      loading: `Adding ${name} to booking...`,
      success() {
        refetchBookingExtras();
        return `${name} added to booking successfully!`;
      },
      error: `Failed to add ${name} to booking`,
    });

    
  }

  const onQuantityUpdate = async (bookingExtraId: string, quantity: number ) => {
        updateBookingExtra(bookingExtraId, {quantity}).then(() => {
            refetchBookingExtras();
        }).catch(e => {})
  }

  return (
    <div className="grid gap-3">
      <div className="font-semibold">Overview</div>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Extras</span>
          <span>x{bookingExtras.reduce((t, i) => t + i.quantity, 0)}</span>
        </li>
        <li className="flex items-center justify-between font-semibold">
          <span className="text-muted-foreground">Total</span>
          <span>
            $
            {new Intl.NumberFormat("de-DE")
              .format(
                bookingExtras.reduce((t, i) => t + i.quantity * i.price, 0)
              )
              .replace(",", ".")}
          </span>
        </li>
      </ul>
      <Separator className="my-4" />
      <div className="flex flex-col space-y-6">
        {isBookingExtrasLoading
          ? "Loading..."
          : bookingExtras.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-1"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-2">
                    <Image
                      alt={item.extra.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      height="60"
                      src={item.extra.images[0]?.url ?? "/placeholder.svg"}
                      style={{
                        aspectRatio: "60/60",
                        objectFit: "cover",
                      }}
                      width="60"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.extra.name}</p>
                    <p className="font-regular text-gray-500 line-clamp-2">
                      {item.extra.description}
                    </p>
                    <p className="font-bold text-sm">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border-2 h-[32px] rounded-md">
                      <Button
                        className="border-none p-2 hover:bg-transparent"
                        variant="ghost"
                        type="button"
                        onClick={() => onQuantityUpdate(item.id, (item.quantity > 1 ?  item.quantity- 1 : 1))}
                      >
                        <MinusIcon size={16} />
                      </Button>
                      <div className="text-sm">{item.quantity}</div>
                      <Button
                        className="border-none p-2 hover:bg-transparent"
                        variant="ghost"
                        type="button"
                        onClick={() => onQuantityUpdate(item.id,  item.quantity + 1)}
                      >
                        <PlusIcon size={16} />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="!p-0.5 rounded-full h-auto"
                      variant="ghost"
                      onClick={() => onRemove(item.id, item.extra.name)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Add Extra Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="gap-2 w-full h-12 my-4" size="sm" variant="ghost">
            <CirclePlus className="h-4 w-4" /> Add extras
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-[450px] p-0">
          <Command>
            <CommandInput placeholder="Search extras..." />
            {/* <CommandEmpty>No extra found.</CommandEmpty> */}
            <CommandGroup>
            <Accordion
                  type="multiple"
                  defaultValue={Object.keys(categorizedExtras).map((k) =>
                    k.toLowerCase()
                  )}
                  className="flex flex-col px-2 min-w-full justify-center"
                >
                  {Object.entries(categorizedExtras).map(([category, subs]) => (
                    <AccordionItem
                      value={category.toLowerCase()}
                      key={category.toLowerCase()}
                      className="flex flex-col"
                    >
                      <AccordionTrigger>
                        <div>{category}</div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {Object.entries(subs).map(([sub, extras]) => (
                          <div className="subcategory" key={sub.toLowerCase()}>
                            <div>
                              <p className="text-black/50 font-semibold mb-2">
                                {sub}
                              </p>
                            </div>
                            {extras.map((extra) => (
                                <CommandItem key={extra.id} value={extra.name}>
                                <div
                                    key={extra.id}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-4">
                                    <div className="flex-2">
                                        <Image
                                        alt={extra.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                        height="60"
                                        src={
                                            extra.images[0]?.url ??
                                            "/placeholder.svg"
                                        }
                                        style={{
                                            aspectRatio: "60/60",
                                            objectFit: "cover",
                                        }}
                                        width="60"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                        {extra.name}
                                        </p>
                                        <p className="font-regular text-gray-500 line-clamp-2">
                                        {extra.description}
                                        </p>
                                        <p className="font-bold text-sm">
                                        ${extra.price}
                                        </p>
                                    </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                    <Button
                                        variant="default"
                                        type="button"
                                        onClick={() =>
                                        onAdd({
                                            extraId: extra.id,
                                            price: extra.price,
                                            quantity: 1,
                                            name: extra.name,
                                        })
                                        }
                                    >
                                        Add
                                    </Button>
                                    </div>
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
          </Command>
        </PopoverContent>
      </Popover>

      {/* <div className="font-semibold">Purchase History</div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead>Date</TableHead>
              <TableHead>Extra</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? "Loading..." :data.map((item) => (
              <TableRow key={item.id}  className="h-16">
                <TableCell>{moment(item.createdAt).format("DD MMM YYYY")}</TableCell>
                <TableCell>{item.extra.name}</TableCell>
                <TableCell>${new Intl.NumberFormat('de-DE').format(item.price).replace(',', '.')}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.quantity}</Badge>
                </TableCell>
                <TableCell>
                    ${new Intl.NumberFormat('de-DE').format(item.price * item.quantity).replace(',', '.')}
                </TableCell>
                <TableCell>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
}

export default BookingExtras;
