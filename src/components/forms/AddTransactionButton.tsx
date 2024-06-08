import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "@/server/actions/booking.action";
import { toast } from "sonner";
import { Calendar } from "../ui/calendar";
import moment from "moment";
import { TransactionStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { statuses } from "@/app/main/(main)/(authenticated)/transactions/data/data";

const formSchema = z.object({
  amount: z.string().transform(v => Number(v)),
  date: z.date(),
  description: z.string(),
  paymentType: z.string(),
  status: z.nativeEnum(TransactionStatus),
});
function AddTransactionButton({
  children,
  placeholder,
  bookingId,
}: {
  children: React.ReactNode;
  placeholder?: string;
  bookingId: string;
}) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { paymentType: "Cash", status: "Paid" },
    resetOptions: {keepDefaultValues: true}
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const promise = addTransaction({ ...values, bookingId });
    toast.promise(promise, {
      loading: `Adding ${placeholder ?? "manual payment"}!`,
      error: "There was an error with the request, kindly try again!",
      success(data) {
        queryClient.invalidateQueries({
          queryKey: ["bookingPayments", bookingId],
        });
        setOpen(false);
        return `${placeholder ?? "manual payment"} added successfully!`;
      },
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="items-center">
        <DrawerHeader className="self-auto w-4/5">
          <DrawerTitle>Add {placeholder ?? "Manual Payment"}</DrawerTitle>
          <DrawerDescription>
            Enter the details of the {placeholder ?? "manual payment"} you want
            to add.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" w-4/5">
            <div className="grid gap-4 py-4 p-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="00.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          name={field.name}
                        >
                          <SelectTrigger aria-label="Select payment type">
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Cash",
                              "Bank transfer",
                              "Wompi",
                              "Epayco",
                              "Mercadopago",
                              "Stripe",
                            ].map((pt, key) => (
                              <SelectItem key={key} value={pt}>
                                {pt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Date</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Payment Date"
                          type="date"
                          value={field.value && moment(field.value).format("YYYY-MM-DD")}
                          onChange={(e) =>
                            field.onChange(moment(e.target.value).toDate())
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                          disabled={field.disabled}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          name={field.name}
                        >
                          <SelectTrigger aria-label="Select payment status">
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((pt, key) => (
                              <SelectItem key={key} value={pt.value}>
                                {pt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Payment Purpose" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DrawerFooter>
              <div className="flex gap-5 items-end justify-center">
                <DrawerClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit">Create Payment</Button>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

export default AddTransactionButton;
