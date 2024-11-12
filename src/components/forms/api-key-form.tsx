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
import { ApiKey, Permission } from "@prisma/client";
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
import { toast } from "sonner";
import LoadingDots from "../icons/loading-dots";
import { createApiKey, updateApiKey } from "@/server/actions/api-key.action";

const formSchema = z.object({
  name: z.string().min(1, "API Key name is required"),
  permission: z.nativeEnum(Permission),
});

export default function APIKeyForm({ workspaceId, onOpenChange, open, editingField  }: { workspaceId: string; open: boolean; onOpenChange: (open: boolean) => void; editingField?: ApiKey }) {
  const queryClient = useQueryClient();

  const {mutate, isPending} = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
     if(editingField?.id){
        return await updateApiKey({
          id: editingField.id,
          name: data.name,
          permission: data.permission,
        })
     }
     return await createApiKey({workspaceId, name: data.name, permission: data.permission});
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { permission: Permission.FULL_ACCESS },
    disabled: isPending,
    resetOptions: { keepDefaultValues: true },
  });

  useEffect(() => {
    if (editingField) {
      form.reset({
        ...editingField,
        permission: Permission.FULL_ACCESS,
      });
    }
  }, [editingField, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        form.reset({ permission: Permission.FULL_ACCESS });
        const message = editingField ? "API Key updated successfully" : "API Key added successfully";
        toast.success(message);
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["api-keys",workspaceId] });
      },
      onError: (error) => {
        const message = editingField ? "Error updating API Key" : "Error adding API Key";
        toast.error(message);
      },
    });
  };  

  return (
    <>
      <Credenza onOpenChange={onOpenChange} open={open}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Add API Key</CredenzaTitle>
            <CredenzaDescription>
              Use this form to add a new API Key to your workspace.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your API Key name"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="permission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permission</FormLabel>
                        <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value: Permission) => field.onChange(value)}
                          disabled={isPending}
                        >
                          <SelectTrigger id="fieldType">
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Permission.FULL_ACCESS}>Full access</SelectItem>
                            <SelectItem value={Permission.READ_ONLY}>Read-only access</SelectItem>
                            <SelectItem value={Permission.SEND_ONLY}>Post-only access</SelectItem>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <CredenzaFooter>
                  <CredenzaClose asChild>
                    <Button variant="outline" disabled={isPending}>Cancel</Button>
                  </CredenzaClose>
                  <Button type="submit" disabled={isPending}>{isPending ? (<LoadingDots />) : (editingField?.id ? "Update":"Add")}</Button>
                </CredenzaFooter>
              </form>
            </Form>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
