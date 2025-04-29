import { redirect } from "next/navigation";
import { AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { auth } from "@/server/auth";
import ResetPasswordForm from "@/components/auth/reset-password-form";

type PageProps = {
  searchParams: { token?: string };
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();
  if (session?.user) {
    return redirect(AFTER_SIGNIN_REDIRECT_URL);
  }

  const token = searchParams.token || "";

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen">
      <ResetPasswordForm token={token} />
    </main>
  );
}
