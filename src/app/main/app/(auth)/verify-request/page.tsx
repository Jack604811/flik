import OTPVerification from "@/components/auth/otp-form";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { decode, encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function Page() {
  const session = await auth();
  // console.log(await decode({secret: env.NEXTAUTH_SECRET, token: "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..5K69rpuE3uzDgfN9.qUP3n3KzFBu57OGgCophztYnM8bgnjd07L1_jiORV4xlbEpwycNhskpIXcrcBHhh09sQvl4SIorLTyfRWME5Tr3bNEpmCPlbMKkdrvQbrKXUB_6GicEclY7lnMCHjeLP-sgQgh48DGyDsrt1G9CJ9fFfV410FdbxIUaaG_60AhU2bfiIN3N0oDQpCcIz8ruvq5dyhyglyyoNMs6ELoSYqRmg5WMN0WepE8oezRt9BbXbRFSdc36LyaSupcJXNJMsXPcyXp4RWaTeNSyAX6bkMdHCmHzikzHCYof85K0juL_rv22IHd78XxIGM7nEc9BSVySKeoMt0pTfs92Fvlk1LVCdEGfeWBbGq95Amw.mQNmmU0o1J4xSkKaY8db9Q"}))


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
