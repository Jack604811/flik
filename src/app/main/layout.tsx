import { NextAuthProvider } from "@/components/auth/session-provider";
import { APP_LANG } from "@/app_settings";
import { ThemeProvider } from "@/components/theme-provider";
import "rsuite/dist/rsuite-no-reset.min.css";
import "../globals.css";
import { TailwindScreen } from "@/components/dev/tailwind-screen";
import NextTopLoader from "nextjs-toploader";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import TanstackQueryProvider from "@/components/providers/TanstackQueryProvider";

const CrispWithNoSSR = dynamic(() => import("@/components/support/crisp-chat"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html lang={APP_LANG}>
        <head key="head">
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
          <ThemeProvider attribute="class" defaultTheme="light">
            <NextTopLoader />
            <Toaster position="top-center" />
            <TanstackQueryProvider>{children}</TanstackQueryProvider>
            <TailwindScreen />
          </ThemeProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
