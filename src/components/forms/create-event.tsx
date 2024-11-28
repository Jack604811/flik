"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaFooter,
  CredenzaClose,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { addBooking, getBookingsBySpot } from "@/server/actions/booking.action";
import SpotSelector from "@/components/calendar/spot-selector";
import { Calendar, Plus, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import CalendarAvailability from "@/components/calendar/calendar-availability";
import { DateRange } from "react-day-picker";

type Spot = {
  id: string;
  name: string;
  image: string;
  price: number;
  workingHours: any;
  duration: number;
  durationType: string;
  units: number;
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  note: z.string().optional(),
});

interface CreateEventProps {
  workspaceId: string;
  onEventCreated: () => void;
}

export function CreateEvent({ workspaceId, onEventCreated }: CreateEventProps) {
  const [isCredenzaOpen, setIsCredenzaOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
  const [spotBookings, setSpotBookings] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const resetForm = useCallback(() => {
    form.reset();
    setSelectedSpot(null);
    setSelectedDate(undefined);
    setSpotBookings([]);
  }, [form]);

  const fetchBookingsForSpot = async (spotId: string) => {
    try {
      const bookings = await getBookingsBySpot(spotId);
      setSpotBookings(bookings);
    } catch (error) {
      console.error("Failed to fetch bookings for spot:", error);
      toast.error("Failed to load availability.");
    }
  };

  const handleDateSelect = (data: {
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    subTotal: number;
  }) => {
    setSelectedDate({
      from: data.startDate ?? undefined,
      to: data.endDate ?? undefined,
    });
  };

  const handleSpotSelect = (spot: Spot | null) => {
    setSelectedSpot(spot);
    setSelectedDate(undefined);
    if (spot) {
      fetchBookingsForSpot(spot.id);
    } else {
      setSpotBookings([]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedSpot || !selectedDate) {
      toast.error("Please select a spot and date.");
      return;
    }

    setLoading(true);
    try {
      await addBooking({
        name: values.name,
        email: values.email,
        phone: values.phone,
        spotId: selectedSpot.id,
        startDate: selectedDate.from!,
        endDate: selectedDate.to!,
        note: values.note,
        subtotal: selectedSpot.price,
        totalPrice: selectedSpot.price + 20   
      });
      toast.success("Event created successfully");
      onEventCreated(); // Refresh the booking list
      setIsCredenzaOpen(false); // Close the credenza
      resetForm(); // Reset the form after closing
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCredenzaOpen) resetForm();
  }, [isCredenzaOpen, resetForm]);

  return (
    <Credenza open={isCredenzaOpen} onOpenChange={setIsCredenzaOpen}>
      <CredenzaTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>
            <div className="flex items-center space-x-2">
              <Calendar />
              <span>Create New Booking</span>
            </div>
          </CredenzaTitle>
          <CredenzaClose>
            <X className="h-0 w-0" />
          </CredenzaClose>
        </CredenzaHeader>
        <form className="p-0 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 pb-0">
            <label htmlFor="spot" className="block text-sm font-medium text-gray-700">
              Spot
            </label>
            <SpotSelector workspaceId={workspaceId} onSelect={handleSpotSelect} />
          </div>
          {selectedSpot && (
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedDate && selectedDate.from && selectedDate.to ? (
                      `${selectedDate.from.toLocaleDateString()} - ${selectedDate.to.toLocaleDateString()}`
                    ) : (
                      "Select Date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-background">
                  <CalendarAvailability
                    spot={selectedSpot}
                    bookings={spotBookings} // Pass fetched bookings
                    selectedDate={selectedDate}
                    callback={() => {}}
                    onDateSelected={handleDateSelect}
                    btnText="Select"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input {...form.register("name")} placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <PhoneInput
              placeholder="Enter phone number"
              value={form.watch("phone")}
              onChange={(value) => form.setValue("phone", value ?? "")}
              required
              defaultCountry="US"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input {...form.register("email")} placeholder="Enter email" type="email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Note
            </label>
            <Textarea {...form.register("note")} placeholder="Add any additional notes here..." />
          </div>
          <CredenzaFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCredenzaOpen(false)}>
              Close
            </Button>
            <Button type="submit" disabled={loading || form.formState.isSubmitting}>
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
}
