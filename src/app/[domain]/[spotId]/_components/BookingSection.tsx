/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import BookingInfo from "../../booking/[bookingId]/info";
import moment from "moment";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  addBooking,
  createStripePaymentLink,
} from "@/server/actions/booking.action";
import { Booking, Spot, SpotImages, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { BookingDates } from "@/lib/types";
import { X } from "lucide-react";
import BookingAvailability from "./BookingAvailability";
import Link from "next/link";
import { WOMPI_CENT_MULTIPLIER } from "@/app_settings";

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Enter a valid email address"),
  phone: z.string().nonempty("Phone is required"),
  dni: z.string().nonempty("DNI is required"),
  address: z.string().nonempty("Address is required"),
  startDate: z.date().nullable().refine(Boolean, "Start Date is required"),
  endDate: z.date().nullable().refine(Boolean, "End Date is required"),
  subtotal: z.number().min(0, "Subtotal is required"),
  totalPrice: z.number().min(0, "Total Price is required"),
  note: z.string().optional(),
  countryCode: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
});

type Params = {
  spot: Spot & { bookings: BookingDates[]; owner: User; images: SpotImages[] };
};

type ProgressKey = "check_availability" | "personal_info" | "payment";

const progresses: Record<
  ProgressKey,
  { value: number; title: string; description: string }
> = {
  check_availability: {
    value: 33,
    title: "Check Availability",
    description: "Select available booking spots below to continue",
  },
  personal_info: {
    value: 50,
    title: "Personal Details",
    description: "Enter your personal details to create a booking.",
  },
  payment: {
    value: 90,
    title: "",
    description: "",
  },
};

function BookingSection({ spot }: Params) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { countryCode: "+57" },
  });

  const [progress, setProgress] = useState<ProgressKey>("check_availability");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<
    Date | DateRange | undefined
  >();
  const bookings = spot.bookings;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const booking = await addBooking({ ...values, spotId: spot.id });
      form.setValue("id", booking.id);
      setProgress("payment");
      handlePayment();
    } catch (error: any) {
      toast.error(
        `There was an error proceeding with the request, ${error.message}`
      );
    }
  };

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

          // const widgetCheckout = new window.WidgetCheckout(data);
          // // Use methods from widgetCheckout instance if needed
          // widgetCheckout.open(function (result: any) {
          //   setPaymentSuccess(true);
          // });
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
          redirectURI: to.href
        });
        window.location.href = res.url!;
        // // TODO: Implement stripe payment popup
        // setPaymentSuccess(true);
        break;
      case "cash":
        setPaymentSuccess(true);
        break;
      default:
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-center">
          <div>
            <h2 className="text-2xl font-bold">{progresses[progress].title}</h2>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {progress === "check_availability" && (
              <BookingAvailability
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                spot={spot as any}
                bookings={bookings}
                callback={() => setProgress("personal_info")}
              />
            )}
            {progress === "personal_info" && (
              <BookingInfo
                form={form}
                onPrev={() => setProgress("check_availability")}
              />
            )}
            {progress === "payment" && (
              <div key="1" className="container mx-auto px-4 md:px-6 py-8">
              <div className="flex-2 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 p-6">
                <div>
                  <div className="flex gap-2 justify-between">
                    <span>
                      <h2 className="text-2xl font-bold">Booking Details</h2>
                      <p className="text-gray-500 dark:text-gray-400">Complete your booking adding more items.</p>
                    </span>
                  </div>
                  <div className="grid grid-2 justify-between items-center mt-8 mb-4">
                    <h2 className="text-lg font-semibold ">Items</h2>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="grid grid-cols-[120px_1fr] w-full items-center gap-4">
                        <img
                          alt="Booking Image"
                          className="rounded-md object-cover"
                          height={80}
                          src="/placeholder.svg"
                          style={{ aspectRatio: "120/80", objectFit: "cover" }}
                          width={120}
                        />
                        <div className="flex flex-col">
                          <div className="flex w-full justify-between">
                            <div className="font-bold">Cozy Mountain Retreat</div>
                            <div className="font-bold text-lg">$400</div>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">x2 nights</div>
                          <div className="flex items-center font-semibold text-sm mt-4">
                            <Calendar className="w-4 h-4 mr-1" />
                            June 1 - June 3
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-b py-4 my-4">
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold mb-6">Extras</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="mr-4">
                              <img
                                alt="Burnt Ends"
                                className="w-16 h-16 object-cover rounded-lg"
                                height="60"
                                src="/placeholder.svg"
                                style={{ aspectRatio: "60/60", objectFit: "cover" }}
                                width="60"
                              />
                            </div>
                            <div>
                              <p className="font-semibold">Burnt Ends</p>
                              <p className="font-regular text-gray-500">Description</p>
                              <p className="font-bold text-sm">$10.00</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button className="text-white" variant="default">
                              Add
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="mr-4">
                              <img
                                alt="Burnt Ends"
                                className="w-16 h-16 object-cover rounded-lg"
                                height="60"
                                src="/placeholder.svg"
                                style={{ aspectRatio: "60/60", objectFit: "cover" }}
                                width="60"
                              />
                            </div>
                            <div>
                              <p className="font-semibold">Burnt Ends</p>
                              <p className="font-regular text-gray-500">Description</p>
                              <p className="font-bold text-sm">$10.00</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button className="text-white" variant="default">
                              Add
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="mr-4">
                              <img
                                alt="Burnt Ends"
                                className="w-16 h-16 object-cover rounded-lg"
                                height="60"
                                src="/placeholder.svg"
                                style={{ aspectRatio: "60/60", objectFit: "cover" }}
                                width="60"
                              />
                            </div>
                            <div>
                              <p className="font-semibold">Burnt Ends</p>
                              <p className="font-regular text-gray-500">Description</p>
                              <p className="font-bold text-sm">$10.00</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button className="text-white" variant="default">
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex-col bg-gray-100 dark:bg-gray-800 rounded-lg p-6 grid sticky top-6 gap-8">
                    <div className="grid gap-4">
                      <h3 className="font-medium">Order Summary</h3>
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">$104.97</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Extras</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Taxes</span>
                        <span className="font-medium">$8.40</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">$113.37</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-between">
                  <Button variant="outline">Back</Button>
                  <Button>Proceded to checkout</Button>
                </div>
              </div>
            </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BookingSection;
