import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import {
  CalendarDays,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  Edit,
  MoreVerticalIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Booking } from "../data/schema";
import moment from "moment";
import { BookingStatus } from "@prisma/client";
import { PhoneInput } from "@/components/ui/phone-input";
import { statuses } from "../data/data";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect, memo } from "react";
import { updateBooking } from "@/server/actions/booking.action";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import BookingPayments from "./bookingPayments";
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
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import EditBookingDate from "./EditBookingDate";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  children: React.ReactNode;
  booking?: Booking;
};

const bookingSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(BookingStatus).optional(),
  updatedAt: z.date().optional(),
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
});

type EDITING_FIELD =
  | "name"
  | "dni"
  | "email"
  | "phone"
  | "address"
  | "status"
  | "note"
  | null;

function BookingDetails({ children, booking }: Props) {
  const router = useRouter();
  const { control, handleSubmit, setValue, getValues, reset } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: booking,
  });

  const [editingField, setEditingField] = useState<EDITING_FIELD>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    const updatedData: z.infer<typeof bookingSchema> & {updatedAt: Date} = {
      id: data.id,
      updatedAt: new Date(),
    };
  

    if (editingField === "status") {
      updatedData.status = data.status;
    } else {
      updatedData.guest = {
        id: data.guest!.id,
        [editingField as string]: data.guest![editingField!],
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
  };


  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
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
                    endDate={booking!.endDate}
                    startDate={booking!.startDate}
                    spot={booking!.spot}
                  />
                  <CalendarDays className="h-5 w-5" />
                  <div className="flex flex-col gap-0">
                    <div>
                      {moment(booking?.startDate).format("DD MMM YYYY hh:mm A")}
                    </div>
                    {booking?.endDate && (
                      <div>
                        {moment(booking?.endDate).format("DD MMM YYYY 12:00")}{" "}
                        PM
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-red-500">
                  The current date are not available for {booking?.spot.name}
                </p>
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
                                          defaultCountry={'CO'}
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
                                            inputRef as React.RefObject<
                                              HTMLInputElement
                                            >
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
                                            (s) => s.value === booking?.status
                                          )?.label
                                        : booking!.guest?.[
                                            field as keyof Booking["guest"]
                                          ] ??
                                          String(
                                            booking![field as keyof Booking]
                                          )}
                                    </span>
                                    <span
                                      className="cursor-pointer"
                                      onClick={() => startEditing(field as any)}>
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
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          <div className="flex flex-row items-center gap-2">
                            Spot
                          </div>
                        </span>
                        <div className="flex flex-row items-center gap-1">
                          <span className="text-sm">{booking?.spot.name}</span>
                          <ChevronsUpDownIcon className="ml-auto h-4 w-4" />
                        </div>
                      </li>
                      <span className="text-sm text-end">
                        ${new Intl.NumberFormat('de-DE').format(booking?.totalPrice ?? 0)}
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
                        <span className="text-sm">${new Intl.NumberFormat('de-DE').format(booking?.subtotal ?? 0)}</span>
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
                        <span className="text-sm">${new Intl.NumberFormat('de-DE').format(booking?.totalPrice ?? 0)}</span>
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
                                            inputRef as React.RefObject<
                                              HTMLTextAreaElement
                                            >
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
                                        onClick={() => startEditing(field as any)}
                                      >
                                        {
                                          booking!.guest?.[
                                            field as keyof Booking["guest"]
                                          ]
                                        }
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
                  </div>
                </TabsContent>
                <TabsContent className="p-6" value="extras">
                  <div>
                    <h3 className="text-lg font-semibold">Extras</h3>
                  </div>
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
                <CarouselItem>
                  <div className="flex flex-row text-xs text-muted-foreground gap-1">
                    Booking ID
                    <div className="text-xs text-sky-600">{booking?.id}</div>
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

export default BookingDetails
