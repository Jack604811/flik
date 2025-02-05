import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";
import Credentials from "next-auth/providers/credentials";
import { generateVerificationCodeOTP, getUserByEmail } from "../actions/auth.action";
import bcrypt from "bcrypt";
import { NextAuthConfig, User } from "next-auth";



export const providers: NextAuthConfig["providers"] = [
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
    async authorize(credentials: Partial<Record<"email" | "password", unknown>>) {
      const email = credentials?.email as string;
      const password = credentials?.password as string;

      if (!email || !password) return null;

      const existingUser = await getUserByEmail(email);
      if (!existingUser) throw new Error("Invalid credentials, please check your email and password.");
      if (!existingUser.password) throw new Error("Your account is connected to a social provider. Please sign in with Google.");

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) throw new Error("Invalid credentials, please check your email and password.");

      if (!existingUser.emailVerified) {
        await generateVerificationCodeOTP(existingUser.email!);
      }

      return existingUser as User;
    },
  }),
];