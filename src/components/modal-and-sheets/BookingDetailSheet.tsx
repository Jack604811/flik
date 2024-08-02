"use client";
import { env } from "@/env";
import { CardTitle, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { ChevronsUpDownIcon, CirclePlus, Copy, Edit, MinusIcon, MoreVerticalIcon, PlusIcon, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Booking } from "@/schemas/booking.schema";
import moment from "moment";
import { BookingStatus, Spot } from "@prisma/client";
import { PhoneInput } from "@/components/ui/phone-input";
import { statuses } from "@/schemas/booking.schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect, memo } from "react";
import { updateBooking } from "@/server/actions/booking.action";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import BookingPayments from "@/app/main/(main)/(authenticated)/bookings/_components/BookingPayments";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import EditBookingDate from "@/app/main/(main)/(authenticated)/bookings/_components/EditBookingDate";
import { Textarea } from "@/components/ui/textarea";
import { useBookingDetail } from "@/hooks/use-booking-detail";
import { useQuery } from "@tanstack/react-query";
import { getSpotsByUser } from "@/server/actions/spot.action";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger,  } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

const bookingSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(BookingStatus).optional(),
  spotId: z.string().optional(),
  guest: z
    .object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      dni: z.string().optional(),
      address: z.string().optional(),
      note: z.string().optional(),
    })
    .optional(),
    updatedAt: z.date().optional(),
});

type EDITING_FIELD =
  | "name"
  | "dni"
  | "email"
  | "phone"
  | "address"
  | "status"
  | "note"
  | "spotId"
  | null;
  
