import { type Provider } from "next-auth/providers/index";
import Credentials from "next-auth/providers/credentials";
import { getAdminByEmail } from "@/server/actions/auth.action";
import bcrypt from "bcrypt";
import { User } from "next-auth";



export const providers: Provider[] = [
  Credentials({
    id: "admin-signin",
    name: "admin-signin",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if(!credentials?.email || !credentials?.password)  return null;

      // Mock the admin login for inirial setup
      if(credentials.email === "admin@flik.so" && credentials.password === "admin") {
        return {
          id: "admin",
          email: "admin@flik.so",
          name: "Admin",
          isAdmin: true,
        } as unknown as User
      }

      const existingUser = await getAdminByEmail(credentials.email);
      if(!existingUser) throw new Error("Invalid credentials, please check your email and password.");
      if(!existingUser.password) throw new Error("Invited admins must sign in with the magic link sent to their email.");

      const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
      if(!isPasswordValid)  throw new Error("Invalid credentials, please check your email and password.");

      return {...existingUser, isAdmin: true} as unknown as User
    },
  }),
];