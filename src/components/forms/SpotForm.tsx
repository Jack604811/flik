'use client';
import React, { useCallback, useState } from 'react';
import MoneyInput from 'src/components/ui/money-input';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { AutosizeTextarea } from '../ui/autosize-textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { ChevronLeftIcon, CirclePlusIcon, X, MoreVertical, UploadIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../ui/table';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createNewSpot, deleteSpot, deleteSpotImage, updateSpot } from '@/server/actions/spot.action';
import { Spot, SpotStatus } from '@prisma/client';
import { useDropzone } from 'react-dropzone';
import ConfirmModal from '../main/confirm-modal';
import MultiSelect from '../ui/multiselect';
import { AMENITIES } from '@/lib/constant';
import { env } from '@/env';
import { useQuery } from '@tanstack/react-query';
import { getExtrasByWorkspace } from '@/server/actions/extra.action';

// Validation schema
const formSchema = z
  .object({
    name: z.string({ required_error: 'Spot Name is required' }),
    description: z.string({ required_error: 'Spot Description is required' }),
    status: z.enum([SpotStatus.Disabled, SpotStatus.Public, SpotStatus.Private]),
    maxGuest: z.string().optional(),
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
    amenities: z.array(z.string()),
    duration: z.string(),
    durationType: z.string(),
    path: z.string().optional(),
    extras: z.array(z.string()),
  })
  .superRefine((data, refineContext) => {
    if (!!data.allowAdditionalGuest && !data.additionalGuestPrice) {
      refineContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required',
        path: ['additionalGuestPrice'],
      });
      refineContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required',
        path: ['maxGuest'],
      });
    }

    return refineContext;
  });

