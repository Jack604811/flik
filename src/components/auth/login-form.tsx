"use client";
import { signIn } from "next-auth/react";
import { AFTER_SIGNIN_REDIRECT_URL, APP_DOMAIN } from "@/app-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOptimistic, useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { BaseInputField } from "@/components/base/base-input-field";
import { LoadingButton } from "@/components/base/loading-button";
import Link from "next/link";
import FormMessageAlert from "../base/form-message-alert";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string({ message: "Password is required" }),
});

export function LoginForm() {
  const router = useRouter()
  const [isLoading, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined | null>();
  const [success, setSuccess] = useState<string | undefined | null>();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { email, password } = values;
    startTransition( async () => {
      await signIn("signin", {
        email, 
        password,
        redirect: false,
        callbackUrl: AFTER_SIGNIN_REDIRECT_URL,
     }).then(res => {
          setError(res?.error);
          if(res?.ok) router.push(res?.url!);
     })
    }
    )
  }


  return (
    <Form {...form}>
      <FormMessageAlert error={error} success={success} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BaseInputField control={form.control} name="email" type="email" />
        <BaseInputField control={form.control} name="password" type="password" description={
            <p className="text-muted-foreground text-right text-xs"><Link href={"/forgot-password"} className="text-primary">Forgotten Password?</Link> </p>
        } />
        

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
