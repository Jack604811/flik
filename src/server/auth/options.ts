import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Adapter } from "next-auth/adapters";
import { db } from "@/server/db";
import { events, providers, callbacks, pages } from "@/server/auth";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions = {
  callbacks,
  events,
  adapter: PrismaAdapter(db) as Adapter,
  providers,
  pages
};
