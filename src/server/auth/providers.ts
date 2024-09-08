import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { type Provider } from "next-auth/providers/index";
import { env } from "@/env";
import { Resend } from 'resend';
import { APP_NAME } from "@/app-settings";
import { MagicLinkTemplate } from "@/emails/auth/magic-link";

const resend = new Resend(env.RESEND_API_KEY);

export const providers: Provider[] = [
  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }),
  
  EmailProvider({
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
  /**
   * ...add more providers here.
   *
   * Most other providers require a bit more work than the Discord provider. For example, the
   * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
   * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
   *
   * @see https://next-auth.js.org/providers/github
   */
];
