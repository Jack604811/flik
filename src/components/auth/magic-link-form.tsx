"use client";
import { signIn } from "next-auth/react";
import { AFTER_SIGNIN_REDIRECT_URL, APP_DOMAIN } from "@/app-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { BaseInputField } from "@/components/base/base-input-field";
import { LoadingButton } from "@/components/base/loading-button";
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function MagicLinkForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    const { email } = values;
    await signIn("resend", {
      email,
      callbackUrl: AFTER_SIGNIN_REDIRECT_URL,
    });
    setIsLoading(false);
  }

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BaseInputField control={form.control} name="email" />

        <LoadingButton
          variant={"default"}
          className="w-full"
          isLoading={isLoading}
        >
          Sign In
        </LoadingButton>
      </form>
    </Form>
  );
}
