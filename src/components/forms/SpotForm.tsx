"use client";
import React, { useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  ChevronLeftIcon,
  CirclePlusIcon,
  DeleteIcon,
  Dot,
  MoreHorizontal,
  MoreVertical,
  UploadIcon,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ImageUpload from "../image-upload";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createNewSpot,
  deleteSpot,
  deleteSpotImage,
  updateSpot,
} from "@/server/actions/spot.action";
import { Spot, SpotStatus } from "@prisma/client";
import { useDropzone } from "react-dropzone";
import { uploadSpotImage } from "@/server/actions/superbase.action";
import ConfirmModal from "../confirm-modal";

const formSchema = z
  .object({
    name: z.string({ required_error: "Spot Name is required" }),
    description: z.string({ required_error: "Spot Description is required" }),
<<<<<<< Updated upstream
    status: z.enum([SpotStatus.Disabled, SpotStatus.Public, SpotStatus.Private]),
    maxGuest: z.string().optional(),
=======
    status: z.enum(["Private", "Public", "Disabled"]),
    maxGuest: z.string(),
>>>>>>> Stashed changes
    additionalGuestPrice: z.string().optional(),
    allowAdditionalGuest: z.boolean(),
    units: z.string(),
    workingHours: z.array(
      z.object({
        day: z.string(),
        openTime: z.string(),
        closeTime: z.string(),
        price: z.string(),
      })
    ),
  })
  .superRefine((data, refineContext) => {
    if (!!data.allowAdditionalGuest && !data.additionalGuestPrice){
      refineContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["additionalGuestPrice"],
      })
      refineContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["maxGuest"],
      })
    }

    return refineContext;
  });

