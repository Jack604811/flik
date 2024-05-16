import type { Metadata } from "next";
import { NextAuthProvider } from "@/components/auth/session-provider";
import {
  APP_LANG,
  SEO_DESCRIPTION,
  SEO_IMAGE,
  SEO_TITLE,
} from "@/app_settings";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { TailwindScreen } from "@/components/dev/tailwind-screen";
import { APP_NAME, APP_DOMAIN } from "@/app_settings";
import NextTopLoader from "nextjs-toploader";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  metadataBase: new URL(APP_DOMAIN),
  alternates: {
    canonical: new URL("/", APP_DOMAIN),
  },
  openGraph: {
    type: "website",
    locale: APP_LANG,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    siteName: APP_NAME,
    url: new URL(APP_DOMAIN),
    images: [
      {
        url: SEO_IMAGE ?? "/api/og",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: SEO_IMAGE ?? "/api/og",
      },
    ],
    title: SEO_TITLE,
  },
};

const CrispWithNoSSR = dynamic(() => import("@/components/support/crisp-chat"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html lang={APP_LANG}>
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </head>
        <CrispWithNoSSR />
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <NextTopLoader />
            <Toaster position="top-center" />
            {children}
            <TailwindScreen />
          </ThemeProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
