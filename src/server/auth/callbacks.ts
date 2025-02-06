import { env } from "@/env";
import type { NextAuthConfig } from "next-auth";
import { getUserById } from "../actions/auth.action";

export const callbacks: Partial<NextAuthConfig["callbacks"]> = {
  async signIn({ user, account }) {
    if(account?.type !== "credentials") return true;

    // Fetch the user from the database
    const existingUser = await getUserById(user.id!);
    if (!existingUser) return false; // Deny login if user does not exist

    // Pass verified email information
    user.emailVerified = existingUser.emailVerified;
    user.emailVerified = existingUser.emailVerified;
    user.onboardingComplete = existingUser.onboardingComplete || null;
    return true; // Allow login
  },
  jwt: async ({ token, user, trigger, session }) => {
    if (!token.sub) return token;
    // Only fetch user data when:
    // 1. Initial sign-in (user object is present)
    // 2. Session update is triggered
    if (user || trigger === "update") {
      if (user) {
        // On initial sign-in, use the user object we already have
        token.id = user.id;
        token.emailVerified = user.emailVerified || null;
        token.onboardingComplete = user.onboardingComplete || null;
      } else if (session) {
        // On manual session update, only update specific fields
        if (session.user?.emailVerified) {
          token.emailVerified = session.user.emailVerified;
        }
        if (session.user?.onboardingComplete) {
          token.onboardingComplete = session.user.onboardingComplete;
        }
      }
    }
  
    return token;
  },
  session: ({ session, token }) => {
    if(token.id) session.user.id = token.id
    if(token.emailVerified) session.user.emailVerified = token.emailVerified
    if(token.onboardingComplete) session.user.onboardingComplete = token.onboardingComplete
  
    // Add user details to the session
    return session;
  },
  async redirect({ url, baseUrl }) {
    // Ensure baseUrl is using the app subdomain
    const appBaseUrl = env.NEXTAUTH_URL;

    // Allows relative callback URLs
    if (url.startsWith("/")) return `${appBaseUrl}${url}`;
    // Allows callback URLs on the same origin
    else if (new URL(url).origin === appBaseUrl) return url;
    // Allows callback URLs on any subdomain of the root domain
    else if (new URL(url).hostname.endsWith(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`)) return url;

    return appBaseUrl; // Default to app base URL if none of the conditions match
  },
};
