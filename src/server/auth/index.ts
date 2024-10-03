import NextAuth, { NextAuthConfig, type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      subscriptionId: string | null;
      customerId: string;
      oneTimeProductId: string | null;
      country: string;
      
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    email?: string | null | undefined;
    name?: string | null | undefined;
    subscriptionId: string | null;
    customerId: string;
    oneTimeProductId: string | null;
    country: string;
  }
}

//Single point of import for all auth related modules

import { providers } from "./providers";
import { events } from "./events";
import { callbacks } from "./callbacks";
import { pages } from "./pages";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks,
  events,
  adapter: PrismaAdapter(db) as NextAuthConfig["adapter"],
  session: { strategy: "database" },
  providers,
  pages,
  debug: true
})


export const getCurrentUser = async () => {
  const userSession = await auth();

  return userSession?.user
}

export { providers, events, callbacks, pages };
