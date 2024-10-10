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
import { resetPassword } from "@/server/actions/auth.action";
import FormMessageAlert from "../base/form-message-alert";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  password: z.string().min(6, { message: "Minimum of 6 characters is required" }),
});

export function ResetPasswordForm({token}: {token: string}) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined | null>();
  const [success, setSuccess] = useState<string | undefined | null>();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { password } = values;
    startTransition(() => {
      resetPassword(token, password)
      .then((res) => {
        setError(res?.error ?? null)
        setSuccess(res?.success ?? null)
        if(res.success){
          form.reset();
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
       })
    })

  }


  return (
    <Form {...form}>
      <FormMessageAlert error={error} success={success} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BaseInputField control={form.control} name="password" type="password" placeholder="********" />
        <LoadingButton
          variant={"default"}
          className="w-full"
          isLoading={isLoading}
        >
          Reset Password
        </LoadingButton>
      </form>
    </Form>
  );
}
