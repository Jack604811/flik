import { env } from "@/env";
import type { CallbacksOptions } from "next-auth";
import { getUserById } from "../actions/auth.action";

export const callbacks: Partial<CallbacksOptions> = {
  async signIn({ user, account }) {
    if(account?.type !== "credentials") return true;
    const existingUser = await getUserById(user.id);
    if(!existingUser?.emailVerified)  return false;

    // db.session.create({
    //   data: {
    //     userId: user.id,
    //     expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    //     sessionToken: 
    //   }
    // })
    return true;
  },
  jwt: async ({ token, user }) => {
    if(user){
      token.id = user.id;
    }
    return token;
  },
  session: ({ session, user, token }) => {
    return ({
    ...session,
    user: {
      ...session.user,
      id: user?.id ?? token.id,
      // customerId: user.customerId,
      // subscriptionId: user.subscriptionId,
      // oneTimeProductId: user.oneTimeProductId,
    },
  })},
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
