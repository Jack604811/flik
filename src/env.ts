import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
        STRIPE_CLIENT_ID: z.string().min(1),
        STRIPE_REDIRECT_URI: z.string().min(1),
        STRIPE_SECRET_KEY: z.string().min(1),
        STRIPE_WEBHOOK_SECRET: z.string().min(1),
        EMAIL_FROM: z.string().email(),
        NEXTAUTH_SECRET: z.string().min(1),
        NEXTAUTH_URL: z.string().url(),
        SUPABASE_URL: z.string().url(),
        SUPABASE_KEY: z.string()
    },
    client: {
        NEXT_PUBLIC_CRISP_WEBSITE_ID: z.string().min(1).optional(),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
        NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1).optional(),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_CRISP_WEBSITE_ID: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }
});