"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { BaseInputField } from "@/components/base/base-input-field";
import { LoadingButton } from "@/components/base/loading-button";
import { registerUser } from "@/server/actions/auth.action";
import FormMessageAlert from "../base/form-message-alert";
import { useSearchParams } from "next/navigation";
const formSchema = z.object({
    name: z.string().min(5, { message:"Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Minimum of 6 characters is required" }),
});

export function SignupForm() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined | null>();
  const [success, setSuccess] = useState<string | undefined | null>();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        email: "",
        password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      registerUser(values.email, values.password, values.name, inviteToken)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BaseInputField control={form.control} name="name" />
        <BaseInputField control={form.control} name="email" type="email" />
        <BaseInputField control={form.control} name="password" type="password" />

        <LoadingButton
          variant={"default"}
          className="w-full"
          isLoading={isLoading}
        >
        Create an account
        </LoadingButton>
      </form>
    </Form>
  );
}
