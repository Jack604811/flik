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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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

type Props = {
  children: React.ReactNode;
  booking?: Booking;
};
export default function BookingDetails({ children, booking }: Props) {
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
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-1">
                      <Label htmlFor="customer">Customer</Label>
                      <Input
                        defaultValue={booking?.guest?.name}
                        id="customer"
                      />
                    </div>
                    <div className="flex justify-end items-center space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="dni">DNI</Label>
                      <Input defaultValue={booking?.guest.dni} id="dni" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input defaultValue={booking?.guest.email} id="email" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="phone">Phone</Label>
                      <PhoneInput
                        defaultValue={booking?.guest.phone}
                        defaultCountry="CO"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        defaultValue={booking?.guest.address}
                        id="address"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status">
                          <SelectValue defaultValue={booking?.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status, key) => (
                            <SelectItem key={key} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Order Details</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div>Spot Name</div>
                      <div>$250.00</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Extra Items x 1</div>
                      <div>$49.00</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between">
                      <div>Subtotal</div>
                      <div>$299.00</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Extras</div>
                      <div>$49.00</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Tax</div>
                      <div>$25.00</div>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <div>Total</div>
                      <div>$329.00</div>
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
