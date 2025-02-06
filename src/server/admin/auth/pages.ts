import { NextAuthConfig } from "next-auth";
export const pages: Partial<NextAuthConfig["pages"]> = {
  newUser: "/dashboard",
  signIn: "/",
  verifyRequest: "/verify-request",
};
