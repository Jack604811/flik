"use client";
import { signIn } from "next-auth/react";
import { AFTER_SIGNIN_REDIRECT_URL, APP_DOMAIN } from "@/app-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { BaseInputField } from "@/components/base/base-input-field";
import { LoadingButton } from "@/components/base/loading-button";
import Link from "next/link";
import { forgotPassword } from "@/server/actions/auth.action";
import FormMessageAlert from "../base/form-message-alert";
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function ForgottenPasswordForm() {
  const [isLoading, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined | null>();
  const [success, setSuccess] = useState<string | undefined | null>();
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
    const { email } = values;
    startTransition(() => {
      forgotPassword(email)
      .then((res) => {
        setError(res?.error ?? null)
        setSuccess(res?.success ?? null);
        form.reset()
       })
    })

  }


  return (
    <Form {...form}>
      <FormMessageAlert error={error} success={success} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BaseInputField control={form.control} name="email" type="email" />
        <LoadingButton
          variant={"default"}
          className="w-full"
          isLoading={isLoading}
        >
          Send reset email
        </LoadingButton>
      </form>
    </Form>
  );
}
