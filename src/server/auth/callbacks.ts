import { env } from "@/env";
import type { Account, NextAuthConfig, Profile } from "next-auth";

export const callbacks: NextAuthConfig["callbacks"] = {
  session: ({ session, user }) => ({
    ...session,
    user: {
      ...session.user,
      id: user.id,
      customerId: user.customerId,
      subscriptionId: user.subscriptionId,
      oneTimeProductId: user.oneTimeProductId,
    },
  }),
  async redirect({ url, baseUrl }) {
    // Ensure baseUrl is using the app subdomain
    const appBaseUrl = env.NEXTAUTH_URL;
    
    // Allows relative callback URLs
    if (url.startsWith("/")) return `${appBaseUrl}${url}`;
    // Allows callback URLs on the same origin
    else if (new URL(url).origin === appBaseUrl) return url;
    // Allows callback URLs on any subdomain of the root domain
    else if (new URL(url).hostname.endsWith(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`)) return url;
    return appBaseUrl;
  },
};
