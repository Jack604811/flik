"use client";
import React, { useCallback, useState } from "react";
import MoneyInput from "src/components/ui/money-input";
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
import { AutosizeTextarea } from "../ui/autosize-textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { ChevronLeftIcon, UploadIcon, X } from "lucide-react";
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
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Extras, ExtrasStatus } from "@prisma/client";
import { useDropzone } from "react-dropzone";
import ConfirmModal from "../main/confirm-modal";
import {
  createCategory,
  createNewExtra,
  createSubCategory,
  deleteCategory,
  deleteExtra,
  deleteExtraImage,
  deleteSubCategory,
  getCategories,
  updateCategory,
  updateExtra,
  updateSubCategory,
} from "@/server/actions/extra.action";
import { FancyBox } from "../ui/fancy-box";
import { useMutation, useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string({ required_error: "Extra Name is required" }),
  description: z.string({ required_error: "Extra Description is required" }),
  categoryId: z.string({ required_error: "Category is required" }).nullable(),
  subCategoryId: z.string().optional().nullable(),
  status: z.enum([
    ExtrasStatus.Disabled,
    ExtrasStatus.Public,
    ExtrasStatus.Private,
  ]),
  price: z.string(),
});

// LR.registerBlocks(LR);
function ExtrasForm({
  workspaceId,
  extra,
}: {
  workspaceId: string;
  extra?: Extras & { images: Record<string, string>[] };
}) {
  const { data: categories, refetch: fetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => getCategories({ workspaceId }),
    initialData: [],
  });

  const { mutate: addNewCategory } = useMutation({
    mutationFn: async (categoryName: string) =>
      createCategory({ workspaceId, categoryName }),
    onSuccess() {
      fetchCategories();
    },
  });
  const { mutate: addNewSubCategory } = useMutation({
    mutationFn: async ({
      categoryId,
      subCategoryName,
    }: {
      categoryId: string;
      subCategoryName: string;
    }) => createSubCategory({ categoryId, subCategoryName }),
    onSuccess() {
      fetchCategories();
    },
  });

  const router = useRouter();
  const [files, setFiles] = useState<(File & { url: string })[]>([]);
  const [extraImages, setExtraImages] = useState<Record<string, string>[]>(
    extra?.images ?? []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Private",
      ...(extra ?? {}),
      price: String(extra?.price ?? ""),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let obj = {
      workspaceId,
      ...values,
      images: [],
      price: Number(values.price),
    };

    const promise = async () => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const nExtra = extra?.id
        ? updateExtra({ ...obj, id: extra.id, files: formData })
        : createNewExtra({ ...obj, files: formData });

      return nExtra;
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        router.push("/extras");
        return "extra created/updated successfully";
      },
      error: "Error add/updating extra",
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
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/jpg': ['.jpg'],
    },
  });

  const onDeleteImage = async (file: any, index: number) => {
    if (!file.id) {
      setFiles((files) => files.filter((f, ind) => f !== file));
      return;
    }
    const deleted = await deleteExtraImage(file.id);
    setExtraImages((prev) => prev.filter((im) => im.id !== file.id));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/extras">
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
              {extra?.id ? "Edit" : "New"} Extra
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
                              <AutosizeTextarea
                                placeholder="Add a description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <MoneyInput
                        placeholder="Add a price"
                        form={form}
                        label="Price"
                        defaultValue={form.getValues(`price`)}
                        name="price"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-col gap-4">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <FancyBox
                                options={categories.map((category) => ({
                                  value: category.id,
                                  label: category.name,
                                }))}
                                label="category"
                                values={field.value ? [field.value] : []}
                                onSelect={(value) => {
                                  form.setValue(
                                    "categoryId",
                                    value === field.value ? null : value
                                  );
                                  form.setValue("subCategoryId", null);
                                }}
                                onCreate={(category) =>
                                  addNewCategory(category)
                                }
                                isEditable
                                onDelete={async (id) =>
                                  deleteCategory(id).then(() => {
                                    form.setValue("categoryId", null)
                                    form.setValue("subCategoryId", null)
                                    fetchCategories();
                                  })
                                }
                                onEdit={async (option) =>
                                  updateCategory({
                                    id: option.value,
                                    name: option.label,
                                  }).then(() => {
                                    fetchCategories();
                                  })
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subCategoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subcategory (optional)</FormLabel>
                            <FormControl>
                              <FancyBox
                                options={
                                  categories
                                    .find(
                                      (category) =>
                                        category.id === form.watch().categoryId
                                    )
                                    ?.subCategories.map((sub) => ({
                                      value: sub.id,
                                      label: sub.name,
                                    })) ?? []
                                }
                                label="subcategory"
                                values={field.value ? [field.value] : []}
                                onSelect={(value) =>
                                  form.setValue(
                                    "subCategoryId",
                                    value === field.value ? null : value
                                  )
                                }
                                isDisabled={!form.watch().categoryId}
                                onCreate={(subCategoryName) =>
                                  addNewSubCategory({
                                    categoryId: form.watch().categoryId!,
                                    subCategoryName,
                                  })
                                }
                                isEditable
                                onDelete={async (id) =>
                                  deleteSubCategory(id).then(() => {
                                    form.setValue("subCategoryId", null)
                                    fetchCategories();
                                  })
                                }
                                onEdit={async (option) =>
                                  updateSubCategory({
                                    id: option.value,
                                    name: option.label,
                                  }).then(() => {
                                    fetchCategories();
                                  })
                                }
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
                                  <SelectItem value={ExtrasStatus.Disabled}>
                                    Disabled
                                  </SelectItem>
                                  <SelectItem value={ExtrasStatus.Public}>
                                    Public
                                  </SelectItem>
                                  <SelectItem value={ExtrasStatus.Private}>
                                    Private
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

              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 ">
                    {extraImages.length || files.length ? (
                      <div className="relative">
                        <div className="absolute right-2 top-2">
                          <Button
                            type="button"
                            className="!p-0.5 rounded-full h-auto"
                            variant="destructive"
                            onClick={() =>
                              onDeleteImage([...extraImages, ...files][0], 0)
                            }
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Image
                          alt={"Extra Image"}
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          src={[...extraImages, ...files][0].url}
                          width="300"
                        />
                      </div>
                    ) : null}

                    <div className="grid grid-cols-3 gap-2">
                      {[...(extraImages ?? []), ...files]
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
                              alt={"Extra Image"}
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

              {extra?.id && (
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
                        await deleteExtra(extra.id);
                        toast.success("Extra deleted Successfully");
                        router.push("/extras");
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

export default ExtrasForm;
