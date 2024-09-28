import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";

/** 
 * This is the main page that renders protected content.
 * If the user is not authenticated, they will be redirected.
 * If authenticated, it will display the protected content.
 */
export default async function Page() {
  const session = await auth();

  // Redirect to login if user is not authenticated
  if (!session?.user) {
    redirect(NON_AUTHENTICATED_REDIRECT_URL);
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div></div>
    </Suspense>
  );
}
