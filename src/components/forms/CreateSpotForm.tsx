"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { ChevronLeftIcon, CirclePlusIcon, UploadIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ImageUpload from "../image-upload";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createNewSpot } from "@/server/actions/spot.action";

const formSchema = z.object({
  name: z.string({ required_error: "Spot Name is required" }),
  description: z.string({ required_error: "Spot Description is required" }),
  status: z.enum(["Draft", "Archived", "Active"]),
  minGuest: z.string(),
  additionalGuestPrice: z.string(),
  allowAdditionalGuest: z.boolean(),
  module: z.string(),
});

// LR.registerBlocks(LR);
function CreateSpotForm({userId}: {userId: string}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: "Draft", allowAdditionalGuest: false, minGuest: "1" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const promise = createNewSpot({
        userId,
        ...values,
        price: 38.94,
        images: [],
        minGuest: Number(values.minGuest)
    });
    console.log("Saving...", values)
    toast.promise(promise, {
    loading: "Loading...",
    success: () => {
        router.push("/spots")
        return "spot created/updated successfully"
    },
    error: "Error add/updating spot",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/spots">
              <Button
                type="button"
                className="h-7 w-7"
                size="icon"
                variant="outline"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="whitespace-nowrap text-xl font-semibold tracking-tight ">
              New Spot
            </h1>
            <Badge className="ml-0" variant="outline">
              Draft
            </Badge>
            <div className="items-center gap-2 md:ml-auto flex">
              {/* <Button type="button" onClick={() => router.refresh()} size="sm" variant="outline">
                Discard
              </Button> */}
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Add a name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add a description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="module"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modules</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="minGuest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum People</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" datatype="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name="allowAdditionalGuest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block">
                              Allow Additional People
                            </FormLabel>
                            <FormControl>
                              <Switch
                                onCheckedChange={field.onChange}
                                checked={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="additionalGuestPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Per Additional Person</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Working Hours</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Day</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">Monday</TableCell>
                        <TableCell>
                          <Label className="sr-only" htmlFor="open-monday">
                            Check In
                          </Label>
                          <Input
                            defaultValue="09:00"
                            id="open-monday"
                            type="time"
                          />
                        </TableCell>
                        <TableCell>
                          <Label className="sr-only" htmlFor="close-monday">
                            Check Out
                          </Label>
                          <Input
                            defaultValue="17:00"
                            id="close-monday"
                            type="time"
                          />
                        </TableCell>
                        <TableCell>
                          <Label className="sr-only" htmlFor="price-monday">
                            Price
                          </Label>
                          <Input
                            defaultValue="100"
                            id="price-monday"
                            prefix="$"
                            step="0.01"
                            type="number"
                          />
                        </TableCell>
                      </TableRow>
                      {/* Other days */}
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Button
                            className="gap-1 w-full"
                            size="sm"
                            variant="ghost"
                          >
                            <CirclePlusIcon className="h-3.5 w-3.5" />
                            Add Working Hours
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Status</FormLabel> */}
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger
                                  aria-label="Select status"
                                  id="status"
                                >
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Draft">Draft</SelectItem>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Archived">
                                    Archived
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Path Url</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Assign a path to share</Label>
                      <Input
                        className="w-full"
                        id="name"
                        defaultValue=""
                        placeholder="/my-spot"
                        type="text"
                      />
                      <div className="flex flex-row items-center gap-2">
                        <Link href="#" className="underline">
                          website.com/my-spot
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Image
                      alt="Image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="300"
                      src="/placeholder.svg"
                      width="300"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <button>
                        <Image
                          alt="Image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <button>
                        <Image
                          alt="Image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                            <UploadIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-center">
                              Upload your files
                            </DialogTitle>
                            <DialogDescription className="text-center">
                              The only file upload you will ever need
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <ImageUpload />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Delete</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex" />
                  <Button
                    className="w-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                    size="sm"
                    variant="secondary"
                    type="button"
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default CreateSpotForm;
