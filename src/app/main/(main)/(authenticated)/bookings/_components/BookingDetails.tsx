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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  Edit,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddTransactionButton from "@/components/forms/AddTransactionButton";

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
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <dl className="grid gap-3">
                      {[
                        "name",
                        "dni",
                        "email",
                        "phone",
                        "address",
                        "status",
                      ].map((field) => (
                        <div
                          key={field}
                          className="flex items-center justify-between"
                        >
                          <dt className="text-muted-foreground">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </dt>
                          <dd>
                            {editingField === field ? (
                              <>
                                {field === "phone" ? (
                                  <FormField
                                    control={control}
                                    name={`guest.${field}`}
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
                                    name={`guest.${field}`}
                                    render={({ field: formField }) => (
                                      <Input {...formField} id={field} />
                                    )}
                                  />
                                )}
                                <div className="flex justify-end items-center space-x-2 mt-1">
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
                                    {field === "status"
                                      ? statuses.find(
                                          (s) => s.value === booking?.status
                                        )?.label
                                      : booking!.guest?.[
                                          field as keyof Booking["guest"]
                                        ] ??
                                        String(
                                          booking![field as keyof Booking]
                                        )}
                                  </span>
                                  <span
                                    onClick={() => startEditing(field as any)}
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

                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        <div className="flex flex-row items-center gap-2">
                          Spot Name
                          <ChevronsUpDownIcon className="ml-auto h-4 w-4" />
                        </div>
                      </span>
                      <span className="text-sm">{booking?.spot.name}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Extra Items x<span>1</span>
                      </span>
                      <span className="text-sm">$00.00</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-sm">${booking?.subtotal}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Extras</span>
                      <span className="text-sm">$00.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-sm">$00.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-sm">${booking?.totalPrice}</span>
                    </li>
                  </ul>
                </div>

                <Separator className="my-4" />
                <div className="grid grid gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Note</div>
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          {booking?.guest.note}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="extras">
                <div>
                  <h3 className="text-lg font-semibold">Extras</h3>
                </div>
              </TabsContent>
              <TabsContent value="payments">
                <div className="grid gap-3">
                  <div className="font-semibold">Payment Resume</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Payments</span>
                      <span>$299.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Outstanding</span>
                      <span>$49.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>$329.00</span>
                    </li>
                  </ul>
                  <Separator className="my-4" />
                  <div className="font-semibold">Payment History</div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>May 19, 2023</TableCell>
                          <TableCell>Monthly Subscription</TableCell>
                          <TableCell className="text-right">$19.99</TableCell>
                          <TableCell>
                            <Badge variant="outline">Paid</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>May 12, 2023</TableCell>
                          <TableCell>Online Purchase</TableCell>
                          <TableCell className="text-right">$49.95</TableCell>
                          <TableCell>
                            <Badge variant="outline">Paid</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>May 5, 2023</TableCell>
                          <TableCell>Utility Bill</TableCell>
                          <TableCell className="text-right">$78.23</TableCell>
                          <TableCell>
                            <Badge variant="outline">Paid</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>April 28, 2023</TableCell>
                          <TableCell>Subscription Renewal</TableCell>
                          <TableCell className="text-right">$99.99</TableCell>
                          <TableCell>
                            <Badge variant="outline">Paid</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>April 21, 2023</TableCell>
                          <TableCell>Online Purchase</TableCell>
                          <TableCell className="text-right">$29.99</TableCell>
                          <TableCell>
                            <Badge variant="outline">Paid</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4}>
                          <AddTransactionButton>
                          <Button
                              className="gap-1 w-full"
                              size="sm"
                              variant="ghost"
                            >
                              Add Manual Transaction
                            </Button>
                          </AddTransactionButton>
                           
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
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
