import { PagesOptions } from "next-auth";
export const pages: Partial<PagesOptions> = {
  newUser: "/dashboard",
  signIn: "/",
  verifyRequest: "/verify-request",
};
