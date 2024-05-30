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

export default function BookingDetails() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div>
          <CardTitle>John Doe</CardTitle>
          <CardDescription>June 23 2024 - June 25 2024</CardDescription>
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
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-1">
                  <Label htmlFor="customer">Customer</Label>
                  <Input defaultValue="John Doe" id="customer" />
                </div>
                <div className="flex justify-end items-center space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="dni">DNI</Label>
                  <Input defaultValue="409873652" id="dni" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input defaultValue="johndoe@acme.com" id="email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input defaultValue="+1 234 567 890" id="phone" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input defaultValue="242 Greene St, New York" id="address" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue defaultValue="Pending" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processed">Processed</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                fermentum nisi nec nulla interdum, vel facilisis felis interdum.
                Maecenas varius neque id vestibulum tincidunt. Praesent id velit
                vel sem interdum consequat. Sed ac risus nec urna fermentum
                eleifend. Integer sit amet nunc non odio consectetur gravida.
                Cras ut neque nec justo convallis facilisis vel id purus.
                Suspendisse potenti. Ut posuere ligula a nulla vestibulum, sit
                amet dignissim leo posuere.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm">
        Created May 18 2024
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
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
