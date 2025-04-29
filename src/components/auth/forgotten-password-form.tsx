"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { forgotPassword } from "@/server/actions/auth.action";
import { AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";

// 1) Define the type for searchParams (invite is optional)
type ForgottenPasswordFormProps = {
  searchParams?: {
    invite?: string;
  };
};

// 2) Define schema for your form data
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// 3) Build the component
const ForgottenPasswordForm: React.FC<ForgottenPasswordFormProps> = ({
  searchParams,
}) => {
  const router = useRouter();
  const [emailValue, setEmailValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACK_BUTTON_URL = `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  // Handle changes to the email input
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  // Handle submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validate form data with zod
    const result = formSchema.safeParse({ email: emailValue });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid input");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await forgotPassword(emailValue);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(res.success);
        setEmailValue("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen relative">
      <div className="hidden md:block absolute top-4 left-4">
        <Button size="sm" variant="outline">
          <Link href={BACK_BUTTON_URL} className="flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center w-full h-full px-4 md:px-0">
        <div className="mx-auto grid max-w-sm w-full gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 text-start">
            <h1 className="text-2xl font-semibold">Forgot your password?</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email below, and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>
          {/* The Form */}
          <form onSubmit={handleSubmit} className="grid gap-4 mt-2 w-full">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                required
                id="email"
                type="email"
                placeholder="Your email address"
                value={emailValue}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              } dark:text-black`}
            >
              {isLoading ? "Sending..." : "Send reset email"}
            </Button>
          </form>
            {/* Error or Success Messages */}
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}
        </div>
      </div>

      {/* Conditionally include ?invite=... in the sign-in link */}
      <p className="text-muted-foreground text-center text-sm mt-5 pb-8">
        Already have an account?{" "}
        <Link
          href={`/${searchParams?.invite ? `?invite=${searchParams.invite}` : ""}`}
          className="text-primary"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
};

export default ForgottenPasswordForm;
