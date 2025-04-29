"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  TableFooter,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import MultiSelect from "../ui/multiselect";
import MoneyInput from "../ui/money-input";

import useConfirm from "@/hooks/use-confirm";

import { MoreVertical, UploadIcon, X, HelpCircle, ChevronLeftIcon, CirclePlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Spot, SpotStatus } from "@prisma/client";
import { AMENITIES } from "@/lib/constant";
import { deleteSpot, deleteSpotImage, updateSpot, createNewSpot } from "@/server/actions/spot.action";
import { getExtrasByWorkspace } from "@/server/actions/extra.action";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "../ui/badge";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

const tooltipContent = {
  image: "Upload a featured image for your event",
  title: "Enter the name of your event that will be displayed to users",
  slug: "The URL-friendly version of your event title",
  description: "Provide detailed information about your event",
  price: "Set the price for your event",
  duration: "Specify how long the event will last",
  units: "The total number of spots available for booking",
  amenities: "List the features and facilities included with the event",
  workingHours: "Set the available time slots for your event",
  maxGuest: "Maximum number of guests allowed",
  status: "Set whether the event is public, private, or disabled",
  extras: "Optional add-ons or services for this event",
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum([SpotStatus.Disabled, SpotStatus.Public, SpotStatus.Private]),
  units: z.string().min(1, "Units is required"),
  price: z.string().min(1, "Price is required"),
  workingHours: z.array(
    z.object({
      day: z.string(),
      openTime: z.string(),
      closeTime: z.string(),
      price: z.string(),
    })
  ),
  amenities: z.array(z.string()).optional(),
  duration: z.string(),
  durationType: z.string(),
  path: z.string(),
  extras: z.array(z.string()),
});

interface SpotFormProps {
  workspaceId: string;
  spot?: Spot & {
    images: Record<string, string>[];
    extras: { id: string; name: string }[];
  };
}

