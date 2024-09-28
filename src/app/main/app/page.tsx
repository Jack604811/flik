import { AFTER_SIGNIN_REDIRECT_URL, NON_AUTHENTICATED_REDIRECT_URL } from "@/app-settings";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

/** 
 * This page checks for an active session and redirects accordingly.
 * If the user is not authenticated, it redirects them to the login page.
 * If authenticated, it redirects to the AFTER_SIGNIN_REDIRECT_URL.
 */
export default async function Page() {
  const session = await auth();

  // If the user is not authenticated, redirect to the login page
  if (!session?.user) {
    redirect(NON_AUTHENTICATED_REDIRECT_URL);
    return null;
  }

  // If the user is authenticated, redirect them to the dashboard (or another protected page)
  redirect(AFTER_SIGNIN_REDIRECT_URL);
  return null;
}