function SpotForm({
  workspaceId,
  spot,
}: {
  workspaceId: string;
  spot?: Spot & { images: Record<string, string>[]; extras: Record<'id' | 'name', string>[] };
}) {
  const router = useRouter();
  
  // Fetch extras using workspaceId instead of userId
  const { data: extrasOption, isLoading } = useQuery({
    queryKey: ['extras'],
    queryFn: async () => getExtrasByWorkspace({ workspaceId }),
    initialData: [],
  });
  
  const [files, setFiles] = useState<(File & { url: string })[]>([]);
  const [spotImages, setSpotImages] = useState<Record<string, string>[]>(spot?.images ?? []);
  const [isDragActive, setIsDragActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Private',
      allowAdditionalGuest: false,
      ...(spot ?? {}),
      maxGuest: spot?.maxGuest ? String(spot?.maxGuest) : '1',
      units: spot?.units ? String(spot.units) : '1',
      additionalGuestPrice: spot?.additionalGuestPrice ? String(spot?.additionalGuestPrice) : undefined,
      workingHours: (spot?.workingHours as Record<string, any>[])?.map((e) => ({
        ...e,
        price: String(e.price),
      })) ?? [],
      duration: spot?.duration ? String(spot.duration) : '1',
      durationType: spot?.durationType ? String(spot.durationType) : 'hours',
      extras: spot?.extras?.map((ex) => ex.id) ?? [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let obj = {
      workspaceId,
      ...values,
      images: [],
      maxGuest: Number(values.maxGuest),
      workingHours: values.workingHours.map((w) => ({
        ...w,
        price: Number(w.price),
      })),
      units: Number(values.units),
      additionalGuestPrice: Number(values.additionalGuestPrice),
      duration: Number(values.duration),
    };

    const promise = async () => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      const nSpot = spot?.id
        ? updateSpot({ ...obj, id: spot.id, files: formData })
        : createNewSpot({ ...obj, files: formData });
      return nSpot;
    };

    toast.promise(promise, {
      loading: 'Loading...',
      success: () => {
        router.push('/spots');
        return 'Spot created/updated successfully';
      },
      error: 'Error adding/updating spot',
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        url: URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/jpg': ['.jpg'],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'workingHours',
  });

  const onDeleteImage = async (file: any, index: number) => {
    if (!file.id) {
      setFiles((files) => files.filter((f, ind) => f !== file));
      return;
    }
    await deleteSpotImage(file.id);
    setSpotImages((prev) => prev.filter((im) => im.id !== file.id));
  };

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/services">
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
              {spot?.id ? "Edit" : "New"} Service
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
                    Provide details about the service, such as its purpose and key features.
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
                              <Input placeholder="Enter the name of your service" {...field} />
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
                              <AutosizeTextarea
                                placeholder="Provide a brief description of this service"
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

              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Working Hours</CardTitle>
                  <CardDescription>
                    Set the days and times when this service will be available for bookings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>{form.watch("durationType") === "days" ? "Check-in" : "Open"}</TableHead>
                        <TableHead>{form.watch("durationType") === "days" ? "Check-out" : "Close"}</TableHead>
                        {/* <TableHead>Price</TableHead> */}
                        <TableHead></TableHead>
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
                          {/* <TableCell>
                            <Label className="sr-only" htmlFor={`price-${index}`}>
                              Price
                            </Label>
                            <MoneyInput
                              form={form}
                              name={`workingHours.${index}.price`}
                              label={""}
                              placeholder="Set a price"
                              defaultValue={form.getValues(`workingHours.${index}.price`)}
                            
                            />
                          </TableCell> */}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => append(field)}>
                                  Clone
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => remove(index)}>
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
                                day: "Sunday",
                                price: "0",
                                openTime: "03:00 ",
                                closeTime: "12:00 ",
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
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelect
                            selected={field.value}
                            options={AMENITIES}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Extras</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="extras"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelect
                            selected={field.value}
                            options={isLoading ? [] : extrasOption?.map(ex => ({label: ex.name, value: ex.id}))}
                            onChange={field.onChange}
                            placeholder="Select Extra..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                                  <SelectItem value={SpotStatus.Public}>
                                    Public
                                  </SelectItem>
                                  <SelectItem value={SpotStatus.Private}>
                                    Private
                                  </SelectItem>
                                  <SelectItem value={SpotStatus.Disabled}>
                                    Disabled
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

              <Card className="w-full max-w-lg">
                <CardHeader>
                  <CardTitle>Slug</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      {env.NEXT_PUBLIC_ROOT_DOMAIN}/
                    </span>
                    <FormField
                      control={form.control}
                      name="path"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="flex-1 block w-full rounded-none rounded-r-md"
                              placeholder="service-url"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    .replace(/ñ/g, "n")
                                    .replace(/[^A-Za-z0-9]+/g, "-")
                                    .toLowerCase()
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                  Upload relevant images for the service, such as promotional banners or sample photos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {spotImages.length || files.length ? (
                      <div className="relative">
                        <div className="absolute right-2 top-2">
                          <Button
                            type="button"
                            className="!p-0.5 rounded-full h-auto"
                            variant="destructive"
                            onClick={() =>
                              onDeleteImage([...spotImages, ...files][0], 0)
                            }
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Image
                          alt={"Service Image"}
                          className="aspect-square rounded-md object-cover"
                          height="300"
                          src={[...spotImages, ...files][0].url}
                          width="300"
                        />
                      </div>
                    ) : null}

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
                              alt={"Service Image"}
                              width="84"
                            />
                          </div>
                        ))}

                      <button
                        {...getRootProps()}
                        type="button"
                        className={`flex ${spotImages.length === 0 && files.length === 0 ? 'w-60 h-60' : 'w-full'} aspect-square items-center justify-center rounded-md border border-dashed ${isDragActive ? 'border-blue-500 bg-blue-100 transition-all duration-300 scale-105' : 'border-gray-300'}`}
                      >
                        <Input
                          {...getInputProps()}
                          id="dropzone-file"
                          accept="image/png, image/jpeg, image/jpg"
                          type="file"
                          className="hidden"
                        />
                        {spotImages.length === 0 && files.length === 0 ? (
                          <div className="flex flex-col items-center justify-center text-center text-muted-foreground px-2">
                            <UploadIcon className="h-6 w-6 text-muted-foreground mb-2" />
                            <p>Drag and drop your files here or <span className="font-bold underline">choose files</span></p>
                          </div>
                        ) : (
                          <UploadIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">Upload</span>
                      </button>
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
                    <FormItem>
                      <FormLabel>Event Duration</FormLabel>
                      <div className="grid w-full items-center gap-4 justify-start">
                        <div className="grid grid-cols-2 items-center gap-2">
                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="durationType"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="hours">
                                        Hours
                                      </SelectItem>
                                      <SelectItem value="days">Days</SelectItem>
                                      <SelectItem value="months">
                                        Months
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Set the duration for this action.
                        </p>
                      </div>
                    </FormItem>
                    {/* <div className="flex items-center gap-2">
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
                    </div> */}
                    {form.getValues().allowAdditionalGuest && (
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
                    )}
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