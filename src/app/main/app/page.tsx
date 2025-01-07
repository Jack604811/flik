import { redirect } from "next/navigation";
import { AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { auth, providers } from "@/server/auth";
import LoginForm from "@/components/auth/login-form";

type Params = {
  searchParams: { invite?: string };
};

export default async function Page({ searchParams }: Params) {
  const session = await auth();

  if (session?.user) {
    return redirect(AFTER_SIGNIN_REDIRECT_URL);
  }

  // Pass only Google provider
  const authProviders = providers
    .filter((p) => p.id === "google")
    .map((p) => ({
      id: p.id,
      name: p.name,
    }));

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen">
      <LoginForm searchParams={searchParams} authProviders={authProviders} />
    </main>
  );
}
