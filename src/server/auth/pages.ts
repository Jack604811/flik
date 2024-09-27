import { AFTER_SIGNUP_REDIRECT_URL } from "@/app-settings";
import { NextAuthConfig } from "next-auth";
export const pages: Partial<NextAuthConfig["pages"]> | undefined = {
  newUser: AFTER_SIGNUP_REDIRECT_URL,
  signIn: "/",
  verifyRequest: "/verify-request",
};
