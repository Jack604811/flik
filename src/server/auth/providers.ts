import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/email";
import { type Provider } from "next-auth/providers/index";
import { env } from "@/env";
import Credentials from "next-auth/providers/credentials";
import { getAdminByEmail, getUserByEmail } from "../actions/auth.action";
import bcrypt from "bcrypt";
import { User } from "next-auth";



export const providers: Provider[] = [
  GoogleProvider({
    name: "google",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }),
  

  Credentials({
    id: "signin",
    name: "signin",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if(!credentials?.email || !credentials?.password)  return null;
      const existingUser = await getUserByEmail(credentials.email);
      if(!existingUser) throw new Error("Invalid credentials, please check your email and password.");
      if(!existingUser.password) throw new Error("Your account is connected to a social provider. Please sign in with Google.");

      const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
      if(!isPasswordValid)  throw new Error("Invalid credentials, please check your email and password.");

      return existingUser as unknown as User
    },
  }),

  Credentials({
    id: "admin-signin",
    name: "admin-signin",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if(!credentials?.email || !credentials?.password)  return null;
      const existingUser = await getAdminByEmail(credentials.email);
      if(!existingUser) throw new Error("Invalid credentials, please check your email and password.");
      if(!existingUser.password) throw new Error("Invited admins must sign in with the magic link sent to their email.");

      const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
      if(!isPasswordValid)  throw new Error("Invalid credentials, please check your email and password.");

      return {...existingUser, isAdmin: true} as unknown as User
    },
  }),
];