"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/credenza";
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
import LoadingDots from "../icons/loading-dots";
import { createApiKey, updateApiKey } from "@/server/actions/api-key.action";

const formSchema = z.object({
  name: z.string().min(1, "API Key name is required"),
  permission: z.nativeEnum(Permission),
});

export default function APIKeyForm({
  workspaceId,
  onOpenChange,
  open,
  editingField,
}: {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingField?: ApiKey;
}) {
  const queryClient = useQueryClient();

  // Track the newly created key (if any)
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  // Whether we've just copied the key (to show "Copied!" button text)
  const [hasCopied, setHasCopied] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (editingField?.id) {
        return await updateApiKey({
          id: editingField.id,
          name: data.name,
          permission: data.permission,
        });
      }
      return await createApiKey({
        workspaceId,
        name: data.name,
        permission: data.permission,
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { permission: Permission.FULL_ACCESS },
    disabled: isPending,
    resetOptions: { keepDefaultValues: true },
  });

  // If editing an existing field, load its data
  useEffect(() => {
    if (editingField) {
      form.reset({
        ...editingField,
        permission: Permission.FULL_ACCESS,
      });
    }
  }, [editingField, form]);

  // Whenever the Credenza is closed, reset everything:
  // - Clear the created key (so we return to the "create" form next time)
  // - Reset the form
  // - Clear "hasCopied" state
  useEffect(() => {
    if (!open) {
      setCreatedKey(null);
      setHasCopied(false);
      form.reset({ permission: Permission.FULL_ACCESS });
    }
  }, [open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: (data) => {
        // Reset the form
        form.reset({ permission: Permission.FULL_ACCESS });

        // Save the newly created key
        setCreatedKey(data?.key ?? null);

        // Invalidate to refresh data in your UI
        queryClient.invalidateQueries({ queryKey: ["api-keys", workspaceId] });
      },
    });
  };

  return (
    <Credenza onOpenChange={onOpenChange} open={open}>
      <CredenzaContent>
        <CredenzaHeader>
          {createdKey ? (
            <>
              <CredenzaTitle>Save your key</CredenzaTitle>
              <CredenzaDescription>
                Please save your secret key in a safe place since you won&apos;t be
                able to view it again. Keep it secure, as anyone with your API
                key can make requests on your behalf. If you do lose it, you
                will need to generate a new one.
              </CredenzaDescription>
            </>
          ) : (
            <>
              <CredenzaTitle>Create API Key</CredenzaTitle>
              <CredenzaDescription>
                Use this form to create a new API Key to your workspace.
              </CredenzaDescription>
            </>
          )}
        </CredenzaHeader>

        <CredenzaBody className="space-y-4">
          {/* STEP 1: CREATE/UPDATE FORM */}
          {!createdKey ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Your API Key name" required />
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
                              <SelectItem value={Permission.FULL_ACCESS}>
                                Full access
                              </SelectItem>
                              <SelectItem value={Permission.READ_ONLY}>
                                Read-only access
                              </SelectItem>
                              <SelectItem value={Permission.SEND_ONLY}>
                                Post-only access
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <CredenzaFooter>
                  {/* Cancel -> close Credenza */}
                  <CredenzaClose asChild>
                    <Button variant="outline" disabled={isPending}>
                      Cancel
                    </Button>
                  </CredenzaClose>
                  {/* Submit -> create/update key */}
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <LoadingDots /> : editingField?.id ? "Update" : "Create"}
                  </Button>
                </CredenzaFooter>
              </form>
            </Form>
          ) : (
            // STEP 2: COPY THE KEY
            <div className="space-y-4">
              <Input readOnly value={createdKey} className="cursor-text" />

              <CredenzaFooter>
                {/* LEFT: close button (outline) */}
                <CredenzaClose asChild>
                  <Button variant="outline">Close</Button>
                </CredenzaClose>

                {/* RIGHT: copy button -> changes to "Copied!" when clicked */}
                <Button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(createdKey);
                    setHasCopied(true);
                  }}
                >
                  {hasCopied ? "Copied!" : "Copy"}
                </Button>
              </CredenzaFooter>
            </div>
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
