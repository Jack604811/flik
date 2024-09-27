import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import { type Provider } from "next-auth/providers/index";
import { env } from "@/env";
import { Resend } from 'resend';
import { APP_NAME } from "@/app-settings";
import { MagicLinkTemplate } from "@/emails/auth/magic-link";

const resend = new Resend(env.RESEND_API_KEY);

export const providers: Provider[] = [
  GoogleProvider({
    name: "google",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }),
  
  ResendProvider({
    id: "resend",
    name: "resend",
    async sendVerificationRequest({ identifier: email, url }) {
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: `Sign in to ${APP_NAME}`,
      react: MagicLinkTemplate({ link: url }),
        html: ""
      })
    },
  }),
];
