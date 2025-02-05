import { env } from "@/env";
import type { NextAuthConfig } from "next-auth";
import { getAdminById } from "@/server/actions/auth.action";

export const callbacks: Partial<NextAuthConfig["callbacks"]> = {
  async signIn({ user, account }) {
    if(account?.type !== "credentials") return true;

    if(user.id === "admin") return true;
    const existingAdmin = await getAdminById(user.id!);
    if(!existingAdmin) return false
    return true;
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
    const appBaseUrl = env.NEXTAUTH_URL.replace("app.", "admin.");

    // Allows relative callback URLs
    if (url.startsWith("/")) return `${appBaseUrl}${url}`;
    // Allows callback URLs on the same origin
    else if (new URL(url).origin === appBaseUrl) return url;
    // Allows callback URLs on any subdomain of the root domain
    else if (new URL(url).hostname.endsWith(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`)) return url;

    return appBaseUrl; // Default to app base URL if none of the conditions match
  },
};
