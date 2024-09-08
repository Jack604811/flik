"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import BookingInfo from "../../booking/[bookingId]/info";
import moment from "moment";
import { DateRange } from "react-day-picker";
import {
  addBooking,
  addExtrasToBooking,
  createStripePaymentLink,
} from "@/server/actions/booking.action";
import {
  Category,
  Extras,
  ExtrasImages,
  Spot,
  SpotImages,
  SubCategory,
  User,
} from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { BookingDates } from "@/lib/types";
import {
  CalendarIcon,
  ChevronLeft,
  MinusIcon,
  PlusIcon,
  X,
} from "lucide-react";
import { WOMPI_CENT_MULTIPLIER } from "@/app-settings";
import Image from "next/image";
import { WORKING_HOUR_TYPE, calculateSubtotal, categorizeExtras } from "./util";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import _ from "lodash";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  dni: z.string().min(1, "DNI is required"),
  address: z.string().min(1, "Address is required"),
  startDate: z.date().nullable().refine(Boolean, "Start Date is required"),
  endDate: z.date().nullable().refine(Boolean, "End Date is required"),
  subtotal: z.number().min(0, "Subtotal is required"),
  totalPrice: z.number().min(0, "Total Pricing is required"),
  note: z.string().optional(),
  countryCode: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  extras: z.array(
    z.object({
      extraId: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
      quantity: z.number(),
      image: z.string().optional().nullable(),
    })
  ),
});

type Params = {
  spot: Spot & {
    bookings: BookingDates[];
    owner: User;
    images: SpotImages[];
    extras: (Extras & {
      category: Category;
      subCategory: SubCategory;
      images: ExtrasImages[];
    })[];
  };
};

type ProgressKey = "personal_info" | "extras" | "payment";

const progresses: Record<
  ProgressKey,
  { value: number; title: string; description: string; btn?: string }
> = {
  personal_info: {
    value: 50,
    title: "Personal Details",
    description: "Enter your personal details to create a booking.",
    btn: "Continue",
  },
  extras: {
    value: 33,
    title: "Extras",
    description: "Select available booking spots below to continue",
    btn: "Proceded to checkout",
  },
  payment: {
    value: 90,
    title: "",
    description: "",
  },
};

