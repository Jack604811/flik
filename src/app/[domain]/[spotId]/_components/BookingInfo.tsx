"use client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { z } from "zod";
import { FormState, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

export default function BookingInfo({
  onPrev,
  form,
}: {
  onPrev: () => void;
  form: UseFormReturn<any>;
}) {
  return (
    <div>
      <div>
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

      <div className="flex gap-2 py-4 border-t dark:border-gray-800 justify-between">
        <Button variant="outline" type="button" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Booking..." : "Book Now"}
        </Button>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> refs/remotes/origin/main
