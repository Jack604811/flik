"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { AFTER_SIGNUP_REDIRECT_URL } from "@/app-settings";
import { OauthProvider } from "@/components/auth/oauth-provider";
import { registerUser } from "@/server/actions/auth.action";
import { signIn } from "next-auth/react";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupForm = ({
  searchParams,
  authProviders,
}: {
  searchParams: { invite?: string };
  authProviders: { id: string; name: string }[];
}) => {
  const router = useRouter();
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACK_BUTTON_URL = `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const result = formSchema.safeParse({ name: nameValue, email: emailValue, password: passwordValue });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid input");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await registerUser(emailValue, passwordValue, nameValue, searchParams.invite);
  
      if (response.error) {
        setError(response.error);
      } else {
        await signIn("signin", { redirectTo: `/verify-request${searchParams.invite ? `?invite=${searchParams.invite}`:""}`, email: emailValue, password: passwordValue})
        // Pass the email parameter during redirection
        // router.push(`/verify-request?email=${encodeURIComponent(emailValue)}`);
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
      <div className="hidden md:block absolute top-4 left-4">
        <Button size="sm" variant="outline">
          <Link href={BACK_BUTTON_URL} className="flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>

      {/* Register Form */}
      <div className="flex items-center justify-center w-full h-full px-4 md:px-0 pt-8">
        <div className="mx-auto grid max-w-sm w-full gap-6">
          <div className="flex flex-col gap-4 text-start">
            <h1 className="text-2xl font-semibold">Get Started</h1>
            <p className="text-muted-foreground text-sm">
              Please enter your details to sign up or use Google Sign-Up.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 mt-2 w-full">
            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                required
                id="name"
                type="text"
                placeholder="Your full name"
                value={nameValue}
                onChange={handleNameChange}
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
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

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
              } text-white`}
            >
              {isLoading ? "Registering..." : "Sign Up"}
            </Button>
          </form>

          {/* Divider */}
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
                prefix="Sign up"
                callbackUrl={`${AFTER_SIGNUP_REDIRECT_URL}${searchParams.invite ? `?invite=${searchParams.invite}` : ""}`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </div>
      </div>
      <p className="text-muted-foreground text-center text-sm mt-5 pb-8">Already have an account? <Link href={`/${searchParams.invite ? `?invite=${searchParams.invite}`:''}`} className="text-primary">Sign in</Link> </p>
    </section>
  );
};

export default SignupForm;
