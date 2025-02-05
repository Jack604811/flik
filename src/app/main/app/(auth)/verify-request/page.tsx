import OTPVerification from "@/components/auth/otp-form";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { decode, encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function Page() {
  const session = await auth();
  const c = cookies().get("authjs.session-token")
  // console.log(await decode({secret: env.NEXTAUTH_SECRET, token: c?.value!.toString(), salt: "authjs.session-token"}))

  // Redirect if user is already authenticated and verified
  if (session?.user && session.user.emailVerified) {
    // Check if onboarding is complete, if not redirect to onboarding
    if (!session.user.onboardingComplete) {
      return redirect("/onboarding");
    }
    return redirect("/dashboard");
  }

  const email = session?.user.email;

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
