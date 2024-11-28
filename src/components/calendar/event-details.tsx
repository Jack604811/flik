"use client";

import { CardTitle, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Copy, Edit, MoreVerticalIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Booking } from "@/schemas/booking.schema";
import moment from "moment";
import { BookingStatus, Spot } from "@prisma/client";
import { PhoneInput } from "@/components/ui/phone-input";
import { statuses } from "@/schemas/booking.schema";
import { useForm } from "react-hook-form";
import {  z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect, memo } from "react";
import { updateBooking } from "@/server/actions/booking.action";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import BookingPayments from "../booking/BookingPayments";
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
import EditBookingDate from "../booking/EditBookingDate";
import { Textarea } from "@/components/ui/textarea";
import { useBookingDetail } from "@/hooks/use-booking-detail";
import { useQuery } from "@tanstack/react-query";
import { getSpotsByWorkspace } from "@/server/actions/spot.action";
import { getCurrentWorkspace } from "@/server/actions/user.action";
import BookingExtras from "../booking/BookingExtras";
import { getCustomFields } from "@/server/actions/custom-field.action";

const bookingSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  status: z.nativeEnum(BookingStatus).optional(),
  spotId: z.string().optional(),
  customer: z
    .object({
      id: z.string().min(1, { message: "Customer ID is required" }),
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      note: z.string().optional(),
    })
    .optional(),
  customFields: z
    .array(
      z.object({
        id: z.string().optional(),
        value: z.string(),
        customFieldId: z.string(),
        label: z.string().optional()
      })
    )
    .optional(),
  updatedAt: z.date().optional(),
});

type EDITING_FIELD =
  | "customer.name"
  | "customer.email"
  | "customer.phone"
  | "status"
  | "customer.note"
  | "spotId"
  | `customFields.${number}.value`
  | null;

