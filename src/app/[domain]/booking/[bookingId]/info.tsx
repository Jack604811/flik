"use client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { PhoneInput } from "@/components/ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Booking, Guest, Spot } from "@prisma/client";
import { addGuestToBooking } from "@/server/actions/booking.action";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Enter a valid email address"),
  phone: z.string({ required_error: "Phone is required" }),
  dni: z.string({ required_error: "DNI is required" }),
  address: z.string({ required_error: "Address is required" }),
  note: z.string().optional(),
});

export default function BookingInfo({
  booking,
}: {
  booking: any;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const guest = await addGuestToBooking({...values, bookingId: booking.id});
      router.refresh();
    } catch (error: any) {
      toast.error(`There was an error procceding with the request, ${error.message}`)
    }

  };

  return (
    <div key="1" className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg dark:bg-gray-950">
        <Form {...form}>
          <form
            className="flex flex-col gap-2 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <Progress className="w-full" value={33} />
              </div>
              <div className="space-y-6">
                <div className="flex gap-2 justify-between">
                  <span>
                    <h2 className="text-2xl font-bold">Personal Details</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter your personal details to create a booking.
                    </p>
                  </span>
                  <div className="flex gap-2">
                    <Button
                      className="border border-gray-300 w-8 h-8"
                      variant="outline"
                      type="button"
                    >
                      {`<`}
                    </Button>
                    <Button
                      className="border border-gray-300 w-8 h-8"
                      variant="outline"
                      type="button"
                    >
                      {`>`}
                    </Button>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter your phone number"
                          defaultCountry="CO"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your DNI number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add a note</FormLabel>
                      <FormControl>
                        <AutosizeTextarea
                          className="w-full"
                          placeholder="Enter your note here..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-2 ml-6 mr-6 py-4 border-t dark:border-gray-800 justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit">Book Now</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
