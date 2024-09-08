import { type PagesOptions } from "next-auth";
import { AFTER_SIGNUP_REDIRECT_URL } from "@/app-settings";
export const pages: Partial<PagesOptions> | undefined = {
  newUser: AFTER_SIGNUP_REDIRECT_URL,
  signIn: "/signin",
  verifyRequest: "/verify-request",
};
