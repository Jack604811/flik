import { env } from "@/env";
import type { CallbacksOptions } from "next-auth";
import { getUserById } from "../actions/auth.action";

export const callbacks: Partial<CallbacksOptions> = {
  async signIn({ user, account }) {
    // Skip additional checks for non-credentials-based accounts
    if (account?.type !== "credentials") return true;

    // Fetch the user from the database
    const existingUser = await getUserById(user.id);
    if (!existingUser) return false; // Deny login if user does not exist

    // Pass verified email information
    user.emailVerified = existingUser.emailVerified;
    return true; // Allow login
  },
  jwt: async ({ token, user }) => {
    // Attach user information to the token if available
    if (user) {
      token.id = user.id;
      token.emailVerified = user.emailVerified || null; // Pass the emailVerified flag
    }
    return token;
  },
  session: ({ session, token }) => {
    // Add user details to the session
    return {
      ...session,
      user: {
        ...session.user,
        id: token.id,
        emailVerified: token.emailVerified, // Include emailVerified
        // customerId: user.customerId,
        // subscriptionId: user.subscriptionId,
        // oneTimeProductId: user.oneTimeProductId,
      },
    };
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
