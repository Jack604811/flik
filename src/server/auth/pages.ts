import { AFTER_SIGNUP_REDIRECT_URL } from "@/app-settings";
import { PagesOptions } from "next-auth";
export const pages: Partial<PagesOptions> = {
  newUser: AFTER_SIGNUP_REDIRECT_URL,
  signIn: "/",
  verifyRequest: "/verify-request",
};
