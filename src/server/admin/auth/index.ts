import NextAuth, {  type DefaultSession, type NextAuthConfig, type User } from "next-auth";
import { Adapter } from "next-auth/adapters"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/server/db";
import { DefaultJWT, JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id?: string;
    onboardingComplete: Date | null;
    emailVerified: Date | null;
  }
}
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
      emailVerified: Date | null;
      isAdmin?: boolean;
      customerId?: string | null | undefined;
      stripeCustomerId?: string | null | undefined;
      subscriptionId?: string | null | undefined;
      oneTimeProductId?: string | null | undefined;
      onboardingComplete: Date | null;
    };
  }


  interface User {
    id?: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    emailVerified?: Date | null;
    isAdmin?: boolean;
    customerId?: string | null | undefined;
    stripeCustomerId?: string | null | undefined;
    subscriptionId?: string | null | undefined;
    oneTimeProductId?: string | null | undefined;
    onboardingComplete: Date | null;
  }
}

//Single point of import for all auth related modules

import { providers } from "./providers";
import { events } from "./events";
import { callbacks } from "./callbacks";
import { pages } from "./pages";
import { env } from "@/env";

const authOptions: NextAuthConfig = {
  secret: env.NEXTAUTH_SECRET,
  callbacks,
  events,
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  providers,
  pages,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token-admin",
      options: {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  }
}

export const { auth, signIn, unstable_update, handlers } = NextAuth(authOptions);



export const getCurrentUser = async () => {
  const userSession = await auth();

  return userSession?.user;
}

export { providers, events, callbacks, pages, authOptions };
