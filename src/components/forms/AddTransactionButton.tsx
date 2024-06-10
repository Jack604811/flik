import React, { useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { addOrUpdateTransaction } from "@/server/actions/booking.action";
import { toast } from "sonner";
import { TransactionStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statuses } from "@/app/main/(main)/(authenticated)/transactions/data/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CirclePlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // Ensure this utility function is available
import { useRouter } from "next/navigation";

const formSchema = z.object({
  id: z.string().optional(),
  amount: z.string(),
  date: z.date(),
  description: z.string(),
  paymentType: z.string(),
  status: z.nativeEnum(TransactionStatus),
});

function AddTransactionButton({
  children,
  placeholder,
  bookingId,
  defaultTransaction,
  callback
}: {
  children?: React.ReactNode;
  placeholder?: string;
  bookingId: string;
  defaultTransaction?: z.infer<typeof formSchema> & { id: string };
  callback?: () => void
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentType: "Cash",
      status: "Paid",
      ...defaultTransaction
    },
    resetOptions: { keepDefaultValues: true },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const promise = addOrUpdateTransaction({ ...values, bookingId, amount: Number(values.amount) });
    const operation = defaultTransaction?.id
      ? ["Updating", "updated"]
      : ["Adding", "added"];
    toast.promise(promise, {
      loading: `${operation[0]} ${placeholder ?? "manual payment"}!`,
      error: "There was an error with the request, kindly try again!",
      success(data) {
        if (defaultTransaction) {

          router.refresh();
          callback && callback()
        };
        queryClient.invalidateQueries({
          queryKey: ["bookingPayments", bookingId],
        });
        
        setOpen(false);
        form.reset();
        return `${placeholder ?? "manual payment"} ${
          operation[1]
        } successfully!`;
      },
    });
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className="items-center justify-center h-6" asChild>
        {children ?? (
          <div className="flex flex-row gap-2">
            <CirclePlus className="h-4 w-4" />
            <button>Add {placeholder ?? "Payment"}</button>
          </div>
        )}
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="text-xl text-semibold">
            Add {placeholder ?? "Manual Payment"}
          </CredenzaTitle>
          <CredenzaDescription>
            Enter the details of the {placeholder ?? "manual payment"} you want
            to add.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="grid gap-4 p-0">
                <div className="grid grid-cols-1 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="00.00"  {...field}  />
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
                      <FormItem className="flex flex-col">
                        <FormLabel>Payment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
              <CredenzaFooter>
                <div className="flex w-full mt-8 gap-4 items-center justify-center">
                  <CredenzaClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </CredenzaClose>
                  <Button type="submit">{defaultTransaction?.id ? "Update" : "Create"} Payment</Button>
                </div>
              </CredenzaFooter>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

export default AddTransactionButton;
