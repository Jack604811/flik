"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OauthProvider } from "@/components/auth/oauth-provider";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormProps = {
  searchParams: { invite?: string };
  authProviders: { id: string; name: string }[];
};

const LoginForm: React.FC<LoginFormProps> = ({ searchParams, authProviders }) => {
  const router = useRouter();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACK_BUTTON_URL = `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = formSchema.safeParse({ email: emailValue, password: passwordValue });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid input");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      const res = await signIn("signin", {
        email: emailValue,
        password: passwordValue,
        redirect: false,
        callbackUrl: `${AFTER_SIGNIN_REDIRECT_URL}${
                  searchParams.invite ? `?invite=${searchParams.invite}` : ""
                }`,
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.ok && res.url) {
        router.push(res.url);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button size="sm" variant="outline" asChild>
          <Link href={BACK_BUTTON_URL}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center w-full h-full px-4 md:px-0">
        <div className="mx-auto grid max-w-sm w-full gap-6">
          <div className="flex flex-col gap-4 text-start">
            <h1 className="text-2xl font-semibold">Welcome Back!</h1>
            <p className="text-muted-foreground text-sm">
              Please enter your email and password to login or use a provider.
            </p>
          </div>

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

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm underline text-primaryLight">
                  Forgot your password?
                </Link>
              </div>
              <Input
                required
                id="password"
                type="password"
                placeholder="Your password"
                value={passwordValue}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
              } dark:text-black`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="flex items-center justify-center w-full my-4">
            <div className="h-px bg-border w-full"></div>
            <p className="text-muted-foreground mx-4">or</p>
            <div className="h-px bg-border w-full"></div>
          </div>

          {/* OAuth Providers */}
          <div className="space-y-2">
            {authProviders.map((provider) => (
              <OauthProvider
                key={provider.id}
                provider={provider}
                prefix="Sign in"
                callbackUrl={`${AFTER_SIGNIN_REDIRECT_URL}${
                  searchParams.invite ? `?invite=${searchParams.invite}` : ""
                }`}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </div>
      </div>
      <p className="text-muted-foreground text-center text-sm mt-5">Don&apos;t have an account? <Link href={`/signup${searchParams.invite ? `?invite=${searchParams.invite}`:''}`} className="text-primary">Sign up</Link> </p>
    </section>
  );
};

export default LoginForm;