function BookingSection({ spot }: Params) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { countryCode: "+57", totalPrice: 0 },
  });

  const [progress, setProgress] = useState<ProgressKey>("personal_info");
  

  

  const handlePayment = async () => {
    const values = form.getValues();
    const defaultPaymentMethod = spot.owner.defaultPaymentMethod;
    const to = new URL(`/booking/${values.id}`, window.location.href);

    switch (defaultPaymentMethod) {
      case "wompi":
        if (typeof window !== "undefined" && window.WidgetCheckout) {
          const wompiAccount = spot.owner.wompiAccountId as Record<
            string,
            string
          >;
          const publicKey =
            wompiAccount.useSandbox === "on"
              ? wompiAccount.testPublicKey
              : wompiAccount.livePublicKey;

          const data = {
            currency: "COP",
            amountInCents: values.totalPrice * WOMPI_CENT_MULTIPLIER,
            reference: values.id,
            publicKey: publicKey,
            redirectURI: to.href,
            customerData: {
              email: values.email,
              fullName: values.name,
              phoneNumber: values.phone.replace(
                values.countryCode ?? "+57",
                ""
              ),
              phoneNumberPrefix: values.countryCode ?? "+57",
            },
          };

          const url = `https://checkout.wompi.co/p/?public-key=${
            data.publicKey
          }&currency=${data.currency}&amount-in-cents=${
            data.amountInCents
          }&reference=${
            data.reference
          }&customer-data:email=${encodeURIComponent(
            data.customerData.email
          )}&customer-data:full-name=${encodeURIComponent(
            data.customerData.fullName
          )}&customer-data:phone-number=${encodeURIComponent(
            data.customerData.phoneNumber
          )}&customer-data:phone-number-prefix=${encodeURIComponent(
            data.customerData.phoneNumberPrefix
          )}&redirect-url=${encodeURIComponent(data.redirectURI)}`;

          window.location.href = url;
        }
        break;
      case "stripe":
        if (!spot.owner.stripeAccountId)
          toast.error(
            "There was an error while generating payment link, kindly try again or contact to make payment manually!"
          );
        const res = await createStripePaymentLink({
          reference: values.id!,
          customerEmail: values.email,
          account: spot.owner.stripeAccountId!,
          amount: values.totalPrice,
          productName: spot.name,
          redirectURI: to.href,
          currency: spot.owner.currency ?? "USD",
        });
        window.location.href = res.url!;
        break;
      case "cash":
        router.replace(`/booking/${values.id}`);
        break;
      default:
        router.replace(`/booking/${values.id}`);
        break;
    }
  };

  const onGoBack = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname.replace("/book", "")}${query}`, { scroll: true });
  }, [pathname, searchParams, router]);

  function getCheckinDifference(checkIn: string, checkOut: string) {
    const checkInDate = moment(checkIn);
    const checkOutDate = moment(checkOut);

    const duration = moment.duration(checkOutDate.diff(checkInDate));
    const hours = duration.asHours();

    if (hours < 24) {
      const roundedHours = Math.round(hours);
      return roundedHours === 1 ? "1 hour" : `${roundedHours} hours`;
    } else if (hours < 168) {
      const days = Math.round(hours / 24);
      return days === 1 ? "1 day" : `${days} days`;
    } else {
      const weeks = Math.round(hours / 168);
      return weeks === 1 ? "1 week" : `${weeks} weeks`;
    }
  }

  const getBookingData = () => {
    const startDate = moment(searchParams.get("check-in")).toDate();
    const endDate = moment(searchParams.get("check-out")).toDate();

    const selectedDate: DateRange | Date | undefined = !searchParams.get(
      "check-in"
    )
      ? undefined
      : spot.durationType === "hours"
      ? startDate
      : {
          from: startDate,
          to: searchParams.get("check-out") ? endDate : undefined,
        };
    const subtotal = calculateSubtotal(
      selectedDate,
      spot.workingHours as WORKING_HOUR_TYPE[]
    );

    form.setValue("subtotal", subtotal);
    form.setValue("startDate", startDate);
    form.setValue("endDate", endDate);

    return {
      selectedDate,
      subtotal,
    };
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (progress === "personal_info") {
        const booking = await addBooking({ ...values, spotId: spot.id });
        form.setValue("id", booking.id);
        if(!spot.extras.length) return handlePayment();
        setProgress("extras");
        return;
      } else if (progress === "extras") {
        // TODO: Add Extras to the database
        const bookingData = getBookingData();
        form.setValue(
          "totalPrice",
          values.extras.reduce(
            (t, f) => f.price * f.quantity + t,
            bookingData.subtotal
          )
        );
        await addExtrasToBooking({
          bookingId: values.id!,
          extras: values.extras,
        });
        handlePayment();
      }
    } catch (error: any) {
      toast.error(
        `There was an error proceeding with the request, ${error.message}`
      );
    }
  };



  useEffect(() => {
    if (!searchParams.get("check-in") || !searchParams.get("check-out"))
      onGoBack();
  }, [searchParams, onGoBack]);

  const bookingData = getBookingData();
  const availableExtras = categorizeExtras(spot?.extras);
  const { fields, append, remove, update } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "extras", // unique name for your Field Array
  });

  return (
    <div key="1" className="container mx-auto px-0 py-4 md:px-6 md:py-8">
      <Form {...form}>
        <form
          className="flex flex-col gap-2 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 p-6">
            <div>
              <div className="flex gap-2 items-start">
                <Button
                  type="button"
                  className="h-6 w-6 mt-2"
                  size="icon"
                  variant="outline"
                  onClick={onGoBack}
                >
                  <ChevronLeft />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Complete your booking adding more items.
                  </p>
                </div>
              </div>
              <div className="grid grid-2 justify-between items-center mt-8 mb-4">
                <h2 className="text-lg font-semibold ">Items</h2>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="grid grid-cols-[120px_1fr] w-full items-center gap-4">
                    <Image
                      alt="Booking Image"
                      className="rounded-md object-cover"
                      height={80}
                      src={spot.images[0].url}
                      style={{ aspectRatio: "120/80", objectFit: "cover" }}
                      width={120}
                    />
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between">
                        <div className="font-bold">{spot.name}</div>
                        {/*<div className="font-bold text-lg">
                          $
                          {new Intl.NumberFormat("de-DE")
                            .format(bookingData.subtotal)
                            .replace(",", ".")}
                        </div>*/}
                      </div>
                      <div className="flex flex-row items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                        <div className="font-bold text-md">
                          $
                          {new Intl.NumberFormat("de-DE")
                            .format(bookingData.subtotal)
                            .replace(",", ".")}
                        </div>
                        x{" "}
                        {getCheckinDifference(
                          searchParams.get("check-in")!,
                          searchParams.get("check-out")!
                        )}
                      </div>
                      <div className="flex items-center font-semibold text-sm mt-4">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {moment(searchParams.get("check-in")).format(
                          "MMM DD, hh:mm A"
                        )}{" "}
                        -{" "}
                        {moment(searchParams.get("check-out")).format(
                          "MMM DD, hh:mm A"
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2" />
                  </div>
                </div>
              </div>
              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold mb-6">
                    {progresses[progress].title}
                  </h2>
                </div>
                {progress === "personal_info" && <BookingInfo />}
                {progress === "extras" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col mb-4 gap-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-2">
                              <Image
                                alt={field.name}
                                className="w-16 h-16 object-cover rounded-lg"
                                height="60"
                                src={field.image ?? "/placeholder.svg"}
                                style={{
                                  aspectRatio: "60/60",
                                  objectFit: "cover",
                                }}
                                width="60"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{field.name}</p>
                              <p className="font-regular text-gray-500 line-clamp-2">
                                {field.description}
                              </p>
                              <p className="font-bold text-sm">
                                ${field.price}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 border-2 h-[32px] rounded-md">
                              <Button
                                className="border-none p-2 hover:bg-transparent"
                                variant="ghost"
                                type="button"
                                onClick={() =>
                                  update(index, {
                                    ...field,
                                    quantity:
                                      field.quantity > 1
                                        ? field.quantity - 1
                                        : 1,
                                  })
                                }
                              >
                                <MinusIcon size={16} />
                              </Button>
                              <div className="text-sm">{field.quantity}</div>
                              <Button
                                className="border-none p-2 hover:bg-transparent"
                                variant="ghost"
                                type="button"
                                onClick={() =>
                                  update(index, {
                                    ...field,
                                    quantity: field.quantity + 1,
                                  })
                                }
                              >
                                <PlusIcon size={16} />
                              </Button>
                            </div>
                            <Button
                              type="button"
                              className="!p-0.5 rounded-full h-auto"
                              variant="ghost"
                              onClick={() => remove(index)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                      <Tabs
                        defaultValue={Object.keys(
                          availableExtras
                        )[0]?.toLowerCase()}
                        className="w-full"
                      >
                        <div className="overflow-x-auto">
                          <TabsList className="flex w-max md:w-full">
                            {Object.keys(availableExtras).map((c) => (
                              <TabsTrigger
                                key={c.toLowerCase()}
                                value={c.toLowerCase()}
                                className="px-4 py-2 whitespace-nowrap"
                              >
                                {c}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </div>
                        {Object.entries(availableExtras).map(([c, subs]) => (
                          <TabsContent
                            value={c.toLowerCase()}
                            key={c.toLowerCase()}
                          >
                            {Object.entries(subs).map(([sub, extras]) => (
                              <div
                                className="flex flex-col my-4 gap-4"
                                key={sub.toLowerCase()}
                              >
                                <p className="text-black/50 font-semibold">
                                  {sub}
                                </p>
                                {extras.map((extra) => {
                                  const idx = fields.findIndex(
                                    (f) => f.extraId == extra.id
                                  );
                                  if (idx !== -1) return null;
                                  return (
                                    <div
                                      className="flex justify-between items-center"
                                      key={extra.id}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="flex-2">
                                          <Image
                                            alt="Image"
                                            className="w-25 h-16 object-cover rounded-lg"
                                            height="60"
                                            src={
                                              extra.images[0].url ??
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
                                      <div className="flex items-center">
                                        <Button
                                          className="text-white"
                                          variant="default"
                                          type="button"
                                          onClick={() => {
                                            const idx = fields.findIndex(
                                              (f) => f.extraId == extra.id
                                            );
                                            if (idx != -1)
                                              update(idx, {
                                                ...fields[idx],
                                                quantity:
                                                  fields[idx].quantity + 1,
                                              });
                                            else
                                              append({
                                                extraId: extra.id,
                                                price: extra.price,
                                                quantity: 1,
                                                image: extra.images[0].url,
                                                name: extra.name,
                                                description: extra.description,
                                              });
                                          }}
                                        >
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </TabsContent>
                        ))}
                      </Tabs>
                    
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex-col bg-gray-100 dark:bg-gray-800 rounded-lg p-6 grid sticky top-6 gap-8">
                <div className="grid gap-4">
                  <h3 className="font-medium">Order Summary</h3>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ${bookingData.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Extras</span>
                    <span className="font-medium">
                      $
                      {fields
                        .reduce((t, f) => f.price * f.quantity + t, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Taxes</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      $
                      {fields
                        .reduce(
                          (t, f) => f.price * f.quantity + t,
                          bookingData.subtotal
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <Button variant="outline" className="invisible">
                Back
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {progress === "extras" && !["wompi", "stripe"].includes(spot.owner.defaultPaymentMethod!)
                  ? "Book now"
                  : progresses[progress].btn}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default BookingSection;