export default function SpotForm({ workspaceId, spot }: SpotFormProps) {
  const router = useRouter();

  const { data: extrasOption, isLoading } = useQuery({
    queryKey: ["extras"],
    queryFn: async () => getExtrasByWorkspace({ workspaceId }),
    initialData: [],
  });

  const [files, setFiles] = useState<(File & { url: string })[]>([]);
  const [spotImages, setSpotImages] = useState<Record<string, string>[]>(
    spot?.images ?? []
  );
  const [isDragActive, setIsDragActive] = useState(false);

  const [ConfirmRemoval, confirmRemoval] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete this spot? This action cannot be undone."
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: spot?.status || "Public",
      ...(spot ?? {}),
      units: spot?.units ? String(spot.units) : "1",
      price: spot?.price ? String(spot.price) : "",
      amenities: spot?.amenities || [],
      workingHours:
        (spot?.workingHours as Record<string, any>[])?.map((e) => ({
          ...e,
          price: String(e.price),
        })) ?? [],
      duration: spot?.duration ? String(spot.duration) : "1",
      durationType: spot?.durationType || "hours",
      extras: spot?.extras?.map((ex) => ex.id) ?? [],
    },
  });

  const isEditing = !!spot?.id;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      workspaceId,
      ...values,
      images: [],
      units: Number(values.units),
      duration: Number(values.duration),
      price: Number(values.price),
      amenities: values.amenities || [],
      workingHours: values.workingHours.map((w) => ({
        ...w,
        price: Number(w.price),
      })),
    };

    const promise = async () => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      return spot?.id
        ? updateSpot({ ...payload, id: spot.id, files: formData })
        : createNewSpot({ ...payload, files: formData });
    };
    const successMessage = isEditing
      ? "Spot updated successfully"
      : "Spot created successfully";

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        router.push("/spots");
        return successMessage;
      },
      error: "Error adding/updating spot",
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, { url: URL.createObjectURL(file) })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/jpg": [".jpg"],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workingHours",
  });

  const onDeleteImage = async (file: any, index: number) => {
    if (!file.id) {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    await deleteSpotImage(file.id);
    setSpotImages((prev) => prev.filter((im) => im.id !== file.id));
  };

  return (
    <>
    <header className="sticky top-0 z-10 flex flex-row w-full h-16 bg-background px-4 items-center justify-between gap-2 border-b">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <SidebarTrigger className="-ml-1 h-4 w-5 text-muted-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* <Link href="/spots">
          <Button type="button" size="icon" variant="outline" className="h-7 w-7">
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link> */}
        <h1 className="hidden md:block text-lg font-semibold tracking-tight truncate">
          {spot?.id ? "Edit Spot" : "New Spot"}
        </h1>
        <Badge className="shrink-0" variant="outline">
          {form.watch("status")}
        </Badge>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button type="submit" form="spot-form" size="sm">
          Save changes
        </Button>
        {spot?.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-500 cursor-pointer flex items-center gap-2"
                onClick={async () => {
                  const didConfirm = await confirmRemoval();
                  if (didConfirm) {
                    await deleteSpot(spot.id);
                    toast.success("Spot deleted Successfully");
                    router.push("/spots");
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <ConfirmRemoval />
    </header>
    <TooltipProvider delayDuration={300}>
        <Form {...form}>
          <form
            id="spot-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8"
          >
            {/* Top navigation + Save + Dropdown */}
            

            {/* Images dropzone */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="font-semibold">Images</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{tooltipContent.image}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div
                {...getRootProps()}
                className={`relative flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
              >
                <Input {...getInputProps()} className="hidden" />
                <UploadIcon className="mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  Choose a file or drag &amp; drop it here.
                  <br />
                  <span className="text-xs">
                    jpg, jpeg, png, webp &mdash; Up to 50MB
                  </span>
                </p>
                <Button type="button" className="mt-2">
                  Browse files
                </Button>
              </div>

              {(spotImages.length + files.length) > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {[...spotImages, ...files].map((file, idx) => (
                    <div key={idx} className="relative h-20 w-full overflow-hidden rounded-md">
                      <button
                        type="button"
                        onClick={() => onDeleteImage(file, idx)}
                        className="absolute right-1 top-1 rounded-full bg-white p-0.5 shadow-sm"
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </button>
                      <Image
                        src={file.url}
                        alt="Image"
                        className="h-full w-full object-cover"
                        width={80}
                        height={80} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2 flex items-center gap-2">
                    <Label htmlFor="title" className="font-semibold">
                      Title
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{tooltipContent.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Input id="title" placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            {/* Slug */}
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2 flex items-center gap-2">
                    <Label htmlFor="slug" className="font-semibold">
                      Slug
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{tooltipContent.slug}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Input
                      id="slug"
                      placeholder="event-url-slug"
                      {...field}
                      onChange={(e) => field.onChange(
                        e.target.value
                          .replace(/ñ/g, "n")
                          .replace(/[^A-Za-z0-9]+/g, "-")
                          .toLowerCase()
                      )} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">yoursite.url/events/</p>
                </FormItem>
              )} />

            {/* Price */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Label htmlFor="price" className="font-semibold">
                  Price
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{tooltipContent.price}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <MoneyInput
                form={form}
                name="price"
                label=""
                placeholder="$0"
                defaultValue={spot?.price ? String(spot.price) : ""} />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2 flex items-center gap-2">
                    <Label htmlFor="description" className="font-semibold">
                      Description
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{tooltipContent.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <AutosizeTextarea
                      id="description"
                      placeholder="Enter event description"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <div className="flex flex-row w-full justify-start gap-4">
              {/* Duration */}
              <div className="flex flex-col w-full">
                <div className="mb-2 flex items-center gap-2">
                  <Label htmlFor="duration" className="font-semibold">
                    Event Duration
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{tooltipContent.duration}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex w-full items-center gap-2">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem className="w-16">
                        <FormControl>
                          <Input id="duration" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField
                    control={form.control}
                    name="durationType"
                    render={({ field }) => (
                      <FormItem className="flex-1 w-8">
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="months">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Day</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
              </div>

              {/* Units */}
              <div className="flex flex-col w-full">
                <FormField
                  control={form.control}
                  name="units"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-2 flex items-center gap-2">
                        <Label htmlFor="units" className="font-semibold">
                          Total Units Available
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{tooltipContent.units}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input id="units" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
            </div>

            <hr className="my-6" />
            <div className="flex flex-col gap-6">
              {/* Working Hours */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Label htmlFor="working hours" className="font-semibold">
                    Working Hours
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{tooltipContent.workingHours}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="mb-3 text-sm text-muted-foreground">
                  Set the days/times this event is available (optional).
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>
                        {form.watch("durationType") === "days" ? "Check-in" : "Open"}
                      </TableHead>
                      <TableHead>
                        {form.watch("durationType") === "days" ? "Check-out" : "Close"}
                      </TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((fieldItem, idx) => (
                      <TableRow key={fieldItem.id}>
                        <TableCell>
                          <Select
                            value={form.watch(`workingHours.${idx}.day`)}
                            onValueChange={(value) => form.setValue(`workingHours.${idx}.day`, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sunday">Sunday</SelectItem>
                              <SelectItem value="Monday">Monday</SelectItem>
                              <SelectItem value="Tuesday">Tuesday</SelectItem>
                              <SelectItem value="Wednesday">Wednesday</SelectItem>
                              <SelectItem value="Thursday">Thursday</SelectItem>
                              <SelectItem value="Friday">Friday</SelectItem>
                              <SelectItem value="Saturday">Saturday</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="time" {...form.register(`workingHours.${idx}.openTime`)} />
                        </TableCell>
                        <TableCell>
                          <Input type="time" {...form.register(`workingHours.${idx}.closeTime`)} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => append(fieldItem)}>
                                Clone
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => remove(idx)}>
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
                      <TableCell colSpan={4}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full gap-1"
                          onClick={() => append({
                            day: "Sunday",
                            price: "0",
                            openTime: "03:00",
                            closeTime: "12:00",
                          })}
                        >
                          <CirclePlusIcon className="h-3.5 w-3.5" />
                          Add Working Hours
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              {/* Amenities */}
              {/* <div>
      <div className="mb-2 flex items-center gap-2">
        <Label className="font-semibold">Amenities</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltipContent.amenities}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MultiSelect
                selected={field.value || []}
                options={AMENITIES}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div> */}

              {/* Extras */}
              {/* <div>
      <div className="mb-2 flex items-center gap-2">
        <Label className="font-semibold">Extras</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltipContent.extras}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <FormField
        control={form.control}
        name="extras"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MultiSelect
                selected={field.value}
                options={
                  isLoading
                    ? []
                    : extrasOption.map((ex: any) => ({
                        label: ex.name,
                        value: ex.id,
                      }))
                }
                onChange={field.onChange}
                placeholder="Select Extra..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div> */}

              {/* Status */}
              {/* <div>
      <div className="mb-2 flex items-center gap-2">
        <Label className="font-semibold">Status</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltipContent.status}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SpotStatus.Public}>Public</SelectItem>
                  <SelectItem value={SpotStatus.Private}>Private</SelectItem>
                  <SelectItem value={SpotStatus.Disabled}>Disabled</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div> */}
            </div>
          </form>
        </Form>
      </TooltipProvider></>
  );
}
