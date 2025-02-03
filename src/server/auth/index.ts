import NextAuth, { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/server/db";
import { DefaultJWT, JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
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
    id: string;
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

const authOptions: NextAuthOptions = {
  callbacks,
  events,
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  providers,
  pages,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  }
}

export const handlers = NextAuth(authOptions);

export const auth = async () => {
  const session = await getServerSession(authOptions);
  return session;
}


export const getCurrentUser = async () => {
  const userSession = await auth();

  return userSession?.user;
}

export { providers, events, callbacks, pages, authOptions };
