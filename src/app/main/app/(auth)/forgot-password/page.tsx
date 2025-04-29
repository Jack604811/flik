import { redirect } from "next/navigation";
import { AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { auth } from "@/server/auth";
import ForgottenPasswordForm from "@/components/auth/forgotten-password-form";

// If you expect optional searchParams or an invite link:
type Params = {
  searchParams?: { invite?: string };
};

export default async function Page({ searchParams }: Params) {
  // 1) Check if user is already authenticated.
  const session = await auth();
  if (session?.user) {
    // If logged in, redirect them elsewhere (to dash or main).
    return redirect(AFTER_SIGNIN_REDIRECT_URL);
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen">
      <ForgottenPasswordForm searchParams={searchParams} />
    </main>
  );
}