// LR.registerBlocks(LR);
function SpotForm({
  userId,
  spot,
}: {
  userId: string;
  spot?: Spot & { images: Record<string, string>[] };
}) {
  const router = useRouter();
  const [files, setFiles] = useState<(File & { url: string })[]>([]);
  const [spotImages, setSpotImages] = useState<Record<string, string>[]>(spot?.images ?? []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
<<<<<<< Updated upstream
      status: "Disabled",
=======
      status: "Private",
>>>>>>> Stashed changes
      allowAdditionalGuest: false,
      ...(spot ?? {}),
      maxGuest: spot?.maxGuest ? String(spot?.maxGuest) : "1",
      units: spot?.units ? String(spot.units) : "1",
      additionalGuestPrice: spot?.additionalGuestPrice
        ? String(spot?.additionalGuestPrice)
        : undefined,
      workingHours:
        (spot?.workingHours as Array<Record<string, string>>)?.map((w) => ({
          ...w,
          price: String(w.price),
        })) ?? undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let obj = {
      userId,
      ...values,
      images: [],
      maxGuest: Number(values.maxGuest),
      workingHours: values.workingHours.map((w) => ({
        ...w,
        price: Number(w.price),
      })),
      units: Number(values.units),
      additionalGuestPrice: Number(values.additionalGuestPrice),
    };

    const promise = async () => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const nSpot = spot?.id
        ? updateSpot({ ...obj, id: spot.id, files: formData })
        : createNewSpot({ ...obj, files: formData });
      return nSpot;
    };

    // const promise = spot?.id
    //   ? updateSpot({ ...obj, id: spot.id })
    //   : createNewSpot(obj);
    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        router.push("/spots");
        return "spot created/updated successfully";
      },
      error: "Error add/updating spot",
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        url: URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { images: ["image/*"] },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "workingHours", // unique name for your Field Array
    }
  );

  const onDeleteImage = async (file: any, index: number) => {
    if (!file.id) {
      setFiles((files) => files.filter((f, ind) => f !== file));
      return;
    }
    const deleted = await deleteSpotImage(file.id);
    setSpotImages((prev) => prev.filter((im) => im.id !== file.id));
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
              {spot?.id ? "Edit" : "New"} Spot
            </h1>
            <Badge className="ml-0" variant="outline">
              {form.getValues().status}
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
                        name="units"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Total Units Available for Booking
                            </FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
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
                          <FormItem className="flex flex-row items-center gap-2">
                            <FormLabel className="block">
                              Allow Additional Guests
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
<<<<<<< Updated upstream
                    {form.getValues().allowAdditionalGuest && (
                    <>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="maxGuest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Guests</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                datatype="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
=======
                    
                    {form.getValues().allowAdditionalGuest && (
>>>>>>> Stashed changes
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="maxGuest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Guests</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="additionalGuestPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Per Additional Guest</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                    )}
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
                        
                        <TableHead>Day</TableHead>
                        <TableHead>Open</TableHead>
                        <TableHead>Close</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead ></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="gap-2">
                      {fields.map((field, index) => (
                        <TableRow key={index}>
                          
                          <TableCell className="font-semibold">
                            <Select
                              defaultValue={field.day}
                              {...form.register(`workingHours.${index}.day`)}
                              onValueChange={(value) =>
                                form.setValue(
                                  `workingHours.${index}.day`,
                                  value
                                )
                              }
                            >
                              <SelectTrigger aria-label="Select a day">
                                <SelectValue placeholder="Select a day" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sunday">Sunday</SelectItem>
                                <SelectItem value="Monday">Monday</SelectItem>
                                <SelectItem value="Tuesday">Tuesday</SelectItem>
                                <SelectItem value="Wednesday">
                                  Wednesday
                                </SelectItem>
                                <SelectItem value="Thursday">
                                  Thursday
                                </SelectItem>
                                <SelectItem value="Friday">Friday</SelectItem>
                                <SelectItem value="Saturday">
                                  Saturday
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Label className="sr-only" htmlFor="open-monday">
                              Open
                            </Label>
                            <Input
                              {...form.register(
                                `workingHours.${index}.openTime`
                              )}
                              id="open-monday"
                              type="time"
                            />
                          </TableCell>
                          <TableCell>
                            <Label className="sr-only" htmlFor="close-monday">
                              Close
                            </Label>
                            <Input
                              {...form.register(
                                `workingHours.${index}.closeTime`
                              )}
                              type="time"
                            />
                          </TableCell>
                          <TableCell>
                            <Label className="sr-only" htmlFor="price-monday">
                              Price
                            </Label>
                            <Input
                              {...form.register(`workingHours.${index}.price`)}
                              prefix="$"
                              step="1"
                              type="number"
                              
                            />
                          </TableCell>
                          <TableCell>
                          <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            
                            <DropdownMenuItem>Clone</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => remove(index)}>
                              Delete 
                           </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Button
                            className="gap-1 w-full"
                            size="sm"
                            variant="ghost"
                            type="button"
                            onClick={() =>
                              append({
                                day: "",
                                price: "",
                                openTime: "",
                                closeTime: "",
                              })
                            }
                          >
                            <CirclePlusIcon className="h-3.5 w-3.5" />
                            Add Working Hours
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger
                                  aria-label="Select status"
                                  id="status"
                                >
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
<<<<<<< Updated upstream
                                  <SelectItem value={SpotStatus.Disabled}>Disabled</SelectItem>
                                  <SelectItem value={SpotStatus.Public}>Public</SelectItem>
                                  <SelectItem value={SpotStatus.Private}>Private</SelectItem>
=======
                                  <SelectItem value="Private">Private</SelectItem>
                                  <SelectItem value="Public">Public</SelectItem>
                                  <SelectItem value="Disabled">Disabled</SelectItem>
>>>>>>> Stashed changes
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
              {/* <Card x-chunk="dashboard-07-chunk-3">
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
                        placeholder="my-spot"
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
              </Card> */}
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 ">
                    {spotImages.length || files.length ? (
                      <div className="relative">
                        <div className="absolute right-2 top-2">
                          <Button
                            type="button"
                            className="!p-0.5 rounded-full h-auto"
                            variant="destructive"
                            onClick={() => onDeleteImage([...spotImages, ...files][0], 0)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Image
                          alt={"Spot Image"}
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          src={[...spotImages, ...files][0].url}
                          width="300"
                        />
                      </div>
                    ) : (
                      null
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      {[...(spotImages ?? []), ...files]
                        .slice(1)
                        .map((file, index) => (
                          <div key={index} className="relative">
                            <div className="absolute right-1 top-0">
                              <Button
                                type="button"
                                className="!p-0.5 rounded-full h-auto"
                                variant="destructive"
                                onClick={() => onDeleteImage(file, index)}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                            <Image
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src={file.url}
                              alt={"Spot Image"}
                              width="84"
                            />
                          </div>
                        ))}

                      <button
                        {...getRootProps()}
                        type="button"
                        className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                      >
                        <Input
                          {...getInputProps()}
                          id="dropzone-file"
                          accept="image/png, image/jpeg, image/jpg"
                          type="file"
                          className="hidden"
                        />
                        <UploadIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {spot?.id && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delete</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConfirmModal
                      onConfirm={async () => {
                        await deleteSpot(spot.id);
                        toast.success("Spot deleted Successfully");
                        router.push("/spots");
                      }}
                      warningText=""
                    >
                      <Button
                        className="w-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                        size="sm"
                        variant="secondary"
                        type="button"
                      >
                        Delete
                      </Button>
                    </ConfirmModal>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default SpotForm;
