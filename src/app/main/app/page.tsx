
import { redirect } from "next/navigation";
import { AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { auth, providers } from "@/server/auth";
import LoginForm from "@/components/auth/login-form";

type Params = {
  searchParams: { invite?: string };
};

export default async function Page({ searchParams }: Params) {
  // Fetch the current session
  const session = await auth();

  if (session?.user) {
    // If the user's email is not verified, redirect to /verify-request
    if (!session.user.emailVerified) {
      return redirect("/verify-request");
    }

    // Redirect verified users to the main page
    return redirect(AFTER_SIGNIN_REDIRECT_URL);
  }

  // Pass only Google provider to the LoginForm component
  const authProviders = providers
  //@ts-ignore
    .filter((p) => p.id === "google")
    .map((p) => ({
      //@ts-ignore
      id: p.id,
      name: p.name,
    }));

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen">
      <LoginForm searchParams={searchParams} authProviders={authProviders} />
    </main>
  );
}
