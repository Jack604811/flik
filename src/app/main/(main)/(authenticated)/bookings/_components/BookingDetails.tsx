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
import { ChevronLeftIcon, ChevronRightIcon, Edit } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Booking } from "../data/schema";
import moment from "moment";
import { BookingStatus } from "@prisma/client";
import { PhoneInput } from "@/components/ui/phone-input";
import { statuses } from "../data/data";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateBooking } from "@/server/actions/booking.action";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  booking?: Booking;
};

const bookingSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(BookingStatus).optional(),
  guest: z
    .object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      dni: z.string().optional(),
      address: z.string().optional(),
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
  | null;

export default function BookingDetails({ children, booking }: Props) {
  const router = useRouter();
  const { control, handleSubmit, setValue, getValues } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: booking,
  });

  const [editingField, setEditingField] = useState<EDITING_FIELD>(null);

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    const updatedData: z.infer<typeof bookingSchema> = { id: data.id };

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
      <SheetContent className="p-0 min-w-[500px]">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div>
              <CardTitle>{booking?.guest.name}</CardTitle>
              <CardDescription>
                {moment(booking?.startDate).format("MMM DD YYYY hh:mm A")} -{" "}
                {moment(booking?.endDate).format("MMM DD YYYY hh:mm A")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="resume">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              <TabsContent value="resume">
                <div>
                  <h3 className="text-lg font-semibold">
                    Customer Information
                  </h3>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-2"
                  >
                    {["name", "dni", "email", "phone", "address", "status"].map(
                      (field) => (
                        <div key={field} className="space-y-1 col-span-2">
                          <Label htmlFor={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </Label>
                          {editingField === field ? (
                            <>
                              {field === "phone" ? (
                                <FormField
                                  control={control}
                                  name={`guest.${field}`}
                                  render={({ field: { onChange, value } }) => (
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
                                  render={({ field: { onChange, value } }) => (
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
                                    <Input {...formField} id={field} />
                                  )}
                                />
                              )}
                              <div className="flex justify-end items-center space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit">Save</Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <span>
                                  {booking!.guest[field] ?? booking![field]}
                                </span>
                                <Button
                                  size="icon"
                                  onClick={() => startEditing(field as any)}
                                >
                                  <Edit size={15} />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    )}
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Order Details</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div>Spot Name</div>
                      <div>{booking?.spot.name}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Extra Items x 1</div>
                      <div>$00.00</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between">
                      <div>Subtotal</div>
                      <div>${booking?.subtotal}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Extras</div>
                      <div>$0.00</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Tax</div>
                      <div>$00.00</div>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <div>Total</div>
                      <div>${booking?.totalPrice}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Note</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking?.guest.note}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="extras">
                <div>
                  <h3 className="text-lg font-semibold">Extras</h3>
                </div>
              </TabsContent>
              <TabsContent value="payments">
                <div>
                  <h3 className="text-lg font-semibold">Payments</h3>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-xs flex justify-between">
            <div>
              <div>
                {" "}
                Created {moment(booking?.createdAt).format("MMM DD YYYY")}{" "}
              </div>
              <div>
                {" "}
                Updated {moment(booking?.updatedAt).format("MMM DD YYYY")}{" "}
              </div>
            </div>
            <nav className="flex gap-2 justify-center">
              <Button variant="ghost">
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost">
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </nav>
          </CardFooter>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
