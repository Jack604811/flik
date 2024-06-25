/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import BookingInfo from "../../booking/[bookingId]/info";
import moment from "moment";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addBooking } from "@/server/actions/booking.action";
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
});

type Params = {
  spot: Spot & { bookings: BookingDates[]; owner: User; images: SpotImages[] };
};

type ProgressKey = "check_availability" | "personal_info";

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
};

function BookingSection({ spot }: Params) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [progress, setProgress] = useState<ProgressKey>("check_availability");
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<
    Date | DateRange | undefined
  >();
  const bookings = spot.bookings;


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const booking = await addBooking({ ...values, spotId: spot.id });
      router.push(`/booking/${booking.id}`);
    } catch (error: any) {
      toast.error(
        `There was an error proceeding with the request, ${error.message}`
      );
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BookingSection;
