"use client";

import React, { useState, FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPassword } from "@/server/actions/auth.action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Zod schema: 6 chars minimum
const formSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Minimum of 6 characters is required" }),
});

// Props: Must receive the reset `token`
type ResetPasswordFormProps = {
  token: string;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // React Hook Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  // On submit, call `resetPassword` then handle the response
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const result = formSchema.safeParse({ password: form.getValues("password") });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid password");
      return;
    }
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await resetPassword(token, result.data.password);

      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(res.success);
        form.reset();

        // Redirect after 2s
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    });
  };

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen relative">
      <div className="flex items-center justify-center w-full h-full px-4 md:px-0">
        <div className="mx-auto grid max-w-sm w-full gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 text-start">
            <h1 className="text-2xl font-semibold">Reset Password</h1>
            <p className="text-muted-foreground text-sm">
              Please enter your new password below.
            </p>
          </div>
          {/* The Form */}
          <form onSubmit={handleSubmit} className="grid gap-4 mt-2 w-full">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                required
                id="password"
                type="password"
                placeholder="********"
                {...form.register("password")}
                disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className={`w-full ${
                isPending
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isPending ? "Please wait..." : "Reset Password"}
            </Button>
          </form>
          {/* Error/Success Messages */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        </div>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
