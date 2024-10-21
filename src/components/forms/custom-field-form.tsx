"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomFieldType, CustomField } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createCustomField, updateCustomField } from "@/server/actions/custom-field.action";
import { toast } from "sonner";
import LoadingDots from "../icons/loading-dots";

const formSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  fieldType: z.nativeEnum(CustomFieldType),
  placeholder: z.string().optional(),
  isRequired: z.boolean(),
  options: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val && val.length > 0) {
          return val.split(",").every((option) => option.trim().length > 0);
        }
        return true;
      },
      { message: "Each option must be a non-empty string" }
    ).transform((val) => val?.split(",").map((option) => option.trim())),
});

export default function CustomFieldForm({ workspaceId, onOpenChange, open, editingField  }: { workspaceId: string; open: boolean; onOpenChange: (open: boolean) => void; editingField?: CustomField }) {
  const queryClient = useQueryClient();

  const {mutate, isPending} = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if(editingField?.id){
        return await updateCustomField({id: editingField.id, ...data});
      }
      await createCustomField({workspaceId, ...data});
    },
    onSuccess: () => { 
      const message = editingField ? "Custom field updated successfully" : "Custom field added successfully";
      toast.success(message);
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["customFields",workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["customFields-on-booking",workspaceId] });
    },
    onError: (error) => {
      const message = editingField ? "Error updating custom field" : "Error adding custom field";
      toast.error(message);
    }
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldType: CustomFieldType.String,
      isRequired: false,
      placeholder: "",
    },
    disabled: isPending,
    resetOptions: { keepDefaultValues: true },
  });

  useEffect(() => {
    if (editingField) {
      form.reset({
        ...editingField,
        options: editingField?.options ? JSON.parse(editingField.options).join(",") : undefined,
      });
    }
  }, [editingField, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(values)
  };

  return (
    <>
      <Credenza onOpenChange={onOpenChange} open={open}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Add Custom Field</CredenzaTitle>
            <CredenzaDescription>
              Use this form to add a new custom field to your form.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="fieldName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter field name"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Label htmlFor="fieldName"></Label>
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="fieldType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Type</FormLabel>
                        <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value: CustomFieldType) => field.onChange(value)}
                          disabled={isPending}
                        >
                          <SelectTrigger id="fieldType">
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={CustomFieldType.String}>Input</SelectItem>
                            <SelectItem value={CustomFieldType.Number}>Number</SelectItem>
                            <SelectItem value={CustomFieldType.Date}>Date</SelectItem>
                            <SelectItem value={CustomFieldType.Dropdown}>Dropdown</SelectItem>
                            <SelectItem value={CustomFieldType.Time}>Time</SelectItem>
                            <SelectItem value={CustomFieldType.File}>File</SelectItem>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="placeholder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placeholder</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter placeholder text"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {form.getValues().fieldType === CustomFieldType.Dropdown && (
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="options"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dropdown Options</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter options separated by commas"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <CredenzaFooter>
                  <CredenzaClose asChild>
                    <Button variant="outline" disabled={isPending}>Cancel</Button>
                  </CredenzaClose>
                  <Button type="submit" disabled={isPending}>{isPending ? (<LoadingDots />) : (editingField?.id ? "Update Field":"Add Field")}</Button>
                </CredenzaFooter>
              </form>
            </Form>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