function BookingDetailSheet() {
  const router = useRouter();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const { isOpen, onOpenChange, booking } = useBookingDetail((state) => state);

  const { data: customFields, isLoading } = useQuery({
    queryKey: ["customFields-on-boooking", workspaceId],
    queryFn: () => getCustomFields(workspaceId!),
    refetchOnMount: false,
    initialData: [],
    enabled: !!workspaceId,
  });

  useEffect(() => {
    async function fetchWorkspace() {
      const currentWorkspace = await getCurrentWorkspace();
      if (currentWorkspace) {
        setWorkspaceId(currentWorkspace.id);
      }
    }

    fetchWorkspace();
  }, []);

  const { data: spots } = useQuery({
    queryKey: ["spots", workspaceId],
    queryFn: () => getSpotsByWorkspace({ workspaceId: workspaceId as string }),
    initialData: [] as Spot[],
    enabled: !!workspaceId && !!isOpen,
  });


  const { control, handleSubmit, reset, getValues, formState } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      id: booking?.id || "",
      ...booking,
      customFields: booking?.customFields?.map((cf) => ({
        id: cf.id,
        value: cf.value,
        customFieldId: cf.customFieldId,
        label: cf.CustomField.fieldName
      })) ?? [],
    },
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
    } else if(editingField?.startsWith("customFields") && data.customFields) {
      updatedData.customFields = data.customFields ?? [];
    } else if (editingField && data.customer) {
      updatedData.customer = {
        id: data.customer.id,
        [editingField as keyof typeof data.customer]:
          data.customer[editingField as keyof typeof data.customer],
      };
    }

    const updated = updateBooking(updatedData);

    
    const fieldLabel = editingField?.startsWith("customFields")
      ? data.customFields?.[parseInt(editingField.split(".")[1])].label
      : editingField;
  
    toast.promise(updated, {
      loading: `Updating ${fieldLabel}...`,
      success() {
        router.refresh();
        setEditingField(null);
        return `${fieldLabel} updated successfully!`;
      },
      error: `Failed to update ${fieldLabel}`,
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
    if (customFields.length > 0 && booking) {
      reset({
        ...booking,
        customFields: customFields.map((field: { id: string; fieldName: any; }) => {
          const existingField = booking.customFields?.find(
            (cf) => cf.customFieldId === field.id
          );
          return {
            id: existingField?.id || undefined,
            value: existingField?.value || "",
            customFieldId: field.id,
            label: field.fieldName
          };
        }),
      });
    }
  }, [customFields, booking, reset]);


  if (!isOpen && !booking) return null;
 
  return (
    <div >
      <SheetContent className="p-0 min-w-full md:min-w-[500px] xl:min-w-[600px]">
        <Card className="flex flex-col overflow-hidden justify-between h-screen">
          <CardContent className="p-0 text-sm h-[95%] relative">
            <div className="flex flex-row items-start bg-muted/50 p-6">
              <div className="grid gap-2">
                <CardTitle className="group flex items-center gap-2 text-xl">
                  {booking?.customer.name}
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
                          "customer.name",
                          "customer.email",
                          "customer.phone",
                          "status",
                        ].map((field) =>{ 
                          let fieldName = field.includes(".") ? field.split(".")[1] : field;
                          fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                          return (
                          <div
                            key={field}
                            className="flex items-start justify-between"
                          >
                            <dt className="text-muted-foreground">
                              {fieldName}
                            </dt>
                            <dd>
                              {editingField === field ? (
                                <>
                                  {field === "customer.phone" ? (
                                    <FormField
                                      control={control}
                                      name={field}
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
                                      name={field}
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
                                              s.value === getValues("status")
                                          )?.label
                                        :String(
                                            getValues(field as any)
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
                        )})}

                        {getValues("customFields")?.map((field, index) => {
                          const customField = customFields.find((fd: { id: string; }) => fd.id === field.customFieldId);

                          return (
                            <div key={field.customFieldId} className="flex items-start justify-between">
                              <dt className="text-muted-foreground">{field.label}</dt>
                              <dd>
                                {editingField === `customFields.${index}.value` ? (
                                  <>
                                    <FormField
                                      control={control}
                                      name={`customFields.${index}.value`}
                                      render={({ field: formField }) => {
                                        let inputElement;

                                        switch (customField?.fieldType) {
                                          case "Number":
                                            inputElement = (
                                              <Input
                                                type="number"
                                                id={field.customFieldId}
                                                value={formField.value}
                                                onChange={(e) => formField.onChange(e.target.value)}
                                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                                placeholder={customField?.placeholder ?? customField?.fieldName}
                                              />
                                            );
                                            break;
                                          case "Date":
                                            inputElement = (
                                              <Input
                                                type="date"
                                                id={field.customFieldId}
                                                value={formField.value}
                                                onChange={(e) => formField.onChange(e.target.value)}
                                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                                placeholder={customField?.placeholder ?? customField?.fieldName}
                                              />
                                            );
                                            break;
                                          case "Time":
                                            inputElement = (
                                              <Input
                                                type="time"
                                                id={field.customFieldId}
                                                value={formField.value}
                                                onChange={(e) => formField.onChange(e.target.value)}
                                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                                placeholder={customField?.placeholder ?? customField?.fieldName}
                                              />
                                            );
                                            break;
                                          case "Dropdown":
                                            inputElement = (
                                              <Select
                                                value={formField.value}
                                                onValueChange={formField.onChange}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue
                                                    placeholder={customField?.placeholder ?? customField?.fieldName}
                                                  />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {JSON.parse(customField?.options ?? "[]").map(
                                                    (option: string, key: number) => (
                                                      <SelectItem key={key} value={option}>
                                                        {option}
                                                      </SelectItem>
                                                    )
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            );
                                            break;
                                          case "File":
                                            inputElement = (
                                              <Input
                                                type="file"
                                                id={field.customFieldId}
                                                value={formField.value}
                                                onChange={(e) => formField.onChange(e.target.value)}
                                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                                placeholder={customField?.placeholder ?? customField?.fieldName}
                                              />
                                            );
                                            break;
                                          default:
                                            inputElement = (
                                              <Input
                                                id={field.customFieldId}
                                                value={formField.value}
                                                onChange={(e) => formField.onChange(e.target.value)}
                                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                                placeholder={customField?.placeholder ?? customField?.fieldName}
                                              />
                                            );
                                        }

                                        return inputElement;
                                      }}
                                    />
                                    <div className="flex justify-end items-center space-x-2 mt-2">
                                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                                        Cancel
                                      </Button>
                                      <Button size="sm" type="submit">
                                        Save
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-center relative gap-2">
                                      <span
                                        className={`text-right text-sm ${
                                          !field.value ? "text-muted-foreground" : ""
                                        }`}
                                        onClick={() => startEditing(`customFields.${index}.value`)}
                                      >
                                        {field.value || customField?.placeholder || customField?.fieldName}
                                      </span>
                                      <span
                                        className="cursor-pointer"
                                        onClick={() => startEditing(`customFields.${index}.value`)}
                                      >
                                        <Edit size={13} />
                                      </span>
                                    </div>
                                  </>
                                )}
                              </dd>
                            </div>
                          );
                        })}

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
                                      name={`customer.note`}
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
                                          booking!.customer?.[
                                            field as keyof Booking["customer"]
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
                  <BookingExtras
                    bookingId={booking?.id!}
                    spotId={booking?.spotId!}
                  />
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
    </div>
  );
}

export default BookingDetailSheet;
