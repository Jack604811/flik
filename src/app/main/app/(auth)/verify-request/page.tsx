import OTPVerification from "@/components/auth/otp-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

type Params = {
  searchParams: { email?: string };
};

export default async function Page({ searchParams }: Params) {
  const session = await auth();

  // Redirect if user is already authenticated
  if (session?.user) {
    return redirect("/dashboard");
  }

  const email = searchParams.email;

  // Fallback if email is not provided
  if (!email) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-semibold">Email is required to verify your OTP.</h1>
        <p>Please return to the registration page or contact support for assistance.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <OTPVerification email={email} />
    </main>
  );
}