function BookingDetailSheet() {
  const router = useRouter();
  const { isOpen, onOpenChange, booking, } = useBookingDetail((state) => state);

  const { data: session } = useSession();
  const { data: spots, refetch: refectSpots } = useQuery({
    queryKey: ["spots"],
    queryFn: () => getSpotsByUser({ userId: session?.user.id! }),
    initialData: [] as Spot[],
  });
  const { control, handleSubmit, reset, getValues } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: booking,
    progressive: true,
  });

  const [editingField, setEditingField] = useState<EDITING_FIELD>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
  const updatedData: z.infer<typeof bookingSchema> = {
    id: data.id,
    updatedAt: new Date(),
  };

  if (editingField === "status") {
    updatedData.status = data.status;
  } else if (editingField === "spotId") {
    updatedData.spotId = data.spotId;
  } else if (editingField && data.guest) {
    updatedData.guest = {
      id: data.guest.id,
      [editingField as keyof typeof data.guest]: data.guest[editingField as keyof typeof data.guest],
    };
  }

  const updated = updateBooking(updatedData);

  toast.promise(updated, {
    loading: `Updating ${editingField}...`,
    success() {
      router.refresh();
      setEditingField(null);
      return `${editingField} updated successfully!`;
    },
    error: `Failed to update ${editingField}`,
  });
};


  const startEditing = (field: EDITING_FIELD) => {
    setEditingField(field);
  };
  const cancelEditing = () => {
    setEditingField(null);
    reset();
  };

  useEffect(() => {
    if (booking) {
      reset(booking);
    }
  }, [booking, reset]);

  useEffect(() => {
    if (session?.user.id) refectSpots();
  }, [session?.user, refectSpots]);

  if (!isOpen && !booking) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 sm:min-w-[360px] md:min-w-[500px] xl:min-w-[600px]">
        <Card className="flex flex-col overflow-hidden justify-between h-screen">
          <CardContent className="p-0 text-sm h-[95%] relative">
            <div className="flex flex-row items-start bg-muted/50 p-6">
              <div className="grid gap-2">
                <CardTitle className="group flex items-center gap-2 text-xl">
                  {booking?.guest.name}
                </CardTitle>
                <div className="flex flex-row w-full items-center gap-2">
                  <EditBookingDate
                    endDate={booking?.endDate!}
                    startDate={booking?.startDate!}
                    spot={booking?.spot!}
                    bookingId={booking?.id!}
                  />
                </div>
                {/*<p className="text-red-500">
                  The current date are not available for {booking?.spot.name}
                </p>*/}
              </div>
              <div className="ml-auto flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8" size="icon" variant="outline">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="flex flex-col bg-white shadow-lg p-2 rounded-md border dark:bg-black overflow-y-hidden"
                    align="end"
                  >
                    <DropdownMenuItem>Copy</DropdownMenuItem>
                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem>Print</DropdownMenuItem>
                    <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Tabs
              className="mt-8 flex flex-col overflow-y-auto h-dvh"
              defaultValue="resume"
            >
              <div className="mx-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resume">Resume</TabsTrigger>
                  <TabsTrigger value="extras">Extras</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>
              </div>
              <ScrollArea className="h-5/6 pb-[100px] no-scrollbar">
                <TabsContent className="p-6" value="resume">
                  <div className="grid gap-3">
                    <div className="font-semibold">Customer Information</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <dl className="grid gap-3">
                        {[
                          "name",
                          "dni",
                          "email",
                          "phone",
                          "address",
                          "status",
                        ].map((field) => (
                          <div
                            key={field}
                            className="flex items-start justify-between"
                          >
                            <dt className="text-muted-foreground">
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </dt>
                            <dd>
                              {editingField === field ? (
                                <>
                                  {field === "phone" ? (
                                    <FormField
                                      control={control}
                                      name={`guest.${field}`}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <PhoneInput
                                          defaultCountry={"CO"}
                                          value={value}
                                          onChange={onChange}
                                        />
                                      )}
                                    />
                                  ) : field === "status" ? (
                                    <FormField
                                      control={control}
                                      name={field}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <Select
                                          onValueChange={onChange}
                                          value={value}
                                        >
                                          <SelectTrigger id={field}>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {statuses.map((status) => (
                                              <SelectItem
                                                key={status.value}
                                                value={status.value}
                                              >
                                                {status.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                    />
                                  ) : (
                                    <FormField
                                      control={control}
                                      name={`guest.${field}`}
                                      render={({ field: formField }) => (
                                        <Input
                                          {...formField}
                                          id={field}
                                          ref={
                                            inputRef as React.RefObject<HTMLInputElement>
                                          }
                                        />
                                      )}
                                    />
                                  )}
                                  <div className="flex justify-end items-center space-x-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs"
                                      onClick={cancelEditing}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      type="submit"
                                      className="text-xs"
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-between items-center relative gap-2">
                                    <span
                                      className="text-right text-sm"
                                      onClick={() => startEditing(field as any)}
                                    >
                                      {field === "status"
                                        ? statuses.find(
                                            (s) =>
                                              s.value === getValues()?.status
                                          )?.label
                                        : getValues()!.guest?.[
                                            field as keyof Booking["guest"]
                                          ] ??
                                          String(
                                            getValues()![field as keyof Booking]
                                          )}
                                    </span>
                                    <span
                                      className="cursor-pointer"
                                      onClick={() => startEditing(field as any)}
                                    >
                                      <Edit size={13} />
                                    </span>
                                  </div>
                                </>
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </form>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <dl>
                          <div className="flex items-start justify-between">
                            <dt className="text-muted-foreground">Spot</dt>
                            <dd>
                              {editingField === "spotId" ? (
                                <>
                                  <FormField
                                    control={control}
                                    name={`spotId`}
                                    render={({
                                      field: { onChange, value, name },
                                    }) => (
                                      <Select
                                        value={value}
                                        onValueChange={onChange}
                                        name={name}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {spots.map((spt, key) => (
                                            <SelectItem
                                              key={key}
                                              value={spt.id}
                                            >
                                              {spt.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                  <div className="flex justify-end items-end gap-2 space-y-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs"
                                      onClick={cancelEditing}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      type="submit"
                                      className="text-xs"
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-between items-center relative gap-2">
                                    <span className="text-right text-sm">
                                      {booking?.spot.name}
                                    </span>
                                    <span
                                      className="cursor-pointer"
                                      onClick={() => startEditing("spotId")}
                                    >
                                      <Edit size={13} />
                                    </span>
                                  </div>
                                </>
                              )}
                            </dd>
                          </div>
                        </dl>
                      </form>
                      <span className="text-sm text-end">
                        $
                        {new Intl.NumberFormat("de-DE").format(
                          booking?.subtotal ?? 0
                        )}
                      </span>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Extra Items x<span>1</span>
                        </span>
                        <span className="text-sm">$0</span>
                      </li>
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-sm">
                          $
                          {new Intl.NumberFormat("de-DE").format(
                            booking?.subtotal ?? 0
                          )}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Extras</span>
                        <span className="text-sm">$0</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="text-sm">$0</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-sm">
                          $
                          {new Intl.NumberFormat("de-DE").format(
                            booking?.totalPrice ?? 0
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator className="my-4" />
                  <div className="flex flex-col justify-between gap-8">
                    <div className="flex flex-col justify-between gap-8">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <dl>
                          {["note"].map((field) => (
                            <div
                              key={field}
                              className="flex flex-col items-start justify-between gap-4"
                            >
                              <dt className="text-muted-foreground">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                              </dt>
                              <dd className="w-full">
                                {editingField === field ? (
                                  <>
                                    <FormField
                                      control={control}
                                      name={`guest.note`}
                                      render={({ field: formField }) => (
                                        <Textarea
                                          {...formField}
                                          id={field}
                                          className="w-full"
                                          ref={
                                            inputRef as React.RefObject<HTMLTextAreaElement>
                                          }
                                        />
                                      )}
                                    />
                                    <div className="flex justify-end items-end gap-2 space-y-2 mt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={cancelEditing}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        type="submit"
                                        className="text-xs"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex w-full justify-between items-start relative gap-2">
                                      <span
                                        className="text-left text-sm flex-grow"
                                        onClick={() =>
                                          startEditing(field as any)
                                        }
                                      >
                                        {
                                          booking!.guest?.[
                                            field as keyof Booking["guest"]
                                          ]
                                        }
                                      </span>
                                      <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                          startEditing(field as any)
                                        }
                                      >
                                        <Edit size={13} />
                                      </span>
                                    </div>
                                  </>
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </form>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent className="p-6" value="extras">
                  <div key="" className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Image
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg"
                          height="60"
                          src={"/placeholder.svg"}
                          style={{
                            aspectRatio: "60/60",
                            objectFit: "cover",
                          }}
                          width="60"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">American Breakfast</p>
                        <p className="font-regular text-gray-500">description</p>
                        <p className="font-bold text-sm">$100</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 border-2 h-[32px] rounded-md">
                        <Button
                          className="border-none p-2 hover:bg-transparent"
                          variant="ghost"
                          type="button"
                          //onClick={() => update(index, {...field, quantity: (field.quantity > 1 ?  field.quantity- 1 : 1) })}
                          >
                          <MinusIcon size={16} />
                        </Button>
                        <div className="text-sm">1</div>
                        <Button
                          className="border-none p-2 hover:bg-transparent"
                          variant="ghost"
                          type="button"
                          //onClick={() => update(index, {...field, quantity: field.quantity + 1 })}
                          >
                          <PlusIcon size={16} />
                        </Button>
                      </div>
                        <Button
                          type="button"
                          className="!p-0.5 rounded-full h-auto"
                          variant="ghost"
                          //onClick={() => remove(index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Popover>
                  <PopoverTrigger asChild>
                  <Button className="gap-2 w-full h-12 my-4" size="sm" variant="ghost">
                    <CirclePlus className="h-4 w-4"/> Add extras
                  </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-[450px] p-0">
                  <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                        <CommandItem>
                        <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="flex flex-col px-2 min-w-full justify-center">
                          <AccordionItem value="item-1" className="flex flex-col">
                            <AccordionTrigger>
                              <div>Extra Category</div>
                            </AccordionTrigger>
                            <AccordionContent>
                            <div>
                              <p className="text-black/50 font-semibold mb-2">
                                Extra Subcategory
                              </p>
                              </div>
                            <div key="" className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="mr-4">
                                  <Image
                                    alt=""
                                    className="w-16 h-16 object-cover rounded-lg"
                                    height="60"
                                    src={"/placeholder.svg"}
                                    style={{
                                      aspectRatio: "60/60",
                                      objectFit: "cover",
                                    }}
                                    width="60"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold">American Breakfast</p>
                                  <p className="font-regular text-gray-500">description</p>
                                  <p className="font-bold text-sm">$100</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                              <Button
                                className=""
                                variant="default"
                                type="button">
                                Add
                              </Button>
                              </div>
                            </div>
                            </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="flex flex-col min-w-[350px]">
                            <AccordionTrigger>
                              <div>Extra Category</div>
                            </AccordionTrigger>
                            <AccordionContent>
                            <div>
                              <p className="text-black/50 font-semibold mb-2">
                                Extra Subcategory
                              </p>
                              </div>
                            <div key="" className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="mr-4">
                                  <Image
                                    alt=""
                                    className="w-16 h-16 object-cover rounded-lg"
                                    height="60"
                                    src={"/placeholder.svg"}
                                    style={{
                                      aspectRatio: "60/60",
                                      objectFit: "cover",
                                    }}
                                    width="60"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold">French Toast</p>
                                  <p className="font-regular text-gray-500">description</p>
                                  <p className="font-bold text-sm">$100</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                              <Button
                                className=""
                                variant="default"
                                type="button">
                                Add
                              </Button>
                              </div>
                            </div>
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        </CommandItem>
                    </CommandGroup>
                  </Command>
                  </PopoverContent>
                  </Popover>
                </TabsContent>
                <TabsContent className="p-6" value="payments">
                  <BookingPayments
                    bookingId={booking!.id}
                    bookingPrice={booking!.totalPrice}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
          <CardFooter className="h-[56px] border-t bg-muted/95 px-0 py-4 relative">
            <Carousel className="max-w-[540px] p-2" opts={{ loop: true }}>
              <CarouselContent>
              <CarouselItem>
                  <div className="flex flex-row items-center text-xs text-muted-foreground gap-1">
                    Booking
                    <div className="text-xs text-sky-600">{booking?.id}</div>
                    <Copy size={14}></Copy>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="text-xs text-muted-foreground">
                    Created{" "}
                    {moment(booking?.createdAt).format("DD MMMM YYYY hh:mm A")}
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="text-xs text-muted-foreground">
                    Updated{" "}
                    {moment(booking?.updatedAt).format("DD MMMM YYYY hh:mm A")}
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="">
                <CarouselNext className="h-6 w-6 rounded-md" />
              </div>
            </Carousel>
            <div className="ml-auto mr-0 w-auto"></div>
          </CardFooter>
        </Card>
      </SheetContent>
    </Sheet>
  );
}

export default BookingDetailSheet;
