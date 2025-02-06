import OTPVerification from "@/components/auth/otp-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";


export default async function Page({searchParams}: { searchParams: { invite?: string }}) {
  const session = await auth();
  if(!session?.user) {
    return redirect(`/${searchParams.invite? `?invite=${searchParams.invite}` : ""}`);
  }
  // Redirect if user is already authenticated and verified
  if (session?.user && session.user.emailVerified) {
    // Check if onboarding is complete, if not redirect to onboarding
    if (!session.user.onboardingComplete) {
      return redirect(`/onboarding${searchParams.invite ? `?invite=${searchParams.invite}` : ""}`);
    }
    return redirect(`/dashboard${searchParams.invite? `?invite=${searchParams.invite}` : ""}`);
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
